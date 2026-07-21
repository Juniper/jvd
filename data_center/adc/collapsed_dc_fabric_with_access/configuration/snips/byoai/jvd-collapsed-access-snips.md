# JVD Collapsed Data Center Fabric with Access Switches snippet library

## junos/interfaces/esi-lag.conf

```
/*
 * Topic:   All-active ESI-LAG (tier interconnect / server multihoming)
 * Variant: Junos OS
 * Seen on:
 *   Junos: leaf1_qfx5120-48y leaf2_qfx5120-48y access1_ex4400-48mp access2_ex4400-48mp
 *   EVO:   (none)
 *
 * Highlights:
 *  - The core all-active ESI-LAG building block used throughout this JVDE:
 *    * collapsed leaf DOWN to the access pair (leaf ae "facing_...access-pair"),
 *    * access switch UP to the collapsed leaf pair (access ae "facing_...leaf-pair"),
 *    * access switch DOWN to a multihomed server (access ae "to.<server>").
 *  - The ESI value AND the LACP system-id MUST be identical on both members of
 *    the bundle (that is what makes it all-active).
 *  - unit 0 is an ethernet-switching trunk carrying the fabric VLANs (vn<vlan>).
 *
 * Pair with:
 *  - junos/services/mac-vrf-evpn-vxlan.conf   (the VLANs/VNIs carried on the trunk)
 *
 * Variables (example values from access1_ex4400-48mp ae1):
 *   $AE_IFD           e.g. ae1
 *   $AE_DESCRIPTION   e.g. facing_dc3-rack-001-leaf-pair1
 *   $ESI_VALUE        e.g. 00:02:00:00:00:00:02:00:00:02
 *   $LACP_SYSTEM_ID   e.g. 02:00:00:00:00:02
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

## junos/interfaces/loopback.conf

```
/*
 * Topic:   Loopback lo0 addressing (router-id / VTEP)
 * Variant: Junos OS
 * Seen on:
 *   Junos: leaf1_qfx5120-48y leaf2_qfx5120-48y access1_ex4400-48mp access2_ex4400-48mp
 *   EVO:   (none)
 *
 * Highlights:
 *  - lo0.0 is the router-id / VTEP source (vtep-source-interface lo0.0) and the
 *    local-address for the tier's EVPN overlay (l3clos-l-evpn on the collapsed
 *    leaves, l3clos-a-evpn on the access switches).
 *  - Additional units are per-VRF loopbacks on the collapsed leaves.
 *  - Repeat the unit block per loopback.
 *
 * Pair with:
 *  - junos/transport/access-evpn-overlay.conf   (lo0.0 as access overlay local-address)
 *  - junos/transport/access-underlay-ebgp.conf   (lo0 router-id / VTEP)
 *
 * Variables (example values from access1_ex4400-48mp):
 *   $LO_UNIT   e.g. 0
 *   $LO_IPV4   e.g. 192.168.253.2/32
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
 *   Junos: leaf1_qfx5120-48y leaf2_qfx5120-48y access1_ex4400-48mp access2_ex4400-48mp
 *   EVO:   (none)
 *
 * Highlights:
 *  - The VLAN-aware MAC-VRF (evpn-1) present on BOTH tiers — the collapsed
 *    leaves and the EX4400 access switches — one VXLAN VNI per VLAN with per-VNI
 *    route targets under vni-options.
 *  - The access switches are full EVPN-VXLAN VTEPs, so they carry the same
 *    MAC-VRF instance and extend the L2 domains from the servers up the ESI-LAG.
 *  - Repeat the vni block per VLAN/VNI. (Collapsed leaves additionally set
 *    default-gateway do-not-advertise for the anycast gateway — see the base
 *    Collapsed Fabric JVD.)
 *
 * Pair with:
 *  - junos/transport/evpn-vxlan-forwarding.conf   (VTEP / vxlan-routing)
 *  - junos/interfaces/esi-lag.conf                 (ESI access into the VLANs)
 *  - junos/transport/access-evpn-overlay.conf      (advertises the EVI)
 *
 * Variables (example values from access1_ex4400-48mp):
 *   $VNI      e.g. 10400
 *   $VNI_RT   e.g. target:10400:1
 */
routing-instances {
    evpn-1 {
        instance-type mac-vrf;
        protocols {
            evpn {
                encapsulation vxlan;
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

## junos/transport/access-evpn-overlay.conf

```
/*
 * Topic:   Access-tier direct eBGP EVPN overlay (EX4400 access pair)
 * Variant: Junos OS
 * Seen on:
 *   Junos: access1_ex4400-48mp access2_ex4400-48mp
 *   EVO:   (none)
 *
 * Highlights:
 *  - The EVPN overlay (group l3clos-a-evpn) runs directly between the two EX4400
 *    access switches over their loopbacks (multihop ttl 1, no-nexthop-change) —
 *    the access pair is its own 2-node EVPN-VXLAN fabric.
 *  - family evpn signaling with loops 2; BFD 3000ms x 3 (multihop overlay).
 *
 * Pair with:
 *  - junos/transport/access-underlay-ebgp.conf     (underlay reachability)
 *  - junos/services/mac-vrf-evpn-vxlan.conf          (the EVI advertised here)
 *  - junos/transport/evpn-vxlan-forwarding.conf      (VTEP / vxlan-routing)
 *  - junos/interfaces/loopback.conf                  (lo0 overlay local-address)
 *
 * Variables (example values from access1_ex4400-48mp):
 *   $OVERLAY_BFD_MS    e.g. 3000
 *   $BFD_MULTIPLIER    e.g. 3
 *   $PEER_LOOPBACK     e.g. 192.168.253.3
 *   $PEER_DESCRIPTION  e.g. facing_dc3-rack-001-access2-evpn-overlay
 *   $LOCAL_LOOPBACK    e.g. 192.168.253.2
 *   $PEER_AS           e.g. 64803
 */
protocols {
    bgp {
        group l3clos-a-evpn {
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
                peer-as $PEER_AS;
            }
            vpn-apply-export;
        }
    }
}
```

## junos/transport/access-underlay-ebgp.conf

```
/*
 * Topic:   Access-tier direct eBGP underlay (EX4400 access pair)
 * Variant: Junos OS
 * Seen on:
 *   Junos: access1_ex4400-48mp access2_ex4400-48mp
 *   EVO:   (none)
 *
 * Highlights:
 *  - The two EX4400 access switches form their own direct 2-node fabric — this
 *    is the access-tier eBGP underlay (group l3clos-a) between access1 and
 *    access2 over a point-to-point link.
 *  - export BGP-AOS-Policy advertises the loopback/fabric prefixes; BFD 1000ms x3.
 *  - Distinct from the collapsed leaves' l3clos-l group — the access pair is a
 *    separate tier, ESI-LAG'd up to the collapsed leaves.
 *
 * Pair with:
 *  - junos/transport/access-evpn-overlay.conf   (access-tier EVPN overlay)
 *  - junos/interfaces/loopback.conf             (lo0 router-id / VTEP)
 *
 * Variables (example values from access1_ex4400-48mp):
 *   $UNDERLAY_BFD_MS   e.g. 1000
 *   $BFD_MULTIPLIER    e.g. 3
 *   $PEER_LINK_IP      e.g. 10.0.3.4
 *   $PEER_DESCRIPTION  e.g. facing_dc3-rack-001-access2
 *   $LOCAL_LINK_IP     e.g. 10.0.3.5
 *   $PEER_AS           e.g. 64803
 */
protocols {
    bgp {
        group l3clos-a {
            type external;
            export BGP-AOS-Policy;
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
                peer-as $PEER_AS;
            }
            vpn-apply-export;
        }
    }
}
```

## junos/transport/evpn-vxlan-forwarding.conf

```
/*
 * Topic:   EVPN-VXLAN forwarding (shared tunnels + VXLAN routing)
 * Variant: Junos OS
 * Seen on:
 *   Junos: leaf1_qfx5120-48y leaf2_qfx5120-48y access1_ex4400-48mp access2_ex4400-48mp
 *   EVO:   (none)
 *
 * Highlights:
 *  - Enables the device as an EVPN-VXLAN VTEP. shared-tunnels lets multiple
 *    MAC-VRF instances share VTEP tunnels; vxlan-routing overlay-ecmp load-
 *    balances routed (inter-VLAN / Type-5) VXLAN traffic.
 *  - Present on both tiers — the collapsed leaves and the EX4400 access switches.
 *    (Collapsed leaves additionally allocate a vxlan-routing next-hop pool.)
 *
 * Pair with:
 *  - junos/services/mac-vrf-evpn-vxlan.conf   (the MAC-VRF that uses the tunnels)
 *  - junos/transport/access-evpn-overlay.conf  (access-tier EVPN overlay)
 *
 * Variables (none — literal)
 */
forwarding-options {
    evpn-vxlan {
        shared-tunnels;
    }
    vxlan-routing {
        overlay-ecmp;
    }
}
```

## _variables.md

# Snip Variable Reference — Collapsed Data Center Fabric with Access Switches

Variables used across the `collapsed_dc_fabric_with_access` snip library. Replace
`$VARIABLE` placeholders with site-specific values when adapting snips to a new
deployment. JVD-wide constants (group names `l3clos-a` / `l3clos-a-evpn`, policy
names `BGP-AOS-Policy`, the `evpn-1` MAC-VRF instance) are left literal because
they *are* the abstraction the JVD documents.

Both tiers (collapsed QFX5120-48Y leaves and EX4400 access switches) run **Junos
OS**, so every snip lives under `junos/`. This library focuses on the
**access-layer extension** — for the base collapsed-fabric building blocks
(leaf direct `l3clos-l` underlay/overlay, anycast IRB), see the
[Collapsed Data Center Fabric](https://github.com/Juniper/jvd/tree/main/data_center/adc/collapsed_dc_fabric/configuration/snips) library.

## Access-tier transport

| Variable | Example | Used in |
|----------|---------|---------|
| `$UNDERLAY_BFD_MS` | `1000` | access-underlay-ebgp |
| `$OVERLAY_BFD_MS` | `3000` | access-evpn-overlay |
| `$BFD_MULTIPLIER` | `3` | both |
| `$PEER_LINK_IP` | `10.0.3.4` | access-underlay-ebgp |
| `$LOCAL_LINK_IP` | `10.0.3.5` | access-underlay-ebgp |
| `$PEER_LOOPBACK` | `192.168.253.3` | access-evpn-overlay |
| `$LOCAL_LOOPBACK` | `192.168.253.2` | access-evpn-overlay |
| `$PEER_DESCRIPTION` | `facing_dc3-rack-001-access2` | both |
| `$PEER_AS` | `64803` | both |

## Interfaces

| Variable | Example | Used in |
|----------|---------|---------|
| `$AE_IFD` | `ae1` | esi-lag |
| `$AE_DESCRIPTION` | `facing_dc3-rack-001-leaf-pair1` | esi-lag |
| `$ESI_VALUE` | `00:02:00:00:00:00:02:00:00:02` | esi-lag |
| `$LACP_SYSTEM_ID` | `02:00:00:00:00:02` | esi-lag |
| `$VLAN_MEMBERS` | `vn400 vn401` | esi-lag |
| `$LO_UNIT` | `0` | loopback |
| `$LO_IPV4` | `192.168.253.2/32` | loopback |

## Services

| Variable | Example | Used in |
|----------|---------|---------|
| `$VNI` | `10400` | mac-vrf-evpn-vxlan |
| `$VNI_RT` | `target:10400:1` | mac-vrf-evpn-vxlan |

## Literal (no variables)

- `evpn-vxlan-forwarding` — `forwarding-options evpn-vxlan shared-tunnels` + `vxlan-routing overlay-ecmp`.

## byoai/TIERS.md

# Configuration form tiers — Collapsed Fabric with Access Switches

Maps each **feature** the user can ask for to the **snip set** to emit for
`minimum` vs `as-deployed`. Slugs are paths under `snips/`. Read this
alongside the snip bodies. Emit exactly the listed snips for the chosen
tier — and only those — unless the user asks for more. This library is
**junos-only** (both tiers run Junos OS) and focuses on the ACCESS-LAYER
EXTENSION; for the base collapsed leaf config point the user to the base
Collapsed Data Center Fabric JVD.

---

## Feature: access-turnup (bring up an EX4400 access switch as a VTEP)

- **minimum**
  - `junos/transport/access-underlay-ebgp.conf`
  - `junos/transport/access-evpn-overlay.conf`
- **as-deployed**
  - `junos/interfaces/loopback.conf`
  - `junos/transport/access-underlay-ebgp.conf`
  - `junos/transport/access-evpn-overlay.conf`
  - `junos/transport/evpn-vxlan-forwarding.conf`
  - `junos/services/mac-vrf-evpn-vxlan.conf`
  - `junos/interfaces/esi-lag.conf`

## Feature: access-underlay (access-tier direct eBGP underlay)

- **minimum**
  - `junos/transport/access-underlay-ebgp.conf`
- **as-deployed**
  - `junos/interfaces/loopback.conf`
  - `junos/transport/access-underlay-ebgp.conf`

## Feature: access-overlay (access-tier EVPN overlay)

- **minimum**
  - `junos/transport/access-evpn-overlay.conf`
- **as-deployed**
  - `junos/interfaces/loopback.conf`
  - `junos/transport/access-underlay-ebgp.conf`
  - `junos/transport/access-evpn-overlay.conf`

## Feature: mac-vrf (VLAN-aware EVPN-VXLAN MAC-VRF / EVI)

- **minimum**
  - `junos/services/mac-vrf-evpn-vxlan.conf`
- **as-deployed**
  - `junos/transport/evpn-vxlan-forwarding.conf`
  - `junos/services/mac-vrf-evpn-vxlan.conf`
  - `junos/transport/access-evpn-overlay.conf`

## Feature: evpn-vxlan-forwarding (VTEP source + vxlan-routing)

- **minimum**
  - `junos/transport/evpn-vxlan-forwarding.conf`
- **as-deployed**
  - `junos/interfaces/loopback.conf`
  - `junos/transport/evpn-vxlan-forwarding.conf`
  - `junos/services/mac-vrf-evpn-vxlan.conf`

## Feature: esi-lag (all-active multihomed Ethernet-segment)

- **minimum**
  - `junos/interfaces/esi-lag.conf`
- **as-deployed**
  - `junos/interfaces/esi-lag.conf`
  - `junos/services/mac-vrf-evpn-vxlan.conf`

## Feature: loopback (lo0 VTEP / router-id)

- **minimum**
  - `junos/interfaces/loopback.conf`
- **as-deployed**
  - `junos/interfaces/loopback.conf`
  - `junos/transport/access-underlay-ebgp.conf`

---

### Notes for the assistant

- **as-deployed always pulls the paired prerequisites** listed in each
  snip's `Pair with:` header. If the user picked `as-deployed` and you
  omit a paired snip, call it out in the output `Notes:`.
- An EX4400 **access VTEP** is not reachable in the overlay until it has
  the access underlay (l3clos-a), the access overlay (l3clos-a-evpn), the
  EVPN-VXLAN forwarding (`vtep-source-interface lo0.0` + `vxlan-routing`),
  and at least one MAC-VRF (`evpn-1`). For a greenfield turn-up prefer
  `as-deployed` on `access-turnup`.
- **ESI-LAG identity must match across the two bundle members** — the EVPN
  `esi` value and the LACP `system-id` are identical on both collapsed
  leaves (for an access uplink) or both access switches (for a server
  downlink). See DEFAULTS.md.
- For the **base collapsed leaf** config (direct l3clos-l underlay/overlay,
  anycast IRB, server ESI-LAG on the leaves) point the user to the base
  **Collapsed Data Center Fabric** JVD — those snips are not in this library.

## byoai/DEFAULTS.md

# Auto-fill defaults — Collapsed Fabric with Access Switches

Deterministic JVD lab values for `auto` mode and short-circuits. Every
value below is taken from the validated `configuration/conf/*.conf`
device configs — do NOT invent alternatives. Always echo the values you
used in the output `Inputs used:` block so the user can rerun with edits.

---

## Devices (`Seen on:` names)

| Shortcut      | Devices                                                   |
| ------------- | --------------------------------------------------------- |
| `ACCESS-PAIR` | `access1_ex4400-48mp`, `access2_ex4400-48mp`              |
| `LEAF-PAIR`   | `leaf1_qfx5120-48y`, `leaf2_qfx5120-48y`                  |

Single device: any one name above (or a user-supplied hostname).
Default device selection when unspecified: `ACCESS-PAIR` (this library is
the access-layer extension).

## Per-device loopback + eBGP AS (direct fabric, from configs)

| Device                | lo0 (`lo0.0`)     | local AS |
| --------------------- | ----------------- | -------- |
| `leaf1_qfx5120-48y`   | `192.168.253.0/32`| `64800`  |
| `leaf2_qfx5120-48y`   | `192.168.253.1/32`| `64801`  |
| `access1_ex4400-48mp` | `192.168.253.2/32`| `64802`  |
| `access2_ex4400-48mp` | `192.168.253.3/32`| `64803`  |

Direct underlay peering (access tier): each access switch peers with the
other over its loopback —
- `access1` → neighbor `192.168.253.3`, `local-address 192.168.253.2`, `peer-as 64803`
- `access2` → neighbor `192.168.253.2`, `local-address 192.168.253.3`, `peer-as 64802`

The collapsed leaves peer the same way (l3clos-l): `leaf1` ↔ `leaf2`,
peer-as 64801 / 64800.

## EVPN-VXLAN forwarding

- `vtep-source-interface`: `lo0.0`
- `forwarding-options evpn-vxlan` + `vxlan-routing` (from
  `evpn-vxlan-forwarding.conf`)

## MAC-VRF / EVI (`evpn-1`)

- Instance: `evpn-1` (mac-vrf, `vlan-aware`)
- First VLAN/VNI: VLAN name `vn400`, `vni 10400`
- Per-VNI route target: `target:10400:1` (pattern `target:<vni>:1`)
- Route-distinguisher: `<lo0>:65534` (e.g. `192.168.253.2:65534` on access1)

When the user wants N VLANs, increment: `vn400 → vn401 → …`,
`vni 10400 → 10401 → …`, `target:10400:1 → target:10401:1 → …`.
If N is unspecified, default to **1** and note it in Inputs Used.

## All-active ESI-LAG (identical across the two bundle members)

- Uplink (access → collapsed-leaf pair), `ae1`:
  - `esi`: `00:02:00:00:00:00:02:00:00:02`  (`all-active`)
  - LACP `system-id`: `02:00:00:00:00:02`
- Server downlink (server → access pair), `ae2`:
  - `esi`: `00:02:00:00:00:00:03:00:00:03`  (`all-active`)
  - LACP `system-id`: `02:00:00:00:00:03`
- `mtu 9216`; unit 0 `family ethernet-switching interface-mode trunk`,
  VLAN members the `vn###` set.

> Both the `esi` value and the LACP `system-id` MUST be identical on both
> members of a given bundle. Use different values per distinct Ethernet
> segment (uplink vs downlink use different ESI/system-id, as above).

## Fallbacks

- Unspecified VLAN/VNI count → 1.
- Unspecified device → `ACCESS-PAIR`.
- Unspecified form → `as-deployed` for a turn-up request, `minimum` for a
  single-feature request.
- Every auto-filled value MUST be listed in `Inputs used:`.

## byoai/OUTPUT_FORMAT.md

# Output Format

This file is part of the [BYOAI](README.md) corpus. It defines the exact shape every generation must take. Bundled into [`jvd-collapsed-access-snips.md`](jvd-collapsed-access-snips.md) by `regenerate-bundle.sh`.

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
#   - { kind: <access-tier|mac-vrf|esi-lag>,
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
  - ESI-LAG **ESI value** and **LACP system-id** MUST be identical on both members of the same AE bundle — the two collapsed leaves for an access uplink, or the two access switches for a server downlink (that is what makes it all-active).
  - MAC-VRF **per-VNI route-targets** MUST match across every device sharing that VNI.
  - The access pair are eBGP peers with each other (l3clos-a); each device has its own loopback and AS.
- Anything by-pattern rather than validated on that exact device (e.g., a user-supplied hostname not in any snip's `Seen on:` list).
- Access-tier reminders: the EX4400 access switches are EVPN-VXLAN **VTEPs** (not L2-only) — they need the access underlay (`l3clos-a`), the access overlay (`l3clos-a-evpn`), the EVPN-VXLAN forwarding (`vtep-source-interface lo0.0` + `vxlan-routing`) and at least one MAC-VRF (`evpn-1`) before overlay reachability works. The anycast IRB gateway lives on the collapsed leaves (base Collapsed Fabric JVD), not in this access library.

## Refusal

If the request cannot be fulfilled from the snip library, do not apologise. Say exactly:

```
I cannot generate this from the snip library because <one reason>.
```

…and stop.
