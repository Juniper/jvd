# Snip Variable Reference — Collapsed Data Center Fabric with Access Switches

Variables used across the `collapsed_dc_fabric_with_access` snip library. Replace
`$VARIABLE` placeholders with site-specific values when adapting snips to a new
deployment. JVD-wide constants (group names `l3clos-a` / `l3clos-a-evpn`, policy
names `BGP-AOS-Policy`, the `evpn-1` MAC-VRF instance) are left literal because
they *are* the abstraction the JVD documents.

Both tiers (collapsed QFX5120-48Y leaves and EX4400 access switches) run **Junos
OS**, so every snip lives under `junos/`. This library focuses on the
**access-layer extension** — for the base collapsed-fabric building blocks
(leaf direct `l3clos-l` underlay/overlay, anycast IRB), see the
[Collapsed Data Center Fabric](https://github.com/Juniper/jvd/tree/main/data_center/adc/collapsed_dc_fabric/configuration/snips) library.

## Access-tier transport

| Variable | Example | Used in |
|----------|---------|---------|
| `$UNDERLAY_BFD_MS` | `1000` | access-underlay-ebgp |
| `$OVERLAY_BFD_MS` | `3000` | access-evpn-overlay |
| `$BFD_MULTIPLIER` | `3` | both |
| `$PEER_LINK_IP` | `10.0.3.4` | access-underlay-ebgp |
| `$LOCAL_LINK_IP` | `10.0.3.5` | access-underlay-ebgp |
| `$PEER_LOOPBACK` | `192.168.253.3` | access-evpn-overlay |
| `$LOCAL_LOOPBACK` | `192.168.253.2` | access-evpn-overlay |
| `$PEER_DESCRIPTION` | `facing_dc3-rack-001-access2` | both |
| `$PEER_AS` | `64803` | both |

## Interfaces

| Variable | Example | Used in |
|----------|---------|---------|
| `$AE_IFD` | `ae1` | esi-lag |
| `$AE_DESCRIPTION` | `facing_dc3-rack-001-leaf-pair1` | esi-lag |
| `$ESI_VALUE` | `00:02:00:00:00:00:02:00:00:02` | esi-lag |
| `$LACP_SYSTEM_ID` | `02:00:00:00:00:02` | esi-lag |
| `$VLAN_MEMBERS` | `vn400 vn401` | esi-lag |
| `$LO_UNIT` | `0` | loopback |
| `$LO_IPV4` | `192.168.253.2/32` | loopback |

## Services

| Variable | Example | Used in |
|----------|---------|---------|
| `$VNI` | `10400` | mac-vrf-evpn-vxlan |
| `$VNI_RT` | `target:10400:1` | mac-vrf-evpn-vxlan |

## Literal (no variables)

- `evpn-vxlan-forwarding` — `forwarding-options evpn-vxlan shared-tunnels` + `vxlan-routing overlay-ecmp`.
