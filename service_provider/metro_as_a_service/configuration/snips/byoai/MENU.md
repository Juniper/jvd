# BYOAI menu — what the Metro-as-a-Service JVD assistant can do

This is the catalog of services the assistant can build. The assistant
walks you through a short funnel — **Service Profile → Deployment →
Attributes → Values** — and only offers choices valid for your earlier
picks. You can also state a full intent in one line (e.g. "multihomed
color-aware EVPL over EVPN-VPWS") and it will skip ahead.

The MEF service model (mirrors the "Metro as a Service Customization"
taxonomy):

```
Service Profile        Deployment                     Attributes
──────────────         ──────────                     ──────────
E-Line   EPL/EVPL      EVPN-VPWS, L2VPN, L2Circuit,    Homing (single / A-A ESI)
E-LAN    EP/EVP-LAN    BGP-VPLS, EVPN-FXC, Floating PW Color (aware / blind)
E-Tree   EP/EVP-Tree   EVPN E-Tree                     Class of Service (on / off)
E-Access (hand-off)    EVPN-VPWS-LSW, L2Circuit-LSW,   VLAN manip (none/map/QinQ)
                       Bridge-domain-LSW
```

## E-Line (point-to-point)

- `EVPL EVPN-VPWS` — VLAN-based EVPN-signalled point-to-point (modern default)
- `EPL EVPN-VPWS` — full-port EVPN-VPWS (EVO)
- `EVPL Kompella L2VPN` — BGP-signalled pseudowire, RFC 4761
- `EPL Kompella L2VPN` — full-port Kompella L2VPN
- `EVPL BGP-VPLS point-to-point` — P2P delivered over BGP-VPLS
- `EVPL L2Circuit floating pseudowire` — static PW on a `ps` anchor (Junos head + EVO tail)
- `EVPL L2Circuit hot-standby` — primary + backup PW (EVO)
- `EVPL EVPN-FXC vlan-unaware` — many UNIs bundled under one EVPN-VPWS
- `EVPL EVPN-FXC vlan-aware` — FXC with per-VLAN awareness (EVO)
- `EVPL EVPN floating pseudowire` — EVPN-ELAN landing on a floating PW (Junos)

## E-LAN (multipoint)

- `EVP-LAN EVPN-ELAN` — VLAN-based EVPN MAC-VRF / virtual-switch
- `EP-LAN EVPN-ELAN` — full-port EVPN-ELAN
- `EVP-LAN EVPN-ELAN with IRB (Type-5 / L3)` — adds anycast IRB + EVPN Type-5
- `EVP-LAN EVPN-ELAN vlan-bundle` — bundle several VLANs into one EVI (EVO)
- `EVP-LAN BGP-VPLS` — multipoint VPLS over BGP (EVO)

## E-Tree (rooted-multipoint)

- `EVP-Tree EVPN E-Tree` — root/leaf AC-role segregation (Junos)

## Access E-Line (E-Access hand-off)

- `EVPN-VPWS local-switch` — QinQ access hand-off via EVPN-VPWS (EVO)
- `L2Circuit local-switch` — QinQ access cross-connect (EVO)
- `Bridge-domain local-switch` — QinQ bridge-domain hand-off (Junos)

## Service attributes (offered per service)

- `single-homed` / `multihomed` (all-active ESI across two PEs)
- `color-aware` (Junos UNIs) / `color-blind`
- `with CoS` (classifiers + scheduler-map) / service-only
- VLAN manipulation: `none` / `vlan-map` (translation) / `qinq` (S-VLAN push)

## Add / audit / explain

- `Add CoS to <device>` — attach the CoS binding + scheduler-map
- `Add a UNI firewall filter to <device>` — color-aware or color-blind policer
- `Which interface snips are ESI-multihomed vs single-homed?`
- `Diff the EVO and Junos schedulers`
- `Compare EVPN-VPWS vs Kompella L2VPN for E-Line`

Don't see what you need? Describe it and the assistant will tell you
whether the Metro-as-a-Service JVD covers it.
