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
