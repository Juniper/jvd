# Auto-Fill Defaults

This file is part of the [BYOAI](README.md) corpus. It gives the deterministic JVD lab-default values the AI uses in `auto` mode (or when the user short-circuits with `all defaults` / `use defaults` / `skip`). It is bundled into [`jvd-ewan-ace-snips.md`](jvd-ewan-ace-snips.md) by `regenerate-bundle.sh`.

Use these values EXACTLY. Do not invent alternative defaults. Every value the AI auto-fills MUST be listed in the output's `Inputs used:` block so the user can rerun with edits.

All addressing uses documentation-range prefixes (RFC 5737 / RFC 3849) or private ranges where the JVD lab used them.

---

## Device inventory (the JVD topology)

| Device | OS family | Role | Loopback (router-id) |
|--------|-----------|------|----------------------|
| `wanedge1_mx304` | Junos | WAN Edge PE | `2.2.2.2` |
| `wanedge2_mx10004` | Junos | WAN Edge PE (uses RSVP-TE) | `5.5.5.5` |
| `wanedge3_acx7509` | EVO | WAN Edge PE | `4.4.4.4` |
| `wanedge4_acx7100-48l` | EVO | WAN Edge PE | `7.7.7.7` |
| `p1_ptx10003` | EVO | Core P / Route Reflector | `3.3.3.3` |
| `p2_ptx10001-36mr` | EVO | Core P / Route Reflector | `6.6.6.6` |

**Device-choice shortcuts** (offered in the clarifying question):
- `EVO` → `wanedge3_acx7509` + `wanedge4_acx7100-48l`
- `JUNOS` → `wanedge1_mx304` + `wanedge2_mx10004`
- `MIXED` → `wanedge1_mx304` (Junos) + `wanedge3_acx7509` (EVO)

The two P routers (`p1_ptx10003`, `p2_ptx10001-36mr`) are the iBGP route reflectors — services are NOT instantiated on them.

---

## Transport / underlay defaults

| Variable | Default | Notes |
|----------|---------|-------|
| `$LOCAL_AS` | `64512` | single iBGP AS, all devices |
| `$RR_PEER_1` | `3.3.3.3` | p1_ptx10003 loopback |
| `$RR_PEER_2` | `6.6.6.6` | p2_ptx10001-36mr loopback |
| `$ROUTER_ID` / `$LOCAL_ADDRESS` | = device loopback | per device (see table) |
| `$AREA` | `0.0.0.0` | OSPF single area |
| `$SRGB_START` | `16000` | domain-wide, consistent everywhere |
| `$SRGB_SIZE` | `8000` | SRGB 16000–24000 |
| `$NODE_SEGMENT_INDEX` | per device | wanedge1=102, wanedge2=105, wanedge3=104, wanedge4=107, p1=103, p2=106 |
| `$MTU` | `9192` | core uplinks |
| `$CORE_INTF` | `et-0/0/1` | first core uplink |
| `$IPV4_ADDRESS` (core p2p) | `192.168.<a><b>.<n>/24` | `<a><b>` = sorted device pair, e.g. 192.168.12.1 on wanedge1↔wanedge2 |

---

## LAG / interface defaults

| Variable | Default | Notes |
|----------|---------|-------|
| `$LAG_INTF` | `ae0` | access-facing LAG for all service ACs |
| `$LAG_MEMBER` | `xe-0/0/9:0` (Junos) / `et-0/0/2` (EVO) | first member |
| `$LACP_SYSTEM_ID` | `00:00:00:01:01:01` (Junos) / `00:00:00:00:01:01` (EVO) | per-OS |
| `$DEVICE_COUNT` | `16` | aggregated-devices ethernet device-count |

---

## Service instance-name conventions

Each service kind uses a distinct instance-name prefix. Increment the trailing numeric per instance.

| Service | Instance name pattern | Starting example | Unit / VLAN start |
|---------|----------------------|------------------|-------------------|
| EVPN-VPWS | `vpws_group_14_<n>` | `vpws_group_14_1` | unit/VLAN `301` |
| EVPN-FXC vlan-aware | `vfxc_group_40_<n>` | `vfxc_group_40_1001` | unit/VLAN `1001` |
| EVPN-ELAN vlan-based (Junos) | `elan_group_500_<n>` | `elan_group_500_2001` | unit/VLAN `2001` |
| EVPN-ELAN vlan-bundle (EVO) | `elan_group_500_<n>` | `elan_group_500_2001` | unit/VLAN `2001` |
| EVPN-ELAN + IRB | `elan_group_65_1_<n>` | `elan_group_65_1_100100` | IRB unit `100100` |
| EVPN Type-5 VRF | `evpn_<n>` | `evpn_100` | — |

---

## Route-distinguisher / route-target defaults

| Variable | Rule | Example |
|----------|------|---------|
| `$RD` | `<device-loopback>:<unit>` | `2.2.2.2:1999` (wanedge1) |
| `$RT` | `target:<AS+offset>:<unit>` per service family | VPWS `target:60014:<id>`; ELAN `target:60525:<unit>`; Type-5 `target:60<vrf>:<vrf>` |
| `$LOCAL_ID` / `$REMOTE_ID` | VPWS service-id pair; symmetric across the two PEs | local `1`, remote `2` (swap on the far PE) |

**Cross-PE identifier rule:** route-targets, VPWS service-id pairs, and ESI values MUST match on both PE halves of a service. Per-PE identifiers (loopback, RD, AC interface name) differ.

---

## IRB / L3 defaults

| Variable | Default | Notes |
|----------|---------|-------|
| `$IRB_UNIT` | = the ELAN unit (e.g. `100100`) | irb.<unit> |
| `$IRB_IPV4` | `100.100.<x>.1/24` | anycast gateway per bridge domain |
| `$VLAN_ID` | `none` (IRB flavor) or = unit | `vlan-id none` allows multi/untagged into the BD |

---

## ESI (multi-homing) defaults

- All-active ESI on `ae0` for multi-homed CEs.
- ESI value pattern: `00:11:22:33:44:55:66:77:88:<nn>` — the trailing octet is per-ESI; MUST match on both PEs of the multi-homed pair.
- LACP system-id on the shared LAG MUST match on both PEs of the ESI.

---

## CoS defaults

8-class model (do not renumber): CONTROL(7), NETWORK(6), REALTIME(5), BUSINESS(4), SIG-OAM(3), MEDIUM(2), LOW(1), BEST-EFFORT(0). Drop-profiles `dp1`/`dp2` for WRED. These are JVD-wide constants — never parameterize the class names or queue numbers.
