# Design Guide — Data Center Interconnect over IPoDWDM

*Faithful markdown rendering of the JVD design document
(jvd-JVD-OPTICS-BASE-01-01, V1.0, July 2025). Exhaustive result tables are
summarized here; see [test-report-brief.md](test-report-brief.md) for the
measured data and [configuration/conf/](../configuration/conf/) for the full
device configurations.*

## About this document

This document presents a Juniper Validated Design (JVD) for Data Center
Interconnect (DCI) using Internet Protocol over Dense Wavelength-Division
Multiplexing (IPoDWDM) with the Juniper ACX7000 Router Series, MX Series Router,
and PTX Series Router, and Juniper 400G Coherent Optics as transceivers. It
focuses on demonstrating the capabilities of Juniper 400G Coherent Optics and
validating the IPoDWDM solution with Juniper's routing platforms and the ADTRAN
Open Line System (OLS).

## Solution benefits — Converged Optical Routing Architecture (CORA)

Traditional DWDM networks use transponders to convert Ethernet signals into a
DWDM signal suitable for DWDM transport. **CORA** integrates DWDM optics into
Juniper routers and switches. DWDM optics in a router connect directly to a DWDM
multiplexer, so there is no need for a separate optical transponder. In this
model, IP and optical network management operate as a single domain controller,
which:

- Lowers capex by eliminating optical transponders
- Simplifies operations and lowers operational expenses
- Increases network efficiency
- Lowers power consumption
- Allows the router to monitor the performance of the DWDM link
- Allows the router to make routing decisions based on the DWDM link performance
- Troubleshoots faster and reduces downtime

## Use case and reference architecture

Generally, DCI requires high-capacity transport interconnecting two or more data
centers. This solution focuses on high-capacity transport using an IPoDWDM
network — the architecture Juniper calls CORA. Design validation assures reliable
operation of the coherent optical transceivers, which are tightly coupled with
the router hardware and software.

*Figure 1: IPoDWDM Network — see [images/](images/).*

## Validation framework

This JVD addresses modernization of the transport layer. A crucial aspect is to
test the capabilities of Juniper 400G Coherent Optics (JCO400). Major technical
attributes include:

- **Amplified links:** minimum receive Optical Signal-to-Noise Ratio (OSNR);
  maximum receive Chromatic Dispersion (CD)
- **Unamplified links:** Rx sensitivity
- Telemetry
- Junos and Junos Evolved software support
- Configurability
- Performance monitoring

### Test bed

**Amplified test bed.** Three coherent optical transceivers (TRX) are used in
both the DCI1 and DCI2 routers. All transceivers and the reconfigurable optical
add-drop multiplexer (ROADM) ports are tuned to a specific wavelength/frequency.
The three signals with different wavelengths are multiplexed onto a single pair
of fiber. For most test cases, one transceiver is the unit under test and the
other two are aggressors. An amplifier adds noise, so OSNR is reduced on every
line-system/amplifier hop — emulated by injecting Amplified Spontaneous Emission
(ASE) noise. Fiber disperses the light signal (Chromatic Dispersion), which the
transceiver's DSP compensates up to a limit; CD is proportional to fiber length
and is emulated with chromatic-dispersion emulators.

**Unamplified test bed.** Two pairs of fiber optic cables, each carrying two
wavelengths combined with a 50/50 optical splitter/combiner. Two coherent
transceivers are used on DCI1 and DCI2 and four on DCI3. For unamplified /
dark-fiber links the design is limited by optical power: as light travels the
fiber, power is lost mainly to scattering. This **span loss** is the only design
factor, bounded by the transmit power and receiver sensitivity of the transceiver.
Span loss is emulated with a Variable Optical Attenuator (VOA).

### Platforms / Devices Under Test (DUT)

- **DCI1:** PTX10001-36MR
- **DCI2:** MX304
- **DCI3:** ACX7100-48L

See the Validated Platforms and Software section and
[test-report-brief.md](test-report-brief.md) for OS releases.

## Test bed configuration

### Configuration template — Junos OS Evolved platforms

```
interfaces {
    <interface-name> {
        speed <port-speed>;
        number-of-sub-ports <number-of-channels>;
        optics-options {
            wavelength <wavelength>;
            tx-power <tx-power>;
        }
    }
}
```

For channelized interfaces, `optics-options` are configured on the first sub-port
(`et-x/y/z:0`), not on the parent port (`et-x/y/z`). The `speed` and
`number-of-sub-ports` knobs are still configured under the parent port.

### Configuration template — Junos OS platforms

```
chassis {
    fpc <fpc> {
        pic <pic> {
            port <port> {
                speed <port-speed>;
                number-of-sub-ports <number-of-channels>;
            }
        }
    }
}
interfaces {
    <interface-name> {
        optics-options {
            wavelength <wavelength>;
            tx-power <tx-power>;
        }
    }
}
```

For channelized interfaces, `optics-options` are configured on the first sub-port
(`et-x/y/z:0`), not on the parent port.

> The extracted, templated versions of these stanzas are in the
> [snip library](../configuration/snips/) (`coherent-optics-port`,
> `port-channelization`). In the validated configs, `optics-options` carries
> `wavelength`; `tx-power` is shown here as an available knob.

### Configuration template — ADTRAN FSP3000C Open Line System

The OLS is a third-party (ADTRAN) system: amplifier **AM-S23L**, optical
mux/demux **RD-12RS**. Bring-up is a sequenced series of `set interface … oms`,
fiber, `otsi`, and `croma slc` commands executed on the ADTRAN, followed by
`carrier-power-management` equalization and span initialization. These are ADTRAN
CLI, not Junos, and are reproduced in the source design document. Contact your
Juniper representative to be connected with an ADTRAN representative for support.

## Test objectives

**Goals** — validate:

- End-to-end optical architecture with coherent optics over DWDM line systems at
  scale, under normal operation and multiple stress conditions
- Performance monitoring through streaming telemetry
- TCA triggering
- PTX10001-36MR, MX304, and ACX7100-48L each as a DCI router
- JCO400-QDD-ZR-M-HP and QDD-400G-ZR-M-HP as TRX for amplified and unamplified
  use cases
- ADTRAN's Open Line System

**Non-goals:** a controller monitoring both router and OLS with AI anomaly
detection; management of the OLS; PTP and synchronization.

## Results summary and analysis

General testing includes: frequency/wavelength sweep across the C-band; OSNR
tolerance for amplified links; chromatic-dispersion-with-noise tolerance for
amplified links; Rx sensitivity for unamplified links; fiber cuts; aggregated
ethernet mixed speeds; telemetry; NETCONF optical PM paths; open JTS; device
reboots; Junos/Junos Evolved daemon restarts; and BGP, OSPF, and BFD tests.
Measured optical data is in [test-report-brief.md](test-report-brief.md).

## Recommendations

- Continuously monitor optical Performance Monitoring (PM) values so corrective
  action can be taken to maintain optical performance.
- Juniper does not sell Open Line Systems, but this document proves that any
  third-party OLS with ≥75 GHz channel spacing for 400G coherent signals works
  well with Juniper Coherent Optics and Routers. ADTRAN was used for this
  validation; contact your Juniper representative for an ADTRAN introduction.
- For brownfield deployments, contact the existing OLS vendor to check link
  feasibility using the results in this document.

## Revision history

| Date | Version | Description |
|------|---------|-------------|
| July 2025 | 1 | Initial publication |
