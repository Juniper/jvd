# Auto-Fill Defaults

This file is part of the [BYOAI](README.md) corpus. It gives the deterministic JVD lab-default values the AI uses in `auto` mode (or when the user short-circuits with `all defaults` / `use defaults` / `skip`). It is bundled into [`jvd-ewan-core-edge-snips.md`](jvd-ewan-core-edge-snips.md) by `regenerate-bundle.sh`.

Use these values EXACTLY. Do not invent alternative defaults. Every value the AI auto-fills MUST be listed in the output's `Inputs used:` block so the user can rerun with edits.

---

## Device inventory (the JVD topology)

| Device | OS family | Role | Loopback (router-id) |
|--------|-----------|------|----------------------|
| `wanedge1_mx304` | Junos | WAN Edge PE | `10.10.0.12` |
| `wanedge2_mx10008` | Junos | WAN Edge PE | `192.168.0.11` |
| `wanedge3_acx7509` | EVO | WAN Edge PE | `192.168.0.14` |
| `wanedge4_acx7100-48l` | EVO | WAN Edge PE | `192.168.0.16` |
| `p1_ptx10003` | EVO | Core P / Route Reflector | `1.1.1.8` |
| `p2_ptx10001-36mr` | EVO | Core P / Route Reflector | `192.168.0.17` |
| `ce1_acx7100-48l` | EVO | L2/L3 Edge (CE) | — |
| `ce2_mx480` | Junos | L2/L3 Edge (CE) | — |

**Device-choice shortcuts** (offered in the clarifying question):
- `EVO` → `wanedge3_acx7509` + `wanedge4_acx7100-48l`
- `JUNOS` → `wanedge1_mx304` + `wanedge2_mx10008`
- `MIXED` → `wanedge1_mx304` (Junos) + `wanedge3_acx7509` (EVO)

The two P routers (`p1_ptx10003`, `p2_ptx10001-36mr`) are the iBGP route reflectors — services are NOT instantiated on them. The two CE devices are customer-premises equipment — generate PE-side config only.

---

## Transport / underlay defaults

| Variable | Default | Notes |
|----------|---------|-------|
| `$LOCAL_AS` | `64512` | single iBGP AS, all devices |
| `$RR_NEIGHBOR_1` | `192.168.0.17` | p2_ptx10001-36mr loopback |
| `$RR_NEIGHBOR_2` | `192.168.0.11` | — (wanedge2 is also a neighbor on some devices) |
| `$ROUTER_ID` / `$LOCAL_ADDRESS` | = device loopback | per device (see table) |
| `$AREA` | `0.0.0.0` | OSPF single area |
| `$CE_PEER_AS` | `64510` (site 1) / `64520` (site 2) | CE AS numbers |
| `$RP_ADDRESS` | `1.1.1.8` (on PEs: static RP) | p1_ptx10003 loopback |
| `$MTU` | — | core uplinks (use platform default) |

---

## LAG / interface defaults

| Variable | Default | Notes |
|----------|---------|-------|
| `$AE_INTF` (core) | `ae2` | core-facing LAG to P-routers |
| `$AE_INTF` (access) | `ae1` | access-facing LAG for service ACs |
| `$LACP_SYSTEM_ID` | `00:00:22:00:00:01` (wanedge1) / `00:00:44:00:00:01` (wanedge3) | per-device |
| `$AE_DEVICE_COUNT` | `25` | aggregated-devices ethernet device-count |

---

## Service instance-name conventions

Each service kind uses a distinct instance-name prefix. Increment the trailing numeric per instance.

| Service | Instance name pattern | Starting example | Unit / VLAN start |
|---------|----------------------|------------------|-------------------|
| L3VPN VRRP | `l3vpn_vrrp_3001_<n>` | `l3vpn_vrrp_3001_3002` | unit `3002` |
| L3VPN Spoke | `l3vpn_Spoke_<site>_<n>` | `l3vpn_Spoke_1_1` | unit `4001` |
| VPLS | `vpls_group_101_<n>` | `vpls_group_101_1` | unit/VLAN `1` |
| L2CKT | — (no routing-instance) | — | unit `1501` |
| NGMVPN | `vpn-mcast_<n>` | `vpn-mcast_1` | lo0 unit `1` |
| NGMVPN Hub | `Hub_Adv_To_Spokes_<n>` | `Hub_Adv_To_Spokes_1001` | unit `2001` |
| NGMVPN Spoke | `Spokes_Adv_To_Hub_<n>` | `Spokes_Adv_To_Hub_1001` | unit `1001` |

---

## Route-distinguisher / route-target defaults

| Variable | Rule | Example |
|----------|------|---------|
| `$RD` | `<device-loopback>:<unit>` | `10.10.0.12:3002` (wanedge1) |
| `$VRF_TARGET` | `<CE_AS>:<unit>` for L3VPN | `64510:3002` |
| `$VRF_TARGET` (VPLS) | `64512:<RD-suffix>` | `64512:1011` |
| Hub/Spoke RT | `target:65535:<2N-1>` (hub) / `target:65535:<2N>` (spoke) | hub_1 = `target:65535:1`, spoke_1 = `target:65535:2` |
| NGMVPN | `<RP-address>:<id>` | `10.33.33.1:1` |

**Cross-PE consistency rule:** route-targets and VPLS-IDs MUST match across all PEs in the same service instance. Per-PE identifiers (loopback, RD, site-identifier, AC interface) differ.

---

## CoS defaults

8-class model: af(2), af1(6), be(0), be1(4), ef(1), ef1(5), nc(3), nc1(7). DSCP classifier "mydscp" + 802.1p "dot1p". These are JVD-wide constants — never parameterize the class names or queue numbers.
