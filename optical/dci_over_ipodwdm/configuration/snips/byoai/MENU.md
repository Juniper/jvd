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
