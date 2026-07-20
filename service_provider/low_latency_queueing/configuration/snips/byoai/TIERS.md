# Configuration Form Tiers

This file is part of the [BYOAI](README.md) corpus. It tells the AI which snippet
files to include for each service kind at each verbosity tier. It is bundled into
[`jvd-llq-snips.md`](jvd-llq-snips.md) by `regenerate-bundle.sh`.

For each service kind, the AI includes ONLY the snips listed for the chosen tier —
and ONLY those — unless the user explicitly asks for more. Use the OS-appropriate
file under `junos/` or `evo/` for the target device:

- **EVO** (ACX7024/7100/7509 access & aggregation, PTX10001-36MR core) → `evo/…`
- **Junos** (MX204/MX480 aggregation, MX304 SAG) → `junos/…`

This is a **5G xHaul Class-of-Service** JVD — CoS is not an afterthought, it is
the point. Every service's `as-deployed` tier therefore includes the full CoS
baseline. Fronthaul services (eCPRI) are the primary use of the low-latency queue
(FC-LLQ, queue 6) and, on ACX, the `schedulers-low-latency` scheduler.

---

## Shared underlay baseline (referenced by every `as-deployed`)

The SR-MPLS transport + policy + CoS every device needs end-to-end. Factor this
once; every service's `as-deployed` = its `with-overlay` set + this baseline.

**Transport**
- `transport/isis-global.conf` (IS-IS SR, SRGB, TI-LFA backup)
- `transport/isis-interface.conf` (level-2, TI-LFA, BFD, p2p)
- `transport/mpls-global.conf` (PCE LSPs, TTL, ICMP/IPv6 tunneling)
- `transport/bgp-internal.conf` (iBGP labeled-unicast + route-reflector)
- `transport/load-balance-pplb.conf` (chained-composite-next-hop)
- `transport/forwarding-options-hash.conf` (EVO only — L3+L4+MPLS hashing)

**Policy**
- `policy/allow-loopback.conf`, `policy/next-hop-self.conf`, `policy/pplb.conf`,
  `policy/sr-nonzero-loopbacks.conf`

**CoS baseline (transport marking)**
- `cos/forwarding-classes.conf` (8-class O-RAN model)
- `cos/classifier-exp.conf` + `cos/rewrite-exp.conf` (MPLS EXP core)
- `cos/scheduler-map.conf`
- `cos/schedulers-low-latency.conf` (EVO ACX — FC-LLQ = low-latency) **or**
  `cos/schedulers-strict-high.conf` (Junos MX + EVO PTX core — FC-LLQ = strict-high)
- `cos/cos-binding-transport.conf` (EXP classify + rewrite on core AE units)

---

## EVPN-VPWS (5G fronthaul eCPRI / L2 MBH point-to-point)

EVO = multi-homed (eCPRI fronthaul, ESI on the AG-facing LAG). Junos = single-homed
(midhaul/backhaul to SAG).

**minimum** (just the service)
- flavor: `evo/services/evpn-vpws-vlan-based-mh.conf` **or**
  `junos/services/evpn-vpws-vlan-based-sh.conf`
- `evo/interfaces/lag-esi.conf` (EVO — ESI LAG) **or**
  `junos/interfaces/vlan-ccc.conf` (Junos — vlan-ccc AC unit)
- `evo/interfaces/vlan-ccc.conf` (EVO AC unit) if not on the ESI LAG
- fronthaul CoS: `evo/cos/cos-binding-l2-fronthaul-static.conf` (static FC-LLQ) +
  `evo/firewall/filter-mf-ecpri-fronthaul.conf` (MAC-based eCPRI steering)

**with-overlay** (= minimum +)
- `transport/bgp-internal.conf` (assert iBGP family for EVPN)

**as-deployed** (= with-overlay + shared underlay baseline)

---

## EVPN-FXC vlan-aware (Flexible Cross-Connect, fronthaul/midhaul)

**minimum**
- `services/evpn-fxc-vlan-aware.conf`
- `interfaces/vlan-ccc.conf` (+ `evo/interfaces/lag-esi.conf` for EVO multihoming)
- fronthaul CoS: `evo/cos/cos-binding-l2-fronthaul-static.conf` +
  `evo/firewall/filter-mf-ecpri-fronthaul.conf` (EVO)

**with-overlay** (= minimum + `transport/bgp-internal.conf`)

**as-deployed** (= with-overlay + shared underlay baseline)

---

## EVPN-ELAN (multipoint L2 fronthaul)

EVO = `evpn-elan-vlan-based.conf` (mac-vrf, simple). Junos = `evpn-elan-vlan-based-irb.conf`
(mac-vrf + IRB — see the IRB service below).

**minimum**
- `evo/services/evpn-elan-vlan-based.conf`
- `interfaces/vlan-bridge.conf` (+ `evo/interfaces/lag-esi.conf` for multihoming)
- L2 CoS: `evo/cos/cos-binding-l2-fronthaul.conf` (802.1p classify)

**with-overlay** (= minimum + `transport/bgp-internal.conf`)

**as-deployed** (= with-overlay + shared underlay baseline)

---

## EVPN-ELAN with IRB + L3VPN (integrated L2 + L3 midhaul)

The DU→SAG midhaul anycast-gateway pattern: bridge domain + IRB routed into an
L3VPN VRF.

**minimum**
- `services/evpn-elan-vlan-based-irb.conf` (Junos) **or**
  `evo/services/evpn-elan-vlan-based.conf` + `evo/cos/cos-binding-irb.conf` (EVO)
- `services/l3vpn-irb.conf` (the VRF that binds `irb.<unit>`)
- `interfaces/vlan-bridge.conf` (AC units)
- IRB CoS: `evo/cos/cos-binding-irb.conf` (static FC-REALTIME on IRB) (EVO)
- IRB firewall MF: `firewall/filter-mfc-ipv4-l3vpn-irb.conf` +
  `firewall/filter-mfc-ipv6-l3vpn-irb.conf`

**with-overlay** (= minimum + `transport/bgp-internal.conf`)

**as-deployed** (= with-overlay + shared underlay baseline + full L3 CoS:
`cos/classifier-dscp.conf`, `cos/classifier-dscp-ipv6.conf`,
`cos/rewrite-dscp.conf`, `cos/rewrite-dscp-ipv6.conf`,
`cos/cos-binding-l3-service.conf`)

---

## L3VPN with IRB (anycast gateway, standalone)

**minimum**
- `services/l3vpn-irb.conf`
- `interfaces/vlan-bridge.conf` (the AC/IRB attachment)
- `cos/cos-binding-l3-service.conf` (DSCP classify/rewrite per unit) +
  `firewall/filter-mfc-ipv4-l3vpn-irb.conf` + `firewall/filter-mfc-ipv6-l3vpn-irb.conf`

**with-overlay** (= minimum + `transport/bgp-internal.conf`)

**as-deployed** (= with-overlay + shared underlay baseline + full L3 CoS:
`cos/classifier-dscp*.conf`, `cos/rewrite-dscp*.conf`)

---

## BGP-VPLS (multipoint L2 MBH, RFC 4761)

**minimum**
- `services/bgp-vpls-vsi.conf`
- `interfaces/vlan-bridge.conf`
- L2 CoS: `evo/cos/cos-binding-l2-fronthaul.conf` (EVO)
- OAM (optional): `evo/oam/cfm-maintenance-domain.conf`

**with-overlay** (= minimum + `transport/bgp-internal.conf`)

**as-deployed** (= with-overlay + shared underlay baseline)

---

## Add-a-feature requests (no full service)

When the user asks to add a supporting feature to an existing device, emit ONLY
that snip set (OS-appropriate):

- **CoS (full 8-class 5G model)** → `cos/forwarding-classes.conf` +
  `cos/scheduler-map.conf` + (`cos/schedulers-low-latency.conf` for EVO ACX /
  `cos/schedulers-strict-high.conf` for Junos MX + EVO PTX) + all classifiers
  (`cos/classifier-ieee-802.1.conf`, `cos/classifier-exp.conf`,
  `cos/classifier-dscp.conf`, `cos/classifier-dscp-ipv6.conf`) + all rewrites
  (`cos/rewrite-ieee-802.1.conf`, `cos/rewrite-exp.conf`, `cos/rewrite-dscp.conf`,
  `cos/rewrite-dscp-ipv6.conf`) + the relevant `cos/cos-binding-*.conf`
- **Low-latency fronthaul CoS binding** → `evo/cos/cos-binding-l2-fronthaul-static.conf`
  (static FC-LLQ) or `evo/cos/cos-binding-l2-fronthaul.conf` (802.1p) +
  `evo/cos/schedulers-low-latency.conf` + `evo/firewall/filter-mf-ecpri-fronthaul.conf`
- **OAM/CFM** → `evo/oam/cfm-maintenance-domain.conf`
- **Firewall / MF classification** → `firewall/filter-mfc-ipv4-l3vpn-irb.conf` +
  `firewall/filter-mfc-ipv6-l3vpn-irb.conf` (L3VPN IRB) or
  `evo/firewall/filter-mf-ecpri-fronthaul.conf` (eCPRI fronthaul)
- **Load-balancing** → `policy/pplb.conf` + `transport/load-balance-pplb.conf` +
  `evo/transport/forwarding-options-hash.conf` (EVO)
