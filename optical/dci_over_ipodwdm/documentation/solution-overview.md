# Solution Overview — Data Center Interconnect over IPoDWDM

*Faithful markdown rendering of the JVD Solution Overview
(sol-overview-JVD-OPTICS-BASE-01-01, V1.0, July 2025).*

Data Center Interconnect (DCI) needs high-capacity transport interconnecting two
or more data centers. This solution focuses on high-capacity transport that can
be leveraged by an **Internet Protocol over Dense Wavelength-Division Multiplexing
(IPoDWDM)** network. Juniper calls this architecture **Converged Optical Routing
Architecture (CORA)**.

## Solution overview

Traditional DWDM networks require transponders to convert Ethernet signals into a
DWDM signal suitable for DWDM transport. CORA integrates DWDM optics directly into
Juniper routers and switches. Because the DWDM optics in the router connect
directly to a DWDM multiplexer, there is no need for a separate transponder. In
this model, IP and optical network management operate as a single domain
controller, which in turn:

- Simplifies operations
- Lowers operational expenses
- Increases network efficiency
- Lowers power consumption
- Allows the router to see the performance of the DWDM link
- Allows the router to make routing decisions based on the DWDM link performance
- Troubleshoots faster and reduces downtime

*Figure 1: Data Center Interconnect over IPoDWDM Topology — see
[images/](images/).*

## Platforms

This solution uses the following routing platforms:

- **Juniper ACX7000 Router Series** (ACX7100-48L)
- **Juniper MX Series Router** (MX304)
- **Juniper PTX Series Router** (PTX10001-36MR)

with **Juniper 400G Coherent Optics** as transceivers and **ADTRAN** as the Open
Line System.

---

*Send feedback to: design-center-comments@juniper.net (V1.0 / 07-11-25)*
