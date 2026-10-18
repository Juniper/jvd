# Telco Cloud and EVPN-VXLAN Data Center Fabric

> Validated IPv6 EVPN-VXLAN data center fabric for private telco clouds, managed by HPE Networking Apstra Data Center Director, with JCNR host-based routing, SR-IOV workloads and a centralized offramp gateway.

Validated configurations for the HPE Juniper Validated Design *"Telco Cloud and EVPN-VXLAN Data Center Fabric Using HPE Networking Apstra Data Center Director"* (JVD-TELCO-DC-01-01).

The design provides a 3-stage Clos bridged overlay fabric with an IPv6 underlay and overlay. Anycast IRB gateways run on the border leaf switches. Multi-tenant workloads connect to the fabric in two ways: Kubernetes workloads use Juniper Cloud-Native Router (JCNR) over MPLS-over-UDP, and high-performance SR-IOV workloads use Q-in-Q. An offramp gateway terminates both service types. It performs inter-VRF and inter-tenant routing and enforces policy.

* JVD landing page: <https://www.juniper.net/documentation/us/en/software/jvd/jvd-hybrid-telco-dcfabric/index.html>

![Hybrid telco cloud solution architecture](images/hybrid-telco-dc-fabric-architecture.png)

## Hardware

| Juniper Product | Role | Devices | Software |
|---|---|---:|---|
| **QFX5230-64CD** | Spine | 2 | Junos OS Evolved 25.2X100-D30 |
| **QFX5130-32CD** | Border leaf | 2 | Junos OS Evolved 25.2X100-D30 |
| **PTX10002-36QDD** | Offramp gateway | 1 | Junos OS Evolved 25.4R1-S1 |
| **QFX5130-32CD** | Server leaf | 2 | Junos OS Evolved 25.2X100-D30 |
| **QFX5130-48C** | Server leaf | 2 | Junos OS Evolved 25.2X100-D30 |
| **QFX5130-48CM** | Server leaf | 2 | Junos OS Evolved 25.2X100-D30 |

Software is the validated release from the design guide. Each configuration file records the release running when it was captured.

## Configurations

| Configuration | Set format | Role | Platform |
|---|---|---|---|
| [`spine1_qfx5230-64cd.conf`](configuration/conf/spine1_qfx5230-64cd.conf) | [`.set`](configuration/set/spine1_qfx5230-64cd.set) | Spine | QFX5230-64CD |
| [`spine2_qfx5230-64cd.conf`](configuration/conf/spine2_qfx5230-64cd.conf) | [`.set`](configuration/set/spine2_qfx5230-64cd.set) | Spine | QFX5230-64CD |
| [`borderleaf1_qfx5130-32cd.conf`](configuration/conf/borderleaf1_qfx5130-32cd.conf) | [`.set`](configuration/set/borderleaf1_qfx5130-32cd.set) | Border leaf | QFX5130-32CD |
| [`borderleaf2_qfx5130-32cd.conf`](configuration/conf/borderleaf2_qfx5130-32cd.conf) | [`.set`](configuration/set/borderleaf2_qfx5130-32cd.set) | Border leaf | QFX5130-32CD |
| [`offramp-gw1_ptx10002-36qdd.conf`](configuration/conf/offramp-gw1_ptx10002-36qdd.conf) | [`.set`](configuration/set/offramp-gw1_ptx10002-36qdd.set) | Offramp gateway | PTX10002-36QDD |
| [`server-leaf1_qfx5130-48cm.conf`](configuration/conf/server-leaf1_qfx5130-48cm.conf) | [`.set`](configuration/set/server-leaf1_qfx5130-48cm.set) | Server leaf | QFX5130-48CM |
| [`server-leaf2_qfx5130-48c.conf`](configuration/conf/server-leaf2_qfx5130-48c.conf) | [`.set`](configuration/set/server-leaf2_qfx5130-48c.set) | Server leaf | QFX5130-48C |
| [`server-leaf3_qfx5130-48cm.conf`](configuration/conf/server-leaf3_qfx5130-48cm.conf) | [`.set`](configuration/set/server-leaf3_qfx5130-48cm.set) | Server leaf | QFX5130-48CM |
| [`server-leaf4_qfx5130-48c.conf`](configuration/conf/server-leaf4_qfx5130-48c.conf) | [`.set`](configuration/set/server-leaf4_qfx5130-48c.set) | Server leaf | QFX5130-48C |
| [`server-leaf5_qfx5130-32cd.conf`](configuration/conf/server-leaf5_qfx5130-32cd.conf) | [`.set`](configuration/set/server-leaf5_qfx5130-32cd.set) | Server leaf | QFX5130-32CD |
| [`server-leaf6_qfx5130-32cd.conf`](configuration/conf/server-leaf6_qfx5130-32cd.conf) | [`.set`](configuration/set/server-leaf6_qfx5130-32cd.set) | Server leaf | QFX5130-32CD |
## Documentation

* [Design guide](documentation/design-guide.md)
* [Datasheet](documentation/datasheet.md)
