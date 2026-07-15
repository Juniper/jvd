# Auto-Fill Defaults

This file is part of the [BYOAI](README.md) corpus. It gives the deterministic JVD lab-default values the AI uses in `auto` mode (or when the user short-circuits with `all defaults` / `use defaults` / `skip`). It is bundled into [`jvd-srv6-snips.md`](jvd-srv6-snips.md) by `regenerate-bundle.sh`.

Use these values EXACTLY. Do not invent alternative defaults. Every value the AI auto-fills MUST be listed in the output's `Inputs used:` block so the user can rerun with edits.

Addressing uses the JVD lab's documentation-style prefixes (`2001:db8:bad:cafe::/64` overlay, `5f00::/16` SRv6 µSID space).

---

## Device inventory (the JVD topology)

| Device | OS family | Role | Region |
|--------|-----------|------|--------|
| `edge1_mx480` | Junos | PE (edge) | 0 |
| `edge2_mx480` | Junos | PE (edge) | 0 |
| `edge3_mx480` | Junos | PE (edge) | 0 |
| `mse1_mx480` | Junos | Metro PE (MSE) | 0 |
| `mse2_mx304` | Junos | Metro PE (MSE) | 0 |
| `cr1_mx10004` | Junos | Core Router / Route Reflector | 0 |
| `cr2_mx2010` | Junos | Core Router / backup RR | 0 |
| `br2_mx304` | Junos | Border Router | 1 |
| `cpe2_mx240` | Junos | CPE (multi-homed) | — |
| `cpe4_mx240` | Junos | CPE (MSE-homed) | — |
| `br1_ptx10002-36qdd` | EVO | Border Router | 0 |

**Device-choice shortcuts:**
- `JUNOS` → `edge1_mx480` + `edge2_mx480`
- `EVO` → `br1_ptx10002-36qdd` (the only EVO device — **L3VPN only**; EVPN-VPWS / EVPN-T5 / CPE-VR are Junos-only)
- `MIXED` → `edge1_mx480` (Junos) + `br1_ptx10002-36qdd` (EVO)

RRs (`cr1_mx10004`, `cr2_mx2010`) reflect service routes — services are not instantiated on them.

---

## Transport / underlay defaults

| Variable | Default | Notes |
|----------|---------|-------|
| `$LOCAL_AS` | `65001` | primary domain AS |
| `$REMOTE_AS` | `65000` | far domain (multi-domain / inter-AS) |
| `$RR1_V6` | `2001:db8:bad:cafe::1000:31` | route reflector 1 loopback |
| `$RR2_V6` | `2001:db8:bad:cafe::1000:56` | route reflector 2 loopback |
| `$RR_CLUSTER_ID` | RR's v4 loopback | e.g. `100.0.0.56` |
| `$PE_LOCAL_V6` | per device | PE iBGP source (device v6 loopback) |
| `$ISIS_NET` | `49.<region>.0000.0000.<node>.00` | per-node NET (e.g. `49.1000.0000.0000.0056.00`) |
| `$JUMBO_L2_MTU` | `9192` | core L2 MTU |
| `$JUMBO_L3_MTU` | `9106` | L3 MTU (9192 − 86 B µSID overhead) |
| `$BFD_MIN_INT` / `$BFD_MULT` | `50` ms / `3` | ~150 ms detect |
| `$REF_BANDWIDTH` | `1000g` | IS-IS reference bandwidth |
| `$EBGP_MULTIHOP_TTL` | `5` | inter-AS BR-to-BR (multi-domain) |

---

## SRv6 locators (per Flex-Algo)

| Flex-Algo | Locator | Per-node prefix (`:56` example) | µSID block | Metric |
|-----------|---------|----------------------------------|------------|--------|
| FA-0 (default IGP) | `SL-FA-000` | `5f00:1:56::/48` | `5f00:1::/32` | IGP |
| FA-128 (delay) | `SL-FA-128` | `5f00:a1:56::/48` | `5f00:a1::/32` | delay (ASLA, dynamic probe) |
| FA-129 (TE) | `SL-FA-129` | `5f00:b1:56::/48` | `5f00:b1::/32` | TE metric |

`$FA_LIST`: PE = `[128 129]`; RR / BR = `[128 129 131 132 133]` (131-133 reserved for future service classes).

`$LOC` / `$DEFAULT_SVC_LOC` per service: default `SL-FA-000`; set to `SL-FA-128` (delay) or `SL-FA-129` (TE) for color-based service steering.

**Multi-domain summary prefixes** (advertised at the BR): FA-0 `5f00:1::/24`, FA-128 `5f00:a1::/24`, FA-129 `5f00:b1::/24`.

**Transport classes:** one per Flex-Algo — `TC-128`, `TC-129`, `TC-131`, `TC-132`, `TC-133`; colors `128 / 129 / 131 / 132 / 133` (auto-create, `use-transport-class { inet3-install; }`).

---

## Service instance-name / ID conventions

| Service | Instance name | VPN_ID seed | Locator | Notes |
|---------|---------------|-------------|---------|-------|
| L3VPN-SRv6 | `$VRF_NAME` | `501` / `1001` (increment) | `SL-FA-000` | RD `<PE-v4-loopback>:<VPN_ID>`; µDT46 dual-stack |
| EVPN-VPWS-SRv6 | `$VPWS_NAME` | VPN_ID + `3000` offset | `SL-FA-000` | ESI-based; single- or all-active |
| L3VPN-EVPN-T5 | `$VRF_NAME` | `1001` | `SL-FA-000` | silent-host; PE originates T5 |
| CPE virtual-router | per-group | — | — | no RD/RT; BGP groups toward PE/MSE |

`$RD_SEED` = the originating PE's v4 loopback (e.g. `100.0.0.56`, `200.0.0.60`). Route-targets follow `target:$LOCAL_AS:<VPN_ID>`. **Cross-PE rule:** RTs, VPWS service-ids, and ESI values MUST match on both PE halves; per-PE identifiers (loopback, RD, attachment IFL) differ.

---

## Interface / attachment defaults

| Variable | Default | Notes |
|----------|---------|-------|
| `$PHYS_IFL` | `ae2` (CPE) / `xe-2/0/2` (PE-CE) | attachment interface |
| `$AE_NUMBER` | `0` | core AE bundle |
| `$VRF_UNIT` / `$VLAN` | = VPN_ID | per-VRF sub-IFL |
| `$PE_CE_V4_LOCAL` / `$PE_CE_V6_LOCAL` | `13.1.8.1/30` / `2013:1:8::1/126` | PE-CE adjacency |
| `$LOOPBACK_V4` / `$LOOPBACK_V6` | `195.168.8.1/32` / `2195:168:8::1/128` | per-VRF loopback / router-id |
| `$IRB_V4` / `$IRB_V6` | `10.104.8.1/30` / `2010:104:8::1/126` | IRB gateway (pe-ce-irb) |

---

## ESI (EVPN-VPWS multihoming) defaults

- 10-byte ESI: `00:11:11:11:11:11:11:11:<PE-ID>:<svc-ID>` — byte 9 = PE-ID, byte 10 = service-ID.
- `$ESI_MODE`: `all-active` (default) or `single-active`. MUST match on both PEs of the multi-homed pair.

---

## Apply-group constants (never parameterize)

`gr-bgp` (TCP-AO key-chain `KC-BGP`), `gr-srv6` (µSID PSP/USP/USD), `gr-l3vpn` (`instance-type vrf` + `vpn-unequal-cost` + `vrf-table-label`), `gr-core-intf-ipv6` (MTU 9192/9106, IPv6-only), `gr-isis-ipv6` (per-FA adjacency SIDs) — these are JVD-wide design constants. Reference the groups; do not expand them inline unless the user asks.
