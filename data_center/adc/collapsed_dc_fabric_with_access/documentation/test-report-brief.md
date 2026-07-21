# Test Report Brief — Collapsed Data Center Fabric with Access Switches

> **Juniper Validated Design Extension (JVDE)** · test report brief
> Source: *JVD Test Report Brief: Collapsed Data Center Fabric with Juniper Apstra and Access Switches* (juniper.net).
> Companion docs: [solution-overview.md](solution-overview.md) · [design-guide.md](design-guide.md) · [datasheet.md](datasheet.md)

## Introduction

This report contains qualification test data for the Collapsed Data Center Fabric with Juniper Apstra JVD **with an added access-switch layer**. Qualification includes blueprint deployment, incremental configuration push, telemetry/analytics checking, data validation, and traffic-flow verification. The objective is to harden the solution for customer deployment through extended testing.

> **Caveat (from the report):** the DCI feature applicability for a collapsed fabric was pending TME confirmation; the report contains baseline / qualified scaling numbers.

## Platforms tested

*Table 1 — tested platforms:*

| Role | Platform | OS |
|------|----------|----|
| DC3 collapsed spine 1 | QFX5120-48Y · QFX5130-32CD · QFX5700 · ACX7100-48L · PTX10001-36MR | Junos OS 22.2R3-S3 |
| DC3 collapsed spine 2 | QFX5120-48Y · QFX5130-32CD · QFX5700 · ACX7100-48L · PTX10001-36MR | Junos OS 22.2R3-S3 |
| DC3 access leaf / ToR | EX4400 | Junos OS 22.4R3 |
| DC3 external router | MX204 | Junos OS 22.2R3-S3 |
| Apstra (AOS) | — | 4.2.1 |

Qualified in Junos OS Release 22.2R3-S3 and Apstra AOS 4.2.1 (EX4400 access on 22.4R3).

## Performance

*Table 3 — convergence:*

| Event | Recovery time |
|-------|---------------|
| Multihomed access link failure — access switch | < 50 ms |
| Multihomed access link failure — collapsed spine | < 50 ms |
| Access-switch → collapsed-spine link failure | < 50 ms |
| Dual-homed access-switch node reboot | < 500 ms |
| Dual-homed collapsed-spine node reboot | < 500 ms |
| BGP protocol flap — collapsed spine | (measured; see report) |

## Scale

*Table 2 — scaling numbers (representative, not device maximums):*

| Metric | Tested scale |
|--------|--------------|
| VN / VLAN / IRB count per leaf | 2,000 each |
| Local MAC-IP host entries per leaf | 5,000 |
| DC3 total MAC-IP count | 10,000 |
| VNI per leaf node | 2,000 |
| VTEP per leaf node | 1 |

## Sources

- *JVD Test Report Brief: Collapsed Data Center Fabric with Juniper Apstra and Access Switches* (juniper.net).
- Companion: [solution-overview.md](solution-overview.md), [design-guide.md](design-guide.md), [datasheet.md](datasheet.md).
