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

## Device roles

| Role | In the network |
|---|---|
| **DCI Edge** | Router with built-in 400G coherent optics that plug directly into the DWDM line system, with no external transponder. All three validated routers (PTX10001-36MR, MX304, ACX7100-48L) take this role; each carries the 100 VPNv4 routing instances over RSVP-signalled MPLS LSPs to the other two. |

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

The [snip library](../configuration/snips/) reproduces every validated router
configuration, Junos OS (MX304) and Junos OS Evolved (PTX10001-36MR,
ACX7100-48L):

- **Coherent optics port** — the built-in 400G coherent interface as an
  aggregated Ethernet member with its `optics-options wavelength` (EVO:
  `ether-options`; Junos/MX: `gigether-options`)
- **DWDM core link** — LACP aggregated Ethernet bundle carrying `inet` and
  `mpls`, plus `chassis aggregated-devices` and the MX304 port speeds
- **Transport** — OSPF with traffic engineering, RSVP, and MPLS with the
  100 LSPs to each of the other two routers
- **Services** — iBGP `inet-vpn` between the three routers and the 100 L3VPN
  VRFs, each with an eBGP session on a VLAN unit of the customer-facing port
- **System** — loopback, router ID and AS, load-balancing, NETCONF and gRPC
  for telemetry, NTP and syslog

The full device configs are under [configuration/conf/](../configuration/conf/).
