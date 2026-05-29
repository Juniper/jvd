# MaaS Configuration Snip Library

Templated, reusable Junos / EVO configuration building blocks extracted
from the Metro-as-a-Service JVD's validated configurations.
Every snip is a real fragment from a deployed JVD device, with values
replaced by `$VARIABLES` and a 5-section header describing topic, where
it was observed, design highlights, same-device dependencies, JVD
service mapping, and variable definitions.

**Snips:** 112 total — 50 Junos + 62 EVO

## Layout

```
snips/
├── junos/   — Junos OS (MX, ACX5448, ACX710)
├── evo/     — Junos EVO (ACX7024, ACX7100, ACX7509)
└── _variables.md   — global $VARIABLE index
```

Each OS tree groups snips by category:
`services/`, `interfaces/`, `firewall/`, `cos/`, `policy/`, `apply-groups/`.

## How to use a snip

1. Open the `.conf` file — the header tells you what the snip does
   and which other snips it pairs with on the same device.
2. Substitute every `$VARIABLE` with your deployment value
   (see [_variables.md](_variables.md) for the full index).
3. Apply each `Pair with` dependency — these are configuration
   stanzas that must coexist on the same device for the snip to
   function (e.g. an EVPN service snip needs its attachment-circuit
   interface snip and the matching CoS / firewall snips).

Snip headers also list:
- **Seen on** — devices and platforms where the pattern was observed
- **Highlights** — design notes worth knowing before deploying
- **JVD service mapping** — the MEF service group(s) the snip implements

## JUNOS snips

### Services (routing-instances + protocols)

| Snip | Topic |
|---|---|
| [`bgp-vpls-p2p.conf`](junos/services/bgp-vpls-p2p.conf) | Service instance: bgp vpls p2p (MEF E-Line / EVPL) |
| [`bridge-domain-lsw.conf`](junos/services/bridge-domain-lsw.conf) | Service instance: bridge domain lsw (MEF E-Access) |
| [`evpn-elan.conf`](junos/services/evpn-elan.conf) | Service instance: evpn elan (MEF E-LAN / EP-LAN) |
| [`evpn-elan-port-based.conf`](junos/services/evpn-elan-port-based.conf) | Service instance: evpn elan port based (MEF E-LAN / EVP-LAN) |
| [`evpn-elan-type5.conf`](junos/services/evpn-elan-type5.conf) | Service instance: evpn elan type5 (MEF E-LAN / EVP-LAN) |
| [`evpn-elan-vlan-based-floating-pw.conf`](junos/services/evpn-elan-vlan-based-floating-pw.conf) | Service instance: evpn elan vlan based floating pw (MEF E-Line / EVPL) |
| [`evpn-etree-vlan-based.conf`](junos/services/evpn-etree-vlan-based.conf) | Service instance: evpn etree vlan based (MEF E-Tree / EVP-Tree) |
| [`evpn-fxc-vlan-unaware.conf`](junos/services/evpn-fxc-vlan-unaware.conf) | Service instance: evpn fxc vlan unaware (MEF E-Line / EVPL) |
| [`evpn-vpws-vlan-based.conf`](junos/services/evpn-vpws-vlan-based.conf) | Service instance: evpn vpws vlan based (MEF E-Line / EVPL) |
| [`l2circuit-floating-pw.conf`](junos/services/l2circuit-floating-pw.conf) | Service instance: l2circuit floating pw (MEF E-Line / EVPL) |
| [`l2vpn-kompella-port-based.conf`](junos/services/l2vpn-kompella-port-based.conf) | Service instance: l2vpn kompella port based (MEF E-Line / EPL) |
| [`l2vpn-kompella-vlan-based.conf`](junos/services/l2vpn-kompella-vlan-based.conf) | Service instance: l2vpn kompella vlan based (MEF E-Line / EVPL) |

### Interfaces (attachment circuits)

| Snip | Topic |
|---|---|
| [`ethernet-bridge.conf`](junos/interfaces/ethernet-bridge.conf) | Interface: ethernet bridge (MEF E-LAN / EP-LAN) |
| [`ethernet-ccc.conf`](junos/interfaces/ethernet-ccc.conf) | Interface: ethernet ccc (MEF E-Line / EPL) |
| [`irb-l3.conf`](junos/interfaces/irb-l3.conf) | Interface: irb l3 (MEF E-LAN / EVP-LAN) |
| [`pseudowire-subscriber.conf`](junos/interfaces/pseudowire-subscriber.conf) | Interface: pseudowire subscriber (MEF E-Line / EVPL) |
| [`vlan-bridge.conf`](junos/interfaces/vlan-bridge.conf) | Interface: vlan bridge (MEF E-Line / EVPL) |
| [`vlan-bridge-esi.conf`](junos/interfaces/vlan-bridge-esi.conf) | Interface: vlan bridge esi (MEF E-LAN / EVP-LAN) |
| [`vlan-bridge-esi-etree-root.conf`](junos/interfaces/vlan-bridge-esi-etree-root.conf) | Interface: vlan bridge esi etree root (MEF E-Tree / EVP-Tree) |
| [`vlan-bridge-esi-v2.conf`](junos/interfaces/vlan-bridge-esi-v2.conf) | Interface: vlan bridge esi (MEF E-LAN / EVP-LAN) |
| [`vlan-bridge-esi-v3.conf`](junos/interfaces/vlan-bridge-esi-v3.conf) | Interface: vlan bridge esi (MEF E-Line / EVPL) |
| [`vlan-bridge-etree-leaf.conf`](junos/interfaces/vlan-bridge-etree-leaf.conf) | Interface: vlan bridge etree leaf (MEF E-Tree / EVP-Tree) |
| [`vlan-bridge-qinq-stacked.conf`](junos/interfaces/vlan-bridge-qinq-stacked.conf) | Interface: vlan bridge qinq stacked (MEF E-Access) |
| [`vlan-bridge-qinq-stacked-v2.conf`](junos/interfaces/vlan-bridge-qinq-stacked-v2.conf) | Interface: vlan bridge qinq stacked (MEF E-Access) |
| [`vlan-ccc.conf`](junos/interfaces/vlan-ccc.conf) | Interface: vlan ccc (MEF E-Line / EVPL) |
| [`vlan-ccc-v2.conf`](junos/interfaces/vlan-ccc-v2.conf) | Interface: vlan ccc (MEF E-Line / EVPL) |
| [`vlan-ccc-vlan-map.conf`](junos/interfaces/vlan-ccc-vlan-map.conf) | Interface: vlan ccc vlan map (MEF E-Line / EVPL) |
| [`vlan-ccc-vlan-map-esi.conf`](junos/interfaces/vlan-ccc-vlan-map-esi.conf) | Interface: vlan ccc vlan map esi (MEF E-Line / EVPL) |

### Firewall filters

| Snip | Topic |
|---|---|
| [`filter-bridge-color-aware.conf`](junos/firewall/filter-bridge-color-aware.conf) | Firewall: filter bridge color aware (MEF E-Line / EVPL, E-Tree / EVP-Tree) |
| [`filter-bridge-color-aware-cf0.conf`](junos/firewall/filter-bridge-color-aware-cf0.conf) | Firewall: filter bridge color aware cf0 (MEF E-Access) |
| [`filter-bridge-color-aware-l2cp.conf`](junos/firewall/filter-bridge-color-aware-l2cp.conf) | Firewall: filter bridge color aware l2cp (MEF E-LAN / EP-LAN) |
| [`filter-bridge-color-blind.conf`](junos/firewall/filter-bridge-color-blind.conf) | Firewall: filter bridge color blind (MEF E-LAN / EVP-LAN, E-Line / EVPL, E-Tree / EVP-Tree) |
| [`filter-ccc-color-aware.conf`](junos/firewall/filter-ccc-color-aware.conf) | Firewall: filter ccc color aware (MEF E-Line / EVPL) |
| [`filter-ccc-color-aware-l2cp.conf`](junos/firewall/filter-ccc-color-aware-l2cp.conf) | Firewall: filter ccc color aware l2cp (MEF E-Line / EPL) |
| [`filter-ccc-color-blind.conf`](junos/firewall/filter-ccc-color-blind.conf) | Firewall: filter ccc color blind (MEF E-Line / EVPL) |
| [`filter-ccc-color-blind-v2.conf`](junos/firewall/filter-ccc-color-blind-v2.conf) | Firewall: filter ccc color blind (MEF E-Line / EVPL) |
| [`filter-ccc-color-blind-v3.conf`](junos/firewall/filter-ccc-color-blind-v3.conf) | Firewall: filter ccc color blind (MEF E-Line / EVPL) |
| [`filter-eswitch-color-blind.conf`](junos/firewall/filter-eswitch-color-blind.conf) | Firewall: filter eswitch color blind (MEF E-LAN / EVP-LAN, E-Line / EVPL) |

### Class-of-service

| Snip | Topic |
|---|---|
| [`classifiers.conf`](junos/cos/classifiers.conf) | Class-of-service: classifiers (MEF E-Access, E-LAN / EP-LAN, E-LAN / EVP-LAN, E-Line / EPL, E-Line / EVPL, E-Tree / EVP-Tree) |
| [`cos-binding-ieee8021p.conf`](junos/cos/cos-binding-ieee8021p.conf) | Class-of-service: cos binding ieee8021p (MEF E-Access, E-LAN / EP-LAN, E-LAN / EVP-LAN, E-Line / EPL, E-Line / EVPL, E-Tree / EVP-Tree) |
| [`cos-binding-mpls.conf`](junos/cos/cos-binding-mpls.conf) | Class-of-service: cos binding mpls (MEF E-Access, E-LAN / EP-LAN, E-LAN / EVP-LAN, E-Line / EPL, E-Line / EVPL, E-Tree / EVP-Tree) |
| [`forwarding-classes.conf`](junos/cos/forwarding-classes.conf) | Class-of-service: forwarding classes (MEF E-Access, E-LAN / EP-LAN, E-LAN / EVP-LAN, E-Line / EPL, E-Line / EVPL, E-Tree / EVP-Tree) |
| [`rewrite-rules.conf`](junos/cos/rewrite-rules.conf) | Class-of-service: rewrite rules (MEF E-Access, E-LAN / EP-LAN, E-LAN / EVP-LAN, E-Line / EPL, E-Line / EVPL, E-Tree / EVP-Tree) |
| [`scheduler-map.conf`](junos/cos/scheduler-map.conf) | Class-of-service: scheduler map (MEF E-Access, E-LAN / EP-LAN, E-LAN / EVP-LAN, E-Line / EPL, E-Line / EVPL, E-Tree / EVP-Tree) |
| [`schedulers.conf`](junos/cos/schedulers.conf) | Class-of-service: schedulers (MEF E-Access, E-LAN / EP-LAN, E-LAN / EVP-LAN, E-Line / EPL, E-Line / EVPL, E-Tree / EVP-Tree) |
| [`schedulers-legacy-acx.conf`](junos/cos/schedulers-legacy-acx.conf) | Class-of-service: schedulers legacy acx (MEF E-LAN / EVP-LAN, E-Line / EVPL) |
| [`schedulers-an1.conf`](junos/cos/schedulers-an1.conf) | Class-of-service: schedulers (AN1 variant — shaping-rate + low-priority SC-HIGH) |

### Routing policy

| Snip | Topic |
|---|---|
| [`policy-l3vpn-import-export.conf`](junos/policy/policy-l3vpn-import-export.conf) | Policy: policy l3vpn import export (MEF E-LAN / EVP-LAN) |
| [`policy-vpn-rt-export-gold.conf`](junos/policy/policy-vpn-rt-export-gold.conf) | Policy: policy vpn rt export gold (MEF E-Tree / EVP-Tree) |

### Apply-groups

| Snip | Topic |
|---|---|
| [`mef-testing.conf`](junos/apply-groups/mef-testing.conf) | Apply-group: mef testing (MEF E-LAN / EVP-LAN, E-Line / EVPL) |

## EVO snips

### Services (routing-instances + protocols)

| Snip | Topic |
|---|---|
| [`bgp-vpls.conf`](evo/services/bgp-vpls.conf) | Service instance: bgp vpls (MEF E-LAN / EVP-LAN) |
| [`bgp-vpls-p2p.conf`](evo/services/bgp-vpls-p2p.conf) | Service instance: bgp vpls p2p (MEF E-Line / EVPL) |
| [`evpn-elan-bundle-port-based.conf`](evo/services/evpn-elan-bundle-port-based.conf) | Service instance: evpn elan bundle port based (MEF E-LAN / EP-LAN) |
| [`evpn-elan-bundle-port-based-v2.conf`](evo/services/evpn-elan-bundle-port-based-v2.conf) | Service instance: evpn elan bundle port based (MEF E-LAN / EP-LAN) |
| [`evpn-elan-port-based.conf`](evo/services/evpn-elan-port-based.conf) | Service instance: evpn elan port based (MEF E-LAN / EVP-LAN) |
| [`evpn-elan-type5.conf`](evo/services/evpn-elan-type5.conf) | Service instance: evpn elan type5 (MEF E-LAN / EVP-LAN) |
| [`evpn-elan-type5-v2.conf`](evo/services/evpn-elan-type5-v2.conf) | Service instance: evpn elan type5 (MEF E-LAN / EVP-LAN) |
| [`evpn-elan-vlan-bundle.conf`](evo/services/evpn-elan-vlan-bundle.conf) | Service instance: evpn elan vlan bundle (MEF E-LAN / EVP-LAN) |
| [`evpn-fxc-vlan-aware.conf`](evo/services/evpn-fxc-vlan-aware.conf) | Service instance: evpn fxc vlan aware (MEF E-Line / EVPL) |
| [`evpn-fxc-vlan-unaware.conf`](evo/services/evpn-fxc-vlan-unaware.conf) | Service instance: evpn fxc vlan unaware (MEF E-Line / EVPL) |
| [`evpn-vpws-lsw.conf`](evo/services/evpn-vpws-lsw.conf) | Service instance: evpn vpws lsw (MEF E-Access) |
| [`evpn-vpws-port-based.conf`](evo/services/evpn-vpws-port-based.conf) | Service instance: evpn vpws port based (MEF E-Line / EPL) |
| [`evpn-vpws-vlan-based.conf`](evo/services/evpn-vpws-vlan-based.conf) | Service instance: evpn vpws vlan based (MEF E-Line / EVPL) |
| [`evpn-vpws-vlan-based-v2.conf`](evo/services/evpn-vpws-vlan-based-v2.conf) | Service instance: evpn vpws vlan based (MEF E-Line / EVPL) |
| [`l2circuit-floating-pw.conf`](evo/services/l2circuit-floating-pw.conf) | Service instance: l2circuit floating pw (MEF E-Line / EVPL) |
| [`l2circuit-hot-standby-backup.conf`](evo/services/l2circuit-hot-standby-backup.conf) | Service instance: l2circuit hot standby backup (MEF E-Line / EVPL) |
| [`l2circuit-hot-standby-primary.conf`](evo/services/l2circuit-hot-standby-primary.conf) | Service instance: l2circuit hot standby primary (MEF E-Line / EVPL) |
| [`l2circuit-lsw.conf`](evo/services/l2circuit-lsw.conf) | Service instance: l2circuit lsw (MEF E-Access) |
| [`l2vpn-kompella-port-based.conf`](evo/services/l2vpn-kompella-port-based.conf) | Service instance: l2vpn kompella port based (MEF E-Line / EPL) |
| [`l2vpn-kompella-vlan-based.conf`](evo/services/l2vpn-kompella-vlan-based.conf) | Service instance: l2vpn kompella vlan based (MEF E-Line / EVPL) |

### Interfaces (attachment circuits)

| Snip | Topic |
|---|---|
| [`ethernet-bridge.conf`](evo/interfaces/ethernet-bridge.conf) | Interface: ethernet bridge (MEF E-LAN / EP-LAN) |
| [`ethernet-bridge-v2.conf`](evo/interfaces/ethernet-bridge-v2.conf) | Interface: ethernet bridge (MEF E-LAN / EP-LAN) |
| [`ethernet-ccc.conf`](evo/interfaces/ethernet-ccc.conf) | Interface: ethernet ccc (MEF E-Line / EPL) |
| [`ethernet-ccc-v2.conf`](evo/interfaces/ethernet-ccc-v2.conf) | Interface: ethernet ccc (MEF E-Line / EPL) |
| [`irb-l3.conf`](evo/interfaces/irb-l3.conf) | Interface: irb l3 (MEF E-LAN / EVP-LAN) |
| [`irb-l3-vga.conf`](evo/interfaces/irb-l3-vga.conf) | Interface: irb l3 vga (MEF E-LAN / EVP-LAN) |
| [`physical-mtu.conf`](evo/interfaces/physical-mtu.conf) | Interface: physical mtu (MEF E-LAN / EP-LAN, E-LAN / EVP-LAN, E-Line / EPL, E-Line / EVPL) |
| [`vlan-bridge.conf`](evo/interfaces/vlan-bridge.conf) | Interface: vlan bridge (MEF E-LAN / EVP-LAN) |
| [`vlan-bridge-bundle.conf`](evo/interfaces/vlan-bridge-bundle.conf) | Interface: vlan bridge bundle (MEF E-LAN / EVP-LAN) |
| [`vlan-bridge-esi.conf`](evo/interfaces/vlan-bridge-esi.conf) | Interface: vlan bridge esi (MEF E-LAN / EVP-LAN) |
| [`vlan-bridge-esi-bundle.conf`](evo/interfaces/vlan-bridge-esi-bundle.conf) | Interface: vlan bridge esi bundle (MEF E-LAN / EVP-LAN) |
| [`vlan-bridge-v2.conf`](evo/interfaces/vlan-bridge-v2.conf) | Interface: vlan bridge (MEF E-Line / EVPL) |
| [`vlan-bridge-vlan-map.conf`](evo/interfaces/vlan-bridge-vlan-map.conf) | Interface: vlan bridge vlan map (MEF E-LAN / EVP-LAN) |
| [`vlan-bridge-vlan-map-v2.conf`](evo/interfaces/vlan-bridge-vlan-map-v2.conf) | Interface: vlan bridge vlan map (MEF E-LAN / EVP-LAN) |
| [`vlan-ccc.conf`](evo/interfaces/vlan-ccc.conf) | Interface: vlan ccc (MEF E-Line / EVPL) |
| [`vlan-ccc-2-units.conf`](evo/interfaces/vlan-ccc-2-units.conf) | Interface: vlan ccc 2 units (MEF E-Line / EVPL) |
| [`vlan-ccc-esi.conf`](evo/interfaces/vlan-ccc-esi.conf) | Interface: vlan ccc esi (MEF E-Line / EVPL) |
| [`vlan-ccc-qinq-stacked-qinq-tpid.conf`](evo/interfaces/vlan-ccc-qinq-stacked-qinq-tpid.conf) | Interface: vlan ccc qinq stacked qinq tpid (MEF E-Access) |
| [`vlan-ccc-v2.conf`](evo/interfaces/vlan-ccc-v2.conf) | Interface: vlan ccc (MEF E-Line / EVPL) |
| [`vlan-ccc-vlan-map.conf`](evo/interfaces/vlan-ccc-vlan-map.conf) | Interface: vlan ccc vlan map (MEF E-Line / EVPL) |
| [`vlan-ccc-vlan-map-bundle-qinq-tpid.conf`](evo/interfaces/vlan-ccc-vlan-map-bundle-qinq-tpid.conf) | Interface: vlan ccc vlan map bundle qinq tpid (MEF E-Access) |
| [`vlan-ccc-vlan-map-esi.conf`](evo/interfaces/vlan-ccc-vlan-map-esi.conf) | Interface: vlan ccc vlan map esi (MEF E-Line / EVPL) |
| [`vlan-ccc-vlan-map-esi-2-units.conf`](evo/interfaces/vlan-ccc-vlan-map-esi-2-units.conf) | Interface: vlan ccc vlan map esi 2 units (MEF E-Line / EVPL) |
| [`vlan-ccc-vlan-map-esi-2-units-v2.conf`](evo/interfaces/vlan-ccc-vlan-map-esi-2-units-v2.conf) | Interface: vlan ccc vlan map esi 2 units (MEF E-Line / EVPL) |
| [`vlan-ccc-vlan-map-v2.conf`](evo/interfaces/vlan-ccc-vlan-map-v2.conf) | Interface: vlan ccc vlan map (MEF E-Line / EVPL) |

### Firewall filters

| Snip | Topic |
|---|---|
| [`filter-ccc-color-blind.conf`](evo/firewall/filter-ccc-color-blind.conf) | Firewall: filter ccc color blind (MEF E-Access, E-Line / EVPL) |
| [`filter-ccc-color-blind-l2cp.conf`](evo/firewall/filter-ccc-color-blind-l2cp.conf) | Firewall: filter ccc color blind l2cp (MEF E-Line / EPL) |
| [`filter-ccc-color-blind-v2.conf`](evo/firewall/filter-ccc-color-blind-v2.conf) | Firewall: filter ccc color blind (MEF E-Line / EVPL) |
| [`filter-eswitch-color-blind.conf`](evo/firewall/filter-eswitch-color-blind.conf) | Firewall: filter eswitch color blind (MEF E-LAN / EVP-LAN, E-Line / EVPL) |
| [`filter-eswitch-color-blind-l2cp.conf`](evo/firewall/filter-eswitch-color-blind-l2cp.conf) | Firewall: filter eswitch color blind l2cp (MEF E-LAN / EP-LAN) |
| [`filter-eswitch-color-blind-v2.conf`](evo/firewall/filter-eswitch-color-blind-v2.conf) | Firewall: filter eswitch color blind (MEF E-LAN / EVP-LAN) |

### Class-of-service

| Snip | Topic |
|---|---|
| [`classifiers.conf`](evo/cos/classifiers.conf) | Class-of-service: classifiers (MEF E-Access, E-LAN / EP-LAN, E-LAN / EVP-LAN, E-Line / EPL, E-Line / EVPL) |
| [`cos-binding-ieee8021p.conf`](evo/cos/cos-binding-ieee8021p.conf) | Class-of-service: cos binding ieee8021p (MEF E-Access, E-LAN / EP-LAN, E-LAN / EVP-LAN, E-Line / EPL, E-Line / EVPL) |
| [`cos-binding-mpls.conf`](evo/cos/cos-binding-mpls.conf) | Class-of-service: cos binding mpls (MEF E-Access, E-LAN / EP-LAN, E-LAN / EVP-LAN, E-Line / EPL, E-Line / EVPL) |
| [`forwarding-classes.conf`](evo/cos/forwarding-classes.conf) | Class-of-service: forwarding classes (MEF E-Access, E-LAN / EP-LAN, E-LAN / EVP-LAN, E-Line / EPL, E-Line / EVPL) |
| [`rewrite-rules.conf`](evo/cos/rewrite-rules.conf) | Class-of-service: rewrite rules (MEF E-Access, E-LAN / EP-LAN, E-LAN / EVP-LAN, E-Line / EPL, E-Line / EVPL) |
| [`scheduler-map.conf`](evo/cos/scheduler-map.conf) | Class-of-service: scheduler map (MEF E-Access, E-LAN / EP-LAN, E-LAN / EVP-LAN, E-Line / EPL, E-Line / EVPL) |
| [`schedulers.conf`](evo/cos/schedulers.conf) | Class-of-service: schedulers (MEF E-Access, E-LAN / EP-LAN, E-LAN / EVP-LAN, E-Line / EPL, E-Line / EVPL) |

### Routing policy

| Snip | Topic |
|---|---|
| [`policy-l3vpn-import-export.conf`](evo/policy/policy-l3vpn-import-export.conf) | Policy: policy l3vpn import export (MEF E-LAN / EVP-LAN) |
| [`policy-vpn-rt-export-bronze.conf`](evo/policy/policy-vpn-rt-export-bronze.conf) | Policy: policy vpn rt export bronze (MEF E-LAN / EVP-LAN, E-Line / EVPL) |
| [`policy-vpn-rt-export-gold.conf`](evo/policy/policy-vpn-rt-export-gold.conf) | Policy: policy vpn rt export gold (MEF E-Line / EVPL) |

### Apply-groups

| Snip | Topic |
|---|---|
| [`mef-forwarding-profile.conf`](evo/apply-groups/mef-forwarding-profile.conf) | Apply-group: mef forwarding profile (MEF E-Access, E-LAN / EP-LAN, E-LAN / EVP-LAN, E-Line / EPL, E-Line / EVPL) |

## Provenance

Source configurations: [`configuration/conf/`](../conf/) (per-service,
per-device hierarchical Junos and EVO captures from the MaaS lab).
Snips were derived by detecting recurring stanzas across devices and
service variants, templating instance-specific values into
`$VARIABLES`, and recording cross-snip pair-with edges from the same
device's configuration tree.
