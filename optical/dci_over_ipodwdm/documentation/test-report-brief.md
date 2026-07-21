# Test Report Brief — Data Center Interconnect over IPoDWDM

*Faithful summary of the JVD Test Report Brief
(test-report-brief-JVD-Optics-Base-01-01, V1.0, July 2025). The exhaustive
per-step OSNR / Rx-power tables are condensed to representative ranges here; the
full measured tables are in the source report.*

## Scope

The testing demonstrates Juniper 400G Coherent Optics capabilities and validates
the IPoDWDM (CORA) solution. Major technical attributes:

- **Amplified path:** minimum receive OSNR, maximum chromatic dispersion
- **Unamplified path:** Rx sensitivity
- Telemetry, configurability, performance monitoring

Two Juniper 400G Coherent Optics are tested: **JCO400-QDD-ZR-M-HP** and
**QDD-400G-ZR-M-HP**.

## Platforms tested (Devices Under Test)

| Role | Model | OS |
|------|-------|----|
| DCI-Edge1 | PTX10001-36MR | Junos OS Evolved Release 24.2R2 |
| DCI-Edge2 | MX304 | Junos OS Release 24.2R2 |
| DCI-Edge3 | ACX7100-48L | Junos OS Evolved Release 24.2R2 |
| Transceiver | JCO400-QDD-ZR-M-HP | N/A |
| Transceiver | QDD-400G-ZR-M-HP | N/A |

**Version qualification history:** initially qualified on Junos OS Release 24.2R2
and Junos OS Evolved Release 24.2R2.

## Scale data

- **MPLS:** 100 RSVP-based LSPs between DCIs
- **Routing instances:** 100 VPNv4
- **Routes:** 20,000
- **BGP:** 100 eBGP sessions

## Performance data — method

**Amplified path.** Three optical transceivers on each of DCI1 and DCI2; all
transceivers and ROADM ports tuned to a specific wavelength/frequency. EDFA noise
is emulated with an Amplified Spontaneous Emission (ASE) source; noise is
increased gradually with a Variable Optical Attenuator (VOA) and Chromatic
Dispersion emulated with Chromatic Dispersion Emulators (CDE). Each step repeats
until traffic loss is observed or the channel goes down; noise is then decreased
until traffic is stable for 2 hours, after which Pre-FEC BER, uncorrected FER, and
OSNR are measured. The measured OSNR is the transceiver's minimum receive-OSNR
requirement, cross-checked with an Optical Spectrum Analyzer (OSA).

**Unamplified path.** Limited by optical power / span loss (bounded by transmit
power and receiver sensitivity), emulated with a VOA. Rx signal power and Rx total
power are measured per media mode.

## Results — representative ranges

**Amplified path — minimum receive OSNR by media mode** (across 0–20 ns/nm
chromatic dispersion; reported by the transceiver):

| Media / mode | Approx. minimum rOSNR |
|--------------|-----------------------|
| 400GE ZR400-OFEC-16QAM | ~22–24 dB |
| 3×100GE ZR300-OFEC-8QAM | ~19–20 dB |
| 2×100GE ZR200-OFEC-QPSK | ~15 dB |
| 1×100GE ZR100-OFEC-QPSK | ~12 dB |

Both JCO400-QDD-ZR-M-HP and QDD-400G-ZR-M-HP were characterized as Rx.
Pre-FEC BER remained within the OFEC correctable range at the measured OSNR
points. Higher-order modulation (16QAM) requires higher OSNR; QPSK modes tolerate
the lowest OSNR — the expected coherent-optics trade-off.

**Unamplified path — Rx sensitivity.** Rx signal power and Rx total power
measured per media mode. Notes from the report:

- JCO400-QDD-ZR-M-HP on 100GE mode (ZR100-OFEC-QPSK) links up down to −32 dBm Rx
  power (with possible degradation below that point).
- QDD-400G-ZR-M-HP's Rx Signal Power monitor is accurate only down to −21 dBm;
  values below −21 dBm are not guaranteed.

## Additional test coverage

Frequency/wavelength sweep across the C-band; OSNR and CD-with-noise tolerance
(amplified); Rx sensitivity (unamplified); fiber cuts; aggregated-ethernet mixed
speeds; telemetry; NETCONF optical PM paths; open JTS; device reboots;
Junos / Junos Evolved daemon restarts; and BGP, OSPF, and BFD tests.

## Conclusion

The Juniper 400G Coherent Optics and the PTX10001-36MR, MX304, and ACX7100-48L
routers were validated as DCI edge devices for the IPoDWDM (CORA) architecture
over an ADTRAN open line system, meeting the OSNR, chromatic-dispersion, and
Rx-sensitivity targets for each supported coherent media mode.
