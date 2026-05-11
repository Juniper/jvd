# SRv6 Core Edge — Configuration Snippets

Reusable, templated config fragments extracted from the sanitized JVD
configurations under [conf/](../conf/). Each snippet contains:

- A 5-section header (Topic, Seen on, Highlights, Pair with, Variables).
- A Junos and (where applicable) an Evolved-OS sibling.
- `$VARIABLE` placeholders for tunable values; see [_variables.md](_variables.md)
  for the master glossary.

## Layout

```
snips/
├── _variables.md
├── junos/
│   ├── apply-groups/      # Wildcard `<GR-*>` defaults
│   ├── transport/         # Underlay: IS-IS, SRv6 locators, BGP overlay, BFD, TI-LFA
│   ├── services/          # L3VPN, EVPN-VPWS, PE-CE attachment styles
│   ├── interfaces/        # Core AE links, CPE attachment trunk
│   ├── policy/            # RT scoping, load-balance
│   └── oam/               # TWAMP-Light, BFD defaults
└── evo/                   # PTX/EVO siblings (mostly identical to Junos;
                           #   each notes any platform-specific deltas)
```

## Snip index

### Apply-groups (foundation)

| Snip | Purpose |
|---|---|
| [junos/apply-groups/gr-core-intf-ipv6.conf](junos/apply-groups/gr-core-intf-ipv6.conf) | Core IFL defaults: jumbo MTU, BFD-on-LACP, optics alarms |
| [junos/apply-groups/gr-isis-ipv6.conf](junos/apply-groups/gr-isis-ipv6.conf) | Per-IFL IS-IS L2 + SRv6 adjacency-SIDs + ASLA + TI-LFA + delay measurement |
| [junos/apply-groups/gr-srv6.conf](junos/apply-groups/gr-srv6.conf) | Locator µSID flavors (psp/usp/usd) |
| [junos/apply-groups/gr-bgp.conf](junos/apply-groups/gr-bgp.conf) | iBGP peer-group defaults: TCP-AO + multipath + tcp-mss |
| [junos/apply-groups/gr-l3vpn.conf](junos/apply-groups/gr-l3vpn.conf) | L3VPN routing-instance defaults |

### Transport (underlay)

| Snip | Purpose |
|---|---|
| [junos/transport/isis-srv6-flex-algo.conf](junos/transport/isis-srv6-flex-algo.conf) | Per-device IS-IS instantiation + SRv6 locator/block defs |
| [junos/transport/bgp-overlay-rr.conf](junos/transport/bgp-overlay-rr.conf) | Route-reflector multi-AFI configuration with SRv6 service signaling |
| [junos/transport/bgp-overlay-rr-client.conf](junos/transport/bgp-overlay-rr-client.conf) | PE-side iBGP overlay session toward the RRs |
| [junos/transport/bgp-transport-class.conf](junos/transport/bgp-transport-class.conf) | Color-to-Flex-Algo binding |
| [junos/transport/inter-as-option-c.conf](junos/transport/inter-as-option-c.conf) | BR-to-BR eBGP for inter-AS Option C |
| [junos/transport/srv6-locator-summarization.conf](junos/transport/srv6-locator-summarization.conf) | Locator redistribution + summarization at AS boundary |
| [junos/transport/bfd-isis.conf](junos/transport/bfd-isis.conf) | Per-IFL BFDv6 under IS-IS |
| [junos/transport/ti-lfa-mla.conf](junos/transport/ti-lfa-mla.conf) | TI-LFA backup-SPF + Micro-Loop Avoidance |

### Services (overlay)

| Snip | Purpose |
|---|---|
| [junos/services/l3vpn-srv6-vrf.conf](junos/services/l3vpn-srv6-vrf.conf) | L3VPN VRF over SRv6 with PE-CE eBGP + µDT46-SID |
| [junos/services/evpn-vpws-srv6.conf](junos/services/evpn-vpws-srv6.conf) | EVPN-VPWS over SRv6 (single-active or all-active) |
| [junos/services/pe-ce-direct.conf](junos/services/pe-ce-direct.conf) | PE-CE direct sub-IFL attachment |
| [junos/services/pe-ce-irb.conf](junos/services/pe-ce-irb.conf) | PE-CE IRB attachment (bridge-domain stitched to L3 VRF) |

### Interfaces

| Snip | Purpose |
|---|---|
| [junos/interfaces/core-ae-link.conf](junos/interfaces/core-ae-link.conf) | Core AE trunk template |
| [junos/interfaces/cpe-attachment.conf](junos/interfaces/cpe-attachment.conf) | CPE-facing trunk hosting L3 sub-IFL + EVPN-VPWS AC + IRB AC |

### Policy

| Snip | Purpose |
|---|---|
| [junos/policy/vpn-import-export-rt.conf](junos/policy/vpn-import-export-rt.conf) | RT-SRV6 community + PS-VPN-SRV6 RR filter |
| [junos/policy/srv6-redistribution-policy.conf](junos/policy/srv6-redistribution-policy.conf) | PS-LOAD-BALANCE for forwarding-table |

### OAM

| Snip | Purpose |
|---|---|
| [junos/oam/twamp-light.conf](junos/oam/twamp-light.conf) | TWAMP-Light responder for delay measurement |
| [junos/oam/bfd-defaults.conf](junos/oam/bfd-defaults.conf) | Standard BFD timer triplet (50/3/no-adaptation) |

### Evolved-OS siblings

Every Junos snip has a self-contained sibling under [evo/](evo/) at the same
relative path with the full body inlined — even when the body is byte-for-byte
identical to the Junos version. This lets EVO operators consume the snip
without cross-referencing the Junos tree. Each EVO snip's header carries a
`Variant: Evolved-OS (EVO)` tag and a leading "Highlights" bullet that calls
out either "Body is byte-identical to the Junos sibling." or any platform-
specific delta.

The notable structural deltas are:

- [evo/apply-groups/gr-core-intf-ipv6.conf](evo/apply-groups/gr-core-intf-ipv6.conf) — family-level `mtu` is `inactive:` by default on PTX.
- [evo/apply-groups/gr-bgp.conf](evo/apply-groups/gr-bgp.conf) — adds a `<GR-EBGP-*>` wildcard alongside `<GR-IBGP-*>`.
- [evo/transport/inter-as-option-c.conf](evo/transport/inter-as-option-c.conf) — `multihop { ttl 255; no-nexthop-change; }` and per-neighbor `local-address`.
- [evo/policy/srv6-redistribution-policy.conf](evo/policy/srv6-redistribution-policy.conf) — adds PS-IBGP-SRV6-IMP, PS-EBGP-IMP, PS-EBGP-NHS, PS-EBGP-SRV6-EXP for the inter-AS BR role.
- [evo/services/pe-ce-direct.conf](evo/services/pe-ce-direct.conf) and [evo/interfaces/core-ae-link.conf](evo/interfaces/core-ae-link.conf) — note PTX uses `et-*` interface naming and `et-options { 802.3ad ... }` instead of MX's `xe-*` / `gigether-options { 802.3ad ... }`.
