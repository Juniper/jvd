# 3-Stage EVPN/VXLAN Data Center Design — Update

> Validated EVPN/VXLAN data center fabric with an Edge-Routed Bridging overlay and a lean spine underlay, managed by Juniper Apstra.

Validated configurations from the updated validation of the Juniper Validated Design *"3-Stage Data Center Design with Juniper Apstra."* The update covers new platforms, larger scale and a later Apstra release. The configurations of the earlier release are in [3-Stage Data Center](../3stage_dc/).

This is the most common Juniper data center fabric architecture. It is built on EVPN/VXLAN with an **Edge-Routed Bridging (ERB)** overlay and a **lean spine** underlay.

* JVD landing page: <https://www.juniper.net/documentation/us/en/software/jvd/jvd-3-stage-datacenterdesign-with-juniper-apstra/index.html>

## Highlights

- Validated at full tested scale across six PODs. Each POD is a complete fabric with a different mix of platforms in the spine, border leaf, server leaf and access roles.
- Multiple MAC-VRF instances and overlapping VLANs
- ESI-LAG multihoming for server redundancy
- Apstra-managed, with the exported blueprint for each POD included

## Hardware

| Juniper Product | Role | PODs | Devices | Software |
|---|---|---|---:|---|
| **QFX5120-48Y** | Spine | BPOD2 | 2 | Junos OS 25.2R2-S2.2 |
| **QFX5130-48C** | Spine | BPOD1 | 1 | Junos OS Evolved 25.2X100-D30.4 |
| **QFX5130-48CM** | Spine | BPOD1 | 1 | Junos OS Evolved 25.2X100-D30.4 |
| **QFX5210-64C** | Spine | BPOD3 | 2 | Junos OS 25.2R2-S2.2 |
| **QFX5220-128C** | Spine | QPOD1 | 2 | Junos OS Evolved 25.2X100-D30.4 |
| **QFX5220-32CD** | Spine | QPOD2 | 2 | Junos OS Evolved 25.2X100-D30.4 |
| **QFX5230-64CD** | Spine | QPOD3 | 2 | Junos OS Evolved 25.2X100-D30.4 |
| **ACX7100-48L** | Border leaf | QPOD3 | 2 | Junos OS Evolved 25.4R1.13 |
| **PTX10001-36MR** | Border leaf | BPOD2 | 2 | Junos OS Evolved 25.4R1.9 |
| **QFX5120-32C** | Border leaf | BPOD3 | 2 | Junos OS 25.2R2-S2.2 |
| **QFX5130-48C** | Border leaf | BPOD1 | 1 | Junos OS Evolved 25.2X100-D30.4 |
| **QFX5130-48CM** | Border leaf | BPOD1, QPOD2 | 3 | Junos OS Evolved 25.2X100-D30.4 |
| **QFX5140-24CD8O** | Border leaf | QPOD1 | 2 | Junos OS Evolved 25.2X100-D30.4 |
| **PTX10001-36MR** | ESI-LAG server leaf | QPOD3 | 2 | Junos OS Evolved 25.4R1.13 |
| **QFX5110-48S** | ESI-LAG server leaf | QPOD2 | 4 | Junos OS 25.2R2-S2.2<br>Junos OS 25.2R2.6 |
| **QFX5120-32C** | ESI-LAG server leaf | BPOD3, QPOD1 | 4 | Junos OS 25.2R2-S2.2 |
| **QFX5120-48Y** | ESI-LAG server leaf | BPOD1, BPOD2, BPOD3, QPOD2 | 22 | Junos OS 25.2R2-S2.2 |
| **QFX5120-48YM** | ESI-LAG server leaf | QPOD1 | 8 | Junos OS 25.2R2-S2.2 |
| **QFX5130-32CD** | ESI-LAG server leaf | QPOD1, QPOD2, QPOD3 | 8 | Junos OS Evolved 25.2X100-D30.4 |
| **QFX5130-48CM** | ESI-LAG server leaf | QPOD2 | 2 | Junos OS Evolved 25.2X100-D30.4 |
| **QFX5110-48S** | Single-homed server leaf | QPOD1 | 1 | Junos OS 25.2R2-S2.2 |
| **QFX5120-48Y** | Single-homed server leaf | BPOD1, QPOD1, QPOD2 | 4 | Junos OS 25.2R2-S2.2 |
| **QFX5120-48YM** | Single-homed server leaf | BPOD1, QPOD3 | 2 | Junos OS 25.2R2-S2.2 |
| **EX4100-48P** | Access switch | BPOD2 | 2 | Junos OS 23.4R2-S8.7<br>Junos OS 23.4R2-S8.8 |
| **EX4400-48MP** | Access switch | QPOD1 | 2 | Junos OS 23.4R2-S8.9 |

## Configurations

### BPOD1

| Configuration | Set format | Role | Platform |
|---|---|---|---|
| [`spine1_qfx5130-48c.conf`](configuration/conf/bpod1/spine1_qfx5130-48c.conf) | [`.set`](configuration/set/bpod1/spine1_qfx5130-48c.set) | Spine | QFX5130-48C |
| [`spine2_qfx5130-48cm.conf`](configuration/conf/bpod1/spine2_qfx5130-48cm.conf) | [`.set`](configuration/set/bpod1/spine2_qfx5130-48cm.set) | Spine | QFX5130-48CM |
| [`dc1-borderleaf-001-leaf1_qfx5130-48c.conf`](configuration/conf/bpod1/dc1-borderleaf-001-leaf1_qfx5130-48c.conf) | [`.set`](configuration/set/bpod1/dc1-borderleaf-001-leaf1_qfx5130-48c.set) | Border leaf (rack `borderleaf-001`) | QFX5130-48C |
| [`dc1-borderleaf-001-leaf2_qfx5130-48cm.conf`](configuration/conf/bpod1/dc1-borderleaf-001-leaf2_qfx5130-48cm.conf) | [`.set`](configuration/set/bpod1/dc1-borderleaf-001-leaf2_qfx5130-48cm.set) | Border leaf (rack `borderleaf-001`) | QFX5130-48CM |
| [`dc1-esi-001-leaf1_qfx5120-48y.conf`](configuration/conf/bpod1/dc1-esi-001-leaf1_qfx5120-48y.conf) | [`.set`](configuration/set/bpod1/dc1-esi-001-leaf1_qfx5120-48y.set) | ESI-LAG server leaf (rack `esi-001`) | QFX5120-48Y |
| [`dc1-esi-001-leaf2_qfx5120-48y.conf`](configuration/conf/bpod1/dc1-esi-001-leaf2_qfx5120-48y.conf) | [`.set`](configuration/set/bpod1/dc1-esi-001-leaf2_qfx5120-48y.set) | ESI-LAG server leaf (rack `esi-001`) | QFX5120-48Y |
| [`dc1-esi-002-leaf1_qfx5120-48y.conf`](configuration/conf/bpod1/dc1-esi-002-leaf1_qfx5120-48y.conf) | [`.set`](configuration/set/bpod1/dc1-esi-002-leaf1_qfx5120-48y.set) | ESI-LAG server leaf (rack `esi-002`) | QFX5120-48Y |
| [`dc1-esi-002-leaf2_qfx5120-48y.conf`](configuration/conf/bpod1/dc1-esi-002-leaf2_qfx5120-48y.conf) | [`.set`](configuration/set/bpod1/dc1-esi-002-leaf2_qfx5120-48y.set) | ESI-LAG server leaf (rack `esi-002`) | QFX5120-48Y |
| [`dc1-esi-003-leaf1_qfx5120-48y.conf`](configuration/conf/bpod1/dc1-esi-003-leaf1_qfx5120-48y.conf) | [`.set`](configuration/set/bpod1/dc1-esi-003-leaf1_qfx5120-48y.set) | ESI-LAG server leaf (rack `esi-003`) | QFX5120-48Y |
| [`dc1-esi-003-leaf2_qfx5120-48y.conf`](configuration/conf/bpod1/dc1-esi-003-leaf2_qfx5120-48y.conf) | [`.set`](configuration/set/bpod1/dc1-esi-003-leaf2_qfx5120-48y.set) | ESI-LAG server leaf (rack `esi-003`) | QFX5120-48Y |
| [`dc1-esi-004-leaf1_qfx5120-48y.conf`](configuration/conf/bpod1/dc1-esi-004-leaf1_qfx5120-48y.conf) | [`.set`](configuration/set/bpod1/dc1-esi-004-leaf1_qfx5120-48y.set) | ESI-LAG server leaf (rack `esi-004`) | QFX5120-48Y |
| [`dc1-esi-004-leaf2_qfx5120-48y.conf`](configuration/conf/bpod1/dc1-esi-004-leaf2_qfx5120-48y.conf) | [`.set`](configuration/set/bpod1/dc1-esi-004-leaf2_qfx5120-48y.set) | ESI-LAG server leaf (rack `esi-004`) | QFX5120-48Y |
| [`dc1-esi-sub-001-leaf1_qfx5120-48y.conf`](configuration/conf/bpod1/dc1-esi-sub-001-leaf1_qfx5120-48y.conf) | [`.set`](configuration/set/bpod1/dc1-esi-sub-001-leaf1_qfx5120-48y.set) | ESI-LAG server leaf (rack `esi-sub-001`) | QFX5120-48Y |
| [`dc1-esi-sub-001-leaf2_qfx5120-48y.conf`](configuration/conf/bpod1/dc1-esi-sub-001-leaf2_qfx5120-48y.conf) | [`.set`](configuration/set/bpod1/dc1-esi-sub-001-leaf2_qfx5120-48y.set) | ESI-LAG server leaf (rack `esi-sub-001`) | QFX5120-48Y |
| [`dc1-single-001-leaf1_qfx5120-48ym.conf`](configuration/conf/bpod1/dc1-single-001-leaf1_qfx5120-48ym.conf) | [`.set`](configuration/set/bpod1/dc1-single-001-leaf1_qfx5120-48ym.set) | Single-homed server leaf (rack `single-001`) | QFX5120-48YM |
| [`dc1-single-sub-001-leaf1_qfx5120-48y.conf`](configuration/conf/bpod1/dc1-single-sub-001-leaf1_qfx5120-48y.conf) | [`.set`](configuration/set/bpod1/dc1-single-sub-001-leaf1_qfx5120-48y.set) | Single-homed server leaf (rack `single-sub-001`) | QFX5120-48Y |

### BPOD2

| Configuration | Set format | Role | Platform |
|---|---|---|---|
| [`spine1_qfx5120-48y.conf`](configuration/conf/bpod2/spine1_qfx5120-48y.conf) | [`.set`](configuration/set/bpod2/spine1_qfx5120-48y.set) | Spine | QFX5120-48Y |
| [`spine2_qfx5120-48y.conf`](configuration/conf/bpod2/spine2_qfx5120-48y.conf) | [`.set`](configuration/set/bpod2/spine2_qfx5120-48y.set) | Spine | QFX5120-48Y |
| [`dc2-borderleaf-001-leaf1_ptx10001-36mr.conf`](configuration/conf/bpod2/dc2-borderleaf-001-leaf1_ptx10001-36mr.conf) | [`.set`](configuration/set/bpod2/dc2-borderleaf-001-leaf1_ptx10001-36mr.set) | Border leaf (rack `borderleaf-001`) | PTX10001-36MR |
| [`dc2-borderleaf-001-leaf2_ptx10001-36mr.conf`](configuration/conf/bpod2/dc2-borderleaf-001-leaf2_ptx10001-36mr.conf) | [`.set`](configuration/set/bpod2/dc2-borderleaf-001-leaf2_ptx10001-36mr.set) | Border leaf (rack `borderleaf-001`) | PTX10001-36MR |
| [`dc2-esi-001-leaf1_qfx5120-48y.conf`](configuration/conf/bpod2/dc2-esi-001-leaf1_qfx5120-48y.conf) | [`.set`](configuration/set/bpod2/dc2-esi-001-leaf1_qfx5120-48y.set) | ESI-LAG server leaf (rack `esi-001`) | QFX5120-48Y |
| [`dc2-esi-001-leaf2_qfx5120-48y.conf`](configuration/conf/bpod2/dc2-esi-001-leaf2_qfx5120-48y.conf) | [`.set`](configuration/set/bpod2/dc2-esi-001-leaf2_qfx5120-48y.set) | ESI-LAG server leaf (rack `esi-001`) | QFX5120-48Y |
| [`dc2-esi-002-leaf1_qfx5120-48y.conf`](configuration/conf/bpod2/dc2-esi-002-leaf1_qfx5120-48y.conf) | [`.set`](configuration/set/bpod2/dc2-esi-002-leaf1_qfx5120-48y.set) | ESI-LAG server leaf (rack `esi-002`) | QFX5120-48Y |
| [`dc2-esi-002-leaf2_qfx5120-48y.conf`](configuration/conf/bpod2/dc2-esi-002-leaf2_qfx5120-48y.conf) | [`.set`](configuration/set/bpod2/dc2-esi-002-leaf2_qfx5120-48y.set) | ESI-LAG server leaf (rack `esi-002`) | QFX5120-48Y |
| [`dc2-esi-003-leaf1_qfx5120-48y.conf`](configuration/conf/bpod2/dc2-esi-003-leaf1_qfx5120-48y.conf) | [`.set`](configuration/set/bpod2/dc2-esi-003-leaf1_qfx5120-48y.set) | ESI-LAG server leaf (rack `esi-003`) | QFX5120-48Y |
| [`dc2-esi-003-leaf2_qfx5120-48y.conf`](configuration/conf/bpod2/dc2-esi-003-leaf2_qfx5120-48y.conf) | [`.set`](configuration/set/bpod2/dc2-esi-003-leaf2_qfx5120-48y.set) | ESI-LAG server leaf (rack `esi-003`) | QFX5120-48Y |
| [`dc2-esi-sub-001-leaf1_qfx5120-48y.conf`](configuration/conf/bpod2/dc2-esi-sub-001-leaf1_qfx5120-48y.conf) | [`.set`](configuration/set/bpod2/dc2-esi-sub-001-leaf1_qfx5120-48y.set) | ESI-LAG server leaf (rack `esi-sub-001`) | QFX5120-48Y |
| [`dc2-esi-sub-001-leaf2_qfx5120-48y.conf`](configuration/conf/bpod2/dc2-esi-sub-001-leaf2_qfx5120-48y.conf) | [`.set`](configuration/set/bpod2/dc2-esi-sub-001-leaf2_qfx5120-48y.set) | ESI-LAG server leaf (rack `esi-sub-001`) | QFX5120-48Y |
| [`dc2-esi-sub-001-access1_ex4100-48p.conf`](configuration/conf/bpod2/dc2-esi-sub-001-access1_ex4100-48p.conf) | [`.set`](configuration/set/bpod2/dc2-esi-sub-001-access1_ex4100-48p.set) | Access switch (rack `esi-sub-001`) | EX4100-48P |
| [`dc2-esi-sub-001-access2_ex4100-48p.conf`](configuration/conf/bpod2/dc2-esi-sub-001-access2_ex4100-48p.conf) | [`.set`](configuration/set/bpod2/dc2-esi-sub-001-access2_ex4100-48p.set) | Access switch (rack `esi-sub-001`) | EX4100-48P |

### BPOD3

| Configuration | Set format | Role | Platform |
|---|---|---|---|
| [`spine1_qfx5210-64c.conf`](configuration/conf/bpod3/spine1_qfx5210-64c.conf) | [`.set`](configuration/set/bpod3/spine1_qfx5210-64c.set) | Spine | QFX5210-64C |
| [`spine2_qfx5210-64c.conf`](configuration/conf/bpod3/spine2_qfx5210-64c.conf) | [`.set`](configuration/set/bpod3/spine2_qfx5210-64c.set) | Spine | QFX5210-64C |
| [`dc3-borderleaf-001-leaf1_qfx5120-32c.conf`](configuration/conf/bpod3/dc3-borderleaf-001-leaf1_qfx5120-32c.conf) | [`.set`](configuration/set/bpod3/dc3-borderleaf-001-leaf1_qfx5120-32c.set) | Border leaf (rack `borderleaf-001`) | QFX5120-32C |
| [`dc3-borderleaf-001-leaf2_qfx5120-32c.conf`](configuration/conf/bpod3/dc3-borderleaf-001-leaf2_qfx5120-32c.conf) | [`.set`](configuration/set/bpod3/dc3-borderleaf-001-leaf2_qfx5120-32c.set) | Border leaf (rack `borderleaf-001`) | QFX5120-32C |
| [`dc3-esi-001-leaf1_qfx5120-48y.conf`](configuration/conf/bpod3/dc3-esi-001-leaf1_qfx5120-48y.conf) | [`.set`](configuration/set/bpod3/dc3-esi-001-leaf1_qfx5120-48y.set) | ESI-LAG server leaf (rack `esi-001`) | QFX5120-48Y |
| [`dc3-esi-001-leaf2_qfx5120-48y.conf`](configuration/conf/bpod3/dc3-esi-001-leaf2_qfx5120-48y.conf) | [`.set`](configuration/set/bpod3/dc3-esi-001-leaf2_qfx5120-48y.set) | ESI-LAG server leaf (rack `esi-001`) | QFX5120-48Y |
| [`dc3-esi-sub-001-leaf1_qfx5120-32c.conf`](configuration/conf/bpod3/dc3-esi-sub-001-leaf1_qfx5120-32c.conf) | [`.set`](configuration/set/bpod3/dc3-esi-sub-001-leaf1_qfx5120-32c.set) | ESI-LAG server leaf (rack `esi-sub-001`) | QFX5120-32C |
| [`dc3-esi-sub-001-leaf2_qfx5120-32c.conf`](configuration/conf/bpod3/dc3-esi-sub-001-leaf2_qfx5120-32c.conf) | [`.set`](configuration/set/bpod3/dc3-esi-sub-001-leaf2_qfx5120-32c.set) | ESI-LAG server leaf (rack `esi-sub-001`) | QFX5120-32C |

### QPOD1

| Configuration | Set format | Role | Platform |
|---|---|---|---|
| [`spine1_qfx5220-128c.conf`](configuration/conf/qpod1/spine1_qfx5220-128c.conf) | [`.set`](configuration/set/qpod1/spine1_qfx5220-128c.set) | Spine | QFX5220-128C |
| [`spine2_qfx5220-128c.conf`](configuration/conf/qpod1/spine2_qfx5220-128c.conf) | [`.set`](configuration/set/qpod1/spine2_qfx5220-128c.set) | Spine | QFX5220-128C |
| [`dc1-borderleaf-001-leaf1_qfx5140-24cd8o.conf`](configuration/conf/qpod1/dc1-borderleaf-001-leaf1_qfx5140-24cd8o.conf) | [`.set`](configuration/set/qpod1/dc1-borderleaf-001-leaf1_qfx5140-24cd8o.set) | Border leaf (rack `borderleaf-001`) | QFX5140-24CD8O |
| [`dc1-borderleaf-001-leaf2_qfx5140-24cd8o.conf`](configuration/conf/qpod1/dc1-borderleaf-001-leaf2_qfx5140-24cd8o.conf) | [`.set`](configuration/set/qpod1/dc1-borderleaf-001-leaf2_qfx5140-24cd8o.set) | Border leaf (rack `borderleaf-001`) | QFX5140-24CD8O |
| [`dc1-esi-001-leaf1_qfx5120-32c.conf`](configuration/conf/qpod1/dc1-esi-001-leaf1_qfx5120-32c.conf) | [`.set`](configuration/set/qpod1/dc1-esi-001-leaf1_qfx5120-32c.set) | ESI-LAG server leaf (rack `esi-001`) | QFX5120-32C |
| [`dc1-esi-001-leaf2_qfx5120-32c.conf`](configuration/conf/qpod1/dc1-esi-001-leaf2_qfx5120-32c.conf) | [`.set`](configuration/set/qpod1/dc1-esi-001-leaf2_qfx5120-32c.set) | ESI-LAG server leaf (rack `esi-001`) | QFX5120-32C |
| [`dc1-esi-002-leaf1_qfx5120-48ym.conf`](configuration/conf/qpod1/dc1-esi-002-leaf1_qfx5120-48ym.conf) | [`.set`](configuration/set/qpod1/dc1-esi-002-leaf1_qfx5120-48ym.set) | ESI-LAG server leaf (rack `esi-002`) | QFX5120-48YM |
| [`dc1-esi-002-leaf2_qfx5120-48ym.conf`](configuration/conf/qpod1/dc1-esi-002-leaf2_qfx5120-48ym.conf) | [`.set`](configuration/set/qpod1/dc1-esi-002-leaf2_qfx5120-48ym.set) | ESI-LAG server leaf (rack `esi-002`) | QFX5120-48YM |
| [`dc1-esi-003-leaf1_qfx5130-32cd.conf`](configuration/conf/qpod1/dc1-esi-003-leaf1_qfx5130-32cd.conf) | [`.set`](configuration/set/qpod1/dc1-esi-003-leaf1_qfx5130-32cd.set) | ESI-LAG server leaf (rack `esi-003`) | QFX5130-32CD |
| [`dc1-esi-003-leaf2_qfx5130-32cd.conf`](configuration/conf/qpod1/dc1-esi-003-leaf2_qfx5130-32cd.conf) | [`.set`](configuration/set/qpod1/dc1-esi-003-leaf2_qfx5130-32cd.set) | ESI-LAG server leaf (rack `esi-003`) | QFX5130-32CD |
| [`dc1-esi-004-leaf1_qfx5120-48ym.conf`](configuration/conf/qpod1/dc1-esi-004-leaf1_qfx5120-48ym.conf) | [`.set`](configuration/set/qpod1/dc1-esi-004-leaf1_qfx5120-48ym.set) | ESI-LAG server leaf (rack `esi-004`) | QFX5120-48YM |
| [`dc1-esi-004-leaf2_qfx5120-48ym.conf`](configuration/conf/qpod1/dc1-esi-004-leaf2_qfx5120-48ym.conf) | [`.set`](configuration/set/qpod1/dc1-esi-004-leaf2_qfx5120-48ym.set) | ESI-LAG server leaf (rack `esi-004`) | QFX5120-48YM |
| [`dc1-esi-005-leaf1_qfx5120-48ym.conf`](configuration/conf/qpod1/dc1-esi-005-leaf1_qfx5120-48ym.conf) | [`.set`](configuration/set/qpod1/dc1-esi-005-leaf1_qfx5120-48ym.set) | ESI-LAG server leaf (rack `esi-005`) | QFX5120-48YM |
| [`dc1-esi-005-leaf2_qfx5120-48ym.conf`](configuration/conf/qpod1/dc1-esi-005-leaf2_qfx5120-48ym.conf) | [`.set`](configuration/set/qpod1/dc1-esi-005-leaf2_qfx5120-48ym.set) | ESI-LAG server leaf (rack `esi-005`) | QFX5120-48YM |
| [`dc1-esi-access-001-leaf1_qfx5120-48ym.conf`](configuration/conf/qpod1/dc1-esi-access-001-leaf1_qfx5120-48ym.conf) | [`.set`](configuration/set/qpod1/dc1-esi-access-001-leaf1_qfx5120-48ym.set) | ESI-LAG server leaf (rack `esi-access-001`) | QFX5120-48YM |
| [`dc1-esi-access-001-leaf2_qfx5120-48ym.conf`](configuration/conf/qpod1/dc1-esi-access-001-leaf2_qfx5120-48ym.conf) | [`.set`](configuration/set/qpod1/dc1-esi-access-001-leaf2_qfx5120-48ym.set) | ESI-LAG server leaf (rack `esi-access-001`) | QFX5120-48YM |
| [`dc1-single-001-leaf1_qfx5110-48s.conf`](configuration/conf/qpod1/dc1-single-001-leaf1_qfx5110-48s.conf) | [`.set`](configuration/set/qpod1/dc1-single-001-leaf1_qfx5110-48s.set) | Single-homed server leaf (rack `single-001`) | QFX5110-48S |
| [`dc1-single-sub-001-leaf1_qfx5120-48y.conf`](configuration/conf/qpod1/dc1-single-sub-001-leaf1_qfx5120-48y.conf) | [`.set`](configuration/set/qpod1/dc1-single-sub-001-leaf1_qfx5120-48y.set) | Single-homed server leaf (rack `single-sub-001`) | QFX5120-48Y |
| [`dc1-esi-access-001-access1_ex4400-48mp.conf`](configuration/conf/qpod1/dc1-esi-access-001-access1_ex4400-48mp.conf) | [`.set`](configuration/set/qpod1/dc1-esi-access-001-access1_ex4400-48mp.set) | Access switch (rack `esi-access-001`) | EX4400-48MP |
| [`dc1-esi-access-001-access2_ex4400-48mp.conf`](configuration/conf/qpod1/dc1-esi-access-001-access2_ex4400-48mp.conf) | [`.set`](configuration/set/qpod1/dc1-esi-access-001-access2_ex4400-48mp.set) | Access switch (rack `esi-access-001`) | EX4400-48MP |

### QPOD2

| Configuration | Set format | Role | Platform |
|---|---|---|---|
| [`spine1_qfx5220-32cd.conf`](configuration/conf/qpod2/spine1_qfx5220-32cd.conf) | [`.set`](configuration/set/qpod2/spine1_qfx5220-32cd.set) | Spine | QFX5220-32CD |
| [`spine2_qfx5220-32cd.conf`](configuration/conf/qpod2/spine2_qfx5220-32cd.conf) | [`.set`](configuration/set/qpod2/spine2_qfx5220-32cd.set) | Spine | QFX5220-32CD |
| [`dc2-borderleaf-001-leaf1_qfx5130-48cm.conf`](configuration/conf/qpod2/dc2-borderleaf-001-leaf1_qfx5130-48cm.conf) | [`.set`](configuration/set/qpod2/dc2-borderleaf-001-leaf1_qfx5130-48cm.set) | Border leaf (rack `borderleaf-001`) | QFX5130-48CM |
| [`dc2-borderleaf-001-leaf2_qfx5130-48cm.conf`](configuration/conf/qpod2/dc2-borderleaf-001-leaf2_qfx5130-48cm.conf) | [`.set`](configuration/set/qpod2/dc2-borderleaf-001-leaf2_qfx5130-48cm.set) | Border leaf (rack `borderleaf-001`) | QFX5130-48CM |
| [`dc2-esi-001-leaf1_qfx5110-48s.conf`](configuration/conf/qpod2/dc2-esi-001-leaf1_qfx5110-48s.conf) | [`.set`](configuration/set/qpod2/dc2-esi-001-leaf1_qfx5110-48s.set) | ESI-LAG server leaf (rack `esi-001`) | QFX5110-48S |
| [`dc2-esi-001-leaf2_qfx5110-48s.conf`](configuration/conf/qpod2/dc2-esi-001-leaf2_qfx5110-48s.conf) | [`.set`](configuration/set/qpod2/dc2-esi-001-leaf2_qfx5110-48s.set) | ESI-LAG server leaf (rack `esi-001`) | QFX5110-48S |
| [`dc2-esi-002-leaf1_qfx5120-48y.conf`](configuration/conf/qpod2/dc2-esi-002-leaf1_qfx5120-48y.conf) | [`.set`](configuration/set/qpod2/dc2-esi-002-leaf1_qfx5120-48y.set) | ESI-LAG server leaf (rack `esi-002`) | QFX5120-48Y |
| [`dc2-esi-002-leaf2_qfx5120-48y.conf`](configuration/conf/qpod2/dc2-esi-002-leaf2_qfx5120-48y.conf) | [`.set`](configuration/set/qpod2/dc2-esi-002-leaf2_qfx5120-48y.set) | ESI-LAG server leaf (rack `esi-002`) | QFX5120-48Y |
| [`dc2-esi-003-leaf1_qfx5110-48s.conf`](configuration/conf/qpod2/dc2-esi-003-leaf1_qfx5110-48s.conf) | [`.set`](configuration/set/qpod2/dc2-esi-003-leaf1_qfx5110-48s.set) | ESI-LAG server leaf (rack `esi-003`) | QFX5110-48S |
| [`dc2-esi-003-leaf2_qfx5110-48s.conf`](configuration/conf/qpod2/dc2-esi-003-leaf2_qfx5110-48s.conf) | [`.set`](configuration/set/qpod2/dc2-esi-003-leaf2_qfx5110-48s.set) | ESI-LAG server leaf (rack `esi-003`) | QFX5110-48S |
| [`dc2-esi-004-leaf1_qfx5130-32cd.conf`](configuration/conf/qpod2/dc2-esi-004-leaf1_qfx5130-32cd.conf) | [`.set`](configuration/set/qpod2/dc2-esi-004-leaf1_qfx5130-32cd.set) | ESI-LAG server leaf (rack `esi-004`) | QFX5130-32CD |
| [`dc2-esi-004-leaf2_qfx5130-32cd.conf`](configuration/conf/qpod2/dc2-esi-004-leaf2_qfx5130-32cd.conf) | [`.set`](configuration/set/qpod2/dc2-esi-004-leaf2_qfx5130-32cd.set) | ESI-LAG server leaf (rack `esi-004`) | QFX5130-32CD |
| [`dc2-esi-005-leaf1_qfx5130-48cm.conf`](configuration/conf/qpod2/dc2-esi-005-leaf1_qfx5130-48cm.conf) | [`.set`](configuration/set/qpod2/dc2-esi-005-leaf1_qfx5130-48cm.set) | ESI-LAG server leaf (rack `esi-005`) | QFX5130-48CM |
| [`dc2-esi-005-leaf2_qfx5130-48cm.conf`](configuration/conf/qpod2/dc2-esi-005-leaf2_qfx5130-48cm.conf) | [`.set`](configuration/set/qpod2/dc2-esi-005-leaf2_qfx5130-48cm.set) | ESI-LAG server leaf (rack `esi-005`) | QFX5130-48CM |
| [`dc2-single-001-leaf1_qfx5120-48y.conf`](configuration/conf/qpod2/dc2-single-001-leaf1_qfx5120-48y.conf) | [`.set`](configuration/set/qpod2/dc2-single-001-leaf1_qfx5120-48y.set) | Single-homed server leaf (rack `single-001`) | QFX5120-48Y |
| [`dc2-single-sub-001-leaf1_qfx5120-48y.conf`](configuration/conf/qpod2/dc2-single-sub-001-leaf1_qfx5120-48y.conf) | [`.set`](configuration/set/qpod2/dc2-single-sub-001-leaf1_qfx5120-48y.set) | Single-homed server leaf (rack `single-sub-001`) | QFX5120-48Y |

### QPOD3

| Configuration | Set format | Role | Platform |
|---|---|---|---|
| [`spine1_qfx5230-64cd.conf`](configuration/conf/qpod3/spine1_qfx5230-64cd.conf) | [`.set`](configuration/set/qpod3/spine1_qfx5230-64cd.set) | Spine | QFX5230-64CD |
| [`spine2_qfx5230-64cd.conf`](configuration/conf/qpod3/spine2_qfx5230-64cd.conf) | [`.set`](configuration/set/qpod3/spine2_qfx5230-64cd.set) | Spine | QFX5230-64CD |
| [`dc3-borderleaf-001-leaf1_acx7100-48l.conf`](configuration/conf/qpod3/dc3-borderleaf-001-leaf1_acx7100-48l.conf) | [`.set`](configuration/set/qpod3/dc3-borderleaf-001-leaf1_acx7100-48l.set) | Border leaf (rack `borderleaf-001`) | ACX7100-48L |
| [`dc3-borderleaf-001-leaf2_acx7100-48l.conf`](configuration/conf/qpod3/dc3-borderleaf-001-leaf2_acx7100-48l.conf) | [`.set`](configuration/set/qpod3/dc3-borderleaf-001-leaf2_acx7100-48l.set) | Border leaf (rack `borderleaf-001`) | ACX7100-48L |
| [`dc3-esi-001-leaf1_qfx5130-32cd.conf`](configuration/conf/qpod3/dc3-esi-001-leaf1_qfx5130-32cd.conf) | [`.set`](configuration/set/qpod3/dc3-esi-001-leaf1_qfx5130-32cd.set) | ESI-LAG server leaf (rack `esi-001`) | QFX5130-32CD |
| [`dc3-esi-001-leaf2_qfx5130-32cd.conf`](configuration/conf/qpod3/dc3-esi-001-leaf2_qfx5130-32cd.conf) | [`.set`](configuration/set/qpod3/dc3-esi-001-leaf2_qfx5130-32cd.set) | ESI-LAG server leaf (rack `esi-001`) | QFX5130-32CD |
| [`dc3-esi-002-leaf1_qfx5130-32cd.conf`](configuration/conf/qpod3/dc3-esi-002-leaf1_qfx5130-32cd.conf) | [`.set`](configuration/set/qpod3/dc3-esi-002-leaf1_qfx5130-32cd.set) | ESI-LAG server leaf (rack `esi-002`) | QFX5130-32CD |
| [`dc3-esi-002-leaf2_qfx5130-32cd.conf`](configuration/conf/qpod3/dc3-esi-002-leaf2_qfx5130-32cd.conf) | [`.set`](configuration/set/qpod3/dc3-esi-002-leaf2_qfx5130-32cd.set) | ESI-LAG server leaf (rack `esi-002`) | QFX5130-32CD |
| [`dc3-esi-003-leaf1_ptx10001-36mr.conf`](configuration/conf/qpod3/dc3-esi-003-leaf1_ptx10001-36mr.conf) | [`.set`](configuration/set/qpod3/dc3-esi-003-leaf1_ptx10001-36mr.set) | ESI-LAG server leaf (rack `esi-003`) | PTX10001-36MR |
| [`dc3-esi-003-leaf2_ptx10001-36mr.conf`](configuration/conf/qpod3/dc3-esi-003-leaf2_ptx10001-36mr.conf) | [`.set`](configuration/set/qpod3/dc3-esi-003-leaf2_ptx10001-36mr.set) | ESI-LAG server leaf (rack `esi-003`) | PTX10001-36MR |
| [`dc3-single-sub-001-leaf1_qfx5120-48ym.conf`](configuration/conf/qpod3/dc3-single-sub-001-leaf1_qfx5120-48ym.conf) | [`.set`](configuration/set/qpod3/dc3-single-sub-001-leaf1_qfx5120-48ym.set) | Single-homed server leaf (rack `single-sub-001`) | QFX5120-48YM |
## Apstra blueprints

Each POD was deployed and managed with Juniper Apstra. Its exported blueprint is included for reference as gzip-compressed JSON:

| POD | Blueprint |
|---|---|
| BPOD1 | [`bpod1-blueprint.json.gz`](configuration/apstra/bpod1-blueprint.json.gz) |
| BPOD2 | [`bpod2-blueprint.json.gz`](configuration/apstra/bpod2-blueprint.json.gz) |
| BPOD3 | [`bpod3-blueprint.json.gz`](configuration/apstra/bpod3-blueprint.json.gz) |
| QPOD1 | [`qpod1-blueprint.json.gz`](configuration/apstra/qpod1-blueprint.json.gz) |
| QPOD2 | [`qpod2-blueprint.json.gz`](configuration/apstra/qpod2-blueprint.json.gz) |
| QPOD3 | [`qpod3-blueprint.json.gz`](configuration/apstra/qpod3-blueprint.json.gz) |
