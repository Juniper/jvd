# Configuration form tiers

<!-- GENERATED FROM configuration/snips/_composition.json by the build tooling (generate-tiers). Do not edit by hand: run `JVD_REPO=<checkout> npm run tiers -- --jvd data_center/aidc/aiml_multitenancy_backend`. -->

This file tells the assistant which snippet files to include for each service
form at each tier. It is generated from the composition matrix, so every path
below resolves to a real snippet and every device listed is one the form is
validated on.

## What the tiers mean

| Tier | What it includes |
|---|---|
| `minimum` | Only the service construct. Assumes the device already runs the underlay and the overlay the service needs. |
| `self-contained` | Everything the emitted configuration names, resolved recursively for the target device. |
| `as-deployed` | The self-contained set plus the validated baselines this JVD runs on that device. |

A tier never implies that a larger closure is a minimal protocol requirement.
If a form's overlay, variant or dependency cannot be resolved for the target
device, the request fails closed: say so and generate nothing for it.

---

## Tenant VRF with EVPN Type 5 routes and two GPU server links

Family l3vpn, form tenant-vrf-evpn-type5-2-links. OS mode EVO. Attachment: Server-facing units of the GPU rail links (an IPv4 /31 address with family inet6) and the tenant loopback unit, each listed in the VRF; the IRB and router-advertisement statements of the tenant are separate snippets..

### leaf1_qfx5240-64od (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-vrf-evpn-type-5-2-ac.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL_1
  - occurrence-selection-required: logical-interface:$AC_IFL_2
  - occurrence-selection-required: logical-interface:$LOOPBACK_IFL
  - occurrence-selection-required: policy-statement:$IP_PREFIX_EXPORT_POL

### leaf2_qfx5240-64od (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-vrf-evpn-type-5-2-ac.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL_1
  - occurrence-selection-required: logical-interface:$AC_IFL_2
  - occurrence-selection-required: logical-interface:$LOOPBACK_IFL
  - occurrence-selection-required: policy-statement:$IP_PREFIX_EXPORT_POL

### leaf3_qfx5240-64od (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-vrf-evpn-type-5-2-ac.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL_1
  - occurrence-selection-required: logical-interface:$AC_IFL_2
  - occurrence-selection-required: logical-interface:$LOOPBACK_IFL
  - occurrence-selection-required: policy-statement:$IP_PREFIX_EXPORT_POL

### leaf4_qfx5240-64od (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-vrf-evpn-type-5-2-ac.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL_1
  - occurrence-selection-required: logical-interface:$AC_IFL_2
  - occurrence-selection-required: logical-interface:$LOOPBACK_IFL
  - occurrence-selection-required: policy-statement:$IP_PREFIX_EXPORT_POL

---

## Tenant VRF with EVPN Type 5 routes and four GPU server links

Family l3vpn, form tenant-vrf-evpn-type5-4-links. OS mode EVO. Attachment: Server-facing units of the GPU rail links (an IPv4 /31 address with family inet6) and the tenant loopback unit, each listed in the VRF; the IRB and router-advertisement statements of the tenant are separate snippets..

### leaf1_qfx5240-64od (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-vrf-evpn-type-5-4-ac.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL_1
  - occurrence-selection-required: logical-interface:$AC_IFL_2
  - occurrence-selection-required: logical-interface:$AC_IFL_3
  - occurrence-selection-required: logical-interface:$AC_IFL_4
  - occurrence-selection-required: logical-interface:$LOOPBACK_IFL
  - occurrence-selection-required: policy-statement:$IP_PREFIX_EXPORT_POL

### leaf2_qfx5240-64od (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-vrf-evpn-type-5-4-ac.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL_1
  - occurrence-selection-required: logical-interface:$AC_IFL_2
  - occurrence-selection-required: logical-interface:$AC_IFL_3
  - occurrence-selection-required: logical-interface:$AC_IFL_4
  - occurrence-selection-required: logical-interface:$LOOPBACK_IFL
  - occurrence-selection-required: policy-statement:$IP_PREFIX_EXPORT_POL

### leaf3_qfx5240-64od (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-vrf-evpn-type-5-4-ac.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL_1
  - occurrence-selection-required: logical-interface:$AC_IFL_2
  - occurrence-selection-required: logical-interface:$AC_IFL_3
  - occurrence-selection-required: logical-interface:$AC_IFL_4
  - occurrence-selection-required: logical-interface:$LOOPBACK_IFL
  - occurrence-selection-required: policy-statement:$IP_PREFIX_EXPORT_POL

### leaf4_qfx5240-64od (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-vrf-evpn-type-5-4-ac.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL_1
  - occurrence-selection-required: logical-interface:$AC_IFL_2
  - occurrence-selection-required: logical-interface:$AC_IFL_3
  - occurrence-selection-required: logical-interface:$AC_IFL_4
  - occurrence-selection-required: logical-interface:$LOOPBACK_IFL
  - occurrence-selection-required: policy-statement:$IP_PREFIX_EXPORT_POL

---
