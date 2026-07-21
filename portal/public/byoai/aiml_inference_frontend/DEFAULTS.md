# Auto-fill Defaults

This file is part of the [BYOAI](README.md) corpus. It gives the deterministic JVD lab-default values the AI uses in `auto` mode (or when the user short-circuits with `all defaults` / `use defaults` / `skip`). Values are grounded in the snip headers (`Seen on:`, `Variables:`) — never invented. Bundled into [`jvd-aiml-inf-snips.md`](jvd-aiml-inf-snips.md) by `regenerate-bundle.sh`.

This JVD is **Junos Evolved (EVO) only**. The distinction is ROLE (leaf vs spine), selected by the per-device AS / router-id / tier-tag.

---

## Device inventory

| Device | Platform | OS | Role | Loopback (lo0.0) | AS |
|--------|----------|----|------|------------------|-----|
| `leaf1_qfx5130-32cd` | QFX5130-32CD | EVO | Leaf (client-facing — Lambda Scaler / GenAI-Perf) | `10.0.4.0/32` | `4201032400` |
| `leaf2_qfx5130-32cd` | QFX5130-32CD | EVO | Leaf (client-facing — Envoy) | `10.0.4.1/32` | `4201032401` |
| `leaf3_qfx5130-32cd` | QFX5130-32CD | EVO | Leaf (GPU-facing — AMD MI300X-01) | `10.0.4.4/32` | `4201032406` |
| `leaf4_qfx5130-32cd` | QFX5130-32CD | EVO | Leaf (GPU-facing — AMD MI300X-02) | `10.0.4.5/32` | `4201032407` |
| `spine1_qfx5220-32cd` | QFX5220-32CD | EVO | Spine | `10.0.3.0/32` | `4201032300` |
| `spine2_qfx5220-32cd` | QFX5220-32CD | EVO | Spine | `10.0.3.1/32` | `4201032301` |

Device-choice shortcuts:
- `LEAF` → `leaf1_qfx5130-32cd` … `leaf4_qfx5130-32cd`
- `SPINE` → `spine1_qfx5220-32cd`, `spine2_qfx5220-32cd`

> Loopback/AS values above are the captured lab values from the six validated
> device configs (leaf lo0 from `10.0.4.0/24`, spine lo0 from `10.0.3.0/24`).
> All values picked are echoed in the `Inputs used:` block so the user can
> override.

---

## Transport / underlay defaults

| Variable | Default | Notes |
|----------|---------|-------|
| `$LOCAL_AS` | spine `4201032300`+; leaf `4201032400`+ | eBGP Clos — every device has its own AS |
| `$PEER_AS` | the neighbor's own `$LOCAL_AS` | remote peer AS |
| `$LOCAL_V4` / `$PEER_V4` | `10.0.5.<x>` /31 | fabric underlay p2p addressing (10.0.5.0/24) |
| `$ROUTER_ID` | = device lo0.0 v4 | matches the loopback |
| `$LOCAL_TIER_TAG` | spine `1`; leaf `5` | community high-order tier marker |
| BFD | `1000` ms × `3` | fabric liveness |

---

## Interface / breakout defaults

| Variable | Default | Notes |
|----------|---------|-------|
| `$PHY_PORT` | leaf uplink `et-0/0/24` (breakout) · spine `et-0/0/0` | fabric port |
| `$PEER_PORT_A` / `$PEER_PORT_B` | `et-0/0/4` / `et-0/0/5` | remote sub-port descriptions |
| `$LOCAL_V4_A` / `$LOCAL_V4_B` | `10.0.5.33/31` / `10.0.5.35/31` | leaf breakout /31s |
| access `$PHY_PORT` | `et-0/0/0` | server/client access trunk |
| `$PEER_DESC` | `to.mi300-01` (or `to.envoy`, `to.genai-perf`) | attached endpoint |
| MTU (fabric) | `9216` / `9170` | jumbo fabric links |
| MTU (IRB) | `9000` | client/GPU gateway |

---

## Service — frontend cluster VLAN defaults

One cluster VLAN per leaf; increment per leaf.

| Variable | leaf3 default | Notes |
|----------|---------------|-------|
| `$VLAN_NAME` | `vn5` | per leaf: leaf1=`vn3`, leaf2=`vn4`, leaf3=`vn5`, leaf4=`vn6` |
| `$VLAN_ID` | `5` | matches the VLAN name suffix (3–6) |
| `$VLAN_DESC` | `FrontEnd-Cluster-VN5` | |
| `$IRB_UNIT` | `5` | matches the VLAN ID |
| `$GW_V4` | `10.10.5.254/24` | IRB gateway (per-leaf subnet 10.10.<vlan>.0/24) |
| `$NATIVE_VLAN` | `5` | native VLAN on the access trunk |

---

## Policy / community defaults

- Tier community `FROM_SPINE_FABRIC_TIER` (`0:15`) = CLOS loop-prevention marker (JVD-wide constant, never parameterize).
- `DEFAULT_DIRECT_V4` = direct-route redistribution; high-order tag is the tier (`5:20007` leaf, `1:20007` spine), low-order `21001:26000` shared.
- Clos loop-prevention filter names: `LEAF_TO_SPINE_FABRIC_OUT` / `SPINE_TO_LEAF_FABRIC_OUT`. Policy names `BGP-AOS-Policy`, `AllPodNetworks`, `PFE-LB` are JVD-wide constants.

---

## Bootstrap defaults

| Variable | Default | Notes |
|----------|---------|-------|
| `$HOSTNAME` | the device shortname (e.g. `leaf3`) | |
| `$GRPC_PORT` | leaf `32769`; spine `32767` | gRPC extension-service SSL listener |
| certificate name | `aos_grpc` | fixed literal — referenced by name |
| routing-instance | `mgmt_junos` | management instance (fixed literal) |
