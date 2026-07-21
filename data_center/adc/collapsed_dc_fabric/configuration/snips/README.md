# Collapsed Data Center Fabric — Configuration Snippets

Reusable, templated config fragments extracted from the sanitized JVD
configurations under [conf/](../conf/). Each snippet contains:

- A structured header (Topic, Variant, Seen on, Highlights, Pair with, Variables).
- `$VARIABLE` placeholders for tunable values; see [_variables.md](_variables.md)
  for the master glossary.

The collapsed fabric is a **two-switch** EVPN-VXLAN fabric — the two leaves *are*
the fabric and peer directly (no spine tier). Both switches run **Junos OS**
(baseline QFX5120-48Y), so every snip lives under `junos/`.

## Layout

```
snips/
├── _variables.md
└── junos/
    ├── transport/    # Direct leaf-to-leaf eBGP underlay + EVPN overlay
    ├── services/     # VLAN-aware MAC-VRF EVPN-VXLAN
    └── interfaces/   # ESI-LAG access, anycast IRB gateway, loopback
```

## Snippet headers — `Seen on:` and `Pair with:`

- **`Seen on:`** — every device in [`../conf/`](../conf/) that contains this exact
  pattern. Both devices are Junos, so the `EVO:` line is always `(none)`.
- **`Pair with:`** — other snippets in this library that work together. All
  `Pair with:` references are reciprocal.

## Snip index

### Transport (direct leaf-to-leaf)

| Snip | Purpose |
|---|---|
| [junos/transport/collapsed-underlay-ebgp.conf](junos/transport/collapsed-underlay-ebgp.conf) | eBGP underlay directly between the two collapsed leaves (l3clos-l) |
| [junos/transport/collapsed-evpn-overlay.conf](junos/transport/collapsed-evpn-overlay.conf) | eBGP EVPN overlay directly between the two leaves over loopbacks (l3clos-l-evpn) |

### Services

| Snip | Purpose |
|---|---|
| [junos/services/mac-vrf-evpn-vxlan.conf](junos/services/mac-vrf-evpn-vxlan.conf) | VLAN-aware MAC-VRF (evpn-1), 1 VNI per VLAN, per-VNI route targets |

### Interfaces

| Snip | Purpose |
|---|---|
| [junos/interfaces/esi-lag-access.conf](junos/interfaces/esi-lag-access.conf) | All-active ESI-LAG for multihomed server / access switch |
| [junos/interfaces/irb-anycast-gateway.conf](junos/interfaces/irb-anycast-gateway.conf) | Distributed anycast IRB L3 gateway for a fabric VLAN |
| [junos/interfaces/loopback.conf](junos/interfaces/loopback.conf) | lo0 router-id / VTEP / per-VRF loopbacks |

## Related

- Design corpus: [`../../documentation/`](../../documentation/) (design guide, solution overview, test report brief, datasheet).
- BYOAI assistant: [byoai/README.md](byoai/README.md).
- Scale up: [3-stage data center snips](../../../3stage_dc/configuration/snips/).
