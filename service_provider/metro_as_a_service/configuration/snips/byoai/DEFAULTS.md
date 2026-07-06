# Auto-fill Defaults — Metro-as-a-Service

This file is part of the [BYOAI](README.md) corpus. It defines the
deterministic JVD lab-default values the AI uses when the user picks
`auto` mode (or short-circuits with `all defaults` / `skip`). Bundled
into [`jvd-maas-snips.md`](jvd-maas-snips.md) by `regenerate-bundle.sh`.

Every value comes from an IETF documentation range or a private/reserved
range so the output is visibly safe to share.

## Service identifiers (svc-id S, sequential from 4001)

MaaS instance names encode the MEF service group. Use this shape:

| Item | Value | Notes |
|---|---|---|
| Instance name | `<kind>_group_<S>` | e.g. `evpn_group_edge_4001`, `vpls_group_4001`, `evpn_group_80_4080` (E-Tree) |
| Route-distinguisher | `10.0.0.<pe-id>:<S>` | per-PE loopback-style RD; differs per PE |
| Route-target (`vrf-target`) | `63535:<S>` | shared across both PEs of the service |
| VLAN | `<S>` | e.g. `4001` |
| AC interface unit | `<S>` (vlan-based) or `0` (port-based) | |
| vpws-service-id | local `1`, remote `2` (mirror on the far PE) | EVPN-VPWS |
| Bandwidth-profile RT community | `METRO_L3VPN_<S>` | Type-5 / L3 services |

Sequence for N services: increment S by 1 each (`4001`, `4002`, …). The
E-Tree JVD example uses the `80` sub-group (`evpn_group_80_4080`); keep
that shape for E-Tree.

## Attachment circuits

| Item | Value | Source |
|---|---|---|
| AC interface (EVO) | `et-0/0/13` | from snip examples |
| AC interface (Junos MX) | `ae10` (LAG) or `xe-0/1/4` | from snip examples |
| Physical MTU | `9192` | JVD constant |
| Inner/customer VLAN (`$LOCAL_VID`/`$REMOTE_VID`) | `1` / `2` | VPWS service-id |
| VLAN-map translate (`$INPUT_VID`) | `<S>` | |

## ESI (multihomed / all-active)

- `$ESI_ID` = `00:81:10:<Sh>:<Sm>:<Sl>:10:10:10:01` where `<Sh>:<Sm>:<Sl>`
  encode the service-id — clearly synthetic. **The same ESI value is
  shared by both PEs** of a multihomed service; single-homed services
  omit ESI entirely.

## Addressing (Type-5 / IRB and LSW hand-off)

| Item | Value | Source |
|---|---|---|
| IRB / gateway address | `198.51.100.1/27` | RFC 5737 (TEST-NET-2) |
| Public customer prefix | `203.0.113.0/24` | RFC 5737 (TEST-NET-3) |
| Router-id | `10.0.0.<pe-id>` | loopback-style |
| Virtual-gateway address / MAC | `198.51.100.1` / `00:01:33:44:11:11` | from snip examples |

## Autonomous systems / RD-RT namespace

| Item | Value |
|---|---|
| RD/RT namespace AS | `63535` (2-byte, RFC 6996 private) |
| VC-id (`$VC_ID`, L2Circuit) | `<S>` |
| Kompella site-id / remote-site-id | `1` / `2` (mirror across PEs) |

## CoS / firewall (literal — JVD constants)

- Forwarding-classes: MaaS 8021p class model (literal — keep as in
  `cos/forwarding-classes.conf`).
- `scheduler-map`: keep the name as in `cos/scheduler-map.conf`.
- Filter names: `$FILTER_NAME` templates the `filter X { }` declaration.
  Default to `f_<service>_<colormode>` (e.g. `f_port_based_fam_ccc`) —
  keep whatever the chosen filter snip's example shows unless the user
  supplies a name.
- Apply-group names (`MEF-TESTING`, `MEF-FORWARDING-PROFILE`) are literal.

## Device selection

- If the user names devices → use them verbatim; infer OS from the
  platform code (MX/ACX5xxx/ACX710 = Junos; ACX7xxx = EVO).
- Else if `EVO`: `MA3 (ACX7100-48L)` + `MEG1 (ACX7100-32C)`
- Else if `JUNOS`: `MSE1 (MX304)` + `MA4 (MX204)`
- Else if `MIXED`: `MSE1 (MX304, Junos)` + `MA3 (ACX7100-48L, EVO)`
- Else: ask before continuing.

Devices observed in this JVD's snip `Seen on:` headers:

| OS | Devices (platform) |
|---|---|
| Junos | MSE1/MSE2 (MX304), AN1/MA4/MA5 (MX204), AN2 (ACX5448), AN4 (ACX710) |
| EVO | MA3/AN3 (ACX7100-48L), MEG1 (ACX7100-32C), MEG2 (ACX7509), MA1.x (ACX7024) |

If the user supplies a device not in any `Seen on:` header, accept it
but warn in Notes that the config is by-pattern, not validated on that
specific device.

## Scale

No hard cap on counts. If the user asks for >500 of any entity, emit a
one-line "this will be a lot of output" warning in Notes but still
produce the full config.
