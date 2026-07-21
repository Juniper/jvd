# Collapsed Data Center Fabric with Access Switches — Configuration Snippets

Reusable, templated config fragments extracted from the sanitized JVD
configurations under [conf/](../conf/). Each snippet contains:

- A structured header (Topic, Variant, Seen on, Highlights, Pair with, Variables).
- `$VARIABLE` placeholders for tunable values; see [_variables.md](_variables.md)
  for the master glossary.

This JVDE adds an **EX4400-48MP access-switch layer** to the base collapsed
fabric. This library focuses on the **access-layer extension** — the access-tier
direct EVPN fabric, the EX4400 VTEP config, and the ESI-LAG interconnect between
the tiers. Both tiers run **Junos OS**, so every snip is under `junos/`. For the
base collapsed-fabric building blocks (leaf direct `l3clos-l` underlay/overlay,
anycast IRB), see the
[Collapsed Data Center Fabric snip library](https://github.com/Juniper/jvd/tree/main/data_center/adc/collapsed_dc_fabric/configuration/snips).

## Layout

```
snips/
├── _variables.md
└── junos/
    ├── transport/    # Access-tier direct underlay + EVPN overlay; EVPN-VXLAN forwarding
    ├── services/     # VLAN-aware MAC-VRF (both tiers)
    └── interfaces/   # All-active ESI-LAG interconnect, loopback
```

## Snippet headers — `Seen on:` and `Pair with:`

- **`Seen on:`** — every device in [`../conf/`](../conf/) that contains this exact
  pattern. All four devices (2 collapsed leaves + 2 access switches) are Junos,
  so the `EVO:` line is always `(none)`.
- **`Pair with:`** — other snippets in this library that work together. All
  `Pair with:` references are reciprocal.

## Snip index

### Access-tier transport

| Snip | Purpose |
|---|---|
| [junos/transport/access-underlay-ebgp.conf](junos/transport/access-underlay-ebgp.conf) | Access-tier direct eBGP underlay between the EX4400 pair (l3clos-a) |
| [junos/transport/access-evpn-overlay.conf](junos/transport/access-evpn-overlay.conf) | Access-tier direct eBGP EVPN overlay between the EX4400 pair (l3clos-a-evpn) |
| [junos/transport/evpn-vxlan-forwarding.conf](junos/transport/evpn-vxlan-forwarding.conf) | EVPN-VXLAN VTEP forwarding (shared-tunnels + vxlan-routing overlay-ecmp) — both tiers |

### Services

| Snip | Purpose |
|---|---|
| [junos/services/mac-vrf-evpn-vxlan.conf](junos/services/mac-vrf-evpn-vxlan.conf) | VLAN-aware MAC-VRF (evpn-1), 1 VNI per VLAN — both tiers |

### Interfaces

| Snip | Purpose |
|---|---|
| [junos/interfaces/esi-lag.conf](junos/interfaces/esi-lag.conf) | All-active ESI-LAG — leaf↔access uplink, access↔server, access-pair interconnect |
| [junos/interfaces/loopback.conf](junos/interfaces/loopback.conf) | lo0 router-id / VTEP source |

## Related

- Design corpus: [`../../documentation/`](../../documentation/) (design guide, solution overview, test report brief, datasheet).
- BYOAI assistant: [byoai/README.md](byoai/README.md).
- Base JVD: [Collapsed Data Center Fabric](https://github.com/Juniper/jvd/tree/main/data_center/adc/collapsed_dc_fabric).
