# Solution Overview — 3-Stage Data Center Design with Juniper Apstra and VMware NSX-T

> **Juniper Validated Design Extension (JVDE)** · NSX-T Inline Mode · builds on [JVD-DCFABRIC-3STAGE](solution-overview.md)
> Source: *JVD Solution Overview: 3-Stage Data Center Design with Juniper Apstra and VMware NSX-T* (juniper.net, V1.0).
> Companion docs: [design-guide-nsxt-integration.md](design-guide-nsxt-integration.md) · [test-report-brief-nsxt-integration.md](test-report-brief-nsxt-integration.md) · [datasheet-nsxt-integration.md](datasheet-nsxt-integration.md)
> Base flavor: [solution-overview.md](solution-overview.md)

## Executive summary

Today's data center networks combine physical networks with network virtualization. **VMware NSX-T** network virtualization is common in enterprise data centers, and many operators seek guidance on integrating NSX-T with their physical networks. The **Data Center Design with Juniper Apstra and VMware NSX-T** is a Juniper Validated Design **Extension (JVDE)** that builds upon the 3-Stage Data Center Design with Juniper Apstra JVD to provide validated guidance on integrating NSX-T.

## Solution overview

The design builds on a 3-stage fabric as the foundation for NSX-T integration and describes the recommended NSX-T deployment, tested for end-to-end functionality. The underlying JVD is an **ERB-based** architecture with spine, leaf, and border-leaf switches in a high-availability configuration. This JVDE gives customers a well-characterized approach to integrating VMware NSX-T virtual networking with Juniper physical networking, fully supported by Juniper Apstra automation.

## Benefits

- **Repeatability** — prescriptive designs benefiting from worldwide deployments.
- **Reliability** — integrated best-practice designs tested with real-world traffic.
- **Velocity** — streamlined deployment with step-by-step guidance, automation, and prebuilt integrations.

## Solution components — VMware products

| VMware product | Software / image version |
|----------------|--------------------------|
| NSX-T Edge | nsx-edge-3.2.1.0.0.19232403 |
| NSX-Manager | 3.2.0.1.0.19232396 |
| vSphere Client | 7.0.2 |
| ESXi | VMware ESXi 7.0.2, 17630552 or later |

Combined with a Juniper data center JVD running **Juniper Apstra 4.2.1** and **Junos OS Release 22.2R3-S3**, supporting multiple Juniper switches in the spine, leaf, and border-leaf roles.

## About Juniper Validated Designs

JVDs (and JVD Extensions) represent a cross-functional collaboration between Juniper's subject-matter experts, developing well-characterized, multidimensional solutions that reduce networking-team complexity. JVDEs extend a validated JVD fabric with new functionality (here, NSX-T integration), verified through the New Product Initiative (NPI) testing framework for end-to-end functionality.

## Sources

- *JVD Solution Overview: 3-Stage Data Center Design with Juniper Apstra and VMware NSX-T* (juniper.net Validated Designs, V1.0).
- Companion: [design-guide-nsxt-integration.md](design-guide-nsxt-integration.md), [test-report-brief-nsxt-integration.md](test-report-brief-nsxt-integration.md), [datasheet-nsxt-integration.md](datasheet-nsxt-integration.md).
