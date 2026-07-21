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
