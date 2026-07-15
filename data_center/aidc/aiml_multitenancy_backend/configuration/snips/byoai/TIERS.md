# Configuration Form Tiers

This file is part of the [BYOAI](README.md) corpus. It tells the AI which snippet files to include for the service at each verbosity tier. It is bundled into [`jvd-aiml-mtb-snips.md`](jvd-aiml-mtb-snips.md) by `regenerate-bundle.sh`.

For the chosen tier, the AI includes ONLY the snips listed — and ONLY those — unless the user explicitly asks for more. This JVD is **Junos Evolved (EVO) only** — every file is under `evo/`. All eight devices are QFX5240-64OD; snips carry LEAF and SPINE variants (pick the variant that matches the device role — see DEFAULTS.md).

The three tiers:

- **minimum** — just the per-tenant VRF service + its attachment interfaces + IRB gateway + per-tenant policy + loopback units. Assumes a working EVPN-VXLAN fabric (underlay + overlay + fabric policies) is already present.
- **with-overlay** — `minimum` + the EVPN overlay peering (`bgp-ebgp-evpn-overlay`) so the EVPN address family is re-asserted.
- **as-deployed** — full JVD fabric baseline: service + eBGP underlay + EVPN overlay + fabric policies + RoCEv2 lossless CoS + DLB/ECMP + 400G breakout + loopback + bootstrap + OAM. Best for a greenfield leaf turn-up or a complete working example.

---

## Shared fabric baseline (referenced by every `as-deployed`)

The pure-L3 eBGP Clos underlay + EVPN-VXLAN overlay that every leaf and spine builds on. Pick the LEAF or SPINE variant of each dual-variant snip to match the device role:

- `bootstrap/system-grpc-netconf.conf` — system base: netconf/SSH, gRPC extension-service, mgmt instance
- `bootstrap/security-grpc-cert.conf` — local TLS cert for the gRPC listener
- `bootstrap/chassis-buffer-monitor.conf` — FPC buffer-monitor for AI/RoCE visibility
- `cos/rdma-rocev2-lossless.conf` — RoCEv2 lossless CoS (DSCP classifier, PFC, ECN, lossless buffers, schedulers)
- `interfaces/fabric-p2p-400g-breakout.conf` — 400G breakout /31 fabric P2P links
- `interfaces/loopback-leaf.conf` (leaf) / `interfaces/loopback-spine.conf` (spine) — lo0 router-id / overlay / per-VRF units
- `transport/bgp-ebgp-fabric-underlay.conf` — eBGP leaf↔spine /31 underlay (multipath, BFD)
- `transport/bgp-ebgp-evpn-overlay.conf` — eBGP EVPN overlay (loopback-to-loopback, multihop)
- `transport/routing-options-ecmp-frr.conf` — router-id, AS, ECMP FRR, chained-composite-NH
- `transport/ecmp-dlb-flowlet.conf` — ECMP Dynamic Load Balancing (flowlet) for AI fabric spreading
- `policy/community-definitions.conf` — tier markers, default redistribution, per-tenant communities
- `policy/clos-loop-prevention.conf` — eBGP Clos loop-prevention (spine tags, leaf rejects)
- `policy/allpodnetworks-direct-redistribution.conf` — direct-route → BGP redistribution with community tagging
- `policy/pfe-load-balance.conf` — PFE per-packet load-balance policy
- `oam/lldp-interface-all.conf` — LLDP on all interfaces
- `oam/l2-learning-telemetry.conf` (leaf) — remote-MAC telemetry via gRPC
- `oam/rstp-disable.conf` (spine) — RSTP disabled (pure-L3 spine)

---

## evpn-vrf-ip-prefix-routes (per-tenant VRF, EVPN Type-5)  ·  EVO, leaves only

The one service in this JVD: a per-tenant routing-instance with EVPN Type-5 ip-prefix-routes (VXLAN encapsulation), one VRF per tenant (tenants 1–4, VNI 20001–20004). Runs on the leaves (`leaf1..4_qfx5240-64od`). GPU servers attach to per-tenant 400G sub-ports.

**minimum** (just the service)
- `evo/services/evpn-vrf-ip-prefix-routes.conf`
- `evo/interfaces/tenant-gpu-server-link.conf` (per-tenant GPU-server 400G AC sub-ports)
- `evo/interfaces/irb-tenant-gateway.conf` (per-tenant anycast IRB gateway, MTU 9000)
- `evo/interfaces/loopback-leaf.conf` (per-tenant lo0.N units for the RD)
- `evo/policy/tenant-community-export.conf` (`BGP-AOS-Policy-tenant-N` export)
- `evo/transport/router-advertisement.conf` (IPv6 RA / GUA on the tenant links)

**with-overlay** (= minimum +)
- `evo/transport/bgp-ebgp-evpn-overlay.conf` (carries the Type-5 routes)

**as-deployed** (= with-overlay + the shared fabric baseline above)

---

## Add-a-feature requests (no full service)

When the user asks to add a supporting feature to an existing device, emit ONLY that snip set:
- **RoCEv2 lossless CoS** → `evo/cos/rdma-rocev2-lossless.conf` + `evo/bootstrap/chassis-buffer-monitor.conf`
- **DLB / ECMP load-balancing** → `evo/transport/ecmp-dlb-flowlet.conf` + `evo/transport/routing-options-ecmp-frr.conf` + `evo/policy/pfe-load-balance.conf`
- **400G fabric breakout link** → `evo/interfaces/fabric-p2p-400g-breakout.conf`
- **GPU-server tenant link** → `evo/interfaces/tenant-gpu-server-link.conf` + `evo/transport/router-advertisement.conf`
- **LLDP** → `evo/oam/lldp-interface-all.conf`
- **L2-learning telemetry** → `evo/oam/l2-learning-telemetry.conf`
- **gRPC / telemetry base** → `evo/bootstrap/system-grpc-netconf.conf` + `evo/bootstrap/security-grpc-cert.conf`
- **Clos loop-prevention policy** → `evo/policy/clos-loop-prevention.conf` + `evo/policy/community-definitions.conf`
