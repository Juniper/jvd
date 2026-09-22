# Auto-fill Defaults

This file is part of the [BYOAI](README.md) corpus. It defines the deterministic JVD lab-default values the AI uses when the user picks `auto` mode (or short-circuits with `all defaults` / `skip`). Bundled into [`jvd-mebs-snips.md`](jvd-mebs-snips.md) by `regenerate-bundle.sh`.

Every value comes from an IETF documentation range or a private/reserved range so the output is visibly safe to share.

## Address space

| Item | Value | Source |
|---|---|---|
| PE loopback v4 | `192.0.2.<pe-id>/32` | RFC 5737 (TEST-NET-1) |
| PE loopback v6 | `2001:db8:0::<pe-id>/128` | RFC 3849 |
| PE-PE core links | `198.51.100.<2*link-id>/31` | RFC 5737 (TEST-NET-2) |
| PE-CE links | `198.51.100.<128 + 2*site-id>/31` | RFC 5737 (TEST-NET-2) |
| Customer prefixes | `203.0.113.<seq>.0/24`, carve `/28` per VRF site | RFC 5737 (TEST-NET-3) |

## Autonomous systems

| Item | Value |
|---|---|
| PE iBGP AS | `65000` (RFC 6996 private 2-byte) |
| RD / RT namespace AS | `64512` (deliberately distinct from BGP AS so RD/RT are visibly different) |
| CE eBGP AS | `65001 + (vrf-id mod 1000)` |

## Routing / transport

- IGP: ISIS L2-only, area `49.0001`
- Route-Reflector: first PE in the device list — supplies `$RR1_V4`
- `$RR2_V4`: **ask**. The deployed overlay peers with a redundant RR pair and this
  JVD defines no rule for the second address. Do not synthesize one and do not
  reuse `$RR1_V4`. (With a single-device request neither RR is derivable — ask.)
- SRGB: literal — keep as in `transport/mpls-segment-routing.conf`
- Admin groups: literal — keep as in `transport/mpls-segment-routing.conf`
- Flex-algo: `128` (gold), `129` (bronze) — literal

## L3VPN VRF (vrf-id N, sequential from 2001 unless overridden)

- Instance name: `METRO_BGPv4_L3VPN_<N>`
- Route distinguisher: `64512:<N>`
- Route target: `target:64512:<N>`
- RT community name: `METRO_BGPv4_L3VPN_<N>` (matches JVD snip pattern)
- AC interface unit: `<N>`

## EVPN-VPWS service (svc-id S, sequential from 4001)

- Instance name: `EVPN_VPWS_<S>`
- VPWS service-id: `<S>`
- AC interface unit: `<S>`
- ESI: see **ESI** below (service id = `<S>`)

## EVPN-ELAN service (vlan V, sequential from 2001; skip 1, 1002–1005, 4094)

- Instance name: `EVPN_ELAN_<V>`
- EVI / VNI: `<V>`
- AC interface unit: `<V>`
- ESI: see **ESI** below (service id = `<V>`)

## ESI (every EVPN service with a multi-homed attachment circuit)

Applies wherever a snip consumes `$ESI` — EVPN-VPWS, EVPN-ELAN (vlan-based,
vlan-bundle, IRB, port-based), EVPN-FXC and EVPN E-Tree root UNIs alike.

- ESI: `00:11:22:33:44:55:66:<Sh>:<Sm>:<Sl>` where `<Sh>:<Sm>:<Sl>` are the three
  bytes of `(service id - base + 1)`, using that service's own base (`4001` for
  EVPN-VPWS, `2001` for EVPN-ELAN). Clearly synthetic.
- The same ESI value MUST appear on every PE sharing that attachment circuit;
  the bundle device carries no ESI, the logical interface does.

## L2Circuit

- `virtual-circuit-id`: `<V>`
- AC interface unit: `<V>`

## Service attachment inputs (ask — never auto-filled)

Physical attachment identity is deployment-specific: it is not derivable from the
snip library, the service id or the device name. In `auto` mode these are the
values that still require a question. Ask for all of the ones the selected snips
need in a single batch, then generate.

Never invent a port, PIC, bundle or LACP identity, and never answer a missing
value with the "cannot generate this from the snip library" refusal — that
sentence is reserved for a service or form the library does not contain.

| Variable | Ask for |
|---|---|
| `$IFD` | Parent interface / bundle carrying the UNI (e.g. `ae11`) |
| `$AC_INTF` | Attachment-circuit interface; `<ifd>.<unit>` where a unit applies |
| `$UNI_INTF` | Physical UNI port (port-based and E-Tree forms) |
| `$PS_INTF` | Pseudowire-subscriber anchor interface (floating PW) |
| `$ANCHOR_PIC` | PIC hosting that anchor (floating PW) |
| `$LACP_SYS_ID` | LACP system-id of the multi-homed bundle |
| `$INPUT_VID` | Customer-facing input VLAN, when it differs from the service VLAN |

Derivable, so do **not** ask: `$UNIT` and `$VLAN` follow the per-service rules
above once the user has given a service id or VLAN. `$INPUT_VID` equals that
VLAN only when the selected snip performs no VLAN translation — otherwise ask.

Any other physical attachment identifier with no rule in this file is
ask-required by default.

## OAM (Y.1731 CFM)

- Maintenance domain: `MD_64512`
- Level: `5`
- MA name: `<V>` or `<S>`
- MEP local: `1000 + (PE index in the service)`
- MEP remote: `1000 + (other PE index)`
- SLA iterator profile: `2WD-P3` (literal — JVD constant)

## CoS / firewall

- `scheduler-map`: `5G_SCHEDULER` on every edge LAG (literal — JVD constant)
- Default UNI policer: `50mbps_policer` (literal — JVD constant)
- Forwarding-classes: 6-class model (literal — JVD constant)

## Device selection

- If the user names devices → use them verbatim and infer the OS family from the model code in the hostname.
- Else if `EVO`: `ma3_acx7100-48l` + `meg1_acx7100-32c`
- Else if `JUNOS`: `mse1_mx304` + `ma4_mx204`
- Else if `MIXED`: `mse1_mx304` (Junos) + `ma3_acx7100-48l` (EVO)
- Else: ask before continuing.

Valid device names are those that appear in any snip's `Seen on:` header. If the user supplies a name not in `Seen on:`, accept it but warn in the Notes that the generated config is by-pattern, not validated against that specific device.

## Scale

No hard cap on counts. If the user asks for >500 of any entity, emit a one-line "this will be a lot of output" warning in the Notes but still produce the full config.
