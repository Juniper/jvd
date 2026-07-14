# Configuration Form Tiers

This file is part of the [BYOAI](README.md) corpus. It tells the AI which snippet files to include for each service kind at each verbosity tier. It is bundled into [`jvd-ewan-ace-snips.md`](jvd-ewan-ace-snips.md) by `regenerate-bundle.sh`.

For each service kind, the AI includes ONLY the snips listed for the chosen tier — and ONLY those — unless the user explicitly asks for more. Use the OS-appropriate file under `junos/` or `evo/`.

---

## What the tiers mean

| Tier | Use when | What's included |
|---|---|---|
| **`minimum`** | Brownfield change. PE already has working OSPF/SR underlay AND iBGP EVPN overlay. You just want the new service. | Service routing-instance + AC interface unit(s) + parent LAG. **Nothing else.** |
| **`with-overlay`** | Brownfield-ish. PE has working underlay but you want to (re)assert the iBGP EVPN overlay activation. | `minimum` + `transport/bgp-ibgp-evpn.conf`. |
| **`as-deployed`** | Greenfield turn-up, lab build, or "give me a working example end-to-end." Mirrors what the JVD validates. | Everything: service + AC + overlay + OSPF/SR underlay + MPLS + LDP/SR coexistence + loopback + core uplink + hash + bootstrap + CoS + OAM + policy + firewall. |

> **Greenfield / bootstrap requests** (e.g. "build a new ACX7100-48L WAN-edge turn-up", "bootstrap a new MX304 PE end-to-end") are always treated as **`as-deployed`** regardless of the user's tier choice.

If the user picks `minimum` and the AI cannot tell whether the iBGP EVPN overlay is already on the PE, it should call that out in the `Notes:` section ("assumed `family evpn signaling` already active under `protocols bgp group RR-CLIENT`").

---

## Shared underlay (the `as-deployed` baseline for every service)

Every `as-deployed` service includes this common baseline. OS-select each file:

- `transport/bgp-ibgp-evpn.conf` — iBGP overlay to P1/P2 route reflectors (EVPN + inet flow families, BFD, multipath)
- `transport/ospf-sr-lfa.conf` — OSPF area 0 + Segment Routing + TI-LFA (WAN edges: Junos MX; P routers: EVO PTX)
- `transport/mpls-lsp.conf` — static MPLS LSPs with traffic-engineering
- `transport/forwarding-options-hash.conf` — ECMP/LAG hash keys
- `interfaces/loopback.conf` — /32 router-id + MPLS binding
- `interfaces/physical-uplink-mpls.conf` — core uplink (family inet + mpls, MTU 9192)
- `bootstrap/chassis-network-services.conf` — aggregated-devices count; **EVO also sets `network-services enhanced-ip` (REQUIRED for EVPN/MPLS)**
- `cos/classifier-dscp-exp-8021p.conf` + `cos/forwarding-class-map.conf` + `cos/rewrite-rules-exp.conf` — 8-class CoS
- `oam/cfm-maintenance-domain.conf` + `oam/cfm-sla-iterator.conf` — 802.1ag CFM + SLA
- `policy/per-packet-load-balance.conf` — pplb ECMP + send-direct
- `firewall/filter-ipv4-stateless.conf` — stateless L3/L4 filters
- `ddos-mitigation/flowspec-routes.conf` — BGP FlowSpec enablement

**OS-specific transport add-ons (as-deployed only):**
- EVO WAN edges (wanedge3/4) + P routers: `evo/transport/ldp-sr-coexistence.conf`
- P routers (p1/p2) only: `evo/transport/sr-mapping-server.conf`
- Junos wanedge2_mx10004 only: `junos/transport/rsvp-te.conf`

---

## EVPN-VPWS (vlan-based, MEF E-Line point-to-point)

**minimum** (just the service)
- `services/evpn-vpws-vlan-based.conf`
- `interfaces/vlan-ccc-esi.conf` (per-AC unit on the LAG)
- `interfaces/lag-flexible-services.conf` (parent ae0)

**with-overlay** (= minimum +)
- `transport/bgp-ibgp-evpn.conf` (verify `family evpn signaling`)

**as-deployed** (= with-overlay + the shared underlay baseline above)

---

## EVPN-FXC vlan-aware (Flexible Cross-Connect, multi-AC)

**minimum** (just the service)
- `services/evpn-fxc-vlan-aware.conf`
- `interfaces/vlan-ccc-esi.conf` (one per bundled AC)
- `interfaces/lag-flexible-services.conf` (parent ae0)

**with-overlay** (= minimum +)
- `transport/bgp-ibgp-evpn.conf`

**as-deployed** (= with-overlay + shared underlay baseline)

---

## EVPN-ELAN (L2 multipoint, no IRB)

Pick the OS-appropriate flavor:
- **Junos MX:** `junos/services/evpn-elan-vlan-based.conf` (instance-type evpn)
- **EVO ACX:** `evo/services/evpn-elan-vlan-bundle.conf` (mac-vrf, service-type vlan-bundle)

**minimum** (just the service)
- the flavor above
- `interfaces/vlan-bridge.conf` (per-AC vlan-bridge units)
- `interfaces/lag-flexible-services.conf` (parent ae0)

**with-overlay** (= minimum +)
- `transport/bgp-ibgp-evpn.conf`

**as-deployed** (= with-overlay + shared underlay baseline)

---

## EVPN-ELAN with IRB (L2 + L3 integrated)

**minimum** (just the service)
- `services/evpn-elan-vlan-based-irb.conf` (Junos: instance-type evpn + routing-interface; EVO: mac-vrf + l3-interface)
- `services/evpn-vrf-ip-prefix.conf` (the L3 VRF that binds `irb.$UNIT` and advertises Type-5)
- `interfaces/vlan-bridge.conf` (AC units)
- `interfaces/irb-gateway.conf` (IRB unit addressing)
- `interfaces/lag-flexible-services.conf` (parent ae0)

**with-overlay** (= minimum +)
- `transport/bgp-ibgp-evpn.conf` (verify `family evpn signaling`)

**as-deployed** (= with-overlay + shared underlay baseline)

---

## EVPN Type-5 / L3 VRF (ip-prefix routes, standalone)

When the user wants just the L3 VRF (bound to an existing IRB):

**minimum**
- `services/evpn-vrf-ip-prefix.conf`
- `interfaces/irb-gateway.conf` (the IRB the VRF binds to)

**with-overlay** (= minimum +)
- `transport/bgp-ibgp-evpn.conf` (verify `family evpn signaling`)

**as-deployed** (= with-overlay + shared underlay baseline)

---

## Add-a-feature requests (no full service)

When the user asks to add a supporting feature to an existing device, emit ONLY that snip set:
- **CoS** → `cos/classifier-dscp-exp-8021p.conf` + `cos/forwarding-class-map.conf` + `cos/rewrite-rules-exp.conf`
- **OAM/CFM** → `oam/cfm-maintenance-domain.conf` + `oam/cfm-sla-iterator.conf`
- **Firewall / DDoS** → `firewall/filter-ipv4-stateless.conf` (+ `ddos-mitigation/flowspec-routes.conf` for dynamic FlowSpec)
- **Load-balancing** → `policy/per-packet-load-balance.conf` + `transport/forwarding-options-hash.conf`
