# Configuration Form Tiers

This file is part of the [BYOAI](README.md) corpus. It tells the AI which snippet files to include for each service kind at each verbosity tier (`minimum` vs `as-deployed`). It is bundled into [`jvd-mebs-snips.md`](jvd-mebs-snips.md) by `regenerate-bundle.sh`.

For each service kind, the AI includes ONLY the snips listed for the chosen tier — and ONLY those — unless the user explicitly asks for more. Use the OS-appropriate file under `junos/` or `evo/`.

---

## EVPN-VPWS

**minimum**
- `services/evpn-vpws.conf`
- `interfaces/lag-esi-multihoming.conf` (AC unit, multi-homed) **OR** `interfaces/edge-vlan-normalization.conf` (AC unit, single-homed)
- `transport/bgp-overlay.conf` (`family evpn signaling`)
- `transport/isis-srmpls-tilfa.conf` (label transport)

**as-deployed** (= minimum +)
- `transport/mpls-segment-routing.conf`
- `apply-groups/gr-edge-intf-mh.conf` (or `gr-edge-intf.conf` if SH)
- `apply-groups/gr-core-intf.conf`
- `apply-groups/gr-isis-bcp.conf`
- `apply-groups/gr-bgp-bcp.conf`
- `apply-groups/gr-isis-bfd.conf`
- `apply-groups/gr-lag-member.conf`
- `apply-groups/gr-fatpw-lb.conf`
- `apply-groups/gr-fatpw-label.conf`
- `policy/communities.conf` (BGP-CT color communities)
- `cos/forwarding-classes.conf`
- `cos/schedulers.conf`
- `oam/oam-cfm-perf-mon.conf`
- `firewall/policers.conf`

---

## L3VPN-VRF

**minimum**
- `services/l3vpn-vrf.conf`
- `policy/communities.conf` (just the per-VRF target community, not topology tags or BGP-CT colors)
- `policy/l3vpn-export-import.conf`
- `transport/bgp-overlay.conf` (`family inet-vpn unicast`)
- `transport/isis-srmpls-tilfa.conf`
- `interfaces/edge-vlan-normalization.conf` (PE-CE AC unit)

**as-deployed** (= minimum +)
- `transport/mpls-segment-routing.conf`
- `apply-groups/gr-l3vpn.conf`
- `apply-groups/gr-edge-intf.conf` (or `-mh.conf` if multi-homed CE)
- `apply-groups/gr-core-intf.conf`
- `apply-groups/gr-isis-bcp.conf`
- `apply-groups/gr-bgp-bcp.conf`
- `apply-groups/gr-isis-bfd.conf`
- `apply-groups/gr-lag-member.conf`
- `cos/forwarding-classes.conf`
- `cos/schedulers.conf`
- `firewall/policers.conf`
- `policy/communities.conf` (full set incl. BGP-CT colors)

---

## EVPN-ELAN (mac-vrf, mac-vrf-irb, or port-based)

**minimum**
- `services/evpn-elan-mac-vrf.conf` (or `-irb.conf`, or `evpn-port-based.conf`, whichever flavor was requested)
- `interfaces/lag-esi-multihoming.conf` (AC unit) **OR** `interfaces/edge-vlan-normalization.conf` (single-homed)
- `transport/bgp-overlay.conf` (`family evpn signaling`)
- `transport/isis-srmpls-tilfa.conf`

**as-deployed** (= minimum +)
- `transport/mpls-segment-routing.conf`
- `apply-groups/gr-edge-intf-mh.conf`
- `apply-groups/gr-core-intf.conf`
- `apply-groups/gr-isis-bcp.conf`
- `apply-groups/gr-bgp-bcp.conf`
- `apply-groups/gr-isis-bfd.conf`
- `apply-groups/gr-lag-member.conf`
- `apply-groups/gr-fatpw-lb.conf`
- `apply-groups/gr-fatpw-label.conf`
- `policy/communities.conf`
- `cos/forwarding-classes.conf`
- `cos/schedulers.conf`
- `oam/oam-cfm-perf-mon.conf`
- `firewall/policers.conf`

---

## L2CIRCUIT (including hot-standby)

**minimum**
- `services/l2circuit-hot-standby.conf`
- `interfaces/edge-vlan-normalization.conf`
- `transport/bgp-overlay.conf`
- `transport/isis-srmpls-tilfa.conf`

**as-deployed** (= minimum +)
- `transport/mpls-segment-routing.conf`
- `apply-groups/gr-edge-intf.conf`
- `apply-groups/gr-core-intf.conf`
- `apply-groups/gr-isis-bcp.conf`
- `apply-groups/gr-bgp-bcp.conf`
- `apply-groups/gr-isis-bfd.conf`
- `apply-groups/gr-l2ckt-hs.conf`
- `apply-groups/gr-fatpw-lb.conf`
- `apply-groups/gr-fatpw-label.conf`
- `policy/communities.conf`
- `cos/forwarding-classes.conf`
- `cos/schedulers.conf`
- `oam/oam-cfm-perf-mon.conf`
- `firewall/policers.conf`

---

## L2VPN (Kompella) and LDP-VPLS

Same shape as the others: `services/<topic>.conf` + matching transport snips for **minimum**; full apply-group baseline + CoS + OAM + BGP-CT for **as-deployed**.

---

## Bootstrap / greenfield turn-up

Treat as **as-deployed** regardless of the user's tier choice — a greenfield turn-up is by definition the full baseline.

---

Always acknowledge the chosen tier in the `Inputs Used` block (`form: minimum` or `form: as-deployed`).
