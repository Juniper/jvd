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
