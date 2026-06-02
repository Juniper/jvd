# Snip Library — 5G xHaul Low-Latency QoS

Reusable configuration snippets extracted from the
[Low-Latency Queueing JVD](../../README.md).

## What's Here

| Category | EVO Snips | Junos Snips | Description |
|----------|-----------|-------------|-------------|
| **cos** | 17 | 12 | Forwarding-classes, classifiers, schedulers, rewrites, interface bindings |
| **firewall** | 3 | 2 | Multi-field classifiers (DSCP→FC, eCPRI MAC→FC) |
| **transport** | 6 | 5 | IS-IS, MPLS, BGP labeled-unicast, ECMP hashing |
| **services** | 4 | 4 | EVPN-VPWS, EVPN-ELAN, BGP-VPLS, L3VPN |
| **policy** | 4 | 4 | PPLB, ALLOW_LOOPBACK, SR loopbacks, next-hop-self |
| **interfaces** | 1 | — | LAG with ESI for EVPN multi-homing |
| **oam** | 1 | — | CFM maintenance-domain (802.1ag) |
| **Total** | **36** | **27** | **63 snips** |

## Key Differentiator: Priority Low-Latency

The headline feature of this JVD is the ACX-specific `priority low-latency`
hardware scheduler (`evo/cos/schedulers-low-latency.conf`). This provides
sub-10µs per-hop latency guarantees for eCPRI fronthaul traffic under
congestion — not available on MX or PTX platforms.

**Scheduler variant split:**
- **ACX (AG/AN):** `SC-LLQ priority low-latency` — hardware LLQ
- **PTX (Core):** `SC-LLQ priority strict-high` — best-available fallback
- **MX (Junos):** `SC-LLQ priority strict-high` — same as PTX

## OS Variants

Snips are filed under `evo/` or `junos/` based on the target OS:

- **EVO** (Evolved Junos): ACX7509, ACX7100-32C, ACX7100-48L, ACX7024, PTX10001-36MR
- **Junos** (Classic): MX204, MX480, MX304

Many CoS/transport/policy snips are byte-identical across OS variants
(noted in headers). The split exists for accurate `Seen on:` tracking
and platform-specific scheduler behavior.

## Device Role Mapping

| Role | Devices | Notable Snips |
|------|---------|---------------|
| Access Node | AN1 (ACX7100-48L), AN3 (ACX7100-48L), AN4 (ACX7024) | LLQ scheduler, eCPRI filter, EVPN-VPWS-MH, LAG-ESI |
| Aggregation HSR | AG1-1 (ACX7509), AG1-2 (ACX7100-32C) | All categories, MFC filters, CFM OAM |
| Aggregation Transport | AG2 (MX204×2), AG3 (MX480×2) | CoS + transport only (no services) |
| Core Router | CR1, CR2 (PTX10001-36MR) | strict-high scheduler, EXP binding, transport |
| Services Aggregation GW | SAG (MX304) | EVPN-ELAN-IRB, VPWS-SH, BGP-VPLS, MFC, L3VPN |

## Template Variables

See [`_variables.md`](_variables.md) for the complete variable reference.
Placeholders use `<variable-name>` syntax in snip bodies.

## Using These Snips

1. Choose the OS variant matching your target platform
2. Replace `<variable>` placeholders with site values
3. Combine snips by following `Pair with:` references in headers
4. Apply CoS binding snips last (they reference schedulers + classifiers)

## Files

- [`_variables.md`](_variables.md) — template variable reference
