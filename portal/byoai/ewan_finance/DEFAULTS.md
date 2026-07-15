# Auto-Fill Defaults

This file is part of the [BYOAI](README.md) corpus. It gives the deterministic JVD lab-default values the AI uses in `auto` mode (or when the user short-circuits with `all defaults` / `use defaults` / `skip`). It is bundled into [`jvd-ewan-fin-snips.md`](jvd-ewan-fin-snips.md) by `regenerate-bundle.sh`.

Use these values EXACTLY. Do not invent alternative defaults. Every value the AI auto-fills MUST be listed in the output's `Inputs used:` block so the user can rerun with edits.

Addresses below are the JVD lab's actual values (from each device `.conf`). Substitute site values when deploying.

---

## Device inventory (the JVD topology)

| Device | Platform | OS family | Role | Loopback (router-id) |
|--------|----------|-----------|------|----------------------|
| `wanedge1_mx304` | MX304 | Junos | WAN Edge PE — ESI LAG, EVPN, MVPN sender | `10.200.50.12` |
| `wanedge2_mx10004` | MX10004 | Junos | WAN Edge PE — ESI LAG, EVPN, MVPN sender | `10.200.50.15` |
| `ap1_mx304` | MX304 | Junos | Aggregation PE — TWAMP server, MVPN | `10.200.50.14` |
| `ap2_mx10004` | MX10004 | Junos | Aggregation PE — TWAMP server, MVPN | `10.200.50.16` |
| `cr1_acx7100-48l` | ACX7100-48L | **EVO** | Core Router — virtual-router, TWAMP client | `10.200.50.9` |
| `cr2_mx480` | MX480 | Junos | Core Router — virtual-router, TWAMP client | `10.200.50.18` |
| `p1_ptx10003-80c` | PTX10003-80C | **EVO** | P-router — MPLS/RSVP transit | `10.200.50.13` |
| `p2_ptx10001-36mr` | PTX10001-36MR | **EVO** | P-router — MPLS/RSVP transit | `10.200.50.11` |
| `l2-l3_edge_acx7100` | ACX7100 | **EVO** | L2/L3 Edge — VLAN bridge, LAG (no L3 overlay) | — |

**Device-choice shortcuts** (offered in the clarifying question):
- `WANEDGE` → `wanedge1_mx304` + `wanedge2_mx10004` (Junos; MVPN / EVPN / L3VPN senders)
- `AP` → `ap1_mx304` + `ap2_mx10004` (Junos; MVPN, TWAMP server)
- `CR` → `cr1_acx7100-48l` (EVO) + `cr2_mx480` (Junos) (virtual-router, TWAMP client)
- `P` → `p1_ptx10003-80c` + `p2_ptx10001-36mr` (EVO; MPLS transit only — no service instances)

The multicast finance overlay (NG-MVPN, EVPN A/S, L3VPN, IRB/ESI, firewall CoS marking, multicast tuning, TWAMP-server) is **Junos-exclusive** on the MX WAN-edge / AP nodes. EVO nodes (ACX/PTX) carry the shared underlay plus the **virtual-router** overlay and the L2/L3-edge bridging snips.

---

## Transport / underlay defaults

| Variable | Default | Notes |
|----------|---------|-------|
| `$LOCAL_AS` | `64512` | single iBGP core AS (wanedge / ap / p / cr global) |
| `$ROUTER_ID_ADDRESS` / `$LOCAL_ADDRESS` | = device loopback | per device (see table), `/32` |
| `$MGMT_LOOPBACK` | `10.255.163.<n>/32` | management lo0 unit |
| `$ISO_ADDRESS` | NET derived from loopback | `47.0005.80ff.f800.0000.0108.0001.<lo-as-nibbles>.00` |
| `$IPV6_ADDRESS` | `2001:db8::10:200:50:<n>/128` | v6 loopback |
| `$NEIGHBOR_1..5` | other core loopbacks | iBGP peers from the table |
| `$BFD_INTERVAL` / `$BFD_MULTIPLIER` | `10` / `3` | OSPF + RSVP BFD |
| `$MTU` | `1522` | core P2P (jumbo-capable links) |
| `$CORE_IFACE_1..4` | `et-0/0/<n>.0` | core transport interfaces |

**RSVP-TE / MPLS:** named unicast LSPs `lsp_to_<peer>` toward each core loopback (`$LSP_NAME_n` / `$LSP_DEST_n`); P2MP provider-tunnel template `$P2MP_LSP_NAME` = `P2MP`.

---

## LAG / interface defaults

| Variable | Default | Notes |
|----------|---------|-------|
| `$AE_NAME` | `ae0` | access-facing LAG (ESI on WAN-edge; plain LACP on L2/L3 edge) |
| `$INTERFACE_NAME` | `et-0/0/0` | first physical member |
| `$DEVICE_COUNT` | `25` | aggregated-devices ethernet device-count |
| `$LACP_SYSTEM_ID` | `00:00:00:00:00:10` | must match across ESI peers |
| `$VLAN_ID` | `1` | first service VLAN |
| `$UNIT_ID` | `1` | first logical unit |

---

## ESI (multi-homing) defaults — EVPN virtual-switch

- All-active / Active-Standby ESI on `ae0` for multi-homed CEs.
- `$ESI_ID` pattern: `00:11:11:11:11:11:12:12:12:12` — MUST match on both PEs of the multihomed pair.
- `$DF_PREFERENCE` `150`; per-unit ESI `$UNIT_ESI` for per-VLAN DF election.
- `$LACP_SYSTEM_ID` on the shared LAG MUST match on both PEs of the ESI.

---

## Service instance-name conventions

Each service kind uses a distinct instance-name + RD/RT namespace. Increment the trailing numeric per instance.

| Service | Instance name | RD (`<loopback>:<id>`) | RT | Start IDs |
|---------|---------------|------------------------|----|-----------|
| NG-MVPN | `MVPN_INSTANCE<n>` | `10.200.50.12:61` | `target:64512:101` (import=export) | instance `1`, RT `101` |
| EVPN virtual-switch | `EVPN_ESI_LAG<n>` / BD `BD_EVPN_GROUP<n>` | `10.200.50.12:1` | `target:61535:1` | group `1`, VLAN `1`, `ae0.1` |
| L3VPN VRF | `VRF<n>` | `10.200.50.12:2<n>` | `target:64512:<n>` | `VRF21`, RD `…:221`, RT `…:21`, `irb.21` |
| Virtual-router | `VIRTUAL-ROUTER-V<n>` | — (eBGP context) | — | AP peer AS `64512`; VR AS cr1 `64520` / cr2 `64521` |

---

## Multicast / MVPN defaults

| Variable | Default | Notes |
|----------|---------|-------|
| `$RP_ADDRESS` | `10.10.47.101` | PIM Rendezvous Point |
| `$MCAST_GROUP_RANGE` | `225.0.0.0/22` | PIM group-range (virtual-router); MVPN filter `225.0.0.0/16` |
| `$RESOLVE_RATE` / `$MISMATCH_RATE` | `1000` / `1000` | multicast PFE resolve / RPF-mismatch (pps) |
| `$IRB_UNIT` / `$LO_UNIT` | `irb.1` / `lo0.1` | bound to the MVPN instance |
| `$CE_PEER_AS` | `64513` | CE / traffic-generator AS |

---

## Policy (MED) defaults — virtual-router

| Variable | Default | Notes |
|----------|---------|-------|
| `$MED_LOW_NAME` / `$MED_LOW_VALUE` | `PS-med-10` / `10` | preferred path, prefix `$MED_LOW_PREFIX` `10.101.0.0/16` |
| `$MED_HIGH_NAME` / `$MED_HIGH_VALUE` | `PS-med-30` / `30` | catch-all backup path |
| `$EXPORT_POLICIES` | `[ med-10 med-30 ]` | VR BGP export list |
| `$OSPF_TO_BGP_NAME` / `$BGP_TO_OSPF_NAME` | `PS-send-ospf` / `PS-BGP-TO-OSPF` | redistribution leak policies |

---

## TWAMP / OAM defaults

- TWAMP **server** on Junos AP / WAN-edge: VRF port `$VRF_PORT_1` `862`, global port `$GLOBAL_PORT` `1862`.
- TWAMP **client** on CR: `$PROBE_COUNT` `100`, `$PROBE_INTERVAL` `1` s, target = server loopback.
- `$ROUTING_INSTANCE` for client = `VIRTUAL-ROUTER-V1`.

---

## CoS defaults

EXP-based classifiers + schedulers with a low-latency queue for market-data (`FC-LLQ`) and a high-priority unicast class (`FC-HIGH`). These forwarding-class names and queue numbers are JVD-wide constants — never parameterize them.
