# Auto-Fill Defaults

This file is part of the [BYOAI](README.md) corpus. It gives the deterministic JVD lab-default values the AI uses in `auto` mode (or when the user short-circuits with `all defaults` / `use defaults` / `skip`). It is bundled into [`jvd-bbe-snips.md`](jvd-bbe-snips.md) by `regenerate-bundle.sh`.

Use these values EXACTLY. Do not invent alternative defaults. Every value the AI auto-fills MUST be listed in the output's `Inputs used:` block so the user can rerun with edits.

Addressing follows the JVD lab: `192.168.0.0/24` loopbacks, private AS, and documentation-range subscriber pools.

---

## Device inventory (the JVD topology)

| Device | OS family | Role | Loopback (lo0.0 / router-id) |
|--------|-----------|------|------------------------------|
| `an1_acx7024` | EVO | Access Node (AN) | `192.168.0.0` |
| `an2_acx7100-48l` | EVO | Access Node (AN) | `192.168.0.1` |
| `an3_acx7100-48l` | EVO | Access Node (AN) | `192.168.0.2` |
| `an4_acx7100-48l` | EVO | Access Node (AN) | `192.168.0.3` |
| `an5_acx7100-48l` | EVO | Access Node (AN) | `192.168.0.4` |
| `agn1_acx7100-32c` | EVO | Aggregation Node (AGN) / fabric RR | `192.168.0.5` |
| `agn2_acx7100-32c` | EVO | Aggregation Node (AGN) / fabric RR | `192.168.0.6` |
| `bng1_mx304` | Junos | BNG (Group A) | `192.168.0.7` |
| `bng2_mx204` | Junos | BNG (Group A) | `192.168.0.8` |
| `bng3_mx10004` | Junos | BNG (Group B) | `192.168.0.9` |
| `bng4_mx480` | Junos | BNG (Group B) | `192.168.0.10` |
| `cr1_ptx10004` | EVO | Core Router / core RR | `192.168.0.11` |
| `sw1_qfx5120-32c` | Junos | Access switch (helper) | — |
| `sw2_qfx5210-64c` | Junos | Access switch (helper) | — |

**Device-choice shortcuts** (offered in the clarifying question):
- `AN` → `an1_acx7024` + `an2_acx7100-48l` (EVO access pair)
- `BNG` → `bng1_mx304` + `bng2_mx204` (Junos BNG pair, Group A)
- `PAIR` → `an1_acx7024` (EVO AN) + `bng1_mx304` (Junos BNG) — the end-to-end EVPN-VPWS PWHT service pair
- `CR` → `cr1_ptx10004` (EVO core, for Internet / RADIUS VRF)

The AGNs (`agn1/2`) and CR (`cr1`) are the route reflectors — subscriber services are NOT instantiated on them (they carry transport + Internet/RADIUS VRFs only).

> **OS rule:** ANs / AGNs / CR are **EVO**; BNGs and access switches are **Junos**. All subscriber-management, dynamic-profile, `ps` pseudowire-headend, and BNG chassis snips are **Junos-only** (the BNGs are MX). An EVPN-VPWS service is end-to-end: generate the **AN half** (`evo/`) and the **BNG half** (`junos/`), keeping the shared identifiers matched (see cross-endpoint rule below).

---

## Transport / underlay defaults

| Variable | Default | Notes |
|----------|---------|-------|
| `$LOCAL_AS` | `65001` | single iBGP overlay AS, all devices |
| `$ROUTER_ID` / `$LOOPBACK_V4` | = device lo0.0 (see table) | per device |
| `$LOOPBACK_V6` | `2001:db8::192:168:0:<n>` | per device |
| `$RR_AGN1_V4` / `$RR_AGN2_V4` | `192.168.0.5` / `192.168.0.6` | fabric (AGN) route reflectors |
| `$RR_CR_V4` | `192.168.0.11` | core (CR) route reflector |
| `$SRGB_START` / `$SRGB_END` | `800000` / `890000` | MPLS SRGB, domain-wide |
| `$NODE_SID_V4` | `1000 + last octet of lo0` | e.g. bng1 (.7) → `1007` |
| `$NODE_SID_V6` | `4000 + last octet of lo0` | e.g. bng1 (.7) → `4007` |
| `$ISIS_LEVEL` | `1` (metro/access), `2` (cr1 core links) | per interface |
| `$MTU` (core / access LAG) | `9102` | underlay + AN access LAG |
| `$MTU` (ps interface) | `2022` | pseudowire-headend interface |

---

## LAG / interface defaults

| Variable | Default | Notes |
|----------|---------|-------|
| `$LAG` / `$LAG_PERSUB` | `ae1` | AN per-subscriber-group access LAG (toward sw) |
| `$LAG_FXC` | `ae0` | AN FXC access LAG |
| `$LACP_SYSID_PERSUB` / `$LACP_SYSID_FXC` | `00:00:00:00:02:02` / `00:00:00:00:01:01` | AN LACP system-id overrides |
| `$PS_DEV` | `ps0`, `ps11`, `ps31`, … | BNG pseudowire-headend ifd (one per subscriber group) |
| `$ANCHOR_LT` | `lt-0/0/0` | logical-tunnel anchor for the `ps` interface |

---

## Service identifiers (EVPN-VPWS PWHT)

Each subscriber group is a distinct EVPN-VPWS routing-instance terminated by PWHT.

| Variable | Rule / default | Example |
|----------|----------------|---------|
| `$INSTANCE_NAME` | `METRO_BBE_EVPN_VPWS_<PPPoE\|IPoE>_GROUP_<n>` | `METRO_BBE_EVPN_VPWS_PPPoE_GROUP_1` |
| Subscriber group id (`$RD_ID`) | PPPoE groups `1031–1040`, IPoE groups `1041–1050` | `1031` |
| `$RD_LOOPBACK_V4` (BNG side) | BNG "subscriber" loopback `192.168.10X.10X` (NOT lo0.0) | bng1 `192.168.107.107`, bng2 `108.108`, bng3 `109.109`, bng4 `110.110` |
| `$RD_LOOPBACK_V4` (AN side) | AN "subscriber" loopback `10X.10X.10X.10X` | an4 `103.103.103.103`, an5 `104.104.104.104` |
| `$RT_AS` : `$RT_ID` | `target:60000:<group-id>` — AS `60000` is the EVPN-VPWS service plane | `target:60000:1031` |
| `$VPWS_LOCAL_ID` / `$VPWS_REMOTE_ID` (PPPoE) | AN `local 1–10` / `remote 21–30`; BNG `local 21–30` / `remote 1–10` | AN `1`/`21`, BNG `21`/`1` |
| `$VPWS_LOCAL_ID` / `$VPWS_REMOTE_ID` (IPoE) | AN `local 11–20` / `remote 31–40`; BNG `local 31–40` / `remote 11–20` | AN `11`/`31`, BNG `31`/`11` |
| `$SVC_LOCAL` / `$SVC_REMOTE` (FXC group) | `5001` / `6001` | FXC bundle service-id pair |

**Cross-endpoint rule:** the route-target, the ESI value, and the VPWS service-id pair MUST match across the AN and BNG halves (AN `local` == BNG `remote`, and vice-versa). Per-device identifiers (loopback, RD, `ps`/`ae` unit) differ.

---

## ESI (multihoming) defaults

- **AN per-subscriber (all-active):** `00:10:11:11:11:11:11:00:00:<nn>` on the access LAG unit; the trailing octet is per-group.
- **AN FXC (shared, all-active):** `00:15:15:15:00:00:00:15:15:15` — one LAG-level ESI for the whole FXC bundle.
- **BNG `ps` (single-active):** `00:10:12:12:12:12:12:00:00:<nn>` with `df-election-type preference` — **1000** on the primary BNG, **995** on the backup BNG of the pair.

---

## L3VPN / subscriber-pool defaults

| Variable | Default | Notes |
|----------|---------|-------|
| `$VRF_NAME` | `PPPOE_SUBS_1` (PPPoE), `dhcp-subs` (DHCP/IPoE) | subscriber L3VPN VRF |
| `$LO_UNIT` | `lo0.1` (PPPoE), `lo0.313` (DHCP) | VRF loopback unit |
| `$V4_POOL_NETWORK` / `$V6_POOL_PREFIX` (PPPoE) | `10.25.0.0/16` / `fc00:25:140::/48` | address-assignment pool |
| `$V4_NETWORK` (DHCP) | `10.42.0.0/16` (range `.0.2`–`.255.254`, gw `.0.1`) | dhcp-local-server pool |
| `$V6_PREFIX` (DHCP) | `fc00:125:140::/64` | DHCPv6 pool |
| `$LEASE_TIME` | `600` | DHCP maximum-lease-time (s) |
| Dynamic-profile names | `auto-stacked-pwht` (PPPoE), `auto-stacked-pwht_dhcp` (DHCP), `prod-pppoe-dt-base`, `prod-dhcp-base`, `prof_autosense_ipdemux` | wired by name — leave literal |

---

## RADIUS / subscriber-management defaults

| Variable | Default | Notes |
|----------|---------|-------|
| `$AUTH_PROFILE` | `vlan-auth-access1` | AAA access-profile invoked by the `ps` auto-configure |
| `$RADIUS_SERVER_V4` | `10.189.189.2` | reached through the RADIUS L3VPN |
| `$RADIUS_PORT` | `1812` | RADIUS UDP port |
| `$RADIUS_SOURCE_V4` | `192.168.17.17` | RADIUS source-address (in RADIUS VRF) |
| `$NAS_ID` | = device short tag | e.g. `R7-BNG1` |
| `$USER_PREFIX` / `$USER_PASS` / `$DOMAIN_NAME` | `pwht_pppoe` or `pwht_dhcp` / `joshua` / `jnpr.net` | dynamic-profile username construction |
| `$PS_DEVICE_COUNT` | `100` | chassis `pseudowire-service device-count` |

> The `$junos-*` placeholders inside `dynamic-profiles` are **runtime-resolved by the BNG `smg-service` daemon** — they are NOT user variables. Leave them literal in rendered config.
