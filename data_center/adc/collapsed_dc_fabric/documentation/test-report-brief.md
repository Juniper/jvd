# Test Report Brief — Collapsed Data Center Fabric

> **JVD-DCFABRIC-COLLAPSED-01-02** · Juniper Validated Design · test report brief
> Source: *JVD Test Report Brief: Collapsed Data Center Fabric with Juniper Apstra* (juniper.net).
> Companion docs: [solution-overview.md](solution-overview.md) · [design-guide.md](design-guide.md) · [datasheet.md](datasheet.md)

## Introduction

This report contains qualification test data for the Collapsed Data Center Fabric with Juniper Apstra JVD. Qualification includes blueprint deployment, incremental configuration push, telemetry/analytics checking, data validation, and traffic-flow verification. The objective is to harden the solution for customer deployment through extended testing.

## Platforms tested

*Table 1 — platforms:*

| Role | Platform | OS |
|------|----------|----|
| DC3 collapsed spine 1 | QFX5120-48Y · QFX5130-32CD · QFX5700 · ACX7100-48L · PTX10001-36MR | Junos OS 23.4R2-S3 |
| DC3 collapsed spine 2 | QFX5120-48Y · QFX5130-32CD · QFX5700 · ACX7100-48L · PTX10001-36MR | Junos OS 23.4R2-S3 |
| DC3 external router | MX204 | Junos OS 23.4R2-S3 |
| Apstra (AOS) | — | 4.2.1 |

Qualified in Junos OS Release 23.4R2-S3 and AOS 4.2.1.

## High-level features tested

*Table 4 — features:*

| Feature | Node | Description |
|---------|------|-------------|
| Single-homed access link | Leaf1 | Up to 2,000 VLANs per access interface, split across Red and Blue VRF; ~10 MAC/IP per VLAN |
| Multihomed access link | All leaves | AE bundle with ESI + LACP shared between access switches and collapsed spines; up to 2,000 VLANs per AE bundle |
| Collapsed-spine leaf pair | All leaves | Apstra collapsed-spine rack type; per-VRF BGP peering to a generic system for inter-VRF / external connectivity |
| eBGP underlay + overlay | All leaves | Default Apstra routing profile |
| IP ECMP with fast re-route | All leaves | Equal traffic distribution at all multipoints |
| BFD | All leaves | Underlay + overlay BFD with BGP at 500 ms and 1000 ms timers |
| MAC-VRF | All leaves | Apstra default L2 routing instance; single instance per leaf, 1 VXLAN VNI per VLAN, VLAN-aware service type |
| Layer-3 IRB | All leaves | Symmetric anycast IRB gateways for inter-VLAN routing |

## Performance

*Table 3 — convergence:*

| Event | Recovery time |
|-------|---------------|
| Single-homed access link failure | < 50 ms |
| Multihomed access link failure | < 50 ms |
| Dual-homed collapsed-spine node reboot | < 500 ms |
| BGP protocol flap | < 500 ms |
| Global MAC initialization (20k entries) | < 10 s |

## Scale

*Table 2 — scaling numbers (representative, not device maximums):*

| Metric | Tested scale |
|--------|--------------|
| VN / VLAN / IRB count per leaf | 2,000 each |
| Local MAC-IP host entries per leaf | 5,000 |
| DC3 total MAC-IP count | 10,000 |
| VNI per leaf | 2,000 |
| VTEP per leaf | 1 |
| ESI per leaf | 2 |

## Sources

- *JVD Test Report Brief: Collapsed Data Center Fabric with Juniper Apstra* — JVD-DCFABRIC-COLLAPSED-01-02 (juniper.net).
- Companion: [solution-overview.md](solution-overview.md), [design-guide.md](design-guide.md), [datasheet.md](datasheet.md).
