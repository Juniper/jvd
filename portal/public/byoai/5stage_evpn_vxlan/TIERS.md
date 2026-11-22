# Configuration form tiers

<!-- GENERATED FROM configuration/snips/_composition.json by the build tooling (generate-tiers). Do not edit by hand: run `JVD_REPO=<checkout> npm run tiers -- --jvd data_center/adc/5stage_evpn_vxlan`. -->

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

## EVPN-VXLAN MAC-VRF with 51 VLANs and IGMP snooping

Family e-lan, form evpn-mac-vrf-51-vlans-igmp-snooping. OS mode Junos. Attachment: Access units on the compute leaves (the ESI-LAG and single-homed server ports) and the VLANs' IRB units, which the Type 5 VRFs route..

### compute-leaf1_qfx5120-48ym (junos)

- `minimum`: `junos/routing-instances/evpn-elan/ri-mac-vrf-vlan-aware-51-vlans-igmp-snooping-proxy-3-ac.conf`
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
  - occurrence-selection-required: logical-interface:$IRB_IFL_51

### compute-leaf2_qfx5120-48ym (junos)

- `minimum`: `junos/routing-instances/evpn-elan/ri-mac-vrf-vlan-aware-51-vlans-igmp-snooping-proxy-2-ac.conf`
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
  - occurrence-selection-required: logical-interface:$IRB_IFL_51

---

## EVPN-VXLAN MAC-VRF with 51 VLANs, IGMP snooping and OISM

Family e-lan, form evpn-mac-vrf-51-vlans-igmp-snooping-oism. OS mode EVO. Attachment: Access units on the storage and services leaves and the VLANs' IRB units, which the Type 5 VRFs route; OISM joins the VLANs to the VRFs' multicast..

### services-leaf1_qfx5130-48c (evo)

- `minimum`: `evo/routing-instances/evpn-elan/ri-mac-vrf-vlan-aware-51-vlans-igmp-snooping-oism-2-ac.conf`
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
  - occurrence-selection-required: logical-interface:$IRB_IFL_51

### services-leaf2_qfx5130-48c (evo)

- `minimum`: `evo/routing-instances/evpn-elan/ri-mac-vrf-vlan-aware-51-vlans-igmp-snooping-oism-2-ac.conf`
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
  - occurrence-selection-required: logical-interface:$IRB_IFL_51

### storage-leaf1_qfx5130-32cd (evo)

- `minimum`: `evo/routing-instances/evpn-elan/ri-mac-vrf-vlan-aware-51-vlans-igmp-snooping-proxy-oism-3-ac.conf`
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
  - occurrence-selection-required: logical-interface:$IRB_IFL_51

### storage-leaf2_qfx5130-32cd (evo)

- `minimum`: `evo/routing-instances/evpn-elan/ri-mac-vrf-vlan-aware-51-vlans-igmp-snooping-proxy-oism-2-ac.conf`
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
  - occurrence-selection-required: logical-interface:$IRB_IFL_51

---

## EVPN Type 5 VRF with ten IRB units

Family l3vpn, form evpn-type5-vrf-10-irb. OS mode EVO. Attachment: IRB units of the MAC-VRF VLANs and the VRF loopback unit..

### storage-leaf1_qfx5130-32cd (evo)

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

### storage-leaf2_qfx5130-32cd (evo)

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

---

## EVPN Type 5 VRF with ten IRB units and DHCP relay

Family l3vpn, form evpn-type5-vrf-dhcp-relay-10-irb. OS mode Junos. Attachment: IRB units of the MAC-VRF VLANs and the VRF loopback unit, which DHCP relay uses as its source..

### compute-leaf1_qfx5120-48ym (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-vrf-evpn-type-5-dhcp-relay-10-irb.conf`
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

### compute-leaf2_qfx5120-48ym (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-vrf-evpn-type-5-dhcp-relay-10-irb.conf`
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

## EVPN Type 5 VRF with twenty IRB units and DHCP relay

Family l3vpn, form evpn-type5-vrf-dhcp-relay-20-irb. OS mode MIXED. Attachment: IRB units of the MAC-VRF VLANs and the VRF loopback unit, which DHCP relay uses as its source..

### storage-leaf1_qfx5130-32cd (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-vrf-evpn-type-5-dhcp-relay-20-irb.conf`
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

### storage-leaf2_qfx5130-32cd (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-vrf-evpn-type-5-dhcp-relay-20-irb.conf`
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

### compute-leaf1_qfx5120-48ym (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-vrf-evpn-type-5-dhcp-relay-20-irb.conf`
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

### compute-leaf2_qfx5120-48ym (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-vrf-evpn-type-5-dhcp-relay-20-irb.conf`
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

## EVPN Type 5 VRF with OSPF, PIM and OISM

Family l3vpn, form evpn-type5-vrf-ospf-pim-oism. OS mode MIXED. Attachment: IRB units of the MAC-VRF VLANs (one carries OSPF, PIM and the OISM supplemental bridge domain) and the VRF loopback unit..

### storage-leaf1_qfx5130-32cd (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-vrf-evpn-type-5-ospf-pim-oism-dhcp-relay.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: irb-service:source-occurrence
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
  - occurrence-selection-required: logical-interface:$IRB_IFL_1
  - occurrence-selection-required: logical-interface:$LOOPBACK_IFL
  - occurrence-selection-required: policy-statement:$IP_PREFIX_EXPORT_POL

### storage-leaf2_qfx5130-32cd (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-vrf-evpn-type-5-ospf-pim-oism-dhcp-relay.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: irb-service:source-occurrence
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
  - occurrence-selection-required: logical-interface:$IRB_IFL_1
  - occurrence-selection-required: logical-interface:$LOOPBACK_IFL
  - occurrence-selection-required: policy-statement:$IP_PREFIX_EXPORT_POL

### compute-leaf1_qfx5120-48ym (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-vrf-evpn-type-5-ospf-pim-oism-dhcp-relay.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: irb-service:source-occurrence
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
  - occurrence-selection-required: logical-interface:$IRB_IFL_1
  - occurrence-selection-required: logical-interface:$LOOPBACK_IFL
  - occurrence-selection-required: policy-statement:$IP_PREFIX_EXPORT_POL

### compute-leaf2_qfx5120-48ym (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-vrf-evpn-type-5-ospf-pim-oism-dhcp-relay.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: irb-service:source-occurrence
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
  - occurrence-selection-required: logical-interface:$IRB_IFL_1
  - occurrence-selection-required: logical-interface:$LOOPBACK_IFL
  - occurrence-selection-required: policy-statement:$IP_PREFIX_EXPORT_POL

---

## Border EVPN Type 5 VRF with eBGP to the external gateway

Family l3vpn, form border-evpn-type5-vrf-ebgp. OS mode EVO. Attachment: The services leaf's attachment unit toward the external gateway and the VRF loopback unit..

### services-leaf1_qfx5130-48c (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-vrf-evpn-type-5-ebgp.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL
  - occurrence-selection-required: logical-interface:$LOOPBACK_IFL
  - occurrence-selection-required: policy-statement:$BGP_IMPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_IMPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL
  - occurrence-selection-required: policy-statement:$IP_PREFIX_EXPORT_POL

### services-leaf2_qfx5130-48c (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-vrf-evpn-type-5-ebgp.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL
  - occurrence-selection-required: logical-interface:$LOOPBACK_IFL
  - occurrence-selection-required: policy-statement:$BGP_IMPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_IMPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL
  - occurrence-selection-required: policy-statement:$IP_PREFIX_EXPORT_POL

---

## Border EVPN Type 5 VRF with eBGP and ten IRB units

Family l3vpn, form border-evpn-type5-vrf-ebgp-10-irb. OS mode EVO. Attachment: The attachment unit toward the external gateway, the VLANs' IRB units and the VRF loopback unit..

### services-leaf1_qfx5130-48c (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-vrf-evpn-type-5-ebgp-10-irb.conf`
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

### services-leaf2_qfx5130-48c (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-vrf-evpn-type-5-ebgp-10-irb.conf`
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

## Border EVPN Type 5 VRF with eBGP and DHCP relay

Family l3vpn, form border-evpn-type5-vrf-ebgp-dhcp-relay. OS mode EVO. Attachment: The attachment unit toward the external gateway and the VRF loopback unit, which DHCP relay uses as its source..

### services-leaf1_qfx5130-48c (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-vrf-evpn-type-5-ebgp-dhcp-relay.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL
  - occurrence-selection-required: logical-interface:$LOOPBACK_IFL
  - occurrence-selection-required: policy-statement:$BGP_IMPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_IMPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL
  - occurrence-selection-required: policy-statement:$IP_PREFIX_EXPORT_POL

### services-leaf2_qfx5130-48c (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-vrf-evpn-type-5-ebgp-dhcp-relay.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL
  - occurrence-selection-required: logical-interface:$LOOPBACK_IFL
  - occurrence-selection-required: policy-statement:$BGP_IMPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_IMPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL
  - occurrence-selection-required: policy-statement:$IP_PREFIX_EXPORT_POL

---

## Border EVPN Type 5 VRF with eBGP, twenty IRB units and DHCP relay

Family l3vpn, form border-evpn-type5-vrf-ebgp-dhcp-relay-20-irb. OS mode EVO. Attachment: The attachment unit toward the external gateway, the VLANs' IRB units and the VRF loopback unit..

### services-leaf1_qfx5130-48c (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-vrf-evpn-type-5-ebgp-dhcp-relay-20-irb.conf`
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

### services-leaf2_qfx5130-48c (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-vrf-evpn-type-5-ebgp-dhcp-relay-20-irb.conf`
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

## Border EVPN Type 5 VRF with eBGP, OSPF, PIM and OISM

Family l3vpn, form border-evpn-type5-vrf-ebgp-ospf-pim-oism. OS mode EVO. Attachment: The attachment unit toward the external gateway, the VLANs' IRB units (one carries OSPF, PIM and the OISM supplemental bridge domain) and the VRF loopback unit..

### services-leaf1_qfx5130-48c (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-vrf-evpn-type-5-ebgp-ospf-pim-oism-dhcp-relay.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: irb-service:source-occurrence
  - occurrence-selection-required: logical-interface:$AC_IFL
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
  - occurrence-selection-required: logical-interface:$IRB_IFL_1
  - occurrence-selection-required: logical-interface:$LOOPBACK_IFL
  - occurrence-selection-required: policy-statement:$BGP_IMPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_IMPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL
  - occurrence-selection-required: policy-statement:$IP_PREFIX_EXPORT_POL

### services-leaf2_qfx5130-48c (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-vrf-evpn-type-5-ebgp-ospf-pim-oism-dhcp-relay.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: irb-service:source-occurrence
  - occurrence-selection-required: logical-interface:$AC_IFL
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
  - occurrence-selection-required: logical-interface:$IRB_IFL_1
  - occurrence-selection-required: logical-interface:$LOOPBACK_IFL
  - occurrence-selection-required: policy-statement:$BGP_IMPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_IMPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL
  - occurrence-selection-required: policy-statement:$IP_PREFIX_EXPORT_POL

---
