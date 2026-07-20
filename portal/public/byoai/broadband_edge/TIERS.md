# Configuration Form Tiers

This file is part of the [BYOAI](README.md) corpus. It tells the AI which snippet files to include for each service kind at each verbosity tier. It is bundled into [`jvd-bbe-snips.md`](jvd-bbe-snips.md) by `regenerate-bundle.sh`.

For each service kind, the AI includes ONLY the snips listed for the chosen tier — and ONLY those — unless the user explicitly asks for more. Use the OS-appropriate file: **AN/AGN/CR = `evo/`**, **BNG/switch = `junos/`**.

---

## What the tiers mean

| Tier | Use when | What's included |
|---|---|---|
| **`minimum`** | Brownfield change. Device already has working IS-IS/SR underlay AND its iBGP overlay. You just want the new service. | Service routing-instance + attachment-circuit interface + the service's mandatory `Pair with:` snips. **No transport/bootstrap.** |
| **`with-overlay`** | Brownfield-ish. Underlay is up but you want to (re)assert the device's iBGP overlay activation. | `minimum` + the role's overlay snip (`bgp-overlay-pe-an` / `bgp-overlay-pe-bng` / `bgp-overlay-rr-core`). |
| **`as-deployed`** | Greenfield turn-up, lab build, or "give me a working end-to-end example." Mirrors what the JVD validates. | Everything: service + AC + overlay + the role baseline (IS-IS/SR underlay, MPLS SRGB, policies, and — for BNGs — chassis + subscriber-management + RADIUS bootstrap). |

> **Greenfield / bootstrap requests** (e.g. "build a new ACX7024 AN turn-up", "bootstrap a new MX304 BNG end-to-end") are always treated as **`as-deployed`**.

If the user picks `minimum` and the AI cannot tell whether the iBGP overlay is already on the device, it should call that out in the `Notes:` section.

---

## Shared role baselines (the `as-deployed` foundation)

Every `as-deployed` service adds the baseline for the device's role. OS-select each file.

### AN / AGN / CR transport baseline (`evo/`)
- `transport/isis-srmpls-tilfa.conf` — IS-IS L1/L2 with SR-MPLS + TI-LFA node protection
- `transport/mpls-segment-routing.conf` — MPLS SRGB + IPv6 tunneling
- `transport/routing-options-pe.conf` — router-id, AS, chained-composite-next-hop
- `interfaces/core-isis-mpls.conf` — core-facing IS-IS/MPLS interface
- `policy/isis-export-prefix-segment.conf` — per-loopback SR prefix-segment
- `policy/pplb.conf` — per-packet load-balance
- overlay: `transport/bgp-overlay-pe-an.conf` (AN); `transport/bgp-overlay-rr-fabric.conf` + `policy/bgp-rr-export.conf` (AGN); `transport/bgp-overlay-rr-core.conf` + `policy/bgp-rr-export.conf` (CR)

### BNG bootstrap + transport baseline (`junos/`)
- `transport/isis-srmpls-tilfa.conf` + `transport/mpls-segment-routing.conf` + `transport/routing-options-pe.conf` + `interfaces/core-isis-mpls.conf` + `policy/isis-export-prefix-segment.conf` + `policy/pplb.conf`
- overlay: `transport/bgp-overlay-pe-bng.conf`
- `bootstrap/chassis-bng.conf` — ECMP, GRES, `pseudowire-service`, `tunnel-services` (**PWHT prerequisite**)
- `subscriber-management/system-services-subscriber-mgmt.conf` — subscriber-management redundancy + ddos-protection
- `subscriber-management/radius-server.conf` + `subscriber-management/access-profile-radius.conf` — RADIUS AAA
- `subscriber-management/address-assignment-pools.conf` — global subscriber pools
- `policy/communities.conf` + `policy/subscriber-vrf-policies.conf` — community palette + subscriber VRF policies

> **BNG prerequisite (flag in Notes for greenfield):** `chassis pseudowire-service device-count` + `tunnel-services` (from `bootstrap/chassis-bng.conf`) and `system services subscriber-management` MUST be present before any `ps` pseudowire-headend / dynamic-profile activates.

---

## EVPN-VPWS PPPoE — BNG side (subscriber PPPoE via PWHT)

**minimum** (just the service)
- `junos/services/evpn-vpws-pppoe-bng.conf`
- `junos/interfaces/ps-pseudowire-pppoe.conf` (the `ps` attachment circuit)
- `junos/subscriber-management/dp-auto-stacked-pwht-pppoe.conf` (session-activation dynamic-profile)
- `junos/subscriber-management/dp-prod-pppoe-dt-base.conf` (per-session pp0 dynamic-profile)
- `junos/services/l3vpn-pppoe-subs.conf` (subscriber VRF + pool)
- `junos/subscriber-management/address-assignment-pools.conf`
- `junos/policy/subscriber-vrf-policies.conf`

**with-overlay** (= minimum +)
- `junos/transport/bgp-overlay-pe-bng.conf`

**as-deployed** (= with-overlay + BNG bootstrap + transport baseline)

---

## EVPN-VPWS IPoE/DHCP — BNG side (subscriber DHCP/IPoE via PWHT)

**minimum** (just the service)
- `junos/services/evpn-vpws-ipoe-bng.conf`
- `junos/interfaces/ps-pseudowire-dhcp-ipoe.conf`
- `junos/subscriber-management/dp-auto-stacked-pwht-dhcp.conf`
- `junos/subscriber-management/dp-prod-dhcp-base.conf`
- `junos/subscriber-management/dp-autosense-ipdemux.conf`
- `junos/services/l3vpn-dhcp-subs.conf` (VRF + embedded `dhcp-local-server`)
- `junos/policy/subscriber-vrf-policies.conf`
- `junos/firewall/rpf-pass-dhcp.conf`

**with-overlay** (= minimum +)
- `junos/transport/bgp-overlay-pe-bng.conf`

**as-deployed** (= with-overlay + BNG bootstrap + transport baseline)

---

## EVPN-VPWS FXC — BNG side (Flexible Cross-Connect PWHT)

**minimum** (just the service)
- `junos/services/evpn-vpws-fxc-bng.conf`
- `junos/interfaces/ps-pseudowire-dhcp-ipoe.conf`
- `junos/services/l3vpn-dhcp-subs.conf`

**with-overlay** (= minimum +)
- `junos/transport/bgp-overlay-pe-bng.conf`

**as-deployed** (= with-overlay + BNG bootstrap + transport baseline)

---

## EVPN-VPWS — AN side (per-subscriber-group pseudowires)

**minimum** (just the service)
- `evo/services/evpn-vpws-an.conf`
- `evo/interfaces/ae-vlan-bridge-an.conf` (access LAG with vlan-ccc + ESI)

**with-overlay** (= minimum +)
- `evo/transport/bgp-overlay-pe-an.conf`

**as-deployed** (= with-overlay + AN transport baseline)

---

## EVPN-VPWS FXC — AN side (Flexible Cross-Connect)

**minimum** (just the service)
- `evo/services/evpn-vpws-fxc-an.conf`
- `evo/interfaces/ae-vlan-bridge-an.conf`

**with-overlay** (= minimum +)
- `evo/transport/bgp-overlay-pe-an.conf`

**as-deployed** (= with-overlay + AN transport baseline)

---

## L3VPN Internet — CR side

**minimum** (just the service)
- `evo/services/l3vpn-internet.conf` (Internet VRF, eBGP to upstream CE)
- `evo/policy/vrf-internet-policies.conf`
- `evo/policy/communities.conf`

**with-overlay** (= minimum +)
- `evo/transport/bgp-overlay-rr-core.conf`

**as-deployed** (= with-overlay + AN/AGN/CR transport baseline)

---

## L3VPN RADIUS — RADIUS reachability VRF

**minimum** (just the service)
- OS-select `junos/services/l3vpn-radius.conf` (BNG) or `evo/services/l3vpn-radius.conf` (CR)
- OS-select `junos/policy/vrf-radius-policies.conf` or `evo/policy/vrf-radius-policies.conf`
- `junos/subscriber-management/radius-server.conf` (BNG side)

**with-overlay** (= minimum +)
- `junos/transport/bgp-overlay-pe-bng.conf` (BNG) or `evo/transport/bgp-overlay-rr-core.conf` (CR)

**as-deployed** (= with-overlay + role baseline)

---

## Access switch LAG (QFX helper, toward AN)

**minimum**
- `junos/interfaces/ae-vlan-bridge-fxc-sw.conf`

*(The access switches are helper devices — no overlay/underlay baseline applies.)*

---

## Add-a-feature requests (no full service)

When the user asks to add a supporting feature to an existing device, emit ONLY that snip set (OS-select):
- **Underlay / IS-IS SR-MPLS** → `transport/isis-srmpls-tilfa.conf` + `transport/mpls-segment-routing.conf` + `interfaces/core-isis-mpls.conf` + `policy/isis-export-prefix-segment.conf`
- **iBGP overlay** → the role snip: `transport/bgp-overlay-pe-an.conf` (AN) / `transport/bgp-overlay-pe-bng.conf` (BNG) / `transport/bgp-overlay-rr-fabric.conf` (AGN) / `transport/bgp-overlay-rr-core.conf` (CR) + `policy/bgp-rr-export.conf` (RRs)
- **BNG bootstrap** → `junos/bootstrap/chassis-bng.conf` + `junos/subscriber-management/system-services-subscriber-mgmt.conf`
- **RADIUS AAA** → `junos/subscriber-management/radius-server.conf` + `junos/subscriber-management/access-profile-radius.conf`
- **Load-balancing** → `policy/pplb.conf` (+ `transport/routing-options-pe.conf` for the chained-composite-next-hop knob)
- **uRPF fail-filter (DHCP)** → `junos/firewall/rpf-pass-dhcp.conf`
