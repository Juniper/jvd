# 5-Stage EVPN-VXLAN Data Center — Configuration Snippets

Reusable, templated config fragments extracted from the sanitized JVD
configurations under [conf/](../conf/). Each snippet contains:

- A structured header (Topic, Variant, Seen on, Highlights, Pair with, Variables).
- `$VARIABLE` placeholders for tunable values; see [_variables.md](_variables.md)
  for the master glossary.

This library focuses on the **5-stage-distinctive** configuration — the lean
super-spine tier that relays routes between PODs, enhanced OISM multicast, and
RoCEv2 DCQCN congestion management. Each POD is a 3-stage EVPN/VXLAN fabric; for
those baseline building blocks (leaf/spine underlay + EVPN overlay, IRB, MAC-VRF,
Type-5 VRF, policies), see the
[3-stage data center snip library](../../../3stage_dc/configuration/snips/).

## Layout

```
snips/
├── _variables.md
├── evo/                     # Junos OS Evolved (super spines, storage/services leaves)
│   ├── transport/           # Lean super-spine underlay + EVPN overlay relay
│   ├── services/            # OISM (server-leaf, border PIM gateway, PFE conserve)
│   ├── oam/                 # Enhanced OISM fabric enable
│   └── cos/                 # RoCEv2 DCQCN drop-profiles
└── junos/                   # Junos OS (compute-POD leaves)
    ├── services/            # OISM server-leaf
    ├── oam/                 # Enhanced OISM fabric enable
    └── cos/                 # RoCEv2 DCQCN drop-profiles
```

## Snippet headers — `Seen on:` and `Pair with:`

- **`Seen on:`** — every device in [`../conf/`](../conf/) that contains this exact
  pattern, split by OS family (EVO = QFX5230 super spines, QFX5130 storage/services
  leaves; Junos = QFX5120-48YM compute leaves).
- **`Pair with:`** — other snippets in this library that work together. All
  `Pair with:` references are reciprocal.

## Snip index

### Super-spine transport (lean)

| Snip | Purpose |
|---|---|
| [evo/transport/superspine-underlay-ebgp.conf](evo/transport/superspine-underlay-ebgp.conf) | Lean super-spine underlay eBGP to POD spines (IPv6) |
| [evo/transport/superspine-evpn-overlay-relay.conf](evo/transport/superspine-evpn-overlay-relay.conf) | Super-spine EVPN overlay route relay between PODs |

### OISM multicast

| Snip | Purpose |
|---|---|
| [evo/oam/oism-enhanced-forwarding.conf](evo/oam/oism-enhanced-forwarding.conf) | Enable enhanced OISM (BDNE) — EVO leaves |
| [junos/oam/oism-enhanced-forwarding.conf](junos/oam/oism-enhanced-forwarding.conf) | Enable enhanced OISM (BDNE) — compute leaves |
| [evo/services/oism-server-leaf.conf](evo/services/oism-server-leaf.conf) | Server-leaf per-VRF OISM (SBD, PIM accept-remote-source, OSPF) — EVO |
| [junos/services/oism-server-leaf.conf](junos/services/oism-server-leaf.conf) | Server-leaf per-VRF OISM — compute leaves |
| [evo/services/oism-border-pim-gateway.conf](evo/services/oism-border-pim-gateway.conf) | Border-leaf PIM-EVPN gateway per-VRF (external multicast) |
| [evo/services/oism-conserve-mcast-pfe.conf](evo/services/oism-conserve-mcast-pfe.conf) | QFX5130 PFE route conservation for OISM |

### RoCEv2 congestion management

| Snip | Purpose |
|---|---|
| [evo/cos/rocev2-dcqcn-drop-profiles.conf](evo/cos/rocev2-dcqcn-drop-profiles.conf) | DCQCN ECN WRED drop-profiles — EVO leaves |
| [junos/cos/rocev2-dcqcn-drop-profiles.conf](junos/cos/rocev2-dcqcn-drop-profiles.conf) | DCQCN ECN WRED drop-profiles — compute leaves |

## Related

- Design corpus: [`../../documentation/`](../../documentation/) (design guide, solution overview, test report brief, datasheet).
- BYOAI assistant: [byoai/README.md](byoai/README.md).
- POD baseline: [3-stage data center snips](../../../3stage_dc/configuration/snips/).
