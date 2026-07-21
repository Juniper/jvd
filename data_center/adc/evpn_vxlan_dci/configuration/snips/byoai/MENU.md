# EVPN-VXLAN DCI BYOAI — Full Query Menu

The always-current catalog of generation asks for the **EVPN-VXLAN Data Center Interconnect (DCI)** JVD — the *additional* Junos / Junos Evolved configuration that stitches EVPN/VXLAN fabrics across data centers (Over-the-Top, Type 2 seamless stitching, Type 2 + Type 5 seamless stitching), built with Juniper Apstra. All services render on the chosen gateway device(s) with the chosen form tier (`minimum` / `as-deployed`).

## DCI interconnect techniques

- `Generate the DCI overlay gateway for <device>` — `evpn-gw` overlay eBGP to the remote data center border leaves (multihop, BFD)
- `Generate a Type 2 seamless interconnect on <border-leaf>` — interconnect ESI / RD / interconnected-vni-list + per-VLAN translation VNI
- `Generate a Type 2 + Type 5 stretch on <border-leaf>` — the Type 5 L3 VRF interconnect + ip-prefix-routes on top of Type 2
- `Add translation VNI for VLAN <id> on <device>` — map a local VNI to the common DCI translation VNI

## Security

- `Add MACSEC to the DCI uplink on <device>` — gcm-aes-xpn-128 static-CAK connectivity-association (OTT / Type 2)

## Policy

- `Generate the DCI community definitions for <device>` — EVPN_GW_IN / EVPN_GW_OUT / EVPN_DCI_L2_TARGET / FABRIC_EVI_TARGET
- `Add the collapsed leaf-to-leaf DCI filter to <DC3 leaf>` — stop DCI overlay route re-advertisement between collapsed leaves

## Interfaces

- `Generate the loopback for <border-leaf>` — lo0 router-id / VTEP / gateway local-address + per-VRF loopbacks

## Greenfield / turn-up

- `Build the full DCI gateway config for a DC1 border-leaf (Type 2)` — as-deployed: gateway + interconnect + translation + communities + MACSEC
- `Build the DC3 collapsed-fabric leaf DCI config` — Junos gateway + interconnect + translation + leaf-to-leaf filter + MACSEC
- `Build the DC4 services-leaf Type 2 + Type 5 config`

## Audit / explain

- `Which snips are EVO-only vs Junos-only?`
- `Explain the three DCI techniques (OTT vs Type 2 vs Type 2+5)`
- `Explain seamless stitching and why a logical full mesh is mandatory`
- `Explain translation VNI and when it's needed`
- `Explain how inter-VLAN / intra-VLAN / inter-VRF flows are stitched across the DCI`

---

Don't see what you need? Describe it and the assistant will tell you whether the EVPN-VXLAN DCI JVD covers it.
