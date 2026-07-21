# Configuration Form Tiers

This file is part of the [BYOAI](README.md) corpus. It tells the AI which snippet files to include for each DCI service kind at each verbosity tier. It is bundled into [`jvd-evpn-dci-snips.md`](jvd-evpn-dci-snips.md) by `regenerate-bundle.sh`.

For each service kind, the AI includes ONLY the snips listed for the chosen tier — and ONLY those — unless the user explicitly asks for more. OS-select each file under `junos/` (collapsed-fabric DC3 leaves) or `evo/` (border-leaf gateways) to match the target device.

This is a **DCI-additions** library: it layers onto an already-deployed EVPN/VXLAN fabric. There is no full-fabric `as-deployed` baseline here — the tiers control how much of the DCI supporting config (communities, loopback, encryption) comes along with the core interconnect stanza.

The two tiers:

- **minimum** — just the DCI stanza(s) that implement the chosen technique.
- **as-deployed** — the DCI stanza(s) + supporting config the JVD renders alongside them (community definitions, loopback, MACSEC where the JVD applies it).

---

## dci-gateway (DCI overlay eBGP gateway)  ·  EVO + Junos

The `evpn-gw` overlay eBGP session between border-leaf gateways in different data centers — the transport that carries all stitched EVPN routes. Present in every DCI technique.

**minimum**
- `transport/dci-gateway-overlay-ebgp.conf` (OS-select)

**as-deployed** (= minimum +)
- `policy/community-definitions.conf` (EVPN_GW_IN / EVPN_GW_OUT / EVPN_DCI_L2_TARGET / FABRIC_EVI_TARGET)
- `interfaces/loopback.conf` (EVO; lo0.0 gateway local-address)
- `security/macsec-dci.conf` (OS-select; encrypt the interconnect uplink — OTT and Type 2)

---

## evpn-interconnect (Type 2 seamless stitching)  ·  EVO + Junos

Terminates local VXLAN tunnels at the border/collapsed leaf and re-originates the selected VNIs onto the DCI overlay, with per-VLAN VNI translation. Runs on the DC1 border leaves and DC3 collapsed leaves.

**minimum**
- `services/evpn-interconnect.conf` (interconnect ESI / RD / interconnected-vni-list)
- `services/vxlan-translation-vni.conf` (per-VLAN translation VNI)

**as-deployed** (= minimum +)
- `transport/dci-gateway-overlay-ebgp.conf` (carries the stitched routes)
- `policy/community-definitions.conf` (EVPN_DCI_L2_TARGET is the interconnect RT)
- `security/macsec-dci.conf` (encrypt the interconnect uplink)

> **Collapsed-fabric add (Junos DC3 leaves only):** also include `junos/policy/leaf-to-leaf-dci-filter.conf` — it stops DCI overlay routes being re-advertised between the two collapsed leaves (Apstra omits this policy on collapsed fabric).

---

## type5-stretch (Type 2 + Type 5 seamless stitching)  ·  EVO

Extends Type 2 stitching by also stretching the Layer 3 context of a tenant VRF across data centers (3-stage DC1 ↔ 5-stage DC4). Runs on the DC1 and DC4 EVO border leaves.

**minimum**
- `evo/services/vrf-type5-interconnect.conf` (VRF interconnect RT/RD + ip-prefix-routes)

**as-deployed** (= minimum + the full `evpn-interconnect` as-deployed set)
- `evo/services/evpn-interconnect.conf` + `evo/services/vxlan-translation-vni.conf` (Type 2 half)
- `evo/transport/dci-gateway-overlay-ebgp.conf`
- `evo/policy/community-definitions.conf`

---

## macsec (encrypt the DCI uplink)  ·  EVO + Junos

Add MACSEC to the interconnect uplink between gateways (OTT and Type 2).

**minimum**
- `security/macsec-dci.conf` (OS-select)

---

## Add-a-feature requests (no full service)

When the user asks to add a supporting feature to an existing DCI gateway, emit ONLY that snip (OS-select):
- **DCI overlay gateway** → `transport/dci-gateway-overlay-ebgp.conf`
- **Translation VNI** → `services/vxlan-translation-vni.conf`
- **MACSEC on the uplink** → `security/macsec-dci.conf`
- **DCI communities** → `policy/community-definitions.conf`
- **Collapsed leaf-to-leaf filter** → `junos/policy/leaf-to-leaf-dci-filter.conf`
- **Type 5 L3 stretch** → `evo/services/vrf-type5-interconnect.conf`
