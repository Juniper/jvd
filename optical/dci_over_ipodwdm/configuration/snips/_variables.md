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
