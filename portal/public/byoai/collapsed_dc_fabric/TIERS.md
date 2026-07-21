# Configuration Form Tiers

This file is part of the [BYOAI](README.md) corpus. It tells the AI which snippet files to include for each feature at each verbosity tier. It is bundled into [`jvd-collapsed-snips.md`](jvd-collapsed-snips.md) by `regenerate-bundle.sh`.

For each feature, the AI includes ONLY the snips listed for the chosen tier — and ONLY those — unless the user explicitly asks for more. Both collapsed switches run Junos, so all snips are under `junos/`.

The two tiers:

- **minimum** — just the requested feature's stanza(s). Assumes the collapsed fabric (direct underlay + EVPN overlay) is already present.
- **as-deployed** — the feature + the supporting config the JVD renders alongside it.

---

## collapsed-fabric (direct leaf-to-leaf transport)

The two-switch fabric baseline: the direct eBGP underlay + EVPN overlay between the collapsed leaves.

**minimum**
- `junos/transport/collapsed-underlay-ebgp.conf` (direct leaf-to-leaf underlay)
- `junos/transport/collapsed-evpn-overlay.conf` (direct leaf-to-leaf EVPN overlay)

**as-deployed** (= minimum +)
- `junos/interfaces/loopback.conf` (lo0 router-id / VTEP / per-VRF)

---

## mac-vrf (VLAN-aware MAC-VRF)

The L2 EVPN-VXLAN instance and its anycast gateway.

**minimum**
- `junos/services/mac-vrf-evpn-vxlan.conf` (evpn-1, 1 VNI per VLAN)
- `junos/interfaces/irb-anycast-gateway.conf` (anycast IRB gateway per VLAN)

**as-deployed** (= minimum +)
- `junos/transport/collapsed-evpn-overlay.conf` (advertises the EVI)
- `junos/interfaces/esi-lag-access.conf` (multihomed access into the VLANs)

---

## esi-access (multihomed access)

An all-active ESI-LAG to dual-home a server / access switch to both collapsed switches.

**minimum**
- `junos/interfaces/esi-lag-access.conf`

**as-deployed** (= minimum +)
- `junos/services/mac-vrf-evpn-vxlan.conf` (the VLANs/VNIs carried on the trunk)

---

## Greenfield collapsed turn-up

For a full two-switch turn-up, include everything: both transport snips + loopback + MAC-VRF + anycast IRB + ESI-LAG.

## Add-a-feature requests

When the user asks to add a single stanza, emit ONLY that snip:
- **Direct underlay** → `junos/transport/collapsed-underlay-ebgp.conf`
- **Direct EVPN overlay** → `junos/transport/collapsed-evpn-overlay.conf`
- **MAC-VRF** → `junos/services/mac-vrf-evpn-vxlan.conf`
- **Anycast IRB gateway** → `junos/interfaces/irb-anycast-gateway.conf`
- **ESI-LAG access** → `junos/interfaces/esi-lag-access.conf`
- **Loopback** → `junos/interfaces/loopback.conf`
