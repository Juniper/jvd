# JVD 5-Stage EVPN-VXLAN Data Center snippet library

## evo/cos/rocev2-dcqcn-drop-profiles.conf

```
/*
 * Topic:   RoCEv2 DCQCN drop-profiles (ECN WRED)
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO:   storage-leaf1_qfx5130-32cd storage-leaf2_qfx5130-32cd services-leaf1_qfx5130-48c services-leaf2_qfx5130-48c
 *
 * Highlights:
 *  - Part of the DCQCN congestion-management profile for RoCEv2 storage traffic.
 *    Combines with PFC so ECN marks packets (via WRED drop-profiles) before PFC
 *    pauses the link. Applied via Apstra configlet.
 *  - dp0 / dp1 interpolate fill-level vs drop-probability define the ECN marking
 *    curve. Tune per data center — test before deploying.
 *
 * Pair with:
 *  - evo/services/oism-server-leaf.conf   (same storage/services leaves)
 *
 * Variables (none — literal profile; retune per fabric)
 */
class-of-service {
    drop-profiles {
        dp0 {
            interpolate {
                fill-level [ 0 20 ];
                drop-probability [ 0 100 ];
            }
        }
        dp1 {
            interpolate {
                fill-level [ 1 2 ];
                drop-probability [ 0 100 ];
            }
        }
    }
}
```

## evo/oam/oism-enhanced-forwarding.conf

```
/*
 * Topic:   Enhanced OISM multicast replication (fabric-wide enable)
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO:   storage-leaf1_qfx5130-32cd storage-leaf2_qfx5130-32cd services-leaf1_qfx5130-48c services-leaf2_qfx5130-48c
 *
 * Highlights:
 *  - Enables enhanced Optimized Intersubnet Multicast (OISM) with Bridge Domain
 *    Not Everywhere (BDNE) on the leaf, so revenue bridge domains need not exist
 *    on every leaf. Applied via Apstra configlet (Apstra 5.0 lacks native OISM).
 *  - Pairs with the per-VRF OISM/PIM/OSPF config on the same leaf.
 *
 * Pair with:
 *  - evo/services/oism-server-leaf.conf        (server-leaf per-VRF OISM)
 *  - evo/services/oism-border-pim-gateway.conf  (border-leaf per-VRF OISM)
 *
 * Variables (none — literal)
 */
forwarding-options {
    multicast-replication {
        evpn {
            irb enhanced-oism;
        }
    }
}
```

## evo/services/oism-border-pim-gateway.conf

```
/*
 * Topic:   Border-leaf OISM PIM-EVPN gateway per-VRF (external multicast)
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO:   services-leaf1_qfx5130-48c services-leaf2_qfx5130-48c
 *
 * Highlights:
 *  - The services-POD border leaf acts as a PIM EVPN Gateway (PEG), bridging the
 *    EVPN fabric to an external PIM domain via the Classic L3 method.
 *  - pim-evpn-gateway under evpn oism enables the gateway role; the external RP
 *    is static; revenue-VLAN IRBs run distributed-DR while the SBD IRB carries
 *    inter-leaf multicast.
 *
 * Pair with:
 *  - evo/oam/oism-enhanced-forwarding.conf       (fabric-wide enhanced-oism enable)
 *  - evo/services/oism-conserve-mcast-pfe.conf    (QFX5130 PFE conservation)
 *
 * Variables (example values from services-leaf1_qfx5130-48c):
 *   $VRF_NAME      e.g. blue
 *   $SBD_IRB       e.g. irb.3500
 *   $PIM_RP        e.g. 100.100.100.100
 *   $REVENUE_IRB   e.g. irb.1400
 */
routing-instances {
    $VRF_NAME {
        protocols {
            evpn {
                oism {
                    supplemental-bridge-domain-irb $SBD_IRB;
                    pim-evpn-gateway;
                }
            }
            pim {
                rp {
                    static {
                        address $PIM_RP;
                    }
                }
                interface $REVENUE_IRB {
                    distributed-dr;
                }
                interface $SBD_IRB;
            }
        }
    }
}
```

## evo/services/oism-conserve-mcast-pfe.conf

```
/*
 * Topic:   OISM PFE route conservation on QFX5130 leaves
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO:   storage-leaf1_qfx5130-32cd storage-leaf2_qfx5130-32cd services-leaf1_qfx5130-48c services-leaf2_qfx5130-48c
 *
 * Highlights:
 *  - Required on QFX5130-32CD / QFX5130-48C when used as an OISM server or border
 *    leaf: conserves PFE table space by installing only L3 multicast routes and
 *    skipping L2 multicast snooping routes.
 *  - Set in the OISM-enabled MAC-VRF (evpn-1). Delete it if OISM is disabled.
 *
 * Pair with:
 *  - evo/services/oism-server-leaf.conf         (server-leaf OISM)
 *  - evo/services/oism-border-pim-gateway.conf   (border-leaf OISM)
 *
 * Variables (none — literal)
 */
routing-instances {
    evpn-1 {
        multicast-snooping-options {
            oism {
                conserve-mcast-routes-in-pfe;
            }
        }
    }
}
```

## evo/services/oism-server-leaf.conf

```
/*
 * Topic:   Server-leaf OISM per-VRF (SBD, PIM accept-remote-source, OSPF)
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO:   storage-leaf1_qfx5130-32cd storage-leaf2_qfx5130-32cd
 *
 * Highlights:
 *  - Per-tenant-VRF OISM on a server (non-border) leaf. The Supplemental Bridge
 *    Domain IRB (irb.3500) carries multicast between leaves that do not share a
 *    revenue bridge domain (BDNE).
 *  - PIM is passive; the SBD IRB uses accept-remote-source to receive multicast
 *    sourced elsewhere in the fabric.
 *  - OISM requires OSPF in the tenant VRF — the VRF loopback + SBD IRB are active
 *    (OSPF area 0), all other interfaces passive.
 *
 * Pair with:
 *  - evo/oam/oism-enhanced-forwarding.conf        (fabric-wide enhanced-oism enable)
 *  - evo/services/oism-conserve-mcast-pfe.conf     (QFX5130 PFE conservation)
 *  - evo/cos/rocev2-dcqcn-drop-profiles.conf        (RoCEv2 congestion on same leaf)
 *
 * Variables (example values from storage-leaf1_qfx5130-32cd):
 *   $VRF_NAME       e.g. blue
 *   $SBD_IRB        e.g. irb.3500
 *   $VRF_LOOPBACK   e.g. lo0.3
 */
routing-instances {
    $VRF_NAME {
        protocols {
            evpn {
                oism {
                    supplemental-bridge-domain-irb $SBD_IRB;
                }
            }
            ospf {
                area 0.0.0.0 {
                    interface $VRF_LOOPBACK;
                    interface $SBD_IRB;
                    interface all {
                        passive;
                    }
                }
            }
            pim {
                passive;
                interface all;
                interface $SBD_IRB {
                    accept-remote-source;
                }
            }
        }
    }
}
```

## evo/transport/superspine-evpn-overlay-relay.conf

```
/*
 * Topic:   Lean super-spine EVPN overlay route relay to POD spines
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO:   superspine1_qfx5230-64cd superspine2_qfx5230-64cd
 *
 * Highlights:
 *  - The super spine relays EVPN routes between PODs (group l3clos-s-evpn) so
 *    every POD's leaves can reach routes in the other PODs — without the super
 *    spine itself being a VXLAN tunnel endpoint.
 *  - multihop ttl 1 + no-nexthop-change preserves the originating VTEP through
 *    the relay; family evpn signaling with loops 2 lets Type-5 routes traverse.
 *  - Peers with each POD spine's loopback (overlay); BFD 3000ms x 3 (multihop).
 *
 * Pair with:
 *  - evo/transport/superspine-underlay-ebgp.conf   (provides loopback reachability)
 *
 * Variables (example values from superspine1_qfx5230-64cd):
 *   $OVERLAY_BFD_MS      e.g. 3000
 *   $BFD_MULTIPLIER      e.g. 3
 *   $SPINE_OVERLAY_PEER  e.g. 192.168.252.2
 *   $PEER_DESCRIPTION    e.g. facing_spine001-001-1-evpn-overlay
 *   $OVERLAY_LOCAL       e.g. 192.168.252.0
 *   $POD_SPINE_AS        e.g. 64701
 */
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
                minimum-interval $OVERLAY_BFD_MS;
                multiplier $BFD_MULTIPLIER;
            }
            neighbor $SPINE_OVERLAY_PEER {
                description $PEER_DESCRIPTION;
                local-address $OVERLAY_LOCAL;
                family evpn {
                    signaling;
                }
                export ( SUPERSPINE_TO_SPINE_EVPN_OUT );
                peer-as $POD_SPINE_AS;
            }
        }
    }
}
```

## evo/transport/superspine-underlay-ebgp.conf

```
/*
 * Topic:   Lean super-spine underlay eBGP to POD spines (IPv6)
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO:   superspine1_qfx5230-64cd superspine2_qfx5230-64cd
 *
 * Highlights:
 *  - The 5-stage super spine is "lean": it forwards IP and relays routes only,
 *    it does NOT run VXLAN. This is the fabric (underlay) eBGP group l3clos-s.
 *  - Each super spine peers with every POD spine over IPv6 unicast link
 *    addresses; each POD's spines share one ASN.
 *  - SUPERSPINE_TO_SPINE_FABRIC_OUT + BGP-AOS-Policy scope underlay advertisement.
 *  - BFD (1000ms x 3) speeds underlay convergence.
 *
 * Pair with:
 *  - evo/transport/superspine-evpn-overlay-relay.conf  (overlay route relay)
 *
 * Variables (example values from superspine1_qfx5230-64cd):
 *   $UNDERLAY_BFD_MS    e.g. 1000
 *   $BFD_MULTIPLIER     e.g. 3
 *   $SPINE_PEER_V6      e.g. fdf6:ed70:1fac:f2d4::
 *   $PEER_DESCRIPTION   e.g. facing_spine001-001-1
 *   $LOCAL_V6           e.g. fdf6:ed70:1fac:f2d4::1
 *   $POD_SPINE_AS       e.g. 64701
 */
protocols {
    bgp {
        group l3clos-s {
            type external;
            multipath {
                multiple-as;
            }
            bfd-liveness-detection {
                minimum-interval $UNDERLAY_BFD_MS;
                multiplier $BFD_MULTIPLIER;
            }
            neighbor $SPINE_PEER_V6 {
                description $PEER_DESCRIPTION;
                local-address $LOCAL_V6;
                family inet6 {
                    unicast;
                }
                export ( SUPERSPINE_TO_SPINE_FABRIC_OUT && BGP-AOS-Policy );
                peer-as $POD_SPINE_AS;
            }
        }
    }
}
```

## junos/cos/rocev2-dcqcn-drop-profiles.conf

```
/*
 * Topic:   RoCEv2 DCQCN drop-profiles (ECN WRED)
 * Variant: Junos OS
 * Seen on:
 *   Junos: compute-leaf1_qfx5120-48ym compute-leaf2_qfx5120-48ym
 *   EVO:   (none)
 *
 * Highlights:
 *  - DCQCN congestion-management profile for RoCEv2 storage traffic on the Junos
 *    compute-POD leaves. ECN marks packets (WRED drop-profiles) before PFC pauses
 *    the link. Applied via Apstra configlet.
 *  - dp0 / dp1 interpolate fill-level vs drop-probability define the ECN curve.
 *    Tune per data center — test before deploying.
 *
 * Pair with:
 *  - junos/services/oism-server-leaf.conf   (same compute leaves)
 *
 * Variables (none — literal profile; retune per fabric)
 */
class-of-service {
    drop-profiles {
        dp0 {
            interpolate {
                fill-level [ 0 20 ];
                drop-probability [ 0 100 ];
            }
        }
        dp1 {
            interpolate {
                fill-level [ 1 2 ];
                drop-probability [ 0 100 ];
            }
        }
    }
}
```

## junos/oam/oism-enhanced-forwarding.conf

```
/*
 * Topic:   Enhanced OISM multicast replication (fabric-wide enable)
 * Variant: Junos OS
 * Seen on:
 *   Junos: compute-leaf1_qfx5120-48ym compute-leaf2_qfx5120-48ym
 *   EVO:   (none)
 *
 * Highlights:
 *  - Enables enhanced OISM (BDNE) on the Junos compute-POD leaves. Applied via
 *    Apstra configlet (Apstra 5.0 lacks native OISM).
 *  - Pairs with the per-VRF OISM/PIM/OSPF config on the same leaf.
 *
 * Pair with:
 *  - junos/services/oism-server-leaf.conf   (server-leaf per-VRF OISM)
 *
 * Variables (none — literal)
 */
forwarding-options {
    multicast-replication {
        evpn {
            irb enhanced-oism;
        }
    }
}
```

## junos/services/oism-server-leaf.conf

```
/*
 * Topic:   Server-leaf OISM per-VRF (SBD, PIM accept-remote-source, OSPF)
 * Variant: Junos OS
 * Seen on:
 *   Junos: compute-leaf1_qfx5120-48ym compute-leaf2_qfx5120-48ym
 *   EVO:   (none)
 *
 * Highlights:
 *  - Per-tenant-VRF OISM on the Junos compute-POD server leaves. The SBD IRB
 *    (irb.3500) carries multicast between leaves without a shared revenue bridge
 *    domain (BDNE).
 *  - PIM passive; SBD IRB uses accept-remote-source; OSPF (area 0) on the VRF
 *    loopback + SBD IRB, all other interfaces passive.
 *
 * Pair with:
 *  - junos/oam/oism-enhanced-forwarding.conf   (fabric-wide enhanced-oism enable)
 *  - junos/cos/rocev2-dcqcn-drop-profiles.conf  (RoCEv2 congestion on same leaf)
 *
 * Variables (example values from compute-leaf1_qfx5120-48ym):
 *   $VRF_NAME       e.g. blue
 *   $SBD_IRB        e.g. irb.3500
 *   $VRF_LOOPBACK   e.g. lo0.3
 */
routing-instances {
    $VRF_NAME {
        protocols {
            evpn {
                oism {
                    supplemental-bridge-domain-irb $SBD_IRB;
                }
            }
            ospf {
                area 0.0.0.0 {
                    interface $VRF_LOOPBACK;
                    interface $SBD_IRB;
                    interface all {
                        passive;
                    }
                }
            }
            pim {
                passive;
                interface all;
                interface $SBD_IRB {
                    accept-remote-source;
                }
            }
        }
    }
}
```

## _variables.md

# Snip Variable Reference — 5-Stage EVPN-VXLAN Data Center

Variables used across the `5stage_evpn_vxlan` snip library. Replace `$VARIABLE`
placeholders with site-specific values when adapting snips to a new deployment.
JVD-wide constants (group names `l3clos-s` / `l3clos-s-evpn`, policy names
`SUPERSPINE_TO_SPINE_*`, `BGP-AOS-Policy`, the `evpn-1` MAC-VRF instance,
`enhanced-oism`, `pim-evpn-gateway`) are left literal because they *are* the
abstraction the JVD documents.

This library focuses on the **5-stage-distinctive** configuration — the lean
super-spine tier, enhanced OISM multicast, and RoCEv2 DCQCN. The per-POD 3-stage
fabric building blocks are shared with the
[3-stage data center](https://github.com/Juniper/jvd/tree/main/data_center/adc/3stage_dc/configuration/snips) library.

## Super-spine transport

| Variable | Example | Used in |
|----------|---------|---------|
| `$UNDERLAY_BFD_MS` | `1000` | superspine-underlay-ebgp |
| `$OVERLAY_BFD_MS` | `3000` | superspine-evpn-overlay-relay |
| `$BFD_MULTIPLIER` | `3` | superspine-underlay-ebgp, -overlay-relay |
| `$SPINE_PEER_V6` | `fdf6:ed70:1fac:f2d4::` | superspine-underlay-ebgp |
| `$LOCAL_V6` | `fdf6:ed70:1fac:f2d4::1` | superspine-underlay-ebgp |
| `$SPINE_OVERLAY_PEER` | `192.168.252.2` | superspine-evpn-overlay-relay |
| `$OVERLAY_LOCAL` | `192.168.252.0` | superspine-evpn-overlay-relay |
| `$PEER_DESCRIPTION` | `facing_spine001-001-1` | superspine-underlay-ebgp, -overlay-relay |
| `$POD_SPINE_AS` | `64701` | superspine-underlay-ebgp, -overlay-relay |

## OISM multicast

| Variable | Example | Used in |
|----------|---------|---------|
| `$VRF_NAME` | `blue` | oism-server-leaf, oism-border-pim-gateway |
| `$SBD_IRB` | `irb.3500` | oism-server-leaf, oism-border-pim-gateway |
| `$VRF_LOOPBACK` | `lo0.3` | oism-server-leaf |
| `$PIM_RP` | `100.100.100.100` | oism-border-pim-gateway |
| `$REVENUE_IRB` | `irb.1400` | oism-border-pim-gateway |

## Literal (no variables)

- `oism-enhanced-forwarding` — `forwarding-options multicast-replication evpn irb enhanced-oism`
- `oism-conserve-mcast-pfe` — `multicast-snooping-options oism conserve-mcast-routes-in-pfe` (QFX5130)
- `rocev2-dcqcn-drop-profiles` — `class-of-service drop-profiles dp0/dp1` (retune per fabric)

## byoai/TIERS.md

# Configuration Form Tiers

This file is part of the [BYOAI](README.md) corpus. It tells the AI which snippet files to include for each feature at each verbosity tier. It is bundled into [`jvd-5stage-snips.md`](jvd-5stage-snips.md) by `regenerate-bundle.sh`.

For each feature, the AI includes ONLY the snips listed for the chosen tier — and ONLY those — unless the user explicitly asks for more. OS-select each file under `junos/` (compute-POD leaves / spines) or `evo/` (super spines, storage/services leaves).

This is a **5-stage-distinctive** library: it layers onto a per-POD 3-stage EVPN/VXLAN fabric. There is no full-fabric baseline here — for that, use the [3-stage data center JVD](../../../../3stage_dc/configuration/snips/). The tiers control how much of the supporting OISM/RoCEv2 config comes along with the core stanza.

The two tiers:

- **minimum** — just the requested feature's stanza(s).
- **as-deployed** — the feature + the supporting config the JVD renders alongside it.

---

## superspine-transport (lean super-spine)  ·  EVO

The lean super-spine tier that connects and relays routes between PODs (no VXLAN).

**minimum**
- `evo/transport/superspine-underlay-ebgp.conf` (fabric underlay to POD spines)

**as-deployed** (= minimum +)
- `evo/transport/superspine-evpn-overlay-relay.conf` (EVPN overlay route relay between PODs)

---

## oism-multicast (enhanced OISM)  ·  EVO + Junos

Enhanced OISM (BDNE) multicast for ERB EVPN-VXLAN. OSPF + PIM + IGMP on the leaves, using a Supplemental Bridge Domain (irb.3500).

**minimum** (server / compute / storage leaf)
- `oism/oism-server-leaf.conf` (per-VRF OISM/PIM/OSPF) — OS-select
- `oam/oism-enhanced-forwarding.conf` (fabric-wide enhanced-oism enable) — OS-select

**as-deployed** (= minimum +)
- `evo/services/oism-conserve-mcast-pfe.conf` (QFX5130 leaves — PFE conservation)

> **Border-leaf variant (services POD, EVO):** for a leaf that bridges to an external PIM domain, use `evo/services/oism-border-pim-gateway.conf` (adds `pim-evpn-gateway`, static RP, distributed-DR revenue IRBs) instead of `oism-server-leaf.conf`, plus the fabric-wide enable and PFE-conserve.

---

## rocev2-qos (RoCEv2 DCQCN)  ·  EVO + Junos

DCQCN congestion management for RoCEv2 storage traffic (the ECN / WRED half).

**minimum**
- `cos/rocev2-dcqcn-drop-profiles.conf` (OS-select)

> **Note:** DCQCN also requires PFC (lossless queue + scheduler) config; retune the drop-profile fill-level / drop-probability curve per data center and test before deploying.

---

## Add-a-feature requests

When the user asks to add a supporting stanza to an existing device, emit ONLY that snip (OS-select):
- **Lean super-spine underlay** → `evo/transport/superspine-underlay-ebgp.conf`
- **Super-spine EVPN relay** → `evo/transport/superspine-evpn-overlay-relay.conf`
- **Enable enhanced OISM** → `oam/oism-enhanced-forwarding.conf`
- **Server-leaf OISM** → `services/oism-server-leaf.conf`
- **Border-leaf PIM-EVPN gateway** → `evo/services/oism-border-pim-gateway.conf`
- **QFX5130 OISM PFE conserve** → `evo/services/oism-conserve-mcast-pfe.conf`
- **RoCEv2 drop-profiles** → `cos/rocev2-dcqcn-drop-profiles.conf`

## byoai/DEFAULTS.md

# Auto-Fill Defaults

This file is part of the [BYOAI](README.md) corpus. It gives the deterministic JVD lab-default values the AI uses in `auto` mode (or when the user short-circuits with `all defaults` / `use defaults` / `skip`). It is bundled into [`jvd-5stage-snips.md`](jvd-5stage-snips.md) by `regenerate-bundle.sh`.

Use these values EXACTLY. Do not invent alternative defaults. Every value the AI auto-fills MUST be listed in the output's `Inputs used:` block so the user can rerun with edits. Addresses below are the JVD lab's actual values (from each device `.conf`, generated by Juniper Apstra) — substitute site values when deploying.

---

## Device inventory (the 5-stage topology)

| Device | Platform | OS | Role | Loopback | AS |
|--------|----------|----|------|----------|----|
| `superspine1_qfx5230-64cd` | QFX5230-64CD | **EVO** | Lean super spine | `192.168.252.0` | `64700` |
| `superspine2_qfx5230-64cd` | QFX5230-64CD | **EVO** | Lean super spine | `192.168.252.1` | `64700` |
| `compute-spine1_qfx5210-64c` | QFX5210-64C | Junos | Compute POD spine | `192.168.252.2` | `64701` |
| `compute-spine2_qfx5210-64c` | QFX5210-64C | Junos | Compute POD spine | `192.168.252.3` | `64701` |
| `compute-leaf1_qfx5120-48ym` | QFX5120-48YM | Junos | Compute POD leaf (server) | `192.168.252.8` | `64704` |
| `compute-leaf2_qfx5120-48ym` | QFX5120-48YM | Junos | Compute POD leaf (server) | `192.168.252.9` | `64705` |
| `storage-spine1_qfx5220-32cd` | QFX5220-32CD | **EVO** | Storage POD spine | `192.168.252.4` | `64702` |
| `storage-spine2_qfx5220-32cd` | QFX5220-32CD | **EVO** | Storage POD spine | `192.168.252.5` | `64702` |
| `storage-leaf1_qfx5130-32cd` | QFX5130-32CD | **EVO** | Storage POD leaf (server) | `192.168.252.10` | `64706` |
| `storage-leaf2_qfx5130-32cd` | QFX5130-32CD | **EVO** | Storage POD leaf (server) | `192.168.252.11` | `64707` |
| `services-spine1_qfx5210-64c` | QFX5210-64C | Junos | Services POD spine | `192.168.252.6` | `64703` |
| `services-spine2_qfx5210-64c` | QFX5210-64C | Junos | Services POD spine | `192.168.252.7` | `64703` |
| `services-leaf1_qfx5130-48c` | QFX5130-48C | **EVO** | Services POD leaf (border) | `192.168.252.12` | `64708` |
| `services-leaf2_qfx5130-48c` | QFX5130-48C | **EVO** | Services POD leaf (border) | `192.168.252.13` | `64709` |
| `external-gw_mx` | MX series | Junos | External gateway | — | `65000` |

> Loopbacks `.0`–`.7` (super spines + POD spines) and `.8`–`.13` (leaves) are from the lab. Leaf1 loopbacks/AS above are confirmed from the configs; the `2` peer of each pair increments by one (verify against the actual config before deploying).

**eBGP Clos ASN scheme (single ASN per tier):**
- Super spines share **64700**.
- Each POD's spines share one ASN: compute **64701**, storage **64702**, services **64703**.
- Each leaf has its own AS (compute-leaf1 `64704`, storage-leaf1 `64706`, services-leaf1 `64708`, …).

**Device-choice shortcuts** (offered in the clarifying question):
- `SUPERSPINE` → `superspine1/2_qfx5230-64cd` (EVO; lean underlay + EVPN overlay relay)
- `SERVER-LEAF` → a compute leaf (`compute-leaf1/2_qfx5120-48ym`, Junos) or storage leaf (`storage-leaf1/2_qfx5130-32cd`, EVO)
- `BORDER-LEAF` → `services-leaf1/2_qfx5130-48c` (EVO; OISM PIM-EVPN gateway)

---

## Feature defaults

| Variable | Default | Notes |
|----------|---------|-------|
| `$UNDERLAY_BFD_MS` | `1000` | super-spine underlay BFD |
| `$OVERLAY_BFD_MS` | `3000` | super-spine overlay BFD (multihop) |
| `$BFD_MULTIPLIER` | `3` | both |
| `$POD_SPINE_AS` | `64701` (compute) / `64702` (storage) / `64703` (services) | super-spine underlay/overlay peer AS |
| `$OVERLAY_LOCAL` | = super spine loopback (`192.168.252.0`) | overlay local-address |
| `$VRF_NAME` | `blue` | tenant VRF for OISM |
| `$SBD_IRB` | `irb.3500` | OISM Supplemental Bridge Domain IRB |
| `$VRF_LOOPBACK` | `lo0.3` | tenant VRF loopback (OSPF) |
| `$PIM_RP` | `100.100.100.100` | external PIM rendezvous point (border leaf) |
| `$REVENUE_IRB` | `irb.1400` | revenue-VLAN IRB (distributed-DR) |

---

## Literal constants (never templated)

- Fabric BGP groups: `l3clos-s` (super-spine underlay), `l3clos-s-evpn` (super-spine overlay relay).
- Policies: `SUPERSPINE_TO_SPINE_FABRIC_OUT`, `SUPERSPINE_TO_SPINE_EVPN_OUT`, `BGP-AOS-Policy`.
- OISM: `enhanced-oism`, `pim-evpn-gateway`, `conserve-mcast-routes-in-pfe`, MAC-VRF `evpn-1`.
- RoCEv2: drop-profiles `dp0` / `dp1` (retune per fabric).

## byoai/OUTPUT_FORMAT.md

# Output Format

This file is part of the [BYOAI](README.md) corpus. It defines the exact shape every generation must take. Bundled into [`jvd-5stage-snips.md`](jvd-5stage-snips.md) by `regenerate-bundle.sh`.

## 1. `Inputs used:` block (always first)

Every generation begins with a YAML comment block listing **every** value picked or accepted:

```yaml
# Inputs used:
# mode: auto                   # or "interview"
# form: as-deployed            # or "minimum"
# devices:
#   dev1: { name: <hostname>, os: <junos|evo>, role: <super-spine|server-leaf|border-leaf>, loopback4: <addr>, as: <asn> }
#   dev2: { ... }
# features:
#   - { kind: <superspine-transport|oism-multicast|rocev2-qos>,
#       pod_spine_as: <asn>,        # super-spine underlay/overlay peer AS
#       vrf_name: <name>,           # tenant VRF for OISM
#       sbd_irb: <irb.NNNN>,        # OISM Supplemental Bridge Domain IRB
#       pim_rp: <addr>,             # border-leaf external RP
#       revenue_irb: <irb.NNNN> }   # border-leaf distributed-DR IRB
# snips_used:
#   - evo/transport/superspine-underlay-ebgp.conf
#   - evo/services/oism-server-leaf.conf
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
- Cross-device consistency the user must verify:
  - The **Supplemental Bridge Domain IRB** (`irb.3500`) and tenant VRF must be consistent across all OISM leaves in a tenant.
  - The super-spine **underlay peer AS** toward a POD equals that POD's shared spine ASN; super spines share one ASN; each POD's spines share one ASN; each leaf has its own AS.
  - EVPN **Type-5 VRF vrf-targets** match across leaves sharing the VRF.
  - Per-device identifiers (loopbacks, RDs, own AS, link addresses) differ.
- Anything by-pattern rather than validated on that exact device (e.g., a user-supplied hostname not in any snip's `Seen on:` list).
- 5-stage reminders: OISM and RoCEv2 config is applied via Apstra **configlet** (Apstra 5.0 lacks native support); enhanced OISM needs the fabric-wide enable **and** the per-VRF config; QFX5130 leaves need `conserve-mcast-routes-in-pfe`; RoCEv2 drop-profiles are the ECN half of DCQCN (PFC is configured alongside — retune per fabric). For the per-POD 3-stage fabric baseline, point the user to the 3-stage DC JVD.

## Refusal

If the request cannot be fulfilled from the snip library, do not apologise. Say exactly:

```
I cannot generate this from the snip library because <one reason>.
```

…and stop.
