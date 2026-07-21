# EVPN-VXLAN Data Center Interconnect (DCI) — Configuration Snippets

Reusable, templated config fragments extracted from the sanitized JVD
configurations under [conf/](../conf/). Each snippet contains:

- A structured header (Topic, Variant, Seen on, Highlights, Pair with, Variables).
- `$VARIABLE` placeholders for tunable values; see [_variables.md](_variables.md)
  for the master glossary.

This library focuses on the **DCI-distinctive** configuration — the stanzas that
stitch EVPN/VXLAN fabrics across data centers — rather than re-deriving the full
base-fabric config. For the underlying 3-stage / 5-stage / collapsed fabric
building blocks, see the baseline JVD snip libraries (e.g.
[`../../../3stage_dc/configuration/snips/`](../../../3stage_dc/configuration/snips/)).

## Scenarios

The source configs live under three scenario folders in [conf/](../conf/), and
every `Seen on:` device is written with its scenario prefix so it resolves
unambiguously:

- `dc1-dc2_ott/` — Over-the-Top (all-leaf VXLAN stretch), 3-stage ↔ 3-stage.
- `dc1-dc3_type2_seamless/` — Type 2 seamless stitching, 3-stage ↔ collapsed fabric.
- `dc1-dc4_type2_type5_seamless/` — Type 2 + Type 5 seamless stitching, 3-stage ↔ 5-stage.

## Layout

```
snips/
├── _variables.md
├── evo/                        # Junos OS Evolved (border leaves, spines, DC4)
│   ├── transport/              # DCI overlay eBGP gateway
│   ├── services/               # EVPN interconnect, translation VNI, Type 5 VRF
│   ├── interfaces/             # Loopback addressing
│   ├── policy/                 # DCI community definitions
│   └── security/               # MACSEC on the DCI uplink
└── junos/                      # Junos OS (collapsed-fabric DC3 leaves)
    ├── transport/              # DCI overlay eBGP gateway
    ├── services/               # EVPN interconnect, translation VNI
    ├── policy/                 # DCI communities, leaf-to-leaf DCI filter
    └── security/               # MACSEC on the DCI uplink
```

## Snippet headers — `Seen on:` and `Pair with:`

- **`Seen on:`** — every device in [`../conf/`](../conf/) that contains this
  exact pattern, split by OS family and written as `<scenario>/<device>`.
- **`Pair with:`** — other snippets in this library that work together to
  deliver the same end-to-end DCI function. All `Pair with:` references are
  reciprocal.

## Snip index

### DCI overlay transport

| Snip | Purpose |
|---|---|
| [evo/transport/dci-gateway-overlay-ebgp.conf](evo/transport/dci-gateway-overlay-ebgp.conf) | `evpn-gw` overlay eBGP to remote border leaves (BFD, multihop) — border leaves |
| [junos/transport/dci-gateway-overlay-ebgp.conf](junos/transport/dci-gateway-overlay-ebgp.conf) | `evpn-gw` overlay eBGP — collapsed-fabric DC3 leaves |

### Interconnect services

| Snip | Purpose |
|---|---|
| [evo/services/evpn-interconnect.conf](evo/services/evpn-interconnect.conf) | Type 2 interconnect ESI / RD / interconnected-vni-list — border leaves |
| [junos/services/evpn-interconnect.conf](junos/services/evpn-interconnect.conf) | Type 2 interconnect — collapsed-fabric DC3 leaves |
| [evo/services/vxlan-translation-vni.conf](evo/services/vxlan-translation-vni.conf) | Per-VLAN VXLAN translation VNI — border leaves |
| [junos/services/vxlan-translation-vni.conf](junos/services/vxlan-translation-vni.conf) | Per-VLAN VXLAN translation VNI — DC3 leaves |
| [evo/services/vrf-type5-interconnect.conf](evo/services/vrf-type5-interconnect.conf) | Type 5 (L3 VRF) interconnect + ip-prefix-routes — border leaves |

### Interfaces

| Snip | Purpose |
|---|---|
| [evo/interfaces/loopback.conf](evo/interfaces/loopback.conf) | lo0 addressing — router-id / VTEP / gateway local-address, per-VRF loopbacks |

### Policy

| Snip | Purpose |
|---|---|
| [evo/policy/community-definitions.conf](evo/policy/community-definitions.conf) | DCI gateway / interconnect community definitions — border leaves |
| [junos/policy/community-definitions.conf](junos/policy/community-definitions.conf) | DCI gateway / interconnect community definitions — DC3 leaves |
| [junos/policy/leaf-to-leaf-dci-filter.conf](junos/policy/leaf-to-leaf-dci-filter.conf) | Stops DCI overlay route re-advertisement between collapsed leaves |

### Security

| Snip | Purpose |
|---|---|
| [evo/security/macsec-dci.conf](evo/security/macsec-dci.conf) | MACSEC connectivity-association on the DCI uplink — border leaves |
| [junos/security/macsec-dci.conf](junos/security/macsec-dci.conf) | MACSEC connectivity-association on the DCI uplink — DC3 leaves |

## Related

- Design corpus: [`../../documentation/`](../../documentation/) (design guide, solution overview, test report brief, datasheet).
- BYOAI assistant: [byoai/README.md](byoai/README.md).
