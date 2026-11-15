# Configuration form tiers

<!-- GENERATED FROM configuration/snips/_composition.json by the build tooling (generate-tiers). Do not edit by hand: run `JVD_REPO=<checkout> npm run tiers -- --jvd data_center/adc/collapsed_dc_fabric`. -->

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

## EVPN-VXLAN MAC-VRF with 40 VLANs

Family e-lan, form evpn-mac-vrf-40-vlans. OS mode Junos. Attachment: Access trunk units (the ESI LAG toward the servers) and the VLANs' IRB units, which the Type 5 VRF routes..

### leaf1_qfx5120-48y (junos)

- `minimum`: `junos/routing-instances/evpn-elan/ri-mac-vrf-vlan-aware-vxlan-40-vlans.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL_1
  - occurrence-selection-required: logical-interface:$AC_IFL_2
  - occurrence-selection-required: logical-interface:$IRB_IFL_1
  - occurrence-selection-required: logical-interface:$IRB_IFL_2
  - occurrence-selection-required: logical-interface:$IRB_IFL_3
  - occurrence-selection-required: logical-interface:$IRB_IFL_4
  - occurrence-selection-required: logical-interface:$IRB_IFL_5
  - occurrence-selection-required: logical-interface:$IRB_IFL_6
  - occurrence-selection-required: logical-interface:$IRB_IFL_7
  - occurrence-selection-required: logical-interface:$IRB_IFL_8
  - occurrence-selection-required: logical-interface:$IRB_IFL_9
  - occurrence-selection-required: logical-interface:$IRB_IFL_10
  - occurrence-selection-required: logical-interface:$IRB_IFL_11
  - occurrence-selection-required: logical-interface:$IRB_IFL_12
  - occurrence-selection-required: logical-interface:$IRB_IFL_13
  - occurrence-selection-required: logical-interface:$IRB_IFL_14
  - occurrence-selection-required: logical-interface:$IRB_IFL_15
  - occurrence-selection-required: logical-interface:$IRB_IFL_16
  - occurrence-selection-required: logical-interface:$IRB_IFL_17
  - occurrence-selection-required: logical-interface:$IRB_IFL_18
  - occurrence-selection-required: logical-interface:$IRB_IFL_19
  - occurrence-selection-required: logical-interface:$IRB_IFL_20
  - occurrence-selection-required: logical-interface:$IRB_IFL_21
  - occurrence-selection-required: logical-interface:$IRB_IFL_22
  - occurrence-selection-required: logical-interface:$IRB_IFL_23
  - occurrence-selection-required: logical-interface:$IRB_IFL_24
  - occurrence-selection-required: logical-interface:$IRB_IFL_25
  - occurrence-selection-required: logical-interface:$IRB_IFL_26
  - occurrence-selection-required: logical-interface:$IRB_IFL_27
  - occurrence-selection-required: logical-interface:$IRB_IFL_28
  - occurrence-selection-required: logical-interface:$IRB_IFL_29
  - occurrence-selection-required: logical-interface:$IRB_IFL_30
  - occurrence-selection-required: logical-interface:$IRB_IFL_31
  - occurrence-selection-required: logical-interface:$IRB_IFL_32
  - occurrence-selection-required: logical-interface:$IRB_IFL_33
  - occurrence-selection-required: logical-interface:$IRB_IFL_34
  - occurrence-selection-required: logical-interface:$IRB_IFL_35
  - occurrence-selection-required: logical-interface:$IRB_IFL_36
  - occurrence-selection-required: logical-interface:$IRB_IFL_37
  - occurrence-selection-required: logical-interface:$IRB_IFL_38
  - occurrence-selection-required: logical-interface:$IRB_IFL_39
  - occurrence-selection-required: logical-interface:$IRB_IFL_40

### leaf2_qfx5120-48y (junos)

- `minimum`: `junos/routing-instances/evpn-elan/ri-mac-vrf-vlan-aware-vxlan-40-vlans.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL_1
  - occurrence-selection-required: logical-interface:$AC_IFL_2
  - occurrence-selection-required: logical-interface:$IRB_IFL_1
  - occurrence-selection-required: logical-interface:$IRB_IFL_2
  - occurrence-selection-required: logical-interface:$IRB_IFL_3
  - occurrence-selection-required: logical-interface:$IRB_IFL_4
  - occurrence-selection-required: logical-interface:$IRB_IFL_5
  - occurrence-selection-required: logical-interface:$IRB_IFL_6
  - occurrence-selection-required: logical-interface:$IRB_IFL_7
  - occurrence-selection-required: logical-interface:$IRB_IFL_8
  - occurrence-selection-required: logical-interface:$IRB_IFL_9
  - occurrence-selection-required: logical-interface:$IRB_IFL_10
  - occurrence-selection-required: logical-interface:$IRB_IFL_11
  - occurrence-selection-required: logical-interface:$IRB_IFL_12
  - occurrence-selection-required: logical-interface:$IRB_IFL_13
  - occurrence-selection-required: logical-interface:$IRB_IFL_14
  - occurrence-selection-required: logical-interface:$IRB_IFL_15
  - occurrence-selection-required: logical-interface:$IRB_IFL_16
  - occurrence-selection-required: logical-interface:$IRB_IFL_17
  - occurrence-selection-required: logical-interface:$IRB_IFL_18
  - occurrence-selection-required: logical-interface:$IRB_IFL_19
  - occurrence-selection-required: logical-interface:$IRB_IFL_20
  - occurrence-selection-required: logical-interface:$IRB_IFL_21
  - occurrence-selection-required: logical-interface:$IRB_IFL_22
  - occurrence-selection-required: logical-interface:$IRB_IFL_23
  - occurrence-selection-required: logical-interface:$IRB_IFL_24
  - occurrence-selection-required: logical-interface:$IRB_IFL_25
  - occurrence-selection-required: logical-interface:$IRB_IFL_26
  - occurrence-selection-required: logical-interface:$IRB_IFL_27
  - occurrence-selection-required: logical-interface:$IRB_IFL_28
  - occurrence-selection-required: logical-interface:$IRB_IFL_29
  - occurrence-selection-required: logical-interface:$IRB_IFL_30
  - occurrence-selection-required: logical-interface:$IRB_IFL_31
  - occurrence-selection-required: logical-interface:$IRB_IFL_32
  - occurrence-selection-required: logical-interface:$IRB_IFL_33
  - occurrence-selection-required: logical-interface:$IRB_IFL_34
  - occurrence-selection-required: logical-interface:$IRB_IFL_35
  - occurrence-selection-required: logical-interface:$IRB_IFL_36
  - occurrence-selection-required: logical-interface:$IRB_IFL_37
  - occurrence-selection-required: logical-interface:$IRB_IFL_38
  - occurrence-selection-required: logical-interface:$IRB_IFL_39
  - occurrence-selection-required: logical-interface:$IRB_IFL_40

---

## EVPN Type 5 VRF with eBGP to the external router

Family l3vpn, form evpn-type5-vrf-ebgp. OS mode Junos. Attachment: IRB units of the MAC-VRF VLANs, the VRF loopback unit, and the attachment unit toward the external router..

### leaf1_qfx5120-48y (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-vrf-evpn-type-5-ebgp-20-irb.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: irb-service:source-occurrence
  - occurrence-selection-required: logical-interface:$AC_IFL
  - occurrence-selection-required: logical-interface:$IRB_IFL_1
  - occurrence-selection-required: logical-interface:$IRB_IFL_2
  - occurrence-selection-required: logical-interface:$IRB_IFL_3
  - occurrence-selection-required: logical-interface:$IRB_IFL_4
  - occurrence-selection-required: logical-interface:$IRB_IFL_5
  - occurrence-selection-required: logical-interface:$IRB_IFL_6
  - occurrence-selection-required: logical-interface:$IRB_IFL_7
  - occurrence-selection-required: logical-interface:$IRB_IFL_8
  - occurrence-selection-required: logical-interface:$IRB_IFL_9
  - occurrence-selection-required: logical-interface:$IRB_IFL_10
  - occurrence-selection-required: logical-interface:$IRB_IFL_11
  - occurrence-selection-required: logical-interface:$IRB_IFL_12
  - occurrence-selection-required: logical-interface:$IRB_IFL_13
  - occurrence-selection-required: logical-interface:$IRB_IFL_14
  - occurrence-selection-required: logical-interface:$IRB_IFL_15
  - occurrence-selection-required: logical-interface:$IRB_IFL_16
  - occurrence-selection-required: logical-interface:$IRB_IFL_17
  - occurrence-selection-required: logical-interface:$IRB_IFL_18
  - occurrence-selection-required: logical-interface:$IRB_IFL_19
  - occurrence-selection-required: logical-interface:$IRB_IFL_20
  - occurrence-selection-required: logical-interface:$LOOPBACK_IFL
  - occurrence-selection-required: policy-statement:$BGP_IMPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL
  - occurrence-selection-required: policy-statement:$IP_PREFIX_EXPORT_POL

### leaf2_qfx5120-48y (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-vrf-evpn-type-5-ebgp-20-irb.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: irb-service:source-occurrence
  - occurrence-selection-required: logical-interface:$AC_IFL
  - occurrence-selection-required: logical-interface:$IRB_IFL_1
  - occurrence-selection-required: logical-interface:$IRB_IFL_2
  - occurrence-selection-required: logical-interface:$IRB_IFL_3
  - occurrence-selection-required: logical-interface:$IRB_IFL_4
  - occurrence-selection-required: logical-interface:$IRB_IFL_5
  - occurrence-selection-required: logical-interface:$IRB_IFL_6
  - occurrence-selection-required: logical-interface:$IRB_IFL_7
  - occurrence-selection-required: logical-interface:$IRB_IFL_8
  - occurrence-selection-required: logical-interface:$IRB_IFL_9
  - occurrence-selection-required: logical-interface:$IRB_IFL_10
  - occurrence-selection-required: logical-interface:$IRB_IFL_11
  - occurrence-selection-required: logical-interface:$IRB_IFL_12
  - occurrence-selection-required: logical-interface:$IRB_IFL_13
  - occurrence-selection-required: logical-interface:$IRB_IFL_14
  - occurrence-selection-required: logical-interface:$IRB_IFL_15
  - occurrence-selection-required: logical-interface:$IRB_IFL_16
  - occurrence-selection-required: logical-interface:$IRB_IFL_17
  - occurrence-selection-required: logical-interface:$IRB_IFL_18
  - occurrence-selection-required: logical-interface:$IRB_IFL_19
  - occurrence-selection-required: logical-interface:$IRB_IFL_20
  - occurrence-selection-required: logical-interface:$LOOPBACK_IFL
  - occurrence-selection-required: policy-statement:$BGP_IMPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL
  - occurrence-selection-required: policy-statement:$IP_PREFIX_EXPORT_POL

---
