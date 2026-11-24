# Configuration form tiers

<!-- GENERATED FROM configuration/snips/_composition.json by the build tooling (generate-tiers). Do not edit by hand: run `JVD_REPO=<checkout> npm run tiers -- --jvd data_center/adc/evpn_vxlan_dci`. -->

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

## EVPN-VXLAN MAC-VRF with 10 VLANs

Family e-lan, form evpn-mac-vrf-10-vlans. OS mode EVO. Attachment: Access units on the leaves and the VLANs' IRB units, which the Type 5 VRFs route..

### dc1-dc4_type2_type5_seamless/dc4_storage-leaf1_qfx5130-32cd (evo)

- `minimum`: `evo/routing-instances/evpn-elan/ri-mac-vrf-vlan-aware-10-vlans-2-ac.conf`
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

### dc1-dc4_type2_type5_seamless/dc4_storage-leaf2_qfx5130-32cd (evo)

- `minimum`: `evo/routing-instances/evpn-elan/ri-mac-vrf-vlan-aware-10-vlans-2-ac.conf`
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

---

## EVPN-VXLAN MAC-VRF with 20 VLANs

Family e-lan, form evpn-mac-vrf-20-vlans. OS mode Junos. Attachment: Access units on the leaves and the VLANs' IRB units, which the Type 5 VRFs route..

### dc1-dc3_type2_seamless/dc1_leaf2_qfx5120-48y (junos)

- `minimum`: `junos/routing-instances/evpn-elan/ri-mac-vrf-vlan-aware-20-vlans-3-ac.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL_1
  - occurrence-selection-required: logical-interface:$AC_IFL_2
  - occurrence-selection-required: logical-interface:$AC_IFL_3
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

### dc1-dc3_type2_seamless/dc1_leaf3_qfx5120-48y (junos)

- `minimum`: `junos/routing-instances/evpn-elan/ri-mac-vrf-vlan-aware-20-vlans-3-ac.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL_1
  - occurrence-selection-required: logical-interface:$AC_IFL_2
  - occurrence-selection-required: logical-interface:$AC_IFL_3
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

---

## EVPN-VXLAN MAC-VRF with 30 VLANs

Family e-lan, form evpn-mac-vrf-30-vlans. OS mode Junos. Attachment: Access units on the leaves and the VLANs' IRB units, which the Type 5 VRFs route..

### dc1-dc3_type2_seamless/dc1_leaf1_qfx5120-48y (junos)

- `minimum`: `junos/routing-instances/evpn-elan/ri-mac-vrf-vlan-aware-30-vlans-1-ac.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
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

---

## EVPN-VXLAN MAC-VRF with 40 VLANs

Family e-lan, form evpn-mac-vrf-40-vlans. OS mode Junos. Attachment: Access units on the leaves and the VLANs' IRB units, which the Type 5 VRFs route..

### dc1-dc2_ott/dc1_esi-leaf1_qfx5120-48y (junos)

- `minimum`: `junos/routing-instances/evpn-elan/ri-mac-vrf-vlan-aware-40-vlans-3-ac-dc1.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL_1
  - occurrence-selection-required: logical-interface:$AC_IFL_2
  - occurrence-selection-required: logical-interface:$AC_IFL_3
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

### dc1-dc2_ott/dc1_esi-leaf2_qfx5120-48y (junos)

- `minimum`: `junos/routing-instances/evpn-elan/ri-mac-vrf-vlan-aware-40-vlans-3-ac-dc1.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL_1
  - occurrence-selection-required: logical-interface:$AC_IFL_2
  - occurrence-selection-required: logical-interface:$AC_IFL_3
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

### dc1-dc2_ott/dc1_server-leaf1_qfx5120-48y (junos)

- `minimum`: `junos/routing-instances/evpn-elan/ri-mac-vrf-vlan-aware-40-vlans-1-ac-dc1.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
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

### dc1-dc2_ott/dc2_esi-leaf1_qfx5120-48y (junos)

- `minimum`: `junos/routing-instances/evpn-elan/ri-mac-vrf-vlan-aware-40-vlans-3-ac-dc2.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL_1
  - occurrence-selection-required: logical-interface:$AC_IFL_2
  - occurrence-selection-required: logical-interface:$AC_IFL_3
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

### dc1-dc2_ott/dc2_esi-leaf2_qfx5120-48y (junos)

- `minimum`: `junos/routing-instances/evpn-elan/ri-mac-vrf-vlan-aware-40-vlans-3-ac-dc2.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL_1
  - occurrence-selection-required: logical-interface:$AC_IFL_2
  - occurrence-selection-required: logical-interface:$AC_IFL_3
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

### dc1-dc2_ott/dc2_server-leaf1_qfx5120-48y (junos)

- `minimum`: `junos/routing-instances/evpn-elan/ri-mac-vrf-vlan-aware-40-vlans-1-ac-dc2.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
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

### dc1-dc4_type2_type5_seamless/dc1_leaf2_qfx5120-48y (junos)

- `minimum`: `junos/routing-instances/evpn-elan/ri-mac-vrf-vlan-aware-40-vlans-3-ac-dc1.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL_1
  - occurrence-selection-required: logical-interface:$AC_IFL_2
  - occurrence-selection-required: logical-interface:$AC_IFL_3
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

### dc1-dc4_type2_type5_seamless/dc1_leaf3_qfx5120-48y (junos)

- `minimum`: `junos/routing-instances/evpn-elan/ri-mac-vrf-vlan-aware-40-vlans-3-ac-dc1.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL_1
  - occurrence-selection-required: logical-interface:$AC_IFL_2
  - occurrence-selection-required: logical-interface:$AC_IFL_3
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

### dc1-dc4_type2_type5_seamless/dc4_compute-leaf1_qfx5120-48ym (junos)

- `minimum`: `junos/routing-instances/evpn-elan/ri-mac-vrf-vlan-aware-40-vlans-2-ac.conf`
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

### dc1-dc4_type2_type5_seamless/dc4_compute-leaf2_qfx5120-48ym (junos)

- `minimum`: `junos/routing-instances/evpn-elan/ri-mac-vrf-vlan-aware-40-vlans-2-ac.conf`
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

## EVPN-VXLAN MAC-VRF with 50 VLANs

Family e-lan, form evpn-mac-vrf-50-vlans. OS mode Junos. Attachment: Access units on the leaves and the VLANs' IRB units, which the Type 5 VRFs route..

### dc1-dc4_type2_type5_seamless/dc1_leaf1_qfx5120-48y (junos)

- `minimum`: `junos/routing-instances/evpn-elan/ri-mac-vrf-vlan-aware-50-vlans-1-ac.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
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
  - occurrence-selection-required: logical-interface:$IRB_IFL_41
  - occurrence-selection-required: logical-interface:$IRB_IFL_42
  - occurrence-selection-required: logical-interface:$IRB_IFL_43
  - occurrence-selection-required: logical-interface:$IRB_IFL_44
  - occurrence-selection-required: logical-interface:$IRB_IFL_45
  - occurrence-selection-required: logical-interface:$IRB_IFL_46
  - occurrence-selection-required: logical-interface:$IRB_IFL_47
  - occurrence-selection-required: logical-interface:$IRB_IFL_48
  - occurrence-selection-required: logical-interface:$IRB_IFL_49
  - occurrence-selection-required: logical-interface:$IRB_IFL_50

---

## EVPN-VXLAN MAC-VRF with 20 VLANs and an EVPN interconnect with VNI translation

Family e-lan, form evpn-mac-vrf-interconnect-20-vlans. OS mode MIXED. Attachment: The VLANs' IRB units on the DCI gateway and, where present, its access units; the interconnect stretches the listed VNIs to the remote data center..

### dc1-dc3_type2_seamless/dc1_borderleaf1_qfx5130-32cd (evo)

- `minimum`: `evo/routing-instances/evpn-elan/ri-mac-vrf-vlan-aware-interconnect-translation-vni-20-vlans.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
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

### dc1-dc3_type2_seamless/dc1_borderleaf2_qfx5130-32cd (evo)

- `minimum`: `evo/routing-instances/evpn-elan/ri-mac-vrf-vlan-aware-interconnect-translation-vni-20-vlans.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
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

### dc1-dc3_type2_seamless/dc3_leaf1_qfx5120-48y (junos)

- `minimum`: `junos/routing-instances/evpn-elan/ri-mac-vrf-vlan-aware-interconnect-translation-vni-20-vlans-2-ac.conf`
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

### dc1-dc3_type2_seamless/dc3_leaf2_qfx5120-48y (junos)

- `minimum`: `junos/routing-instances/evpn-elan/ri-mac-vrf-vlan-aware-interconnect-translation-vni-20-vlans-2-ac.conf`
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

---

## EVPN-VXLAN MAC-VRF with 50 VLANs and an EVPN interconnect with VNI translation

Family e-lan, form evpn-mac-vrf-interconnect-50-vlans. OS mode EVO. Attachment: The VLANs' IRB units on the DCI gateway and, where present, its access units; the interconnect stretches the listed VNIs to the remote data center..

### dc1-dc4_type2_type5_seamless/dc1_borderleaf1_qfx5130-32cd (evo)

- `minimum`: `evo/routing-instances/evpn-elan/ri-mac-vrf-vlan-aware-interconnect-translation-vni-50-vlans-borderleaf.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
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
  - occurrence-selection-required: logical-interface:$IRB_IFL_41
  - occurrence-selection-required: logical-interface:$IRB_IFL_42
  - occurrence-selection-required: logical-interface:$IRB_IFL_43
  - occurrence-selection-required: logical-interface:$IRB_IFL_44
  - occurrence-selection-required: logical-interface:$IRB_IFL_45
  - occurrence-selection-required: logical-interface:$IRB_IFL_46
  - occurrence-selection-required: logical-interface:$IRB_IFL_47
  - occurrence-selection-required: logical-interface:$IRB_IFL_48
  - occurrence-selection-required: logical-interface:$IRB_IFL_49
  - occurrence-selection-required: logical-interface:$IRB_IFL_50

### dc1-dc4_type2_type5_seamless/dc1_borderleaf2_qfx5130-32cd (evo)

- `minimum`: `evo/routing-instances/evpn-elan/ri-mac-vrf-vlan-aware-interconnect-translation-vni-50-vlans-borderleaf.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
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
  - occurrence-selection-required: logical-interface:$IRB_IFL_41
  - occurrence-selection-required: logical-interface:$IRB_IFL_42
  - occurrence-selection-required: logical-interface:$IRB_IFL_43
  - occurrence-selection-required: logical-interface:$IRB_IFL_44
  - occurrence-selection-required: logical-interface:$IRB_IFL_45
  - occurrence-selection-required: logical-interface:$IRB_IFL_46
  - occurrence-selection-required: logical-interface:$IRB_IFL_47
  - occurrence-selection-required: logical-interface:$IRB_IFL_48
  - occurrence-selection-required: logical-interface:$IRB_IFL_49
  - occurrence-selection-required: logical-interface:$IRB_IFL_50

### dc1-dc4_type2_type5_seamless/dc4_services-leaf1_qfx5130-48c (evo)

- `minimum`: `evo/routing-instances/evpn-elan/ri-mac-vrf-vlan-aware-interconnect-translation-vni-50-vlans-services-leaf.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
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
  - occurrence-selection-required: logical-interface:$IRB_IFL_41
  - occurrence-selection-required: logical-interface:$IRB_IFL_42
  - occurrence-selection-required: logical-interface:$IRB_IFL_43
  - occurrence-selection-required: logical-interface:$IRB_IFL_44
  - occurrence-selection-required: logical-interface:$IRB_IFL_45
  - occurrence-selection-required: logical-interface:$IRB_IFL_46
  - occurrence-selection-required: logical-interface:$IRB_IFL_47
  - occurrence-selection-required: logical-interface:$IRB_IFL_48
  - occurrence-selection-required: logical-interface:$IRB_IFL_49
  - occurrence-selection-required: logical-interface:$IRB_IFL_50

### dc1-dc4_type2_type5_seamless/dc4_services-leaf2_qfx5130-48c (evo)

- `minimum`: `evo/routing-instances/evpn-elan/ri-mac-vrf-vlan-aware-interconnect-translation-vni-50-vlans-services-leaf.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
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
  - occurrence-selection-required: logical-interface:$IRB_IFL_41
  - occurrence-selection-required: logical-interface:$IRB_IFL_42
  - occurrence-selection-required: logical-interface:$IRB_IFL_43
  - occurrence-selection-required: logical-interface:$IRB_IFL_44
  - occurrence-selection-required: logical-interface:$IRB_IFL_45
  - occurrence-selection-required: logical-interface:$IRB_IFL_46
  - occurrence-selection-required: logical-interface:$IRB_IFL_47
  - occurrence-selection-required: logical-interface:$IRB_IFL_48
  - occurrence-selection-required: logical-interface:$IRB_IFL_49
  - occurrence-selection-required: logical-interface:$IRB_IFL_50

---

## EVPN Type 5 VRF with ten IRB units and a loopback unit

Family l3vpn, form evpn-type5-vrf-10-irb. OS mode MIXED. Attachment: The MAC-VRF VLANs' IRB units and the VRF loopback unit..

### dc1-dc4_type2_type5_seamless/dc4_storage-leaf1_qfx5130-32cd (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-vrf-evpn-type-5-10-irb.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: irb-service:source-occurrence
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
  - occurrence-selection-required: logical-interface:$LOOPBACK_IFL
  - occurrence-selection-required: policy-statement:$IP_PREFIX_EXPORT_POL

### dc1-dc4_type2_type5_seamless/dc4_storage-leaf2_qfx5130-32cd (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-vrf-evpn-type-5-10-irb.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: irb-service:source-occurrence
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
  - occurrence-selection-required: logical-interface:$LOOPBACK_IFL
  - occurrence-selection-required: policy-statement:$IP_PREFIX_EXPORT_POL

### dc1-dc3_type2_seamless/dc1_leaf1_qfx5120-48y (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-vrf-evpn-type-5-10-irb.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: irb-service:source-occurrence
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
  - occurrence-selection-required: logical-interface:$LOOPBACK_IFL
  - occurrence-selection-required: policy-statement:$IP_PREFIX_EXPORT_POL

### dc1-dc4_type2_type5_seamless/dc1_leaf1_qfx5120-48y (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-vrf-evpn-type-5-10-irb.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: irb-service:source-occurrence
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
  - occurrence-selection-required: logical-interface:$LOOPBACK_IFL
  - occurrence-selection-required: policy-statement:$IP_PREFIX_EXPORT_POL

---

## EVPN Type 5 VRF with DHCP relay, twenty IRB units and a loopback unit (blue tenant)

Family l3vpn, form evpn-type5-vrf-dhcp-relay-20-irb-blue. OS mode Junos. Attachment: The MAC-VRF VLANs' IRB units and the VRF loopback unit, which DHCP relay uses as its source..

### dc1-dc2_ott/dc1_esi-leaf1_qfx5120-48y (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-vrf-evpn-type-5-dhcp-relay-20-irb-blue.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: irb-service:source-occurrence
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
  - occurrence-selection-required: policy-statement:$IP_PREFIX_EXPORT_POL

### dc1-dc2_ott/dc1_esi-leaf2_qfx5120-48y (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-vrf-evpn-type-5-dhcp-relay-20-irb-blue.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: irb-service:source-occurrence
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
  - occurrence-selection-required: policy-statement:$IP_PREFIX_EXPORT_POL

### dc1-dc2_ott/dc1_server-leaf1_qfx5120-48y (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-vrf-evpn-type-5-dhcp-relay-20-irb-blue.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: irb-service:source-occurrence
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
  - occurrence-selection-required: policy-statement:$IP_PREFIX_EXPORT_POL

### dc1-dc4_type2_type5_seamless/dc1_leaf1_qfx5120-48y (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-vrf-evpn-type-5-dhcp-relay-20-irb-blue.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: irb-service:source-occurrence
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
  - occurrence-selection-required: policy-statement:$IP_PREFIX_EXPORT_POL

### dc1-dc4_type2_type5_seamless/dc1_leaf2_qfx5120-48y (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-vrf-evpn-type-5-dhcp-relay-20-irb-blue.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: irb-service:source-occurrence
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
  - occurrence-selection-required: policy-statement:$IP_PREFIX_EXPORT_POL

### dc1-dc4_type2_type5_seamless/dc1_leaf3_qfx5120-48y (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-vrf-evpn-type-5-dhcp-relay-20-irb-blue.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: irb-service:source-occurrence
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
  - occurrence-selection-required: policy-statement:$IP_PREFIX_EXPORT_POL

### dc1-dc4_type2_type5_seamless/dc4_compute-leaf1_qfx5120-48ym (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-vrf-evpn-type-5-dhcp-relay-20-irb-blue.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: irb-service:source-occurrence
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
  - occurrence-selection-required: policy-statement:$IP_PREFIX_EXPORT_POL

### dc1-dc4_type2_type5_seamless/dc4_compute-leaf2_qfx5120-48ym (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-vrf-evpn-type-5-dhcp-relay-20-irb-blue.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: irb-service:source-occurrence
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
  - occurrence-selection-required: policy-statement:$IP_PREFIX_EXPORT_POL

---

## EVPN Type 5 VRF with DHCP relay, twenty IRB units and a loopback unit (red tenant)

Family l3vpn, form evpn-type5-vrf-dhcp-relay-20-irb-red. OS mode Junos. Attachment: The MAC-VRF VLANs' IRB units and the VRF loopback unit, which DHCP relay uses as its source..

### dc1-dc2_ott/dc1_esi-leaf1_qfx5120-48y (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-vrf-evpn-type-5-dhcp-relay-20-irb-red.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: irb-service:source-occurrence
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
  - occurrence-selection-required: policy-statement:$IP_PREFIX_EXPORT_POL

### dc1-dc2_ott/dc1_esi-leaf2_qfx5120-48y (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-vrf-evpn-type-5-dhcp-relay-20-irb-red.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: irb-service:source-occurrence
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
  - occurrence-selection-required: policy-statement:$IP_PREFIX_EXPORT_POL

### dc1-dc2_ott/dc1_server-leaf1_qfx5120-48y (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-vrf-evpn-type-5-dhcp-relay-20-irb-red.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: irb-service:source-occurrence
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
  - occurrence-selection-required: policy-statement:$IP_PREFIX_EXPORT_POL

### dc1-dc4_type2_type5_seamless/dc1_leaf1_qfx5120-48y (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-vrf-evpn-type-5-dhcp-relay-20-irb-red.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: irb-service:source-occurrence
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
  - occurrence-selection-required: policy-statement:$IP_PREFIX_EXPORT_POL

### dc1-dc4_type2_type5_seamless/dc1_leaf2_qfx5120-48y (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-vrf-evpn-type-5-dhcp-relay-20-irb-red.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: irb-service:source-occurrence
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
  - occurrence-selection-required: policy-statement:$IP_PREFIX_EXPORT_POL

### dc1-dc4_type2_type5_seamless/dc1_leaf3_qfx5120-48y (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-vrf-evpn-type-5-dhcp-relay-20-irb-red.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: irb-service:source-occurrence
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
  - occurrence-selection-required: policy-statement:$IP_PREFIX_EXPORT_POL

### dc1-dc4_type2_type5_seamless/dc4_compute-leaf1_qfx5120-48ym (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-vrf-evpn-type-5-dhcp-relay-20-irb-red.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: irb-service:source-occurrence
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
  - occurrence-selection-required: policy-statement:$IP_PREFIX_EXPORT_POL

### dc1-dc4_type2_type5_seamless/dc4_compute-leaf2_qfx5120-48ym (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-vrf-evpn-type-5-dhcp-relay-20-irb-red.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: irb-service:source-occurrence
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
  - occurrence-selection-required: policy-statement:$IP_PREFIX_EXPORT_POL

---

## EVPN Type 5 VRF with DHCP relay (loopback as relay source), ten IRB units and a loopback unit (blue tenant)

Family l3vpn, form evpn-type5-vrf-dhcp-relay-overrides-10-irb-blue. OS mode Junos. Attachment: The MAC-VRF VLANs' IRB units and the VRF loopback unit, which DHCP relay uses as its source..

### dc1-dc3_type2_seamless/dc1_leaf1_qfx5120-48y (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-vrf-evpn-type-5-dhcp-relay-overrides-10-irb-blue.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: irb-service:source-occurrence
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
  - occurrence-selection-required: logical-interface:$LOOPBACK_IFL
  - occurrence-selection-required: policy-statement:$IP_PREFIX_EXPORT_POL

### dc1-dc3_type2_seamless/dc1_leaf2_qfx5120-48y (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-vrf-evpn-type-5-dhcp-relay-overrides-10-irb-blue.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: irb-service:source-occurrence
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
  - occurrence-selection-required: logical-interface:$LOOPBACK_IFL
  - occurrence-selection-required: policy-statement:$IP_PREFIX_EXPORT_POL

### dc1-dc3_type2_seamless/dc1_leaf3_qfx5120-48y (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-vrf-evpn-type-5-dhcp-relay-overrides-10-irb-blue.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: irb-service:source-occurrence
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
  - occurrence-selection-required: logical-interface:$LOOPBACK_IFL
  - occurrence-selection-required: policy-statement:$IP_PREFIX_EXPORT_POL

---

## EVPN Type 5 VRF with DHCP relay (loopback as relay source), ten IRB units and a loopback unit (red tenant)

Family l3vpn, form evpn-type5-vrf-dhcp-relay-overrides-10-irb-red. OS mode Junos. Attachment: The MAC-VRF VLANs' IRB units and the VRF loopback unit, which DHCP relay uses as its source..

### dc1-dc3_type2_seamless/dc1_leaf1_qfx5120-48y (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-vrf-evpn-type-5-dhcp-relay-overrides-10-irb-red.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: irb-service:source-occurrence
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
  - occurrence-selection-required: logical-interface:$LOOPBACK_IFL
  - occurrence-selection-required: policy-statement:$IP_PREFIX_EXPORT_POL

### dc1-dc3_type2_seamless/dc1_leaf2_qfx5120-48y (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-vrf-evpn-type-5-dhcp-relay-overrides-10-irb-red.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: irb-service:source-occurrence
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
  - occurrence-selection-required: logical-interface:$LOOPBACK_IFL
  - occurrence-selection-required: policy-statement:$IP_PREFIX_EXPORT_POL

### dc1-dc3_type2_seamless/dc1_leaf3_qfx5120-48y (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-vrf-evpn-type-5-dhcp-relay-overrides-10-irb-red.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: irb-service:source-occurrence
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
  - occurrence-selection-required: logical-interface:$LOOPBACK_IFL
  - occurrence-selection-required: policy-statement:$IP_PREFIX_EXPORT_POL

---

## EVPN Type 5 VRF with DHCP relay (loopback as relay source), twenty IRB units and a loopback unit (blue tenant)

Family l3vpn, form evpn-type5-vrf-dhcp-relay-overrides-20-irb-blue. OS mode Junos. Attachment: The MAC-VRF VLANs' IRB units and the VRF loopback unit, which DHCP relay uses as its source..

### dc1-dc2_ott/dc2_esi-leaf1_qfx5120-48y (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-vrf-evpn-type-5-dhcp-relay-overrides-20-irb-blue.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: irb-service:source-occurrence
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
  - occurrence-selection-required: policy-statement:$IP_PREFIX_EXPORT_POL

### dc1-dc2_ott/dc2_esi-leaf2_qfx5120-48y (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-vrf-evpn-type-5-dhcp-relay-overrides-20-irb-blue.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: irb-service:source-occurrence
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
  - occurrence-selection-required: policy-statement:$IP_PREFIX_EXPORT_POL

### dc1-dc2_ott/dc2_server-leaf1_qfx5120-48y (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-vrf-evpn-type-5-dhcp-relay-overrides-20-irb-blue.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: irb-service:source-occurrence
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
  - occurrence-selection-required: policy-statement:$IP_PREFIX_EXPORT_POL

---

## EVPN Type 5 VRF with DHCP relay (loopback as relay source), twenty IRB units and a loopback unit (red tenant)

Family l3vpn, form evpn-type5-vrf-dhcp-relay-overrides-20-irb-red. OS mode Junos. Attachment: The MAC-VRF VLANs' IRB units and the VRF loopback unit, which DHCP relay uses as its source..

### dc1-dc2_ott/dc2_esi-leaf1_qfx5120-48y (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-vrf-evpn-type-5-dhcp-relay-overrides-20-irb-red.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: irb-service:source-occurrence
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
  - occurrence-selection-required: policy-statement:$IP_PREFIX_EXPORT_POL

### dc1-dc2_ott/dc2_esi-leaf2_qfx5120-48y (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-vrf-evpn-type-5-dhcp-relay-overrides-20-irb-red.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: irb-service:source-occurrence
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
  - occurrence-selection-required: policy-statement:$IP_PREFIX_EXPORT_POL

### dc1-dc2_ott/dc2_server-leaf1_qfx5120-48y (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-vrf-evpn-type-5-dhcp-relay-overrides-20-irb-red.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: irb-service:source-occurrence
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
  - occurrence-selection-required: policy-statement:$IP_PREFIX_EXPORT_POL

---

## EVPN Type 5 VRF with an EVPN interconnect toward the remote data center, ten IRB units and a loopback unit

Family l3vpn, form evpn-type5-vrf-interconnect-10-irb. OS mode EVO. Attachment: The MAC-VRF VLANs' IRB units and the VRF loopback unit; the interconnect stretches the VRF to the remote data center..

### dc1-dc4_type2_type5_seamless/dc1_borderleaf1_qfx5130-32cd (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-vrf-evpn-type-5-interconnect-10-irb.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: irb-service:source-occurrence
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
  - occurrence-selection-required: logical-interface:$LOOPBACK_IFL
  - occurrence-selection-required: policy-statement:$IP_PREFIX_EXPORT_POL

### dc1-dc4_type2_type5_seamless/dc1_borderleaf2_qfx5130-32cd (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-vrf-evpn-type-5-interconnect-10-irb.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: irb-service:source-occurrence
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
  - occurrence-selection-required: logical-interface:$LOOPBACK_IFL
  - occurrence-selection-required: policy-statement:$IP_PREFIX_EXPORT_POL

### dc1-dc4_type2_type5_seamless/dc4_services-leaf1_qfx5130-48c (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-vrf-evpn-type-5-interconnect-10-irb.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: irb-service:source-occurrence
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
  - occurrence-selection-required: logical-interface:$LOOPBACK_IFL
  - occurrence-selection-required: policy-statement:$IP_PREFIX_EXPORT_POL

### dc1-dc4_type2_type5_seamless/dc4_services-leaf2_qfx5130-48c (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-vrf-evpn-type-5-interconnect-10-irb.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: irb-service:source-occurrence
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
  - occurrence-selection-required: logical-interface:$LOOPBACK_IFL
  - occurrence-selection-required: policy-statement:$IP_PREFIX_EXPORT_POL

---

## Border EVPN Type 5 VRF with eBGP (IPv4 and IPv6) to the external router, DHCP relay and a loopback unit (blue tenant)

Family l3vpn, form evpn-type5-vrf-ebgp-dhcp-relay-blue. OS mode EVO. Attachment: The attachment unit toward the external router and the VRF loopback unit, which DHCP relay uses as its source..

### dc1-dc2_ott/dc1_borderleaf1_qfx5130-32cd (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-vrf-evpn-type-5-ebgp-dhcp-relay-blue.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL
  - occurrence-selection-required: logical-interface:$LOOPBACK_IFL
  - occurrence-selection-required: policy-statement:$BGP_IMPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_IMPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL
  - occurrence-selection-required: policy-statement:$IP_PREFIX_EXPORT_POL

### dc1-dc2_ott/dc1_borderleaf2_qfx5130-32cd (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-vrf-evpn-type-5-ebgp-dhcp-relay-blue.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL
  - occurrence-selection-required: logical-interface:$LOOPBACK_IFL
  - occurrence-selection-required: policy-statement:$BGP_IMPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_IMPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL
  - occurrence-selection-required: policy-statement:$IP_PREFIX_EXPORT_POL

### dc1-dc2_ott/dc2_borderleaf1_qfx5700 (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-vrf-evpn-type-5-ebgp-dhcp-relay-blue.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL
  - occurrence-selection-required: logical-interface:$LOOPBACK_IFL
  - occurrence-selection-required: policy-statement:$BGP_IMPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_IMPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL
  - occurrence-selection-required: policy-statement:$IP_PREFIX_EXPORT_POL

### dc1-dc2_ott/dc2_borderleaf2_qfx5700 (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-vrf-evpn-type-5-ebgp-dhcp-relay-blue.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL
  - occurrence-selection-required: logical-interface:$LOOPBACK_IFL
  - occurrence-selection-required: policy-statement:$BGP_IMPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_IMPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL
  - occurrence-selection-required: policy-statement:$IP_PREFIX_EXPORT_POL

---

## Border EVPN Type 5 VRF with eBGP (IPv4 and IPv6) to the external router, DHCP relay (loopback as relay source), ten IRB units and a loopback unit (blue tenant)

Family l3vpn, form evpn-type5-vrf-ebgp-dhcp-relay-overrides-10-irb-blue. OS mode EVO. Attachment: The attachment unit toward the external router, the MAC-VRF VLANs' IRB units and the VRF loopback unit, which DHCP relay uses as its source..

### dc1-dc3_type2_seamless/dc1_borderleaf1_qfx5130-32cd (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-vrf-evpn-type-5-ebgp-dhcp-relay-overrides-10-irb-blue.conf`
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
  - occurrence-selection-required: logical-interface:$LOOPBACK_IFL
  - occurrence-selection-required: policy-statement:$BGP_IMPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_IMPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL
  - occurrence-selection-required: policy-statement:$IP_PREFIX_EXPORT_POL

### dc1-dc3_type2_seamless/dc1_borderleaf2_qfx5130-32cd (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-vrf-evpn-type-5-ebgp-dhcp-relay-overrides-10-irb-blue.conf`
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
  - occurrence-selection-required: logical-interface:$LOOPBACK_IFL
  - occurrence-selection-required: policy-statement:$BGP_IMPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_IMPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL
  - occurrence-selection-required: policy-statement:$IP_PREFIX_EXPORT_POL

---

## Border EVPN Type 5 VRF with eBGP (IPv4 and IPv6) to the external router, DHCP relay (loopback as relay source), ten IRB units and a loopback unit (red tenant)

Family l3vpn, form evpn-type5-vrf-ebgp-dhcp-relay-overrides-10-irb-red. OS mode EVO. Attachment: The attachment unit toward the external router, the MAC-VRF VLANs' IRB units and the VRF loopback unit, which DHCP relay uses as its source..

### dc1-dc3_type2_seamless/dc1_borderleaf1_qfx5130-32cd (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-vrf-evpn-type-5-ebgp-dhcp-relay-overrides-10-irb-red.conf`
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
  - occurrence-selection-required: logical-interface:$LOOPBACK_IFL
  - occurrence-selection-required: policy-statement:$BGP_IMPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_IMPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL
  - occurrence-selection-required: policy-statement:$IP_PREFIX_EXPORT_POL

### dc1-dc3_type2_seamless/dc1_borderleaf2_qfx5130-32cd (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-vrf-evpn-type-5-ebgp-dhcp-relay-overrides-10-irb-red.conf`
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
  - occurrence-selection-required: logical-interface:$LOOPBACK_IFL
  - occurrence-selection-required: policy-statement:$BGP_IMPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_IMPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL
  - occurrence-selection-required: policy-statement:$IP_PREFIX_EXPORT_POL

---

## Border EVPN Type 5 VRF with eBGP (IPv4 and IPv6) to the external router, DHCP relay and a loopback unit (red tenant)

Family l3vpn, form evpn-type5-vrf-ebgp-dhcp-relay-red. OS mode EVO. Attachment: The attachment unit toward the external router and the VRF loopback unit, which DHCP relay uses as its source..

### dc1-dc2_ott/dc1_borderleaf1_qfx5130-32cd (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-vrf-evpn-type-5-ebgp-dhcp-relay-red.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL
  - occurrence-selection-required: logical-interface:$LOOPBACK_IFL
  - occurrence-selection-required: policy-statement:$BGP_IMPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_IMPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL
  - occurrence-selection-required: policy-statement:$IP_PREFIX_EXPORT_POL

### dc1-dc2_ott/dc1_borderleaf2_qfx5130-32cd (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-vrf-evpn-type-5-ebgp-dhcp-relay-red.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL
  - occurrence-selection-required: logical-interface:$LOOPBACK_IFL
  - occurrence-selection-required: policy-statement:$BGP_IMPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_IMPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL
  - occurrence-selection-required: policy-statement:$IP_PREFIX_EXPORT_POL

### dc1-dc2_ott/dc2_borderleaf1_qfx5700 (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-vrf-evpn-type-5-ebgp-dhcp-relay-red.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL
  - occurrence-selection-required: logical-interface:$LOOPBACK_IFL
  - occurrence-selection-required: policy-statement:$BGP_IMPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_IMPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL
  - occurrence-selection-required: policy-statement:$IP_PREFIX_EXPORT_POL

### dc1-dc2_ott/dc2_borderleaf2_qfx5700 (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-vrf-evpn-type-5-ebgp-dhcp-relay-red.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL
  - occurrence-selection-required: logical-interface:$LOOPBACK_IFL
  - occurrence-selection-required: policy-statement:$BGP_IMPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_IMPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL
  - occurrence-selection-required: policy-statement:$IP_PREFIX_EXPORT_POL

---

## Border EVPN Type 5 VRF with eBGP (IPv4) to the external router, ten IRB units and a loopback unit (blue tenant)

Family l3vpn, form evpn-type5-vrf-ebgp-inet-10-irb-blue. OS mode Junos. Attachment: The attachment unit toward the external router, the MAC-VRF VLANs' IRB units and the VRF loopback unit..

### dc1-dc3_type2_seamless/dc3_leaf1_qfx5120-48y (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-vrf-evpn-type-5-ebgp-inet-10-irb-blue.conf`
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
  - occurrence-selection-required: logical-interface:$LOOPBACK_IFL
  - occurrence-selection-required: policy-statement:$BGP_IMPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL
  - occurrence-selection-required: policy-statement:$IP_PREFIX_EXPORT_POL

### dc1-dc3_type2_seamless/dc3_leaf2_qfx5120-48y (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-vrf-evpn-type-5-ebgp-inet-10-irb-blue.conf`
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
  - occurrence-selection-required: logical-interface:$LOOPBACK_IFL
  - occurrence-selection-required: policy-statement:$BGP_IMPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL
  - occurrence-selection-required: policy-statement:$IP_PREFIX_EXPORT_POL

---

## Border EVPN Type 5 VRF with eBGP (IPv4) to the external router, ten IRB units and a loopback unit (red tenant)

Family l3vpn, form evpn-type5-vrf-ebgp-inet-10-irb-red. OS mode Junos. Attachment: The attachment unit toward the external router, the MAC-VRF VLANs' IRB units and the VRF loopback unit..

### dc1-dc3_type2_seamless/dc3_leaf1_qfx5120-48y (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-vrf-evpn-type-5-ebgp-inet-10-irb-red.conf`
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
  - occurrence-selection-required: logical-interface:$LOOPBACK_IFL
  - occurrence-selection-required: policy-statement:$BGP_IMPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL
  - occurrence-selection-required: policy-statement:$IP_PREFIX_EXPORT_POL

### dc1-dc3_type2_seamless/dc3_leaf2_qfx5120-48y (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-vrf-evpn-type-5-ebgp-inet-10-irb-red.conf`
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
  - occurrence-selection-required: logical-interface:$LOOPBACK_IFL
  - occurrence-selection-required: policy-statement:$BGP_IMPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL
  - occurrence-selection-required: policy-statement:$IP_PREFIX_EXPORT_POL

---

## Border EVPN Type 5 VRF with eBGP (IPv4 and IPv6) to the external router, an EVPN interconnect toward the remote data center, DHCP relay, twenty IRB units and a loopback unit (blue tenant)

Family l3vpn, form evpn-type5-vrf-ebgp-interconnect-dhcp-relay-20-irb-blue. OS mode EVO. Attachment: The attachment unit toward the external router, the MAC-VRF VLANs' IRB units and the VRF loopback unit, which DHCP relay uses as its source; the interconnect stretches the VRF to the remote data center..

### dc1-dc4_type2_type5_seamless/dc1_borderleaf1_qfx5130-32cd (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-vrf-evpn-type-5-ebgp-interconnect-dhcp-relay-20-irb-blue.conf`
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
  - occurrence-selection-required: policy-statement:$BGP_IMPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL
  - occurrence-selection-required: policy-statement:$IP_PREFIX_EXPORT_POL

### dc1-dc4_type2_type5_seamless/dc1_borderleaf2_qfx5130-32cd (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-vrf-evpn-type-5-ebgp-interconnect-dhcp-relay-20-irb-blue.conf`
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
  - occurrence-selection-required: policy-statement:$BGP_IMPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL
  - occurrence-selection-required: policy-statement:$IP_PREFIX_EXPORT_POL

### dc1-dc4_type2_type5_seamless/dc4_services-leaf1_qfx5130-48c (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-vrf-evpn-type-5-ebgp-interconnect-dhcp-relay-20-irb-blue.conf`
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
  - occurrence-selection-required: policy-statement:$BGP_IMPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL
  - occurrence-selection-required: policy-statement:$IP_PREFIX_EXPORT_POL

### dc1-dc4_type2_type5_seamless/dc4_services-leaf2_qfx5130-48c (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-vrf-evpn-type-5-ebgp-interconnect-dhcp-relay-20-irb-blue.conf`
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
  - occurrence-selection-required: policy-statement:$BGP_IMPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL
  - occurrence-selection-required: policy-statement:$IP_PREFIX_EXPORT_POL

---

## Border EVPN Type 5 VRF with eBGP (IPv4 and IPv6) to the external router, an EVPN interconnect toward the remote data center, DHCP relay, twenty IRB units and a loopback unit (red tenant)

Family l3vpn, form evpn-type5-vrf-ebgp-interconnect-dhcp-relay-20-irb-red. OS mode EVO. Attachment: The attachment unit toward the external router, the MAC-VRF VLANs' IRB units and the VRF loopback unit, which DHCP relay uses as its source; the interconnect stretches the VRF to the remote data center..

### dc1-dc4_type2_type5_seamless/dc1_borderleaf1_qfx5130-32cd (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-vrf-evpn-type-5-ebgp-interconnect-dhcp-relay-20-irb-red.conf`
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
  - occurrence-selection-required: policy-statement:$BGP_IMPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL
  - occurrence-selection-required: policy-statement:$IP_PREFIX_EXPORT_POL

### dc1-dc4_type2_type5_seamless/dc1_borderleaf2_qfx5130-32cd (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-vrf-evpn-type-5-ebgp-interconnect-dhcp-relay-20-irb-red.conf`
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
  - occurrence-selection-required: policy-statement:$BGP_IMPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL
  - occurrence-selection-required: policy-statement:$IP_PREFIX_EXPORT_POL

### dc1-dc4_type2_type5_seamless/dc4_services-leaf1_qfx5130-48c (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-vrf-evpn-type-5-ebgp-interconnect-dhcp-relay-20-irb-red.conf`
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
  - occurrence-selection-required: policy-statement:$BGP_IMPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL
  - occurrence-selection-required: policy-statement:$IP_PREFIX_EXPORT_POL

### dc1-dc4_type2_type5_seamless/dc4_services-leaf2_qfx5130-48c (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-vrf-evpn-type-5-ebgp-interconnect-dhcp-relay-20-irb-red.conf`
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
  - occurrence-selection-required: policy-statement:$BGP_IMPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL
  - occurrence-selection-required: policy-statement:$IP_PREFIX_EXPORT_POL

---
