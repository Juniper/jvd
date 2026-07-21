# JVD Metro-as-a-Service snippet library

## evo/chassis/aggregated-devices.conf

```
/*
 * Topic:   Enable aggregated-ethernet (chassis device-count)
 * Variant: Junos OS Evolved
 * Seen on:
 *   Junos: (none)
 *   EVO:   dci1_ptx10001-36mr dci3_acx7100-48l
 *
 * Highlights:
 *  - Reserves the pool of ae interfaces the DWDM bundles are built from.
 *  - `device-count` must be at least as large as the highest ae unit used.
 *
 * Pair with:
 *  - evo/interfaces/dwdm-ae-bundle.conf   (the bundles this enables)
 *  - evo/interfaces/coherent-optics-port.conf   (the member ports)
 *
 * Variables (example values from dci1_ptx10001-36mr):
 *   $DEVICE_COUNT   e.g. 10
 */
chassis {
    aggregated-devices {
        ethernet {
            device-count $DEVICE_COUNT;
        }
    }
}
```

## evo/interfaces/coherent-optics-port.conf

```
/*
 * Topic:   Coherent 400G DWDM interface (optics-options / wavelength)
 * Variant: Junos OS Evolved
 * Seen on:
 *   Junos: (none)
 *   EVO:   dci1_ptx10001-36mr dci3_acx7100-48l
 *
 * Highlights:
 *  - This is the heart of the IPoDWDM (CORA) design: the router's built-in
 *    Juniper 400G Coherent Optic (JCO400-QDD-ZR-M-HP / QDD-400G-ZR-M-HP)
 *    connects directly to the DWDM line system, so no external transponder
 *    is needed.
 *  - `optics-options wavelength` tunes the transceiver to the ITU C-band
 *    wavelength (nm) assigned to this channel by the OLS/ROADM plan.
 *  - On EVO platforms (PTX/ACX) the coherent port uses `ether-options` for
 *    LAG membership. For a channelized port, configure optics-options on the
 *    first sub-port (et-x/y/z:0), not the parent.
 *  - Repeat the interface block per coherent member; each member carries a
 *    distinct wavelength multiplexed onto the fiber pair.
 *
 * Pair with:
 *  - evo/interfaces/dwdm-ae-bundle.conf     (the AE these members join)
 *  - evo/chassis/aggregated-devices.conf    (enables aggregated-ethernet)
 *
 * Variables (example values from dci1_ptx10001-36mr):
 *   $COHERENT_IFD   e.g. et-0/0/8
 *   $AE_BUNDLE      e.g. ae12
 *   $WAVELENGTH     e.g. 1547.12
 */
interfaces {
    $COHERENT_IFD {
        ether-options {
            802.3ad $AE_BUNDLE;
        }
        optics-options {
            wavelength $WAVELENGTH;
        }
    }
}
```

## evo/interfaces/dwdm-ae-bundle.conf

```
/*
 * Topic:   DWDM aggregated-ethernet bundle (LACP + inet/mpls core link)
 * Variant: Junos OS Evolved
 * Seen on:
 *   Junos: (none)
 *   EVO:   dci1_ptx10001-36mr dci3_acx7100-48l
 *
 * Highlights:
 *  - Bundles the coherent 400G members into a single logical DCI core link.
 *  - `minimum-links 1` keeps the bundle up while at least one wavelength is
 *    healthy; `lacp active periodic fast` gives sub-second member detection.
 *  - unit 0 carries the IP core: `family inet` for the point-to-point address
 *    and `family mpls maximum-labels` for the transport label stack.
 *  - Add each coherent member with evo/interfaces/coherent-optics-port.conf.
 *
 * Pair with:
 *  - evo/interfaces/coherent-optics-port.conf   (the member ports)
 *  - evo/chassis/aggregated-devices.conf        (enables aggregated-ethernet)
 *  - evo/interfaces/loopback.conf               (router-id reached over this link)
 *
 * Variables (example values from dci1_ptx10001-36mr):
 *   $AE_BUNDLE      e.g. ae12
 *   $MIN_LINKS      e.g. 1
 *   $AE_IPV4        e.g. 10.12.1.1/30
 *   $MAX_LABELS     e.g. 5
 */
interfaces {
    $AE_BUNDLE {
        aggregated-ether-options {
            minimum-links $MIN_LINKS;
            lacp {
                active;
                periodic fast;
            }
        }
        unit 0 {
            family inet {
                address $AE_IPV4;
            }
            family mpls {
                maximum-labels $MAX_LABELS;
            }
        }
    }
}
```

## evo/interfaces/loopback.conf

```
/*
 * Topic:   Loopback lo0 addressing (router-id)
 * Variant: Junos OS Evolved
 * Seen on:
 *   Junos: (none)
 *   EVO:   dci1_ptx10001-36mr dci3_acx7100-48l
 *
 * Highlights:
 *  - lo0.0 is the router-id / control-plane address for each DCI router.
 *  - Used as the BGP/MPLS endpoint for the transport underlay between the
 *    DCI routers.
 *
 * Pair with:
 *  - evo/interfaces/dwdm-ae-bundle.conf   (the core link that reaches lo0)
 *
 * Variables (example values from dci1_ptx10001-36mr):
 *   $LO_UNIT   e.g. 0
 *   $LO_IPV4   e.g. 10.1.1.1/32
 */
interfaces {
    lo0 {
        unit $LO_UNIT {
            family inet {
                address $LO_IPV4;
            }
        }
    }
}
```

## junos/chassis/aggregated-devices.conf

```
/*
 * Topic:   Enable aggregated-ethernet (chassis device-count)
 * Variant: Junos OS
 * Seen on:
 *   Junos: dci2_mx304
 *   EVO:   (none)
 *
 * Highlights:
 *  - Reserves the pool of ae interfaces the DWDM bundles are built from.
 *  - `device-count` must be at least as large as the highest ae unit used.
 *
 * Pair with:
 *  - junos/interfaces/dwdm-ae-bundle.conf   (the bundles this enables)
 *  - junos/interfaces/coherent-optics-port.conf   (the member ports)
 *
 * Variables (example values from dci2_mx304):
 *   $DEVICE_COUNT   e.g. 10
 */
chassis {
    aggregated-devices {
        ethernet {
            device-count $DEVICE_COUNT;
        }
    }
}
```

## junos/chassis/port-channelization.conf

```
/*
 * Topic:   Port speed / channelization (chassis fpc-pic-port)
 * Variant: Junos OS
 * Seen on:
 *   Junos: dci2_mx304
 *   EVO:   (none)
 *
 * Highlights:
 *  - On MX (Junos) the rate and breakout of a physical port are set under
 *    `chassis` per fpc/pic/port, NOT on the interface (EVO differs).
 *  - `speed` selects the port rate (10g/100g/400g); `number-of-sub-ports`
 *    channelizes the port into that many sub-ports (omit for a non-
 *    channelized port — configure `speed` alone).
 *  - For a coherent 400G DWDM port, pair this with the interface-level
 *    optics-options in junos/interfaces/coherent-optics-port.conf.
 *
 * Pair with:
 *  - junos/interfaces/coherent-optics-port.conf   (the tuned coherent port)
 *
 * Variables (example values from dci2_mx304 — fpc 0 / pic 0 / port 1):
 *   $FPC              e.g. 0
 *   $PIC              e.g. 0
 *   $PORT             e.g. 1
 *   $NUM_SUB_PORTS    e.g. 4
 *   $PORT_SPEED       e.g. 10g
 */
chassis {
    fpc $FPC {
        pic $PIC {
            port $PORT {
                number-of-sub-ports $NUM_SUB_PORTS;
                speed $PORT_SPEED;
            }
        }
    }
}
```

## junos/interfaces/coherent-optics-port.conf

```
/*
 * Topic:   Coherent 400G DWDM interface (optics-options / wavelength)
 * Variant: Junos OS
 * Seen on:
 *   Junos: dci2_mx304
 *   EVO:   (none)
 *
 * Highlights:
 *  - This is the heart of the IPoDWDM (CORA) design: the router's built-in
 *    Juniper 400G Coherent Optic (JCO400-QDD-ZR-M-HP / QDD-400G-ZR-M-HP)
 *    connects directly to the DWDM line system, so no external transponder
 *    is needed.
 *  - `optics-options wavelength` tunes the transceiver to the ITU C-band
 *    wavelength (nm) assigned to this channel by the OLS/ROADM plan.
 *  - On Junos MX the coherent port uses `gigether-options` for LAG
 *    membership (EVO uses `ether-options`). Channelization (speed +
 *    number-of-sub-ports) is set under `chassis` on MX — see
 *    junos/chassis/port-channelization.conf.
 *  - Repeat the interface block per coherent member; each member carries a
 *    distinct wavelength multiplexed onto the fiber pair.
 *
 * Pair with:
 *  - junos/interfaces/dwdm-ae-bundle.conf      (the AE these members join)
 *  - junos/chassis/aggregated-devices.conf     (enables aggregated-ethernet)
 *  - junos/chassis/port-channelization.conf    (rate/breakout on MX)
 *
 * Variables (example values from dci2_mx304):
 *   $COHERENT_IFD   e.g. et-0/0/6
 *   $AE_BUNDLE      e.g. ae12
 *   $WAVELENGTH     e.g. 1547.12
 */
interfaces {
    $COHERENT_IFD {
        gigether-options {
            802.3ad $AE_BUNDLE;
        }
        optics-options {
            wavelength $WAVELENGTH;
        }
    }
}
```

## junos/interfaces/dwdm-ae-bundle.conf

```
/*
 * Topic:   DWDM aggregated-ethernet bundle (LACP + inet/mpls core link)
 * Variant: Junos OS
 * Seen on:
 *   Junos: dci2_mx304
 *   EVO:   (none)
 *
 * Highlights:
 *  - Bundles the coherent 400G members into a single logical DCI core link.
 *  - `minimum-links 1` keeps the bundle up while at least one wavelength is
 *    healthy; `lacp active periodic fast` gives sub-second member detection.
 *  - unit 0 carries the IP core: `family inet` for the point-to-point address
 *    and `family mpls maximum-labels` for the transport label stack.
 *  - Add each coherent member with junos/interfaces/coherent-optics-port.conf.
 *
 * Pair with:
 *  - junos/interfaces/coherent-optics-port.conf   (the member ports)
 *  - junos/chassis/aggregated-devices.conf        (enables aggregated-ethernet)
 *  - junos/interfaces/loopback.conf               (router-id reached over this link)
 *
 * Variables (example values from dci2_mx304):
 *   $AE_BUNDLE      e.g. ae12
 *   $MIN_LINKS      e.g. 1
 *   $AE_IPV4        e.g. 10.12.1.2/30
 *   $MAX_LABELS     e.g. 5
 */
interfaces {
    $AE_BUNDLE {
        aggregated-ether-options {
            minimum-links $MIN_LINKS;
            lacp {
                active;
                periodic fast;
            }
        }
        unit 0 {
            family inet {
                address $AE_IPV4;
            }
            family mpls {
                maximum-labels $MAX_LABELS;
            }
        }
    }
}
```

## junos/interfaces/loopback.conf

```
/*
 * Topic:   Loopback lo0 addressing (router-id)
 * Variant: Junos OS
 * Seen on:
 *   Junos: dci2_mx304
 *   EVO:   (none)
 *
 * Highlights:
 *  - lo0.0 is the router-id / control-plane address for each DCI router.
 *  - Used as the BGP/MPLS endpoint for the transport underlay between the
 *    DCI routers.
 *
 * Pair with:
 *  - junos/interfaces/dwdm-ae-bundle.conf   (the core link that reaches lo0)
 *
 * Variables (example values from dci2_mx304):
 *   $LO_UNIT   e.g. 0
 *   $LO_IPV4   e.g. 10.1.1.2/32
 */
interfaces {
    lo0 {
        unit $LO_UNIT {
            family inet {
                address $LO_IPV4;
            }
        }
    }
}
```

## _variables.md

# Snip Variable Reference — Data Center Interconnect over IPoDWDM

Variables used across the `dci_over_ipodwdm` snip library. Replace
`$VARIABLE` placeholders with site-specific values when adapting snips to a new
deployment. Values that are deployment topology (wavelengths, addresses, AE
units) are always variables; there are no JVD-wide literal constants in this
library.

This JVD spans **both operating systems**: `dci1_ptx10001-36mr` (PTX10001-36MR)
and `dci3_acx7100-48l` (ACX7100-48L) run **Junos OS Evolved** (`evo/`), while
`dci2_mx304` (MX304) runs **Junos OS** (`junos/`). Where a stanza is identical on
both OSes it appears in each tree; where syntax differs (LAG membership uses
`ether-options` on EVO vs `gigether-options` on Junos; port channelization lives
under `chassis` on MX) the snips differ accordingly.

This library focuses on the **CORA / IPoDWDM transport layer** — the coherent
400G optics, DWDM aggregated-ethernet core links, and the chassis enablement
they need. The routing/underlay (BGP, MPLS/RSVP, VRF) used in the test bed is
deployment-specific scaffolding and is out of scope; see the full sanitized
device configs under [configuration/conf/](https://github.com/Juniper/jvd/tree/main/optical/dci_over_ipodwdm/configuration/conf).

## Coherent optics

| Variable | Example | Used in |
|----------|---------|---------|
| `$COHERENT_IFD` | `et-0/0/8` | coherent-optics-port |
| `$WAVELENGTH` | `1547.12` | coherent-optics-port |
| `$AE_BUNDLE` | `ae12` | coherent-optics-port, dwdm-ae-bundle |

## Port channelization (Junos / MX)

| Variable | Example | Used in |
|----------|---------|---------|
| `$FPC` | `0` | port-channelization |
| `$PIC` | `0` | port-channelization |
| `$PORT` | `1` | port-channelization |
| `$NUM_SUB_PORTS` | `4` | port-channelization |
| `$PORT_SPEED` | `10g` | port-channelization |

## DWDM aggregated-ethernet bundle

| Variable | Example | Used in |
|----------|---------|---------|
| `$MIN_LINKS` | `1` | dwdm-ae-bundle |
| `$AE_IPV4` | `10.12.1.1/30` | dwdm-ae-bundle |
| `$MAX_LABELS` | `5` | dwdm-ae-bundle |
| `$DEVICE_COUNT` | `10` | aggregated-devices |

## Interfaces

| Variable | Example | Used in |
|----------|---------|---------|
| `$LO_UNIT` | `0` | loopback |
| `$LO_IPV4` | `10.1.1.1/32` | loopback |

## Device inventory

| Device | Platform | OS | lo0 |
|--------|----------|----|-----|
| `dci1_ptx10001-36mr` | PTX10001-36MR | Junos OS Evolved 24.2R2 | `10.1.1.1/32` |
| `dci2_mx304` | MX304 | Junos OS 24.2R2 | `10.1.1.2/32` |
| `dci3_acx7100-48l` | ACX7100-48L | Junos OS Evolved 24.2R2 | `11.1.1.3/32` |

Coherent transceivers validated: **JCO400-QDD-ZR-M-HP** and **QDD-400G-ZR-M-HP**
(amplified and unamplified use cases), over an ADTRAN FSP3000C open line system.

## byoai/MENU.md

# Data Center Interconnect over IPoDWDM — BYOAI menu

Browser-facing catalog of what this JVD assistant can generate and explain. This
is the human-readable companion to the machine bundle (`jvd-dci-ipodwdm-snips.md`)
the AI actually loads.

This JVD validates **Converged Optical Routing Architecture (CORA)** — Data Center
Interconnect over IPoDWDM using Juniper 400G Coherent Optics directly in the
router (no external transponder), over an ADTRAN open line system. Three DCI edge
routers are validated: **PTX10001-36MR** and **ACX7100-48L** (Junos OS Evolved)
and **MX304** (Junos OS).

---

## Two modes

- **Configuration mode** — generate validated Junos / Junos Evolved config from
  the 9 snips below. Strict: only validated patterns, no invented syntax.
- **Design mode** — explore the architecture, grounded in the JVD documentation
  corpus (datasheet / design guide / solution overview / test report brief), with
  citations.

## Configuration catalog (9 snips, two OS trees)

| Feature | Snip | Seen on |
|---------|------|---------|
| Coherent 400G optics port (EVO) | `evo/interfaces/coherent-optics-port.conf` | dci1, dci3 |
| Coherent 400G optics port (Junos) | `junos/interfaces/coherent-optics-port.conf` | dci2 |
| DWDM aggregated-ethernet bundle (EVO) | `evo/interfaces/dwdm-ae-bundle.conf` | dci1, dci3 |
| DWDM aggregated-ethernet bundle (Junos) | `junos/interfaces/dwdm-ae-bundle.conf` | dci2 |
| aggregated-devices (EVO) | `evo/chassis/aggregated-devices.conf` | dci1, dci3 |
| aggregated-devices (Junos) | `junos/chassis/aggregated-devices.conf` | dci2 |
| Port channelization (Junos / MX) | `junos/chassis/port-channelization.conf` | dci2 |
| Loopback lo0 (EVO) | `evo/interfaces/loopback.conf` | dci1, dci3 |
| Loopback lo0 (Junos) | `junos/interfaces/loopback.conf` | dci2 |

### Common tasks

- **Bring up a coherent DWDM interconnect** → `dwdm-core-link` (as-deployed:
  aggregated-devices + coherent ports + AE bundle + loopback; MX adds
  port-channelization).
- **Tune a coherent 400G port to a wavelength** → `coherent-optics`.
- **Build the aggregated-ethernet core link** → `dwdm-ae-bundle`.
- **Rate/breakout an MX port** → `port-channelization` (Junos only).

### Devices

- `EVO` = `dci1_ptx10001-36mr` + `dci3_acx7100-48l` (Junos OS Evolved)
- `MX` = `dci2_mx304` (Junos OS)
- `ALL` = all three DCI edge routers

## Design catalog (ask me about…)

- **CORA / IPoDWDM** — coherent optics in the router, no external transponder.
- **Wavelength tuning** and the C-band channel plan.
- **Amplified vs unamplified (dark-fiber) links** — OSNR and chromatic-dispersion
  limits vs span-loss budget.
- The **ADTRAN open line system** and third-party OLS interop (≥75 GHz spacing).
- **Optical performance monitoring / telemetry** and TCAs.
- Platforms, coherent transceivers, and results from the **test report brief**.

---

*Not sure where to start? Ask for a "rundown of this JVD" and I'll summarise from
the datasheet.*

## byoai/TIERS.md

# Configuration form tiers — DCI over IPoDWDM

Maps each **feature** the user can ask for to the **snip set** to emit for
`minimum` vs `as-deployed`. Slugs are paths under `snips/`. Read this alongside
the snip bodies. Emit exactly the listed snips for the chosen tier — and only
those — unless the user asks for more.

This JVD spans **two OS trees**. Use `evo/` snips for `dci1_ptx10001-36mr` and
`dci3_acx7100-48l` (Junos OS Evolved); use `junos/` snips for `dci2_mx304`
(Junos OS). The tables below list the EVO path; substitute the matching `junos/`
path for the MX (the MX coherent port additionally supports port-channelization,
which EVO does not use).

---

## Feature: dwdm-core-link (bring up a coherent DWDM interconnect)

- **minimum**
  - `evo/interfaces/coherent-optics-port.conf`
  - `evo/interfaces/dwdm-ae-bundle.conf`
- **as-deployed**
  - `evo/chassis/aggregated-devices.conf`
  - `evo/interfaces/coherent-optics-port.conf`
  - `evo/interfaces/dwdm-ae-bundle.conf`
  - `evo/interfaces/loopback.conf`
  - *(MX only, additionally)* `junos/chassis/port-channelization.conf`

## Feature: coherent-optics (tune a coherent 400G port)

- **minimum**
  - `evo/interfaces/coherent-optics-port.conf`
- **as-deployed**
  - `evo/interfaces/coherent-optics-port.conf`
  - `evo/interfaces/dwdm-ae-bundle.conf`
  - `evo/chassis/aggregated-devices.conf`
  - *(MX only)* `junos/chassis/port-channelization.conf`

## Feature: dwdm-ae-bundle (the aggregated-ethernet core link)

- **minimum**
  - `evo/interfaces/dwdm-ae-bundle.conf`
- **as-deployed**
  - `evo/interfaces/coherent-optics-port.conf`
  - `evo/interfaces/dwdm-ae-bundle.conf`
  - `evo/chassis/aggregated-devices.conf`

## Feature: aggregated-devices (enable the ae pool)

- **minimum**
  - `evo/chassis/aggregated-devices.conf`
- **as-deployed**
  - `evo/chassis/aggregated-devices.conf`
  - `evo/interfaces/dwdm-ae-bundle.conf`

## Feature: port-channelization (MX rate / breakout — Junos only)

- **minimum**
  - `junos/chassis/port-channelization.conf`
- **as-deployed**
  - `junos/chassis/port-channelization.conf`
  - `junos/interfaces/coherent-optics-port.conf`

## Feature: loopback (lo0 router-id)

- **minimum**
  - `evo/interfaces/loopback.conf`
- **as-deployed**
  - `evo/interfaces/loopback.conf`
  - `evo/interfaces/dwdm-ae-bundle.conf`

---

### Notes for the assistant

- **Match the tree to the OS.** For MX targets, replace each `evo/…` slug with
  the corresponding `junos/…` slug (coherent-optics-port, dwdm-ae-bundle,
  aggregated-devices, loopback), and add `junos/chassis/port-channelization.conf`
  when the port is rate-selectable/channelized. EVO DWDM ports are used natively
  at 400G.
- **as-deployed always pulls the paired prerequisites** listed in each snip's
  `Pair with:` header. If you omit a paired snip, call it out in `Notes:`.
- A coherent DWDM core link is not usable until it has the tuned coherent members
  (`optics-options wavelength`), the AE bundle (LACP + inet/mpls), and the
  `aggregated-devices` chassis enablement.
- The **BGP / MPLS-RSVP / VRF underlay** is out of scope for this library. If the
  user asks for it, point them to the full device configs under
  `configuration/conf/`.

## byoai/DEFAULTS.md

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

## byoai/OUTPUT_FORMAT.md

# Output Format

This file is part of the [BYOAI](README.md) corpus. It defines the exact shape every generation must take. Bundled into [`jvd-dci-ipodwdm-snips.md`](jvd-dci-ipodwdm-snips.md) by `regenerate-bundle.sh`.

## 1. `Inputs used:` block (always first)

Every generation begins with a YAML comment block listing **every** value picked or accepted:

```yaml
# Inputs used:
# mode: auto                   # or "interview"
# form: as-deployed            # or "minimum"
# devices:
#   dci1: { name: <hostname>, os: evo, role: dci-edge, loopback4: <addr> }
#   dci2: { ... }
# features:
#   - { kind: <coherent-optics|dwdm-ae-bundle|port-channelization|aggregated-devices|loopback>,
#       coherent_ifd: <et-x/y/z>,     # coherent member interface
#       wavelength: <nm>,             # optics-options wavelength
#       ae_bundle: <aeN>,             # aggregated-ethernet unit
#       ae_ipv4: <addr/30>,           # core point-to-point address
#       min_links: <int>,             # AE minimum-links
#       max_labels: <int>,            # family mpls maximum-labels
#       device_count: <int>,          # chassis aggregated-devices count
#       fpc: <int>, pic: <int>, port: <int>,   # MX channelization
#       num_sub_ports: <int>, port_speed: <rate> }
# snips_used:
#   - evo/interfaces/coherent-optics-port.conf
#   - evo/interfaces/dwdm-ae-bundle.conf
#   - ...
```

This block makes every generation reproducible — the user can paste it back to regenerate the same output.

## 2. One fenced `text` block per device

Each device block starts with a `# device:` label and groups its snips with `/* snips/<path> */` section comments:

```text
# device: <hostname>
/* snips/<path-to-snip>.conf */
<rendered config block>

/* snips/<path-to-next-snip>.conf */
<rendered config block>
```

Drop the leading C-style `/* … */` documentation header from each snip when emitting. Keep one `/* snips/<path> */` line as the section comment. Use the correct tree for the device's OS: `evo/…` for PTX10001-36MR / ACX7100-48L, `junos/…` for MX304.

## 3. `Notes:` section (always last)

Bullets covering:

- Snips intentionally omitted (and why).
- Inputs defaulted because the user did not provide them.
- Cross-device / cross-wavelength consistency the user must verify:
  - Each coherent member's **wavelength** must match the OLS/ROADM channel plan; the two ends of a span must be tuned to the same channel.
  - Both ends of a **DWDM AE bundle** must agree on LACP and the point-to-point `/30`.
  - Each device has its own **lo0 router-id**.
- OS-tree reminders: coherent-port LAG membership is `ether-options` on EVO vs `gigether-options` on Junos (MX); MX port rate/breakout lives under `chassis` (`fpc/pic/port`), EVO uses the DWDM ports natively at 400G.
- Anything by-pattern rather than validated on that exact device (e.g., a user-supplied hostname not in any snip's `Seen on:` list).
- Out-of-scope: the BGP / MPLS-RSVP / VRF underlay is NOT in this library — point the user to `configuration/conf/` for the full validated device configs.

## Refusal

If the request cannot be fulfilled from the snip library, do not apologise. Say exactly:

```
I cannot generate this from the snip library because <one reason>.
```

…and stop.
