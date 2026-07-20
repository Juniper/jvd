# Auto-Fill Defaults

This file is part of the [BYOAI](README.md) corpus. It gives the deterministic JVD
lab-default values the AI uses in `auto` mode (or when the user short-circuits with
`all defaults` / `use defaults` / `skip`). It is bundled into
[`jvd-llq-snips.md`](jvd-llq-snips.md) by `regenerate-bundle.sh`.

Use these values EXACTLY. Do not invent alternative defaults. Every value the AI
auto-fills MUST be listed in the output's `Inputs used:` block so the user can
rerun with edits. All values below are taken from the JVD's own validated device
configs (`configuration/conf/*.conf`).

---

## Device inventory (the JVD topology)

| Device | OS family | Role | Loopback (router-id) | SR node index |
|--------|-----------|------|----------------------|---------------|
| `an4_acx7024` | EVO | Access / Cell Site Router (CSR) | `192.168.1.0` | 0 |
| `an1_acx7100-48l` | EVO | Access Node | `192.168.1.1` | 3 |
| `an3_acx7100-48l` | EVO | Access Node | `192.168.1.2` | 4 |
| `ag1_1_acx7509` | EVO | Aggregation / Hub Site Router (HSR) | `192.168.1.3` | 8 |
| `ag1_2_acx7100-32c` | EVO | Aggregation / HSR | `192.168.1.4` | 9 |
| `ag2_1_mx204` | Junos | Aggregation | `192.168.1.5` | 10 |
| `ag2_2_mx204` | Junos | Aggregation | `192.168.1.6` | 11 |
| `ag3_1_mx480` | Junos | Aggregation | `192.168.1.7` | 12 |
| `ag3_2_mx480` | Junos | Aggregation | `192.168.1.8` | 13 |
| `cr1_ptx10001-36mr` | EVO | Core / Route Reflector | `192.168.1.9` | 14 |
| `cr2_ptx10001-36mr` | EVO | Core / Route Reflector | `192.168.1.10` | 15 |
| `sag_mx304` | Junos | Services Aggregation Gateway (SAG) | `192.168.1.11` | — |

**Device-choice shortcuts** (offered in the clarifying question):
- `EVO` → `an4_acx7024` (CSR) + `ag1_1_acx7509` (HSR) — the primary eCPRI
  fronthaul pair, both LLQ-capable ACX
- `JUNOS` → `sag_mx304` (SAG) + `ag2_1_mx204` (aggregation)
- `MIXED` → `an4_acx7024` (EVO CSR) + `sag_mx304` (Junos SAG) — end-to-end
  fronthaul-to-services example

The two core routers (`cr1_ptx10001-36mr`, `cr2_ptx10001-36mr`) are the iBGP route
reflectors — services are NOT instantiated on them. On MX (`sag`, `ag2`, `ag3`)
and PTX core, FC-LLQ is realized with `priority strict-high`
(`cos/schedulers-strict-high.conf`); only ACX supports the hardware
`priority low-latency` scheduler (`cos/schedulers-low-latency.conf`).

---

## Transport / underlay defaults

| Variable | Default | Notes |
|----------|---------|-------|
| `<asn>` / `$LOCAL_AS` | `63535` | primary xHaul AS (all devices except SAG far-AS) |
| `<sag-asn>` | `63536` | SAG / inter-AS Option-B peer AS |
| `<router-id>` / `<loopback-address>` | = device loopback | per device (see table) |
| IS-IS area | `49.1022.1001` | NET `49.1022.1001.0000.00<nn>.00`, `<nn>` per device |
| IS-IS level | `2` (agg/core), `1` (access AN → L1/L2 HSR) | Seamless MPLS domains |
| SRGB | start-label `16000`, index-range `80000` | domain-wide, consistent everywhere |
| `<ipv4-sid-index>` | per device (see table) | e.g. an4=0, ag1_1=8, cr1=14 |
| `<ipv6-sid-index>` | `100 + <ipv4-sid-index>` | IPv6 node-SID index |
| MTU (core) | `9192` | inter-router AE + lo0 |

---

## LAG / interface defaults

| Variable | Default | Notes |
|----------|---------|-------|
| `<ae-interface>` | `ae26` (fronthaul ESI LAG, EVO) / `ae11` (transport) | per role |
| `<lacp-system-id>` | `00:00:00:00:00:01` | shared across the AG pair for EVPN ESI |
| `<interface>` (AC, single-homed) | `et-1/0/1` (EVO 10g) / `xe-0/1/3:2` (Junos) | first AC member |
| `<unit-number>` / `<vlan-id>` | start `101` (fronthaul) / `2501` (midhaul BD) | increment per instance |

---

## Service instance-name conventions

Each service kind uses a distinct instance-name prefix. Increment the trailing
numeric per instance.

| Service | Instance name pattern | Starting example | Unit / VLAN start |
|---------|----------------------|------------------|-------------------|
| EVPN-VPWS (fronthaul MH) | `FRONTHAUL-EVPN-VPWS-MH-AN1-<n>` | `FRONTHAUL-EVPN-VPWS-MH-AN1-1` | `101` |
| EVPN-VPWS (midhaul SH) | `MBH-EVPN-VPWS-SH-<n>` | `MBH-EVPN-VPWS-SH-1` | `901` |
| EVPN-FXC vlan-aware | `FRONTHAUL-EVPN-FXC-<n>` | `FRONTHAUL-EVPN-FXC-1` | `101` |
| EVPN-ELAN (fronthaul) | `FRONTHAUL-EVPN-ELAN-MH-<n>` | `FRONTHAUL-EVPN-ELAN-MH-1` | `1501` |
| EVPN-ELAN + IRB / L3VPN | `L3VPN-IRB-ANYCAST-GATEWAY-MH-<n>` | `L3VPN-IRB-ANYCAST-GATEWAY-MH-1` | IRB unit `351` |
| BGP-VPLS | `MBH-BGP-VPLS-<n>` | `MBH-BGP-VPLS-1` | `2501` |
| L3VPN-IRB | `L3VPN-IRB-<n>` | `L3VPN-IRB-1` | IRB unit `101` |

---

## Route-distinguisher / route-target defaults

| Variable | Rule | Example |
|----------|------|---------|
| `<rd-value>` | `<device-loopback>:<unit>` | `192.168.1.0:3401` |
| `<rt-value>` | `target:<asn>:<id>` | `target:63535:3401` |
| `<local-id>` / `<remote-id>` | VPWS service-id pair; symmetric across the two PEs | local `1`, remote `2` (swap on the far PE) |

**Cross-PE identifier rule:** route-targets, VPWS service-id pairs, ESI values, and
MAC-VRF / instance names MUST match on both PE halves of a service. Per-PE
identifiers (loopback, RD, AC interface name) differ.

---

## Multi-homing (ESI) defaults

- All-active ESI on the AG-facing fronthaul LAG (e.g. `ae26`) for dual-homed ANs.
- ESI value pattern: `00:51:11:11:11:11:11:00:00:<nn>` — the trailing octet is
  per-ESI; MUST match on both HSRs of the multi-homed pair.
- LACP system-id on the shared LAG MUST match on both HSRs of the ESI.

---

## IRB / L3 defaults

| Variable | Default | Notes |
|----------|---------|-------|
| `<irb-unit>` | = the ELAN unit (e.g. `351`) | irb.<unit> |
| `<irb-ipv4>` | `100.100.<x>.1/24` | anycast gateway per bridge domain |
| `<bridge-domain-name>` | `BD_EVPN_ELAN_<vlan>` | e.g. `BD_EVPN_ELAN_1501` |

---

## CoS defaults (JVD-wide constants — never parameterize)

8-class O-RAN multi-priority model, do NOT renumber:

| Queue | Forwarding class | Priority (ACX / MX-PTX) |
|-------|------------------|-------------------------|
| 7 | FC-SIGNALING | strict-high / high |
| 6 | **FC-LLQ** | **low-latency (ACX) / strict-high (MX-PTX)** |
| 5 | FC-REALTIME | medium-high |
| 4 | FC-HIGH | low (WFQ) |
| 3 | FC-CONTROL | high |
| 2 | FC-MEDIUM | low (WFQ) |
| 1 | FC-LOW | low (WFQ) |
| 0 | FC-BEST-EFFORT | low (WFQ remainder) |

Classifier / rewrite names (`CL-MPLS`, `CL-8021P`, `CL-DSCP`, `CL-DSCP-IPV6`,
`RR-MPLS`, `RR-8021P`, `RR-DSCP`, `RR-DSCP-IPV6`), scheduler-map `SM-5G-SCHEDULER`,
and scheduler names (`SC-LLQ`, `SC-SIGNALING`, …) are JVD-wide constants — never
parameterize the class names, queue numbers, or these identifiers.
