# Auto-fill Defaults

This file is part of the [BYOAI](README.md) corpus. It gives the deterministic JVD lab-default value for every `$VAR`, so `auto` mode (and the `all defaults` / `use defaults` / `skip` short-circuits) can generate without an interview. Values are drawn from the validated configs in `../conf/`. Bundled into [`jvd-so-fwnat-snips.md`](jvd-so-fwnat-snips.md) by `regenerate-bundle.sh`.

## Device selection shortcuts

| Shortcut | Device(s) | Role |
|---|---|---|
| `MX-LB` | `mx1_mx304` | MX304 stateless load balancer (TLB / DSR) |
| `SRX` | `srx1a` (+ `srx1b` as the MNHA peer) | SRX4600 SFW + source-NAT (NAPT44) gateway |
| `GW` | `gateway_emulator_mx304` | MX304 north-side test harness (client/server emulator) |

The SRX farm is two MNHA pairs: `srx1a`+`srx1b`, `srx2a`+`srx2b`.

## Load balancer & health-check anchors

| Variable | Default |
|---|---|
| `$REAL1` / `$REAL2` | `192.168.10.1` / `192.168.10.2` (per-pair anchor / health-check IPs) |
| `$TRUST_VRF` / `$UNTRUST_VRF` | `TRUST_VR` / `UNTRUST_VR` |
| `$TRUST_FI` / `$UNTRUST_FI` | `srx_mnha_group_tlb-trust_fi` / `srx_mnha_group_tlb-untrust_fi` |
| `$HC_SRC` / `$HC_SRC6` | `192.168.10.1` / `2001:db8:1:255::1` (SRX lo0.1 anchor) |
| `$HC_TRUST_SRC` / `$HC_UNTRUST_SRC` | `192.168.10.251/32` / `192.168.10.252/32` (MX lo0.1 / lo0.2 probe sources) |
| `$HC_TRUST_SRC6` / `$HC_UNTRUST_SRC6` | `2001:db8:1:255::251/128` / `2001:db8:1:255::252/128` |
| `$TCP_PORT` / `$WEB_PORT` | `8088` (TLB TCP probe = SRX web-management port — keep in sync) |

## Autonomous systems

| Variable | Default |
|---|---|
| `$TRUST_AS` / `$UNTRUST_AS` / `$MNHA_AS` (MX side) | `65200` / `65400` / `65050` |
| `$MX_TRUST_AS` / `$MX_UNTRUST_AS` / `$MX_MNHA_AS` (SRX view) | `65200` / `65400` / `65050` |
| `$SRX_AS` | `65000` (shared across the SRX farm; MX uses `as-override`) |
| `$SRX_MNHA_AS` | `65001` (MNHA-VR ICL local-as) |
| `$SRX_MNHA_A_AS` / `$SRX_MNHA_B_AS` | `65001` / `65002` (A/B node AS as seen by the MX) |
| `$GW_TRUST_AS` / `$GW_UNTRUST_AS` | `65100` / `65300` |

## Per-plane addressing (per SRX/MNHA node, /30 v4 + /126 v6)

| Plane | Sub-unit | MX side | SRX side |
|---|---|---|---|
| TRUST | `.0` | `10.1.1.1/30` · `2001:db8:1:1:1::1/126` | `10.1.1.2/30` · `2001:db8:1:1:1::2/126` |
| UNTRUST | `.1` | `10.2.1.1/30` · `2001:db8:1:2:1::1/126` | `10.2.1.2/30` · `2001:db8:1:2:1::2/126` |
| MNHA-ICL | `.100` | `10.3.1.1/30` | `10.3.1.2/30` |

North-side AC (MX `ae10`, flexible-ethernet-services): TRUST unit `.41` = `172.16.1.1/30`, UNTRUST unit `.81` = `172.16.2.1/30` (v6 `2001:db8:172:1:1::1/126` / `2001:db8:172:2:1::1/126`).

## NAT — source-NAT NAPT44 (the tested feature)

| Variable | Default |
|---|---|
| `$NAPT_POOL` | `srx_nat_pool1` (SRX source-NAT pool name) |
| `$NAPT_PREFIX` | `100.64.1.0/24` (pair 1) · `100.64.3.0/24` (pair 2) — **unique per MNHA pair** |
| `$NAPT_POOL_1` … `$NAPT_POOL_4` | `100.64.1.0/24` … `100.64.4.0/24` (MX route-filter-list) |
| pooling | `address-pooling paired` (endpoint-independent mapping) |

## Stateful-firewall prefixes

| Variable | Default |
|---|---|
| `$SFW_CLIENT_PFX` / `$SFW_SERVER_PFX` | `172.80.0.0/12` / `172.160.0.0/12` |
| `$SFW_CLIENT_V6` / `$SFW_SERVER_V6` | `2001:db8:172:80::/96` / `2001:db8:172:160::/96` |
| `$INSIDE_NH` | `172.16.8.1` (GW-emulator inside next-hop) |

## Zones

| Variable | Default |
|---|---|
| `$TRUST_ZONE` / `$UNTRUST_ZONE` | `VR-1_trust_zone` / `VR-1_untrust_zone` (MNHA-ICL zone: `trust_zone_mnha`) |

## SRX identity / MNHA signalling

| Variable | Default |
|---|---|
| `$LOCAL_IP` / `$MNHA_NODE` | `192.168.0.1` (srx*a); `192.168.0.2` (srx*b) |
| `$PEER_IP` | `192.168.0.2` (peer of srx*a) |
| `$SIG_ROUTE` | `192.168.255.0` (install-on-failure signal-route tested by the export conditions) |
| `$MON_DEST` / `$MON_SRC` | `10.1.1.1` / `10.1.1.2` (SRG0 BFD monitor dest / src) |
| `$MON_INT` | `ae1.0` |

## Interfaces

| Variable | Default |
|---|---|
| `$AE` | `ae1` (pair 1) · `ae2` (pair 2) — to the MX |
| `$ETA` / `$ETB` | `et-1/0/0` / `et-1/0/1` (SRX member ports) |
| BFD | 300 ms × 3 (sub-second detection); LACP active periodic-fast, minimum-links 1 |

## NAT64 (off-design / non-goal — never auto-included)

Present in the lab configs but scoped as a non-goal by the published design guides. Only rendered on an explicit "Add NAT64" request. Defaults: `$NAT64_SRC_POOL` = `nat_64_source_ipv4_pool`, `$NAT64_SRC_PREFIX` = `100.64.2.0/24`, `$NAT64_CLIENT_V6` = `2001:db8:172:80::/96`, `$NAT64_DST_V4` = `172.16.10.3/32`, `$NAT64_DST_V6` = `2001:db8:1::1/128`.

## Secrets

This JVD's validated lab configs contain **no secret material** (no `## SECRET-DATA`, PSKs, or encrypted passwords), so there are no secret placeholders to supply.
