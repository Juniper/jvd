# Auto-fill defaults — DCI over IPoDWDM

Deterministic JVD lab values for `auto` mode and short-circuits. Every value below
is taken from the validated `configuration/conf/*.conf` device configs — do NOT
invent alternatives. Always echo the values you used in the output `Inputs used:`
block so the user can rerun with edits.

---

## Devices (`Seen on:` names)

| Shortcut | Devices | OS / tree |
|----------|---------|-----------|
| `EVO` | `dci1_ptx10001-36mr`, `dci3_acx7100-48l` | Junos OS Evolved → `evo/` |
| `MX`  | `dci2_mx304` | Junos OS → `junos/` |
| `ALL` | all three | mixed |

Single device: any one name above (or a user-supplied hostname + OS).
Default device selection when unspecified: `EVO`.

## Per-device loopback (router-id, from configs)

| Device | lo0 (`lo0.0`) |
|--------|---------------|
| `dci1_ptx10001-36mr` | `10.1.1.1/32` |
| `dci2_mx304` | `10.1.1.2/32` |
| `dci3_acx7100-48l` | `11.1.1.3/32` |

`$LO_UNIT` default `0`.

## Coherent optics (from configs)

- `$COHERENT_IFD`: first coherent member default `et-0/0/8` (EVO) / `et-0/0/6` (MX)
- `$AE_BUNDLE`: default `ae12` (second bundle `ae13`)
- `$WAVELENGTH` (nm) — validated channel plan, assign in order:
  `1547.12`, `1547.72`, `1548.31`, `1550.12`, `1552.52`

When the user wants N coherent members, assign successive wavelengths from the
list above and alternate/extend AE membership per the plan. If N is unspecified,
default to **1** and note it in Inputs Used.

## DWDM aggregated-ethernet bundle

- `$MIN_LINKS`: `1`
- `$MAX_LABELS`: `5`
- `$AE_IPV4` (point-to-point /30): default `10.12.1.1/30` (the peer router takes
  the other host address in the same /30)
- `$DEVICE_COUNT` (aggregated-devices): `10`

## MX port channelization (Junos only — `dci2_mx304`)

- `$FPC`: `0`  ·  `$PIC`: `0`  ·  `$PORT`: `1`
- `$NUM_SUB_PORTS`: `4`  ·  `$PORT_SPEED`: `10g`
- Non-channelized ports use `speed` alone (e.g. `400g`); omit `number-of-sub-ports`.

## Fallbacks

- Unspecified coherent-member count → 1.
- Unspecified device → `EVO`.
- Unspecified form → `as-deployed` for a core-link turn-up, `minimum` for a
  single-feature request.
- Every auto-filled value MUST be listed in `Inputs used:`.
