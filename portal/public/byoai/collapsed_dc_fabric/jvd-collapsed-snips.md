# JVD Collapsed Data Center Fabric snippet library

## junos/interfaces/esi-lag-access.conf

```
/*
 * Topic:   ESI-LAG all-active access (multihomed server / access switch)
 * Variant: Junos OS
 * Seen on:
 *   Junos: leaf1_qfx5120-48y leaf2_qfx5120-48y
 *   EVO:   (none)
 *
 * Highlights:
 *  - Dual-homes a server or access switch to BOTH collapsed leaves with an
 *    all-active ESI-LAG (AE bundle + EVPN ESI + LACP).
 *  - The ESI value AND the LACP system-id MUST be identical on both collapsed
 *    switches for the same AE bundle (that is what makes it all-active).
 *  - unit 0 is an ethernet-switching trunk carrying the fabric VLANs (vn<vlan>).
 *
 * Pair with:
 *  - junos/services/mac-vrf-evpn-vxlan.conf   (the VLANs/VNIs carried on the trunk)
 *
 * Variables (example values from leaf1_qfx5120-48y):
 *   $AE_IFD           e.g. ae1
 *   $AE_DESCRIPTION   e.g. to.dc3-rack-001-sys001
 *   $ESI_VALUE        e.g. 00:02:00:00:00:00:01:00:00:01
 *   $LACP_SYSTEM_ID   e.g. 02:00:00:00:00:01
 *   $VLAN_MEMBERS     e.g. vn400 vn401
 */
interfaces {
    $AE_IFD {
        description $AE_DESCRIPTION;
        mtu 9216;
        esi {
            $ESI_VALUE;
            all-active;
        }
        aggregated-ether-options {
            lacp {
                active;
                system-id $LACP_SYSTEM_ID;
            }
        }
        unit 0 {
            family ethernet-switching {
                interface-mode trunk;
                vlan {
                    members [ $VLAN_MEMBERS ];
                }
            }
        }
    }
}
```

## junos/interfaces/irb-anycast-gateway.conf

```
/*
 * Topic:   Anycast IRB gateway for a fabric VLAN
 * Variant: Junos OS
 * Seen on:
 *   Junos: leaf1_qfx5120-48y leaf2_qfx5120-48y
 *   EVO:   (none)
 *
 * Highlights:
 *  - The distributed anycast L3 gateway for a VLAN. Both collapsed switches use
 *    the SAME irb unit address and the SAME `mac` value, so hosts see one
 *    consistent default gateway regardless of which switch they land on.
 *  - MTU 9000 supports jumbo frames across the fabric.
 *  - Repeat the unit block per routed VLAN; bind the units into the tenant VRF.
 *
 * Pair with:
 *  - junos/services/mac-vrf-evpn-vxlan.conf   (the L2 domain this gateways)
 *
 * Variables (example values from leaf1_qfx5120-48y):
 *   $IRB_UNIT      e.g. 400
 *   $IRB_ADDRESS   e.g. 10.0.0.1/24
 *   $ANYCAST_MAC   e.g. 00:1c:73:00:00:01
 */
interfaces {
    irb {
        unit $IRB_UNIT {
            family inet {
                mtu 9000;
                address $IRB_ADDRESS;
            }
            mac $ANYCAST_MAC;
        }
    }
}
```

## junos/interfaces/loopback.conf

```
/*
 * Topic:   Loopback lo0 addressing (router-id / VTEP / per-VRF)
 * Variant: Junos OS
 * Seen on:
 *   Junos: leaf1_qfx5120-48y leaf2_qfx5120-48y
 *   EVO:   (none)
 *
 * Highlights:
 *  - lo0.0 is the router-id / VTEP source and the local-address for the
 *    collapsed EVPN overlay (l3clos-l-evpn).
 *  - Additional units (lo0.2, lo0.3, ...) are per-VRF loopbacks used by the
 *    tenant routing-instances.
 *  - Repeat the unit block per loopback.
 *
 * Pair with:
 *  - junos/transport/collapsed-evpn-overlay.conf   (lo0.0 as overlay local-address)
 *  - junos/transport/collapsed-underlay-ebgp.conf   (lo0 router-id / VTEP)
 *
 * Variables (example values from leaf1_qfx5120-48y):
 *   $LO_UNIT   e.g. 0
 *   $LO_IPV4   e.g. 192.168.253.0/32
 */
interfaces {
    lo0 {
        unit $LO_UNIT {
            family inet {
                address $LO_IPV4;
            }
        }
    }
}
```

## junos/services/mac-vrf-evpn-vxlan.conf

```
/*
 * Topic:   VLAN-aware MAC-VRF EVPN-VXLAN instance
 * Variant: Junos OS
 * Seen on:
 *   Junos: leaf1_qfx5120-48y leaf2_qfx5120-48y
 *   EVO:   (none)
 *
 * Highlights:
 *  - The single VLAN-aware MAC-VRF (evpn-1) per collapsed switch — one VXLAN VNI
 *    per VLAN, with per-VNI route targets under vni-options.
 *  - default-gateway do-not-advertise: each switch owns its anycast IRB gateway
 *    locally (symmetric ERB), so the gateway MAC is not advertised over EVPN.
 *  - duplicate-mac-detection guards against host mis-cabling / loops.
 *  - Repeat the vni block per stretched VLAN/VNI.
 *
 * Pair with:
 *  - junos/transport/collapsed-evpn-overlay.conf   (advertises the EVI)
 *  - junos/interfaces/irb-anycast-gateway.conf      (L3 anycast gateway per VLAN)
 *  - junos/interfaces/esi-lag-access.conf           (ESI access into the VLANs)
 *
 * Variables (example values from leaf1_qfx5120-48y):
 *   $VNI      e.g. 10400
 *   $VNI_RT   e.g. target:10400:1
 */
routing-instances {
    evpn-1 {
        instance-type mac-vrf;
        protocols {
            evpn {
                encapsulation vxlan;
                default-gateway do-not-advertise;
                duplicate-mac-detection {
                    auto-recovery-time 9;
                }
                extended-vni-list all;
                vni-options {
                    vni $VNI {
                        vrf-target $VNI_RT;
                    }
                }
            }
        }
    }
}
```

## junos/transport/collapsed-evpn-overlay.conf

```
/*
 * Topic:   Direct leaf-to-leaf eBGP EVPN overlay (collapsed spine)
 * Variant: Junos OS
 * Seen on:
 *   Junos: leaf1_qfx5120-48y leaf2_qfx5120-48y
 *   EVO:   (none)
 *
 * Highlights:
 *  - The EVPN overlay (group l3clos-l-evpn) runs directly between the two
 *    collapsed leaves over their loopbacks (multihop ttl 1, no-nexthop-change) —
 *    no spine relay because there is no spine.
 *  - family evpn signaling with loops 2 allows Type-5 routes to re-enter for
 *    inter-VRF routing on the border-capable collapsed switches.
 *  - BFD 3000ms x 3 (multihop overlay).
 *
 * Pair with:
 *  - junos/transport/collapsed-underlay-ebgp.conf   (underlay reachability)
 *  - junos/interfaces/loopback.conf                 (lo0 local-address)
 *  - junos/services/mac-vrf-evpn-vxlan.conf          (the EVI advertised here)
 *
 * Variables (example values from leaf1_qfx5120-48y):
 *   $OVERLAY_BFD_MS    e.g. 3000
 *   $BFD_MULTIPLIER    e.g. 3
 *   $PEER_LOOPBACK     e.g. 192.168.253.1
 *   $PEER_DESCRIPTION  e.g. facing_dc3-rack-001-leaf2-evpn-overlay
 *   $LOCAL_LOOPBACK    e.g. 192.168.253.0
 *   $PEER_AS           e.g. 64801
 */
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
                minimum-interval $OVERLAY_BFD_MS;
                multiplier $BFD_MULTIPLIER;
            }
            neighbor $PEER_LOOPBACK {
                description $PEER_DESCRIPTION;
                local-address $LOCAL_LOOPBACK;
                family evpn {
                    signaling;
                }
                export ( EVPN_EXPORT );
                peer-as $PEER_AS;
            }
            vpn-apply-export;
        }
    }
}
```

## junos/transport/collapsed-underlay-ebgp.conf

```
/*
 * Topic:   Direct leaf-to-leaf eBGP underlay (collapsed spine)
 * Variant: Junos OS
 * Seen on:
 *   Junos: leaf1_qfx5120-48y leaf2_qfx5120-48y
 *   EVO:   (none)
 *
 * Highlights:
 *  - In a collapsed fabric there is NO spine tier — the two switches ARE the
 *    fabric. This is the eBGP underlay (group l3clos-l) directly between the two
 *    collapsed leaves over point-to-point /31 links.
 *  - Repeat the neighbor block per direct link (the pair is dual-linked).
 *  - BFD (1000ms x 3) for fast underlay convergence; export BGP-AOS-Policy.
 *
 * Pair with:
 *  - junos/transport/collapsed-evpn-overlay.conf   (EVPN overlay over loopbacks)
 *  - junos/interfaces/loopback.conf                (lo0 router-id / VTEP)
 *
 * Variables (example values from leaf1_qfx5120-48y):
 *   $UNDERLAY_BFD_MS   e.g. 1000
 *   $BFD_MULTIPLIER    e.g. 3
 *   $PEER_LINK_IP      e.g. 10.0.3.0
 *   $PEER_DESCRIPTION  e.g. facing_dc3-rack-001-leaf2
 *   $LOCAL_LINK_IP     e.g. 10.0.3.1
 *   $PEER_AS           e.g. 64801
 */
protocols {
    bgp {
        group l3clos-l {
            type external;
            multipath {
                multiple-as;
            }
            bfd-liveness-detection {
                minimum-interval $UNDERLAY_BFD_MS;
                multiplier $BFD_MULTIPLIER;
            }
            neighbor $PEER_LINK_IP {
                description $PEER_DESCRIPTION;
                local-address $LOCAL_LINK_IP;
                family inet {
                    unicast;
                }
                export ( BGP-AOS-Policy );
                peer-as $PEER_AS;
            }
            vpn-apply-export;
        }
    }
}
```

## _variables.md

# Snip Variable Reference — Collapsed Data Center Fabric

Variables used across the `collapsed_dc_fabric` snip library. Replace `$VARIABLE`
placeholders with site-specific values when adapting snips to a new deployment.
JVD-wide constants (group names `l3clos-l` / `l3clos-l-evpn`, policy names
`BGP-AOS-Policy` / `EVPN_EXPORT`, the `evpn-1` MAC-VRF instance) are left literal
because they *are* the abstraction the JVD documents.

Both collapsed switches run **Junos OS** (baseline QFX5120-48Y), so every snip
lives under `junos/` — there is no `evo/` tree.

## Transport (direct leaf-to-leaf)

| Variable | Example | Used in |
|----------|---------|---------|
| `$UNDERLAY_BFD_MS` | `1000` | collapsed-underlay-ebgp |
| `$OVERLAY_BFD_MS` | `3000` | collapsed-evpn-overlay |
| `$BFD_MULTIPLIER` | `3` | both |
| `$PEER_LINK_IP` | `10.0.3.0` | collapsed-underlay-ebgp |
| `$LOCAL_LINK_IP` | `10.0.3.1` | collapsed-underlay-ebgp |
| `$PEER_LOOPBACK` | `192.168.253.1` | collapsed-evpn-overlay |
| `$LOCAL_LOOPBACK` | `192.168.253.0` | collapsed-evpn-overlay |
| `$PEER_DESCRIPTION` | `facing_dc3-rack-001-leaf2` | both |
| `$PEER_AS` | `64801` | both |

## Services

| Variable | Example | Used in |
|----------|---------|---------|
| `$VNI` | `10400` | mac-vrf-evpn-vxlan |
| `$VNI_RT` | `target:10400:1` | mac-vrf-evpn-vxlan |

## Interfaces

| Variable | Example | Used in |
|----------|---------|---------|
| `$AE_IFD` | `ae1` | esi-lag-access |
| `$AE_DESCRIPTION` | `to.dc3-rack-001-sys001` | esi-lag-access |
| `$ESI_VALUE` | `00:02:00:00:00:00:01:00:00:01` | esi-lag-access |
| `$LACP_SYSTEM_ID` | `02:00:00:00:00:01` | esi-lag-access |
| `$VLAN_MEMBERS` | `vn400 vn401` | esi-lag-access |
| `$IRB_UNIT` | `400` | irb-anycast-gateway |
| `$IRB_ADDRESS` | `10.0.0.1/24` | irb-anycast-gateway |
| `$ANYCAST_MAC` | `00:1c:73:00:00:01` | irb-anycast-gateway |
| `$LO_UNIT` | `0` | loopback |
| `$LO_IPV4` | `192.168.253.0/32` | loopback |

## byoai/TIERS.md

# Configuration Form Tiers

This file is part of the [BYOAI](README.md) corpus. It tells the AI which snippet files to include for each feature at each verbosity tier. It is bundled into [`jvd-collapsed-snips.md`](jvd-collapsed-snips.md) by `regenerate-bundle.sh`.

For each feature, the AI includes ONLY the snips listed for the chosen tier — and ONLY those — unless the user explicitly asks for more. Both collapsed switches run Junos, so all snips are under `junos/`.

The two tiers:

- **minimum** — just the requested feature's stanza(s). Assumes the collapsed fabric (direct underlay + EVPN overlay) is already present.
- **as-deployed** — the feature + the supporting config the JVD renders alongside it.

---

## collapsed-fabric (direct leaf-to-leaf transport)

The two-switch fabric baseline: the direct eBGP underlay + EVPN overlay between the collapsed leaves.

**minimum**
- `junos/transport/collapsed-underlay-ebgp.conf` (direct leaf-to-leaf underlay)
- `junos/transport/collapsed-evpn-overlay.conf` (direct leaf-to-leaf EVPN overlay)

**as-deployed** (= minimum +)
- `junos/interfaces/loopback.conf` (lo0 router-id / VTEP / per-VRF)

---

## mac-vrf (VLAN-aware MAC-VRF)

The L2 EVPN-VXLAN instance and its anycast gateway.

**minimum**
- `junos/services/mac-vrf-evpn-vxlan.conf` (evpn-1, 1 VNI per VLAN)
- `junos/interfaces/irb-anycast-gateway.conf` (anycast IRB gateway per VLAN)

**as-deployed** (= minimum +)
- `junos/transport/collapsed-evpn-overlay.conf` (advertises the EVI)
- `junos/interfaces/esi-lag-access.conf` (multihomed access into the VLANs)

---

## esi-access (multihomed access)

An all-active ESI-LAG to dual-home a server / access switch to both collapsed switches.

**minimum**
- `junos/interfaces/esi-lag-access.conf`

**as-deployed** (= minimum +)
- `junos/services/mac-vrf-evpn-vxlan.conf` (the VLANs/VNIs carried on the trunk)

---

## Greenfield collapsed turn-up

For a full two-switch turn-up, include everything: both transport snips + loopback + MAC-VRF + anycast IRB + ESI-LAG.

## Add-a-feature requests

When the user asks to add a single stanza, emit ONLY that snip:
- **Direct underlay** → `junos/transport/collapsed-underlay-ebgp.conf`
- **Direct EVPN overlay** → `junos/transport/collapsed-evpn-overlay.conf`
- **MAC-VRF** → `junos/services/mac-vrf-evpn-vxlan.conf`
- **Anycast IRB gateway** → `junos/interfaces/irb-anycast-gateway.conf`
- **ESI-LAG access** → `junos/interfaces/esi-lag-access.conf`
- **Loopback** → `junos/interfaces/loopback.conf`

## byoai/DEFAULTS.md

# Auto-Fill Defaults

This file is part of the [BYOAI](README.md) corpus. It gives the deterministic JVD lab-default values the AI uses in `auto` mode (or when the user short-circuits with `all defaults` / `use defaults` / `skip`). It is bundled into [`jvd-collapsed-snips.md`](jvd-collapsed-snips.md) by `regenerate-bundle.sh`.

Use these values EXACTLY. Do not invent alternative defaults. Every value the AI auto-fills MUST be listed in the output's `Inputs used:` block so the user can rerun with edits. Addresses below are the JVD lab's actual values (from each device `.conf`, generated by Juniper Apstra) — substitute site values when deploying.

---

## Device inventory (the collapsed topology)

| Device | Platform | OS | Role | Loopback | AS |
|--------|----------|----|------|----------|----|
| `leaf1_qfx5120-48y` | QFX5120-48Y | Junos | Collapsed-spine leaf 1 | `192.168.253.0` | `64800` |
| `leaf2_qfx5120-48y` | QFX5120-48Y | Junos | Collapsed-spine leaf 2 | `192.168.253.1` | `64801` |
| `external router` | MX204 | Junos | External gateway | — | — |

> The JVD validates five collapsed-spine platforms (QFX5120-48Y, QFX5130-32CD, QFX5700, ACX7100-48L, PTX10001-36MR); the configs use the QFX5120-48Y baseline. The two leaves are eBGP peers with each other — leaf1 peer-as toward leaf2 is `64801` and vice-versa.

**Device-choice shortcut** (offered in the clarifying question):
- `LEAF-PAIR` → `leaf1_qfx5120-48y` + `leaf2_qfx5120-48y`

---

## Feature defaults

| Variable | Default | Notes |
|----------|---------|-------|
| `$UNDERLAY_BFD_MS` | `1000` | direct underlay BFD |
| `$OVERLAY_BFD_MS` | `3000` | direct EVPN overlay BFD (multihop) |
| `$BFD_MULTIPLIER` | `3` | both |
| `$PEER_AS` | `64801` (from leaf1) / `64800` (from leaf2) | the *other* collapsed switch |
| `$LOCAL_LOOPBACK` | `192.168.253.0` (leaf1) / `192.168.253.1` (leaf2) | overlay local-address |
| `$PEER_LOOPBACK` | `192.168.253.1` (from leaf1) | overlay peer (other leaf) |
| `$PEER_LINK_IP` / `$LOCAL_LINK_IP` | `10.0.3.x` /31 | direct underlay p2p link |
| `$VNI` | `10400` | first fabric VNI |
| `$VNI_RT` | `target:10400:1` | per-VNI route target |
| `$IRB_UNIT` | `400` | first routed VLAN IRB unit |
| `$IRB_ADDRESS` | `10.0.0.1/24` | anycast gateway address (identical on both switches) |
| `$ANYCAST_MAC` | `00:1c:73:00:00:01` | anycast gateway MAC (identical on both switches) |
| `$ESI_VALUE` | `00:02:00:00:00:00:01:00:00:01` | ESI-LAG ESI (identical on both switches) |
| `$LACP_SYSTEM_ID` | `02:00:00:00:00:01` | ESI-LAG LACP system-id (identical on both switches) |

---

## Literal constants (never templated)

- Fabric BGP groups: `l3clos-l` (direct underlay), `l3clos-l-evpn` (direct overlay).
- Policies: `BGP-AOS-Policy`, `EVPN_EXPORT`.
- MAC-VRF instance: `evpn-1` (VLAN-aware, `default-gateway do-not-advertise`).

## byoai/OUTPUT_FORMAT.md

# Output Format

This file is part of the [BYOAI](README.md) corpus. It defines the exact shape every generation must take. Bundled into [`jvd-collapsed-snips.md`](jvd-collapsed-snips.md) by `regenerate-bundle.sh`.

## 1. `Inputs used:` block (always first)

Every generation begins with a YAML comment block listing **every** value picked or accepted:

```yaml
# Inputs used:
# mode: auto                   # or "interview"
# form: as-deployed            # or "minimum"
# devices:
#   leaf1: { name: <hostname>, os: junos, role: collapsed-leaf, loopback4: <addr>, as: <asn> }
#   leaf2: { ... }
# features:
#   - { kind: <collapsed-fabric|mac-vrf|esi-access>,
#       vni: <int>,                 # MAC-VRF VNI
#       vni_rt: <target:...>,        # per-VNI route target
#       irb_unit: <int>,             # anycast IRB unit
#       irb_address: <addr/len>,     # anycast gateway (same on both switches)
#       anycast_mac: <mac>,          # anycast gateway MAC (same on both switches)
#       esi: <hex>,                  # ESI-LAG ESI (same on both switches)
#       lacp_system_id: <mac> }      # ESI-LAG LACP system-id (same on both switches)
# snips_used:
#   - junos/services/mac-vrf-evpn-vxlan.conf
#   - junos/interfaces/irb-anycast-gateway.conf
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
  - ESI-LAG **ESI value** and **LACP system-id** MUST be identical on both collapsed switches for the same AE bundle (that is what makes it all-active).
  - The anycast IRB **`mac`** and gateway **address** MUST be identical on both switches for the same VLAN.
  - MAC-VRF **per-VNI route-targets** MUST match across both switches.
  - The two leaves are eBGP peers with each other; each has its own loopback and AS.
- Anything by-pattern rather than validated on that exact device (e.g., a user-supplied hostname not in any snip's `Seen on:` list).
- Collapsed reminders: the VLAN-aware MAC-VRF uses `default-gateway do-not-advertise` (each switch owns its anycast gateway locally); the direct EVPN overlay (`l3clos-l-evpn`) runs over loopbacks and the underlay (`l3clos-l`) over the point-to-point links between the two switches.

## Refusal

If the request cannot be fulfilled from the snip library, do not apologise. Say exactly:

```
I cannot generate this from the snip library because <one reason>.
```

…and stop.
