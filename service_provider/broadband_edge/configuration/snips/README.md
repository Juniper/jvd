# Configuration Snippets (snips) — Broadband Edge JVD

This `snips/` directory contains **focused, copy-pasteable configuration excerpts** extracted from the full validated device configurations in [`../conf/`](../conf/). Each file isolates a single concept (a service overlay, a routing protocol, a dynamic-profile, etc.) so it can be referenced, shared, or adapted without wading through a 2500-line BNG config.

## Layout

```
snips/
  junos/        ← Junos OS examples (MX204/304/480/10004 BNGs, QFX5120/5210 access switches)
  evo/          ← Junos Evolved examples (ACX7024/7100, PTX10004 core)
```

Each subtree mirrors the same category folders. Categories specific to this JVD:

| Sub-folder | What's in it |
|---|---|
| `bootstrap/` | Chassis-level knobs (ECMP, GRES, pseudowire-service, tunnel-services). |
| `transport/` | Underlay: ISIS L1/L2 with SR-MPLS + TI-LFA, MPLS SRGB, and per-role iBGP overlays — PE-BNG, PE-AN, AGN/fabric RR, CR/core RR. |
| `services/` | EVPN-VPWS routing-instances (per-subscriber-group + Flexible Cross-Connect, BNG and AN sides) and L3VPN VRFs (PPPoE subscribers, DHCP/IPoE subscribers, RADIUS, Internet). |
| `interfaces/` | Core ISIS/MPLS interface template, AN access LAG with vlan-ccc + ESI multihoming, BNG pseudowire-headend (`ps`) interfaces for PPPoE and DHCP/IPoE, QFX access-switch LAG. |
| `policy/` | ISIS export, communities, RR export, per-VRF import/export policies (subscriber + Internet + RADIUS). |
| `firewall/` | uRPF fail-filters for DHCP/DHCPv6 and a clear-DF-bit filter for PPPoE. |
| `subscriber-management/` *(BBE-specific)* | `system services subscriber-management`, RADIUS server, AAA access-profile, address-assignment pools, and the five dynamic-profiles that drive PPPoE / DHCP / IPoE session activation. |

## Snippet headers — `Seen on:` and `Pair with:`

Every snippet starts with a C-style comment header containing two cross-reference fields:

- **`Seen on:`** — every device in `../conf/` that contains this exact pattern, split by OS family.
- **`Pair with:`** — other snippets that work together to deliver the same end-to-end service. All Pair-with references in this library are reciprocal.

When a topic exists on only one OS family in this JVD (e.g. all dynamic-profiles are Junos because the BNGs are MX), there is intentionally no EVO sibling.

## Templated values — `$VAR` placeholders

Identifiers that vary per deployment appear as `$VAR` placeholders. JVD-wide constants (apply-group names, community names, dynamic-profile names, the SRGB range, the AS numbers) are left literal. See [`_variables.md`](_variables.md) for the full glossary.

The `$junos-*` placeholders inside `dynamic-profiles/` blocks are **runtime-resolved by the BNG `smg-service` daemon** — they are not user variables and must be left as-is in any rendered config.
