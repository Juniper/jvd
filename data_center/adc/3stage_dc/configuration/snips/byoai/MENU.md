# 3-Stage Data Center BYOAI — Full Query Menu

The always-current catalog of generation asks for the **3-Stage Data Center (EVPN-VXLAN)** JVD — a Junos / Junos Evolved Clos fabric (EVO spines, Junos leaves, Junos + EVO border-leaves) built with Juniper Apstra. Replace `N` with any count (e.g. `Generate 3 …`). All services render on the chosen device(s) with the chosen form tier (`minimum` / `with-overlay` / `as-deployed`).

## Services — L2 (EVPN-VXLAN)

- `Generate N MAC-VRF EVPN-VXLAN services` — vlan-aware MAC-VRF, per-VNI route-targets, anycast IRB gateway, ESI access (Junos leaves)
- `Add a VLAN → VNI to the MAC-VRF on <device>` — vlan-vxlan-domain mapping + IRB binding

## Services — L3 (EVPN Type-5)

- `Generate N EVPN Type-5 VRFs` — `vrf-evpn-ip-prefix` routing-instance, IRB gateway, DHCP relay (leaves + border-leaves, Junos or EVO)
- `Generate a border-leaf VRF with external WAN peering` — Type-5 VRF + eBGP to an external router + import/export policy + route-filter-lists

## Access / server-facing

- `Add an ESI all-active LAG to <leaf>` — multihomed server access with matching ESI + LACP system-id
- `Add a single-homed access trunk to <leaf>` — L2 trunk carrying EVPN/VXLAN VLANs
- `Add RSTP / BPDU protection to <leaf>` — edge-port loop protection

## Add a feature to a device

- `Add LLDP discovery to <device>`
- `Add sFlow telemetry to <device>` — sampling + collector
- `Add L2 learning telemetry to <device>` — remote-MAC visibility
- `Add IPv6 Router Advertisement to <device>`
- `Add ECMP load-balancing to <device>` — forwarding-table + per-packet policy
- `Add the gRPC / Apstra telemetry certificate to <device>`

## Greenfield / turn-up

- `Build a new QFX5120-48Y leaf turn-up` — full as-deployed fabric baseline + L2 MAC-VRF + L3 VRF
- `Bootstrap a new QFX5220-32CD spine end-to-end` — chassis + underlay + EVPN overlay + policies
- `Build a border-leaf (QFX5120-32C or QFX5130-32CD) with external WAN exit`

## Transport / underlay

- `Generate the eBGP underlay fabric for <device>` — leaf ↔ spine /31 peering
- `Generate the EVPN overlay peering for <device>` — eBGP EVPN peer group toward the spines
- `Generate the fabric export/loop-prevention policies for <device>`
- `Generate the forwarding-table ECMP config for <device>`

## Audit / explain

- `Which snips are EVO-only vs Junos-only?`
- `Explain the EVPN-VXLAN ERB (edge-routed bridging) anycast gateway design`
- `Explain the eBGP Clos underlay + EVPN overlay two-AS-tier model`
- `Explain the ESI all-active multihoming design`
- `Explain how the border-leaf exits the fabric to an external WAN`

---

Don't see what you need? Describe it and the assistant will tell you whether the 3-Stage Data Center JVD covers it.
