# Configuration Form Tiers

This file is part of the [BYOAI](README.md) corpus. It tells the AI which snippet files to include for each service kind at each verbosity tier. It is bundled into [`jvd-3stage-dc-snips.md`](jvd-3stage-dc-snips.md) by `regenerate-bundle.sh`.

For each service kind, the AI includes ONLY the snips listed for the chosen tier — and ONLY those — unless the user explicitly asks for more. OS-select each file under `junos/` or `evo/` to match the target device family (spines + EVO border-leaves = EVO; leaves + Junos border-leaves = Junos).

The three tiers:

- **minimum** — just the new service instance + its attachment interface(s) + service-essential helpers (IRB, VLAN→VNI mapping). Assumes a working EVPN-VXLAN fabric (underlay eBGP + EVPN overlay + policies) is already present.
- **with-overlay** — `minimum` + the EVPN overlay peering (`bgp-evpn-overlay`) so the EVPN address family is re-asserted. Best when you're not sure the overlay is active.
- **as-deployed** — full JVD fabric baseline: service + underlay eBGP + EVPN overlay + fabric policies + forwarding-table ECMP + loopback + fabric uplinks + chassis + OAM. Best for a greenfield leaf/border-leaf turn-up or a complete working example.

---

## Shared fabric baseline (referenced by every `as-deployed`)

The EVPN-VXLAN Clos underlay + overlay that every leaf, border-leaf, and spine builds on. OS-select each file (spines and EVO border-leaves use `evo/`; leaves and Junos border-leaves use `junos/`):

- `bootstrap/chassis-port-config.conf` — chassis port-speed / aggregated-devices / FPC
- `bootstrap/grpc-certificate.conf` — gRPC TLS cert for Apstra telemetry
- `interfaces/fabric-uplink.conf` — point-to-point /31 spine ↔ leaf fabric links
- `interfaces/loopback-multi-unit.conf` — lo0 router-id + EVPN overlay + per-VRF units
- `transport/bgp-underlay-fabric.conf` — eBGP underlay (leaf ↔ spine)
- `transport/bgp-evpn-overlay.conf` — eBGP EVPN overlay peer group
- `transport/forwarding-table-ecmp.conf` — ECMP + per-packet load-balance export
- `policy/community-definitions.conf` — fabric + VRF community definitions
- `policy/pod-network-export.conf` — AllPodNetworks direct-route export
- `policy/bgp-aos-export-policy.conf` — master export filter (chains AllPodNetworks + redistribution)
- `policy/leaf-to-spine-fabric-filter.conf` — underlay loop-prevention export filter
- `policy/leaf-to-spine-evpn-filter.conf` — overlay loop-prevention export filter
- `policy/per-packet-load-balance.conf` — PFE load-balance policy (referenced by forwarding-table)
- `oam/lldp-discovery.conf` — LLDP neighbor discovery
- `oam/sflow-telemetry.conf` — sFlow sampling + collector
- `oam/l2-learning-telemetry.conf` — remote-MAC telemetry

> **Junos-only transport add:** `junos/transport/evpn-vxlan-shared-tunnels.conf` (shared VTEP tunnels + VXLAN routing) is part of the Junos leaf baseline whenever the L2 MAC-VRF service is present.

---

## mac-vrf-evpn-vxlan (L2 EVPN-VXLAN MAC-VRF)  ·  Junos only

Runs on the Junos server-facing leaves (`esi-leaf1/2`, `server-leaf1`). A vlan-aware MAC-VRF that aggregates all L2 VNIs into one EVPN instance with per-VNI route-targets.

**minimum** (just the service)
- `junos/services/mac-vrf-evpn-vxlan.conf`
- `junos/interfaces/vlan-vxlan-domain.conf` (VLAN → VNI mapping + L3 IRB binding)
- `junos/interfaces/irb-gateway.conf` (anycast IRB gateway referenced by the vlans)
- `junos/interfaces/lag-esi-access.conf` (ESI all-active LAG to multi-homed servers)
- `junos/interfaces/trunk-access-port.conf` (single-homed L2 trunk to servers)
- `junos/transport/evpn-vxlan-shared-tunnels.conf` (forwarding-options vxlan-routing)

**with-overlay** (= minimum +)
- `junos/transport/bgp-evpn-overlay.conf` (asserts the EVPN family toward the spines)
- `junos/oam/rstp-bridge.conf` (edge-port BPDU protection on access LAGs)

**as-deployed** (= with-overlay + the shared fabric baseline above)

---

## vrf-evpn-ip-prefix (L3 EVPN Type-5 VRF)  ·  Junos + EVO

Runs on the leaves (`esi-leaf1/2`, `server-leaf1`) and border-leaves (Junos `borderleaf1/2_qfx5120-32c`, EVO `borderleaf1/2_qfx5130-32cd`). A VRF with EVPN ip-prefix (Type-5) routes; the border-leaf variant additionally runs eBGP to an external router with DHCP relay.

**minimum** (just the service) — OS-select every file
- `services/vrf-evpn-ip-prefix.conf`
- `interfaces/irb-gateway.conf` (IRB interfaces bound to the VRF)
- `interfaces/loopback-multi-unit.conf` (per-VRF lo0 unit for the RD)
- `policy/bgp-aos-export-policy.conf` (`BGP-AOS-Policy-$VRF_NAME` on EVPN export)
- `oam/ipv6-router-advertisement.conf` (IPv6 RA on IRB/WAN units)

**with-overlay** (= minimum +)
- `transport/bgp-evpn-overlay.conf` (asserts the EVPN family)

**as-deployed** (= with-overlay + shared fabric baseline)

> **Border-leaf external-peering add** (when the VRF exits to a WAN / external router — `borderleaf*` only): also include
> - `interfaces/external-vlan-tagged.conf` (flexible-VLAN external breakout)
> - `policy/external-route-import.conf` + `policy/external-route-export.conf` (per-peer import/export)
> - `policy/route-filter-lists.conf` (RoutesFromExt / RoutesToExt prefix lists)

---

## Add-a-feature requests (no full service)

When the user asks to add a supporting feature to an existing device, emit ONLY that snip set (OS-select):
- **LLDP** → `oam/lldp-discovery.conf`
- **sFlow telemetry** → `oam/sflow-telemetry.conf`
- **L2 learning telemetry** → `oam/l2-learning-telemetry.conf`
- **IPv6 Router Advertisement** → `oam/ipv6-router-advertisement.conf`
- **RSTP / BPDU protection** → `junos/oam/rstp-bridge.conf`
- **ECMP / load-balancing** → `transport/forwarding-table-ecmp.conf` + `policy/per-packet-load-balance.conf`
- **ESI multihomed access LAG** → `junos/interfaces/lag-esi-access.conf` + `junos/bootstrap/chassis-port-config.conf`
- **Single-homed access trunk** → `junos/interfaces/trunk-access-port.conf` + `junos/interfaces/vlan-vxlan-domain.conf`
- **External / WAN exit** → `interfaces/external-vlan-tagged.conf` + `policy/external-route-import.conf` + `policy/external-route-export.conf` + `policy/route-filter-lists.conf`
- **gRPC / Apstra telemetry cert** → `bootstrap/grpc-certificate.conf`
