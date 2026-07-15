# Solution Overview — 3-Stage Data Center Design with Juniper Apstra

> **JVD-DCFABRIC-3STAGE-02-01** · Juniper Validated Design · IPv4 underlay (baseline flavor)
> Source: *JVD Solution Overview: 3-Stage Data Center Design with Juniper Apstra* (juniper.net, V2.1).
> Companion docs: [design-guide.md](design-guide.md) · [test-report-brief.md](test-report-brief.md) · [datasheet.md](datasheet.md)

## Executive summary

Data center operators must deliver and maintain a reliable network infrastructure while managing complexity and meeting scalability needs. Data centers host increasingly varied workloads with a growing diversity of networking requirements, and meeting those needs with bespoke designs adds a unique troubleshooting burden. The **3-Stage Data Center Design with Juniper Apstra** is a Juniper Validated Design (JVD) that gives organizations a data center network that is fast, adaptable to change, scalable, and reliable.

## Solution overview

The 3-Stage Data Center Design with Juniper Apstra is the most common Juniper data center network architecture and offers comprehensive guidance on deploying a modern 3-stage fabric with **EVPN-VXLAN**. Juniper Apstra automation and network management fully support the design. This JVD consists of an **ERB-based** (edge-routed bridging) network architecture with **spine, leaf, and border-leaf** switches in a high-availability configuration. All hardware components and software versions are tested extensively with simulated and real-world traffic.

## Benefits

- **Repeatability** — prescriptive designs, where all JVD customers benefit from lessons learned across worldwide deployments.
- **Reliability** — integrated, best-practice designs tested with real-world traffic and described with measured results.
- **Velocity** — streamlined deployment with step-by-step guidance, automation, and prebuilt integrations.

## Solution components — supported devices and positioning

| Role | Devices |
|------|---------|
| **Server Leaf** | **QFX5120-48Y-8C\*** · QFX5110-48S · EX4400-24MP# |
| **Border Leaf** | **QFX5130-32CD\*** · QFX5700 · ACX7100-48L · ACX7100-32C · PTX10001-36MR · QFX10002-36Q |
| **Spine** | **QFX5220-32CD\*** · QFX5120-32C · QFX5210-64CD · QFX5200-32C |

\* Baseline devices. # EX4400 has a fabric-wide scale limitation (validated on 22.4R3.25); see the design guide.

**Scale:** the minimum configuration is two spines, two leaves, and two border leaves. The design scales up to **8 lean spines and 128 leaf switches** while maintaining low or no oversubscription — fully scaled, up to **6144 single ports** (or **3072 high-availability ports**) while retaining expected functionality.

**Software:** Juniper Apstra **4.2.1** and **Junos OS Release 23.4R2-S3**.

## About Juniper Validated Designs

JVDs represent a cross-functional collaboration between Juniper's subject-matter experts — product teams, solutions architects, support, development, and testing. The goal is to develop well-characterized, multidimensional solutions that reduce the complexity and support burden of networking teams. Juniper data center JVDs are customer-driven: designs in frequent use are identified, undergo use-case and best-practice analysis, and are fully characterized in the Juniper JVD Labs with extensive multi-team testing, with results provided in JVD test reports and ongoing regression testing on new software.

## Sources

- *JVD Solution Overview: 3-Stage Data Center Design with Juniper Apstra* — JVD-DCFABRIC-3STAGE-02-01 (juniper.net Validated Designs).
- Companion: [design-guide.md](design-guide.md), [test-report-brief.md](test-report-brief.md), [datasheet.md](datasheet.md).
