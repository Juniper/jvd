# Auto-Fill Defaults

This file is part of the [BYOAI](README.md) corpus. It gives the deterministic JVD lab-default values the AI uses in `auto` mode (or when the user short-circuits with `all defaults` / `use defaults` / `skip`). It is bundled into [`jvd-aiml-mtb-snips.md`](jvd-aiml-mtb-snips.md) by `regenerate-bundle.sh`.

Use these values EXACTLY. Do not invent alternative defaults. Every value the AI auto-fills MUST be listed in the output's `Inputs used:` block so the user can rerun with edits.

Addresses below are the JVD lab's actual values (from each device `.conf`). Substitute site values when deploying. **This JVD is Junos Evolved (EVO) only.**

---

## Device inventory (the JVD topology — pure-L3 eBGP Clos)

| Device | Platform | OS | Role | Loopback (router-id) | BGP AS | Tier tag |
|--------|----------|----|------|----------------------|--------|----------|
| `spine1_qfx5240-64od` | QFX5240-64OD | EVO | Spine (pure L3, no services) | `10.0.0.8` | `108` | `1` |
| `spine2_qfx5240-64od` | QFX5240-64OD | EVO | Spine | `10.0.0.9` | `109` | `1` |
| `spine3_qfx5240-64od` | QFX5240-64OD | EVO | Spine | `10.0.0.10` | `110` | `1` |
| `spine4_qfx5240-64od` | QFX5240-64OD | EVO | Spine | `10.0.0.11` | `111` | `1` |
| `leaf1_qfx5240-64od` | QFX5240-64OD | EVO | Leaf (per-tenant VRF, GPU access) | `10.0.1.9` | `208` | `5` |
| `leaf2_qfx5240-64od` | QFX5240-64OD | EVO | Leaf | `10.0.1.10` | `209` | `5` |
| `leaf3_qfx5240-64od` | QFX5240-64OD | EVO | Leaf | `10.0.1.11` | `210` | `5` |
| `leaf4_qfx5240-64od` | QFX5240-64OD | EVO | Leaf | `10.0.1.12` | `211` | `5` |

> Every snip carries a **LEAF variant and a SPINE variant** — pick the one matching the target device's role. `$LOCAL_AS` / `$LOCAL_TIER_TAG` / `$ROUTER_ID` select the role. Spines are pure-L3 (underlay + EVPN overlay + policies, RSTP disabled, no services). Leaves add the per-tenant VRF, IRB anycast gateway, GPU-server links, and L2-learning telemetry.

**Device-choice shortcuts** (offered in the clarifying question):
- `LEAF` → `leaf1_qfx5240-64od` … `leaf4_qfx5240-64od` (EVO; per-tenant VRF + GPU access)
- `SPINE` → `spine1_qfx5240-64od` … `spine4_qfx5240-64od` (EVO; underlay + EVPN overlay only — no services)

---

## Fabric / underlay defaults (eBGP Clos)

| Variable | Default | Notes |
|----------|---------|-------|
| `$ROUTER_ID` / `$LO0_V4` | = device loopback | per device (see table), `/32` |
| `$LO0_V6` | `fdf6:ed70:1fac:f2d2::<n>/128` | lo0.0 v6 |
| `$LOCAL_AS` | spine `108`+; leaf `208`+ | eBGP Clos — every device has its own AS |
| `$PEER_AS` | leaf→spine `108`; spine→leaf `208` | remote peer AS |
| `$LOCAL_V4` / `$PEER_V4` | `10.0.2.<x>` /31 | fabric underlay p2p addressing |
| `$LOCAL_LO_V4` | = device loopback | eBGP-EVPN overlay local-address |
| `$PEER_LO_V4` | remote loopback | eBGP-EVPN overlay neighbor |
| `$LOCAL_TIER_TAG` | spine `1`; leaf `5` | community high-order tier marker |

---

## Interface / breakout defaults

| Variable | Default | Notes |
|----------|---------|-------|
| `$PHY_PORT` | `et-0/0/0` | parent physical port for breakout |
| `$AC_INTF` / `$AC_INTF_A` / `$AC_INTF_B` | `et-0/0/12:0` / `et-0/0/16:0` | GPU-server AC sub-ports |
| `$ANYCAST_MAC` | `00:1c:73:00:00:01` | shared IRB anycast MAC (identical on all leaves) |
| MTU (fabric) | `9216` / `9170` | jumbo fabric links |
| MTU (IRB / server) | `9000` | tenant IRB + GPU-server links |
| `$GPU_HOST` | `H100-01` | GPU server hostname in the AC description |

---

## Service — per-tenant VRF (`evpn-vrf-ip-prefix-routes`) defaults

Per-tenant axis: increment the suffix and pick a fresh `$VNI` / `$LO_UNIT` / `$IRB_UNIT` triplet per tenant.

| Variable | tenant-1 default | Notes |
|----------|------------------|-------|
| `$TENANT_NAME` / `$TENANT_TAG` | `tenant-1` | VRF / routing-instance name |
| `$VNI` | `20001` | tenant-1..4 = VNI 20001..20004 |
| `$LO_UNIT` / `$TENANT_UNIT` | `2` | per-tenant lo0 unit |
| `$IRB_UNIT` | `2` | per-tenant IRB unit |
| `$TENANT_LO_V4` | `192.168.11.4/32` | per-VRF router-id anchor |
| `$TENANT_GW_V4` | `10.200.0.1/24` | anycast IRB gateway |
| `$TENANT_EXPORT_POLICY` | `BGP-AOS-Policy-tenant-1` | EVPN ip-prefix-routes export |
| `$TENANT_COMMUNITY_V4` / `_V6` | `TENANT-1_COMMUNITY_V4` / `_V6` | per-tenant BGP communities |
| RD | `${LO0_V4}:${VNI}` | one tag per VRF per device |
| vrf-target | `target:${VNI}:1` | single RT per VRF |

---

## Policy / community defaults

- Tier communities: `FROM_SPINE_EVPN_TIER`, `FROM_SPINE_FABRIC_TIER` (loop-prevention); `DEFAULT_DIRECT_V4/V6` (redistribution) — JVD-wide constants, never parameterize.
- Clos loop-prevention filter names: `LEAF_TO_SPINE_*` / `SPINE_TO_LEAF_*` (`_FABRIC_OUT`, `_EVPN_OUT`).
- Per-tenant export policies: `AllPodNetworks-tenant-N` + `BGP-AOS-Policy-tenant-N`.

---

## CoS / RoCEv2 defaults

The RoCEv2 lossless CoS (DSCP classifier, PFC on the no-drop queue, ECN marking, lossless buffer partitions, schedulers) uses JVD-wide forwarding-class / queue names — **never parameterize** them. The `chassis-buffer-monitor` telemetry watches these same buffer partitions.
