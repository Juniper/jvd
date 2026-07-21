# Datasheet — Data Center Interconnect over IPoDWDM

> Quick-reference for the Juniper Validated Design **JVD-OPTICS-BASE-01-01**
> (V1.0, July 2025). For the full narrative see [design-guide.md](design-guide.md),
> [solution-overview.md](solution-overview.md), and
> [test-report-brief.md](test-report-brief.md).

## What it is

Data Center Interconnect (DCI) built on **Converged Optical Routing Architecture
(CORA)** — high-capacity transport between data centers using **IP over DWDM
(IPoDWDM)**. Juniper 400G Coherent Optics plug directly into the router and
connect to the DWDM line system, eliminating the separate optical transponder.
IP and optical management operate as a single domain.

## Why it matters

- Lowers capex by removing external transponders
- Simplifies operations; IP and optical as one domain
- Lets the router monitor the DWDM link and make routing decisions on its health
- Lowers power consumption and speeds troubleshooting

## Validated platforms & software

| Role | Model | OS |
|------|-------|----|
| DCI-Edge1 | PTX10001-36MR | Junos OS Evolved 24.2R2 |
| DCI-Edge2 | MX304 | Junos OS 24.2R2 |
| DCI-Edge3 | ACX7100-48L | Junos OS Evolved 24.2R2 |

**Coherent transceivers:** JCO400-QDD-ZR-M-HP, QDD-400G-ZR-M-HP
(validated for both amplified and unamplified paths).
**Open Line System:** ADTRAN FSP3000C (amplifier AM-S23L, mux/demux RD-12RS).
Any third-party OLS with ≥75 GHz channel spacing for 400G coherent signals is
expected to interoperate.

## Key technical attributes validated

- **Amplified links:** minimum receive OSNR, maximum chromatic dispersion
- **Unamplified (dark-fiber) links:** Rx sensitivity / span-loss budget
- Telemetry & optical performance monitoring (streaming + NETCONF PM paths)
- Configurability across the C-band (frequency/wavelength sweep)
- TCA triggering; fiber-cut, reboot, and daemon-restart resiliency

## Scale (initial qualification)

- 100 RSVP-signalled MPLS LSPs between DCIs
- 100 VPNv4 routing instances
- 20,000 routes
- 100 eBGP sessions

## Configuration building blocks

The [snip library](../configuration/snips/) covers the IPoDWDM transport layer:

- **Coherent optics port** — `optics-options wavelength` on the built-in 400G
  coherent interface (EVO: `ether-options` LAG membership; Junos/MX:
  `gigether-options`)
- **Port channelization** (MX) — `chassis fpc/pic/port` speed + number-of-sub-ports
- **DWDM AE bundle** — LACP aggregated-ethernet core link carrying `inet` + `mpls`
- **aggregated-devices** — chassis enablement for the AE pool
- **Loopback** — lo0 router-id

The routing/underlay (BGP, MPLS/RSVP, VRF) is deployment-specific scaffolding and
out of scope for the snip library; see the full device configs under
[configuration/conf/](../configuration/conf/).
