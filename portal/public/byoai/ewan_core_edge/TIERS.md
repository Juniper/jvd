# Configuration Form Tiers

This file is part of the [BYOAI](README.md) corpus. It tells the AI which snippet files to include for each service kind at each verbosity tier. It is bundled into [`jvd-ewan-core-edge-snips.md`](jvd-ewan-core-edge-snips.md) by `regenerate-bundle.sh`.

For each service kind, the AI includes ONLY the snips listed for the chosen tier — and ONLY those — unless the user explicitly asks for more. Use the OS-appropriate file under `junos/` or `evo/`.

---

## What the tiers mean

| Tier | Use when | What's included |
|---|---|---|
| **`minimum`** | Brownfield change. PE already has working OSPF/LDP underlay AND iBGP. You just want the new service. | Service routing-instance + AC interface + parent LAG. **Nothing else.** |
| **`with-overlay`** | Brownfield-ish. PE has working underlay but you want to (re)assert the iBGP overlay families. | `minimum` + `transport/bgp-ibgp-rr-client.conf`. |
| **`as-deployed`** | Greenfield turn-up, lab build, or "give me a working example end-to-end." Mirrors what the JVD validates. | Everything: service + AC + overlay + OSPF/LDP underlay + MPLS LSPs + PIM + hash + bootstrap + CoS + policy. |

> **Greenfield / bootstrap requests** (e.g. "build a new ACX7509 WAN-edge turn-up", "bootstrap a new MX304 PE end-to-end") are always treated as **`as-deployed`** regardless of the user's tier choice.

If the user picks `minimum` and the AI cannot tell whether the iBGP overlay is already on the PE, it should call that out in the `Notes:` section ("assumed `family inet-vpn` and `family l2vpn signaling` already active under `protocols bgp group ibgp`").

---

## Shared underlay (the `as-deployed` baseline for every service)

Every `as-deployed` service includes this common baseline. OS-select each file:

- `transport/bgp-ibgp-rr-client.conf` (Junos) / `transport/bgp-ibgp-rr.conf` (EVO P-routers) — iBGP to RR with inet-vpn/l2vpn/route-target
- `transport/ospf-lfa.conf` — OSPF area 0 + LFA (remote-backup, per-prefix, node-link-degradation)
- `transport/ldp.conf` — LDP with auto-targeted-session + P2MP
- `transport/mpls-lsp.conf` (Junos WAN Edges) / `transport/mpls-transit.conf` (EVO P-routers) — MPLS LSPs / transit
- `transport/pim-sparse.conf` (Junos WAN Edges) / `transport/pim-sparse-rp.conf` (EVO P-routers) — PIM for NGMVPN
- `interfaces/ae-lag-core.conf` — core uplink LAG (family inet + mpls)
- `bootstrap/chassis.conf` — aggregated-devices count; **EVO also sets `network-services enhanced-ip` (REQUIRED for MPLS/VPN)**
- `bootstrap/forwarding-options-hash.conf` — ECMP/LAG hash keys (MPLS label + multiservice)
- `cos/classifiers-forwarding-classes.conf` — 8-class DSCP + 802.1p (Junos WAN Edges only)

---

## L3VPN with VRRP (instance-type vrf, eBGP CE, vrf-target)

**minimum** (just the service)
- `services/l3vpn-vrf-vrrp.conf`
- `interfaces/ae-lag-access.conf` (parent LAG for ACs)

**with-overlay** (= minimum +)
- `transport/bgp-ibgp-rr-client.conf` (verify `family inet-vpn` active)

**as-deployed** (= with-overlay + the shared underlay baseline above)

---

## L3VPN Hub-and-Spoke (asymmetric vrf-import/export)

**minimum** (just the service)
- `services/l3vpn-vrf-spoke.conf`
- `policy/hub-spoke-community.conf` (RT community definitions)
- `policy/hub-spoke-import-export.conf` (hub_N / spoke_N policies)
- `interfaces/ae-lag-access.conf` (parent LAG)

**with-overlay** (= minimum +)
- `transport/bgp-ibgp-rr-client.conf`

**as-deployed** (= with-overlay + shared underlay baseline)

---

## VPLS (virtual-switch, LDP-signaled)

Pick the OS-appropriate flavor:
- **Junos MX:** `junos/services/vpls-virtual-switch.conf` (bridge-domains syntax)
- **EVO ACX:** `evo/services/vpls-virtual-switch.conf` (vlans syntax)

**minimum** (just the service)
- the flavor above
- `interfaces/ae-lag-access.conf` (parent LAG for ACs)

**with-overlay** (= minimum +)
- `transport/bgp-ibgp-rr-client.conf` (verify `family l2vpn signaling`)

**as-deployed** (= with-overlay + shared underlay baseline)

---

## L2CKT (pseudowire with hot-standby backup)

**minimum** (just the service)
- `services/l2ckt-pseudowire.conf`
- `interfaces/ae-lag-access.conf` (parent LAG for ACs)

**with-overlay** (= minimum +)
- `transport/bgp-ibgp-rr-client.conf`
- `transport/ldp.conf` (targeted LDP session to remote PE)

**as-deployed** (= with-overlay + shared underlay baseline)

---

## NGMVPN (Next-Generation Multicast VPN)

**minimum** (just the multicast VRF)
- `services/ngmvpn-vrf.conf`
- `policy/bgp-to-ospf.conf` (OSPF export for CE redistribution)

**with-overlay** (= minimum +)
- `transport/bgp-ibgp-rr-client.conf`
- `transport/pim-sparse.conf` (global PIM for provider tunnels)

**as-deployed** (= with-overlay + shared underlay baseline)

---

## NGMVPN Hub-and-Spoke (EVO only — hub advertise + spoke advertise VRFs)

**minimum** (just the hub/spoke VRF pair)
- `services/ngmvpn-hub-adv.conf` (hub side)
- `services/ngmvpn-spoke-adv.conf` (spoke side)
- `policy/redistribute-vpn.conf` (hub CE export)
- `policy/hub-spoke-community.conf` + `policy/hub-spoke-import-export.conf`

**with-overlay** (= minimum +)
- `transport/bgp-ibgp-rr-client.conf`

**as-deployed** (= with-overlay + shared underlay baseline)

---

## Add-a-feature requests (no full service)

When the user asks to add a supporting feature to an existing device, emit ONLY that snip set:
- **CoS** → `cos/classifiers-forwarding-classes.conf`
- **ECMP / load-balancing** → `bootstrap/forwarding-options-hash.conf`
- **PIM / multicast** → `transport/pim-sparse.conf` (PE) or `transport/pim-sparse-rp.conf` (P/RP)
- **LFA convergence** → `transport/ospf-lfa.conf`
