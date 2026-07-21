# Configuration Form Tiers

This file is part of the [BYOAI](README.md) corpus. It tells the AI which snippet files to include for each feature at each verbosity tier. It is bundled into [`jvd-5stage-snips.md`](jvd-5stage-snips.md) by `regenerate-bundle.sh`.

For each feature, the AI includes ONLY the snips listed for the chosen tier — and ONLY those — unless the user explicitly asks for more. OS-select each file under `junos/` (compute-POD leaves / spines) or `evo/` (super spines, storage/services leaves).

This is a **5-stage-distinctive** library: it layers onto a per-POD 3-stage EVPN/VXLAN fabric. There is no full-fabric baseline here — for that, use the [3-stage data center JVD](../../../../3stage_dc/configuration/snips/). The tiers control how much of the supporting OISM/RoCEv2 config comes along with the core stanza.

The two tiers:

- **minimum** — just the requested feature's stanza(s).
- **as-deployed** — the feature + the supporting config the JVD renders alongside it.

---

## superspine-transport (lean super-spine)  ·  EVO

The lean super-spine tier that connects and relays routes between PODs (no VXLAN).

**minimum**
- `evo/transport/superspine-underlay-ebgp.conf` (fabric underlay to POD spines)

**as-deployed** (= minimum +)
- `evo/transport/superspine-evpn-overlay-relay.conf` (EVPN overlay route relay between PODs)

---

## oism-multicast (enhanced OISM)  ·  EVO + Junos

Enhanced OISM (BDNE) multicast for ERB EVPN-VXLAN. OSPF + PIM + IGMP on the leaves, using a Supplemental Bridge Domain (irb.3500).

**minimum** (server / compute / storage leaf)
- `oism/oism-server-leaf.conf` (per-VRF OISM/PIM/OSPF) — OS-select
- `oam/oism-enhanced-forwarding.conf` (fabric-wide enhanced-oism enable) — OS-select

**as-deployed** (= minimum +)
- `evo/services/oism-conserve-mcast-pfe.conf` (QFX5130 leaves — PFE conservation)

> **Border-leaf variant (services POD, EVO):** for a leaf that bridges to an external PIM domain, use `evo/services/oism-border-pim-gateway.conf` (adds `pim-evpn-gateway`, static RP, distributed-DR revenue IRBs) instead of `oism-server-leaf.conf`, plus the fabric-wide enable and PFE-conserve.

---

## rocev2-qos (RoCEv2 DCQCN)  ·  EVO + Junos

DCQCN congestion management for RoCEv2 storage traffic (the ECN / WRED half).

**minimum**
- `cos/rocev2-dcqcn-drop-profiles.conf` (OS-select)

> **Note:** DCQCN also requires PFC (lossless queue + scheduler) config; retune the drop-profile fill-level / drop-probability curve per data center and test before deploying.

---

## Add-a-feature requests

When the user asks to add a supporting stanza to an existing device, emit ONLY that snip (OS-select):
- **Lean super-spine underlay** → `evo/transport/superspine-underlay-ebgp.conf`
- **Super-spine EVPN relay** → `evo/transport/superspine-evpn-overlay-relay.conf`
- **Enable enhanced OISM** → `oam/oism-enhanced-forwarding.conf`
- **Server-leaf OISM** → `services/oism-server-leaf.conf`
- **Border-leaf PIM-EVPN gateway** → `evo/services/oism-border-pim-gateway.conf`
- **QFX5130 OISM PFE conserve** → `evo/services/oism-conserve-mcast-pfe.conf`
- **RoCEv2 drop-profiles** → `cos/rocev2-dcqcn-drop-profiles.conf`
