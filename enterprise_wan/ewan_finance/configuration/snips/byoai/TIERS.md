# Configuration Form Tiers

This file is part of the [BYOAI](README.md) corpus. It tells the AI which snippet files to include for each service kind at each verbosity tier. It is bundled into [`jvd-ewan-fin-snips.md`](jvd-ewan-fin-snips.md) by `regenerate-bundle.sh`.

For each service kind, the AI includes ONLY the snips listed for the chosen tier — and ONLY those — unless the user explicitly asks for more. Use the OS-appropriate file under `junos/` or `evo/`.

---

## What the tiers mean

| Tier | Use when | What's included |
|---|---|---|
| **`minimum`** | Brownfield change. Node already has a working MPLS/RSVP-TE + OSPF underlay AND the iBGP core mesh. You just want the new service. | Service routing-instance + its attachment interface(s) + service-essential helpers (IRB, provider-tunnel, multicast tuning/filter). **Nothing else.** |
| **`with-overlay`** | Brownfield-ish. Node has the underlay but you want to (re)assert the iBGP core mesh that carries the service address family (inet-vpn / inet-mvpn / evpn). | `minimum` + `transport/ibgp-core-mesh.conf`. |
| **`as-deployed`** | Greenfield turn-up, lab build, or "give me a working example end-to-end." Mirrors what the JVD validates. | Everything: service + attachment + iBGP core mesh + OSPF-TE + RSVP + MPLS (P2MP/interfaces) + loopback + core p2p + chassis + CoS + LLDP + policy. |

> **Greenfield / bootstrap requests** (e.g. "build a new MX304 WAN-edge turn-up", "bootstrap a new ACX7100 core router") are always treated as **`as-deployed`** regardless of the user's tier choice.

If the user picks `minimum` and the AI cannot tell whether the iBGP core mesh already carries the needed family, it should call that out in the `Notes:` section.

---

## Shared underlay (the `as-deployed` baseline for every routing node)

Every `as-deployed` service includes this common baseline. OS-select each file (the MPLS forwarding snip differs: Junos folds LSPs into `mpls-lsp-p2mp`; EVO uses `mpls-interfaces`):

- `bootstrap/chassis-config.conf` — chassis hardware, aggregated-devices, FPC/PIC, tunnel-services
- `interfaces/physical-p2p-mpls.conf` — core P2P links (family inet + mpls)
- `interfaces/loopback-multi-af.conf` — lo0 router-id (v4 + v6 + ISO NET)
- `transport/ibgp-core-mesh.conf` — iBGP full mesh / route-reflection (inet-vpn, inet-mvpn, evpn families)
- `transport/ospf-te-protection.conf` — OSPF area + TE extensions + link protection + BFD
- `transport/rsvp-signaling.conf` — RSVP-TE signaling on core interfaces
- `transport/mpls-lsp-p2mp.conf` (Junos) / `transport/mpls-interfaces.conf` (EVO) — MPLS forwarding + LSPs
- `cos/exp-classifiers-schedulers.conf` — EXP classifiers, forwarding classes, schedulers
- `policy/protocol-redistribution.conf` — direct/BGP↔OSPF redistribution policies
- `oam/lldp-discovery.conf` — LLDP neighbor discovery

> The **L2/L3 edge** (`l2-l3_edge_acx7100`) is NOT a full routing node. It takes only `evo/bootstrap/chassis-config.conf` + `evo/interfaces/lag-lacp.conf` + `evo/interfaces/vlan-bridge-domain.conf` + `evo/oam/lldp-discovery.conf`.

---

## NG-MVPN (multicast VRF — SPT-only, RSVP-TE P2MP)  ·  Junos only

Runs on the WAN-edge / aggregation PEs (`wanedge1/2`, `ap1/2`).

**minimum** (just the service)
- `junos/services/mvpn-instance.conf`
- `junos/interfaces/irb-l3-gateway.conf` (IRB bound to the MVPN VRF)
- `junos/transport/mpls-lsp-p2mp.conf` (P2MP provider-tunnel template)
- `junos/multicast/forwarding-multicast-tuning.conf` (resolve/mismatch rate)
- `junos/firewall/multicast-fwd-cache-filter.conf` (multicast CoS marking)

**with-overlay** (= minimum +)
- `junos/transport/ibgp-core-mesh.conf` (carries `inet-mvpn` / MVPN NLRI, Type-5/7)

**as-deployed** (= with-overlay + the shared underlay baseline above)

---

## EVPN virtual-switch (Active/Standby, ESI multihoming)  ·  Junos only

Runs on the WAN-edge PEs (`wanedge1/2`).

**minimum** (just the service)
- `junos/services/evpn-virtual-switch-esi.conf`
- `junos/interfaces/lag-esi-lacp.conf` (ae0 with ESI + LACP, per-unit DF)
- `junos/interfaces/irb-l3-gateway.conf` (IRB gateway in the bridge domain)

**with-overlay** (= minimum +)
- `junos/transport/ibgp-core-mesh.conf` (carries `evpn` family)

**as-deployed** (= with-overlay + shared underlay baseline)

---

## L3VPN VRF (unicast VRF, eBGP PE-CE)  ·  Junos only

Runs on the WAN-edge / aggregation PEs (`wanedge1/2`, `ap1/2`).

**minimum** (just the service)
- `junos/services/vrf-l3vpn.conf`
- `junos/interfaces/irb-l3-gateway.conf` (IRB the VRF binds)
- `junos/firewall/multicast-fwd-cache-filter.conf` (VRF CoS-marking filter)

**with-overlay** (= minimum +)
- `junos/transport/ibgp-core-mesh.conf` (carries `inet-vpn`)

**as-deployed** (= with-overlay + shared underlay baseline)

---

## Virtual-router (CR PE-CE context — eBGP to AP, PIM-SM)  ·  Junos + EVO

Runs on the core routers (`cr1_acx7100-48l` = EVO, `cr2_mx480` = Junos).

**minimum** (just the service) — OS-select every file
- `services/virtual-router-instance.conf`
- `interfaces/flexible-vlan-subinterface.conf` (PE-CE subinterfaces)
- `policy/route-filter-med.conf` (MED export policies)
- `oam/twamp-client.conf` (SLA probing)
- **EVO only, additionally:** `evo/interfaces/vlan-bridge-domain.conf` + `evo/interfaces/lag-lacp.conf`

**with-overlay** (= minimum +)
- `transport/ibgp-core-mesh.conf` (CR global iBGP toward the RRs)
- `policy/protocol-redistribution.conf`

**as-deployed** (= with-overlay + shared underlay baseline)

---

## Add-a-feature requests (no full service)

When the user asks to add a supporting feature to an existing device, emit ONLY that snip set (OS-select):
- **CoS** → `cos/exp-classifiers-schedulers.conf`
- **TWAMP / OAM** → `oam/twamp-server.conf` (Junos AP/WAN-edge) and/or `oam/twamp-client.conf` (CR) + `oam/lldp-discovery.conf`
- **Multicast forwarding filter (CoS marking)** → `junos/firewall/multicast-fwd-cache-filter.conf`
- **Multicast PFE tuning** → `junos/multicast/forwarding-multicast-tuning.conf`
- **MED / redistribution policy** → `policy/route-filter-med.conf` + `policy/protocol-redistribution.conf`
- **L2/L3 edge bridging** → `evo/interfaces/vlan-bridge-domain.conf` + `evo/interfaces/lag-lacp.conf`
