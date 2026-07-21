# Snip Variable Reference — 5-Stage EVPN-VXLAN Data Center

Variables used across the `5stage_evpn_vxlan` snip library. Replace `$VARIABLE`
placeholders with site-specific values when adapting snips to a new deployment.
JVD-wide constants (group names `l3clos-s` / `l3clos-s-evpn`, policy names
`SUPERSPINE_TO_SPINE_*`, `BGP-AOS-Policy`, the `evpn-1` MAC-VRF instance,
`enhanced-oism`, `pim-evpn-gateway`) are left literal because they *are* the
abstraction the JVD documents.

This library focuses on the **5-stage-distinctive** configuration — the lean
super-spine tier, enhanced OISM multicast, and RoCEv2 DCQCN. The per-POD 3-stage
fabric building blocks are shared with the
[3-stage data center](https://github.com/Juniper/jvd/tree/main/data_center/adc/3stage_dc/configuration/snips) library.

## Super-spine transport

| Variable | Example | Used in |
|----------|---------|---------|
| `$UNDERLAY_BFD_MS` | `1000` | superspine-underlay-ebgp |
| `$OVERLAY_BFD_MS` | `3000` | superspine-evpn-overlay-relay |
| `$BFD_MULTIPLIER` | `3` | superspine-underlay-ebgp, -overlay-relay |
| `$SPINE_PEER_V6` | `fdf6:ed70:1fac:f2d4::` | superspine-underlay-ebgp |
| `$LOCAL_V6` | `fdf6:ed70:1fac:f2d4::1` | superspine-underlay-ebgp |
| `$SPINE_OVERLAY_PEER` | `192.168.252.2` | superspine-evpn-overlay-relay |
| `$OVERLAY_LOCAL` | `192.168.252.0` | superspine-evpn-overlay-relay |
| `$PEER_DESCRIPTION` | `facing_spine001-001-1` | superspine-underlay-ebgp, -overlay-relay |
| `$POD_SPINE_AS` | `64701` | superspine-underlay-ebgp, -overlay-relay |

## OISM multicast

| Variable | Example | Used in |
|----------|---------|---------|
| `$VRF_NAME` | `blue` | oism-server-leaf, oism-border-pim-gateway |
| `$SBD_IRB` | `irb.3500` | oism-server-leaf, oism-border-pim-gateway |
| `$VRF_LOOPBACK` | `lo0.3` | oism-server-leaf |
| `$PIM_RP` | `100.100.100.100` | oism-border-pim-gateway |
| `$REVENUE_IRB` | `irb.1400` | oism-border-pim-gateway |

## Literal (no variables)

- `oism-enhanced-forwarding` — `forwarding-options multicast-replication evpn irb enhanced-oism`
- `oism-conserve-mcast-pfe` — `multicast-snooping-options oism conserve-mcast-routes-in-pfe` (QFX5130)
- `rocev2-dcqcn-drop-profiles` — `class-of-service drop-profiles dp0/dp1` (retune per fabric)
