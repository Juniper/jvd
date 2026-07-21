# Snip Variable Reference — Collapsed Data Center Fabric

Variables used across the `collapsed_dc_fabric` snip library. Replace `$VARIABLE`
placeholders with site-specific values when adapting snips to a new deployment.
JVD-wide constants (group names `l3clos-l` / `l3clos-l-evpn`, policy names
`BGP-AOS-Policy` / `EVPN_EXPORT`, the `evpn-1` MAC-VRF instance) are left literal
because they *are* the abstraction the JVD documents.

Both collapsed switches run **Junos OS** (baseline QFX5120-48Y), so every snip
lives under `junos/` — there is no `evo/` tree.

## Transport (direct leaf-to-leaf)

| Variable | Example | Used in |
|----------|---------|---------|
| `$UNDERLAY_BFD_MS` | `1000` | collapsed-underlay-ebgp |
| `$OVERLAY_BFD_MS` | `3000` | collapsed-evpn-overlay |
| `$BFD_MULTIPLIER` | `3` | both |
| `$PEER_LINK_IP` | `10.0.3.0` | collapsed-underlay-ebgp |
| `$LOCAL_LINK_IP` | `10.0.3.1` | collapsed-underlay-ebgp |
| `$PEER_LOOPBACK` | `192.168.253.1` | collapsed-evpn-overlay |
| `$LOCAL_LOOPBACK` | `192.168.253.0` | collapsed-evpn-overlay |
| `$PEER_DESCRIPTION` | `facing_dc3-rack-001-leaf2` | both |
| `$PEER_AS` | `64801` | both |

## Services

| Variable | Example | Used in |
|----------|---------|---------|
| `$VNI` | `10400` | mac-vrf-evpn-vxlan |
| `$VNI_RT` | `target:10400:1` | mac-vrf-evpn-vxlan |

## Interfaces

| Variable | Example | Used in |
|----------|---------|---------|
| `$AE_IFD` | `ae1` | esi-lag-access |
| `$AE_DESCRIPTION` | `to.dc3-rack-001-sys001` | esi-lag-access |
| `$ESI_VALUE` | `00:02:00:00:00:00:01:00:00:01` | esi-lag-access |
| `$LACP_SYSTEM_ID` | `02:00:00:00:00:01` | esi-lag-access |
| `$VLAN_MEMBERS` | `vn400 vn401` | esi-lag-access |
| `$IRB_UNIT` | `400` | irb-anycast-gateway |
| `$IRB_ADDRESS` | `10.0.0.1/24` | irb-anycast-gateway |
| `$ANYCAST_MAC` | `00:1c:73:00:00:01` | irb-anycast-gateway |
| `$LO_UNIT` | `0` | loopback |
| `$LO_IPV4` | `192.168.253.0/32` | loopback |
