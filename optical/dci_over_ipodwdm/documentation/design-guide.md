> Faithful markdown conversion of the published Juniper Validated Design
> **Data Center Interconnect (DCI) over IPoDWDM — JVD** (`jvd-optics-base-01-01`,
> published July 2025). The PDF on juniper.net is the source of truth. The design
> narrative, validation framework, and test-bed configuration templates are
> reproduced in full. The optical test-bed and device figures are referred out to
> the published JVD document by number and caption. The validated device
> configurations are in [`../configuration/conf`](../configuration/conf).

# Data Center Interconnect (DCI) over IPoDWDM — Design Guide

Juniper Networks Validated Designs provide you with a comprehensive, end-to-end
blueprint for deploying Juniper solutions in your network. These designs are
created by Juniper's expert engineers and tested to ensure they meet your
requirements. Using a validated design, you can reduce the risk of costly
mistakes, save time and money, and ensure that your network is optimized for
maximum performance.

## Table of Contents

- [About this Document](#about-this-document)
- [Solution Benefits](#solution-benefits)
- [Use Case and Reference Architecture](#use-case-and-reference-architecture)
- [Validation Framework](#validation-framework)
- [Test Objectives](#test-objectives)
- [Results Summary and Analysis](#results-summary-and-analysis)
- [Recommendations](#recommendations)
- [Revision History](#revision-history)
- [Sources](#sources)

## About this Document

This document presents a Juniper Validated Design (JVD) for Data Center
Interconnect (DCI) using Internet Protocol over Dense Wavelength-Division
Multiplexing (IPoDWDM) with Juniper ACX7000 Router Series, MX Series Router, and
PTX Series Router, and Juniper 400G Coherent Optics as transceivers.

This document focuses on demonstrating the capabilities of Juniper 400G Coherent
Optics and validating the IPoDWDM solution with Juniper's Routing Platforms and
ADTRAN Open Line System (OLS).

## Solution Benefits

### Juniper Converged Optical Routing Architecture

Traditional DWDM networks use transponders to convert Ethernet signals into a DWDM
signal suitable for DWDM transport. Converged Optical Routing Architecture (CORA)
integrates DWDM optics into Juniper routers and switches. DWDM optics in a router
can connect directly to a DWDM multiplexer, so there is no need for a separate
optical transponder. In this model, the Internet Protocol (IP) and optical network
management operate as a single domain controller, which in turn:

- Lowers capex by eliminating optical transponders
- Simplifies operations and lowers operational expenses
- Increases network efficiency
- Lowers power consumption
- Allows router to monitor the performance of the DWDM link
- Allows router to make routing decisions based on the DWDM link performance
- Troubleshoots faster and reduces downtime

## Use Case and Reference Architecture

Generally, DCI requires high-capacity transport interconnecting two or more data
centers. This solution focuses on high-capacity transport using an IPoDWDM
network. Juniper calls this architecture CORA.

Design validation assures reliable operations of the coherent optical transceivers
which are tightly coupled with the router hardware and software.

*Figure 1: IPoDWDM Network (see the published JVD document).*

## Validation Framework

This JVD addresses the modernization of the transport layer. A crucial aspect of
this solution is to test the capabilities of Juniper 400G Coherent Optics
(JCO400). Major technical attributes include:

- For Amplified Links:
  - Minimum receive Optical Signal-to-Noise Ratio
  - Maximum receive Chromatic Dispersion
- For Unamplified Links:
  - RX Sensitivity
- Telemetry
- Junos and Junos Evolved Software Support
- Configurability
- Performance Monitoring

### Test Bed

*Figure 2: Amplified Test Bed (see the published JVD document).*

Figure 2 shows the physical topology of an amplified test bed. Three coherent
optical transceivers (TRX) are used in both DCI1 and DCI2 routers. All transceivers
and the reconfigurable optical add-drop multiplexer (ROADM) ports are tuned to a
specific wavelength or frequency. All three signals with different wavelengths are
multiplexed into a single pair of fiber. For most test cases, one transceiver is
designated as the unit under test, while the other two transceivers as aggressors.

It is important to note that an amplifier adds noise to the signal. Therefore, the
Optical Signal-to-Noise ratio is reduced on every Line System/Amplifier Hop. This
is emulated in the validation by adding an amplified spontaneous emission (ASE) as
a source of noise.

Another important factor is that the fiber optic cable disperses light signal. This
is called Chromatic Dispersion (CD). This effect can be compensated by the
transceiver's digital signal processor (DSP), but only to a certain limit.
Chromatic dispersion is directly proportional to the fiber optic cable distance.
Thus, chromatic dispersion emulators are used to emulate fiber optic cable
distance.

*Figure 3: Unamplified Test Bed (see the published JVD document).*

Figure 3 shows the physical topology of an unamplified test bed. There are two
pairs of fiber optical cables. Each pair carries two wavelengths. The wavelengths
are combined by using a 50/50 Optical Splitter/Combiner. Two coherent optical
transceivers are used on DCI1 and DCI2 routers and 4 transceivers are used on DCI3.
All transceivers are tuned to a specific wavelength or frequency.

For unamplified or dark fiber links, the design is limited by optical power. As
light goes through fiber optic cable, some optical power is lost mainly due to
light scattering by the fiber material. This Span Loss is the only factor to
consider when designing unamplified links. The maximum span loss allowed, or the
link budget is limited by the Transmit Power and Receiver Sensitivity of the
optical transceiver.

To emulate span loss, a Variable Optical Attenuator (VOA) is used.

### Platforms / Devices Under Test (DUT)

To review the software versions and platforms on which this JVD was validated by
Juniper Networks, see the Validated Platforms and Software section in this
document.

*Figure 4: DCI1: PTX10001-36MR (see the published JVD document).*

*Figure 5: DCI2: MX304 (see the published JVD document).*

*Figure 6: DCI3: ACX7100-48L (see the published JVD document).*

### Test Bed Configuration

**Configuration Template for Junos Evolved Platforms**

```
interfaces {
    $INTERFACE_NAME$ {
        speed $PORT-SPEED$;
        number-of-sub-ports $NUMBER-OF-CHANNELS$;
        optics-options {
            wavelength $WAVELENGTH$;
            tx-power $TX-POWER$;
        }
    }
}
```

For channelized interfaces, optics-options are configured on the first sub-port
(et-x/y/z:0), not on the parent port (et-x/y/z). The speed and number-of-sub-ports
knobs are still configured under the parent port.

**Configuration Template for Junos Platforms**

```
chassis {
    fpc $FPC$ {
        pic $PIC$ {
            port $PORT$ {
                speed $PORT-SPEED$;
                number-of-sub-ports $NUMBER-OF-CHANNELS$;
            }
        }
    }
}
interfaces {
    $INTERFACE_NAME$ {
        optics-options {
            wavelength $WAVELENGTH$;
            tx-power $TX-POWER$;
        }
    }
}
```

For channelized interfaces, optics-options are configured on the first sub-port
(et-x/y/z:0), not on the parent port (et-x/y/z).

**Configuration Template for ADTRAN FSP3000C Open Line System**

- Amplifier: AM-S23L
- Optical Multiplexer/Demultiplexer (Mux/Demux): RD-12RS

```
### The commands need to be executed in sequence
set interface 1/$ROADM_SLOT_NUM$/n/oms oms carrier-power-management setpoint-psd -35
set interface 1/$ROADM_SLOT_NUM$/$CLIENT_PORT_NUM$/oms is-substates append mt
set interface 1/$ROADM_SLOT_NUM$/$CLIENT_PORT_NUM$/oms carrier-power-management powerset-configuration enable setpoint-psd -24
set interface 1/$ROADM_SLOT_NUM$/$CLIENT_PORT_NUM$/oms oms is-substates remove all
set fiber a-end 1/$ROADM_SLOT_NUM$/n z-end 1/$PREAMP_SLOT_NUM$/n
set fiber a-end 1/$PREAMP_SLOT_NUM$/c z-end 1/$BOOSTER_SLOT_NUM$/c
commit

### Assign one Arbitrary_Service_Number per Client_Port per Center Frequency then configure multiple instances as per below template
set interface 1/alien/$ARBITARY_SERVICE_NUMBER$
set interface 1/alien/$ARBITARY_SERVICE_NUMBER$/otsi >>
set otsi $ARBITARY_SERVICE_NUMBER$ center-frequency $CLIENT_PORT_FREQUENCY_THZ$ bandwidth $CLIENT_PORT_BANDWIDTH_GHZ$
done
commit
set fiber a-end 1/alien/$ARBITARY_SERVICE_NUMBER$ z-end 1/$ROADM_SLOT_NUM$/$CLIENT_PORT_NUM$/
commit

set croma slc $ARBITARY_SERVICE_NUMBER$ >>
set slc-aendpoint path-node-number 2
set slc-zendpoint path-node-number 1
set slc-aendpoint slc-active-endpoint slc-resource-instance $DEGREENUMBER$
set slc-zendpoint slc-active-endpoint slc-resource-instance 1/alien/$ARBITARY_SERVICE_NUMBER$/otsi
done
commit

set croma slc $ARBITARY_SERVICE_NUMBER$ slc-zendpoint admin is
commit

run execute interface 1/$ROADM_SLOT_NUM$/n/oms oms carrier-power-management equalize
run execute interface 1/$ROADM_SLOT_NUM$/n/oms oms degree-span-equalization start-span-initialization

set croma slc $ARBITARY_SERVICE_NUMBER$ slc-aendpoint admin is
commit

run execute interface 1/$ROADM_SLOT_NUM$/$CLIENT_PORT_NUM$/oms oms carrier-power-management powerset
```

Contact your Juniper representative to obtain ADTRAN representative support. For
the full configurations used in this validation, see
[`../configuration/conf`](../configuration/conf).

## Test Objectives

### Test Goals

The focus of the testing is to:

- Validate end-to-end optical architecture and design with coherent optics over
  DWDM line systems as foundation technology under scale at the time of normal
  operations and under multiple stress conditions.
- Validate performance monitoring functionality through streaming telemetry.
- Validate TCAs being triggered.
- Validate PTX10001-36MR as a DCI router.
- Validate MX304 as a DCI router.
- Validate ACX7100-48L as a DCI router.
- Validate JCO400-QDD-ZR-M-HP and QDD-400G-ZR-M-HP as TRX for amplified and
  unamplified use cases.
- Validate ADTRAN's Open Line System.

### Test Non-Goals

The test non-goals are as follows:

- Controller that can monitor both router and Open Line System (OLS) where AI can
  detect anomaly
- Management of the Open Line System (OLS)
- Precision Time Protocol (PTP) and synchronization

## Results Summary and Analysis

General testing includes the following crucial scenarios:

- Frequency/wavelength sweep ensuring the router can configure on the entire
  C-band correctly
- Noise or Optical Signal-to-Noise Ratio (OSNR) tolerance test for Amplified links
- Chromatic Dispersion with Noise or OSNR tolerance test for Amplified links
- Rx Sensitivity test for Unamplified links
- Fiber cuts
- Aggregated Ethernet (AE) mixed speeds
- Telemetry tests
- Netconf Optical PMs Path tests
- Open JTS tests
- Device Reboots
- Various Junos OS and Junos OS Evolved software components restart
- BGP tests
- OSPF tests
- BFD tests

## Recommendations

The recommendations are as follows:

- Continuously monitor the optical Performance Monitoring (PM) values to ensure
  optical performance and corrective actions can be done.
- Juniper does not sell Open Line Systems (OLS). However, this document proves that
  any third-party OLS (with channel spacing of 75GHz and above for 400G coherent
  signals) works well with Juniper Coherent Optics and Routers. Since ADTRAN was
  used for this validation, Juniper recommends using ADTRAN Open Line Systems for
  the IPoDWDM solution. Contact your Juniper representative to connect them with an
  ADTRAN representative.
- For brownfield deployments, it is recommended to contact the existing OLS vendor
  to check the feasibility of the link using the results of this document.

## Revision History

### Table 1: Revision History

| Date | Version | Description |
|---|---|---|
| July 2025 | 1 | Initial publication |

## Sources

- Device configurations: [`../configuration/conf`](../configuration/conf)
- Solution overview: [solution-overview.md](solution-overview.md)
- Test report brief: [test-report-brief.md](test-report-brief.md)
