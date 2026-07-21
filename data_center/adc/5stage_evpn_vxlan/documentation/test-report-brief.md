# Test Report Brief — 5-Stage EVPN-VXLAN Data Center

> **JVD-DCFABRIC-5STAGE-01-01** · Juniper Validated Design · test report brief
> Source: *JVD Test Report Brief: 5-Stage Fabric Datacenter Design with Juniper Apstra* (juniper.net).
> Companion docs: [solution-overview.md](solution-overview.md) · [design-guide.md](design-guide.md) · [datasheet.md](datasheet.md)

## Introduction

This report outlines the qualification testing of the 5-Stage Data Center Reference Design with Juniper Apstra — an ERB (Type 2 and Type 5) EVPN/VXLAN fabric with super spine, spine, server leaf, and border leaf devices. Objectives included blueprint deployment, device upgrade, incremental provisioning, telemetry/analytics checking, scaling/performance characterization, failure-mode analysis, and host-traffic verification.

## Test topology

A 5-stage EVPN/VXLAN fabric managed by Apstra with three PODs — **Compute**, **Storage**, **Services** — plus an external router (MX304) on the border leaves and a Spirent traffic generator on the leaves in each POD. Tenants are organized into **Red / Blue / Green / Purple / Yellow** routing zones (VRFs), each with IPv4 and IPv6 subnets, plus external hosts.

*Table 2 — platforms, controllers, and roles (devices under test):*

| Tag | Role | Model | OS |
|-----|------|-------|----|
| R0 / R1 | Super spine 1 / 2 | QFX5230-64CD | Junos OS Evolved 23.4R2-S3 |
| R2 / R3 | Compute POD spine 1 / 2 | QFX5210-64C | Junos OS 23.4R2-S3 |
| R4 / R5 | Compute POD leaf 1 / 2 | QFX5120-48YM | Junos OS 23.4R2-S3 |
| R6 / R7 | Storage POD spine 1 / 2 | QFX5220-32CD | Junos OS Evolved 23.4R2-S3 |
| R8 / R9 | Storage POD leaf 1 / 2 | QFX5130-32CD | Junos OS Evolved 23.4R2-S3 |
| R10 / R11 | Services POD spine 1 / 2 | QFX5210-64C | Junos OS 23.4R2-S3 |
| R12 / R13 | Services POD leaf 1 / 2 (border) | QFX5130-48C | Junos OS Evolved 23.4R2-S3 |
| R14 | External gateway | MX304 | Junos OS 23.4R2-S3 |
| RT0 | Traffic generator | Spirent | — |

> Platforms shown are the validated spine/leaf roles per the design guide (Table 1) and the configurations in this folder (QFX5210-64C POD spines; QFX5220-32CD / QFX5230-64CD run Junos OS Evolved). The published test report's DUT table listed some alternate spine models (e.g. QFX5120-32C) — JVDs validate multiple hardware combinations for a role.

## Events and triggers

Testing exercised the full Apstra deployment sequence (agents, pristine config, logical devices/interface maps/device profiles, racks, POD templates, pod-based blueprint, resource pools, cabling map, commit, routing zones, EVPN loopbacks, virtual networks). Distinctive validations:

- **OISM configlets** — enhanced OISM with BDNE on all leaves (Blue VRF), Classic L3 interface method on the border leaves.
- **Loopback firewall filter configlets** — Routing-Engine protection filter to accept only necessary protocol traffic.
- Underlay/overlay control-plane verification; DHCP bindings; multicast state (IGMP/PIM joins active); overlay connectivity.
- Apstra device state changes (undeploy / drain / pristine + redeploy); tenant add/remove; device reboot; server / multihomed / leaf-spine / spine-superspine link failures; process restart; MAC move; BGP deactivation; DHCP release/renew; loopback filter and storm control policing; multicast leave/join.
- **RoCEv2 traffic** — ECN and PFC validation through the configured QoS profiles.
- Fabric device upgrade from Apstra; extended negative testing; **8-hour longevity**.

## Performance and scale

Three scale scenarios were run per platform (Compute leaf QFX5120-48YM, Storage leaf QFX5130-32CD, Border leaf QFX5130-48C):

| Scenario | VLAN-VNIs w/ IRB | MAC-IPs/VN/port | Global MAC | Global MAC-IP | BGP total paths |
|----------|------------------|-----------------|------------|----------------|-----------------|
| 1 | 50 | 10 | ~2,717 | ~5,710 | ~49k |
| 2 | 500 | 5 | ~13,527 | ~27,649 | ~243k |
| 3 | 1,000 | 2 | ~10,827 | ~22,907 | ~239k |

Scale numbers are representative (not device maximums); the QFX5130 L3 overlay next-hop limit of ~28,000 is reached before other limits.

## Results summary

Comprehensive functional testing on the DUTs validated Junos OS 23.4R2-S3 and Apstra 5.0. The "Check gRPC Reset count" anomaly (an Apstra 5.0 issue) was mitigated by disabling gRPC telemetry (collect via NETCONF). Overall, validation detected no issues and all performance parameters were within threshold.

## Test non-goals

LLDP, management VRF, applying pristine configs, and symmetric-vs-asymmetric IRB comparison were out of scope.

## Sources

- *JVD Test Report Brief: 5-Stage Fabric Datacenter Design with Juniper Apstra* — JVD-DCFABRIC-5STAGE-01-01 (juniper.net).
- Companion: [solution-overview.md](solution-overview.md), [design-guide.md](design-guide.md), [datasheet.md](datasheet.md).
