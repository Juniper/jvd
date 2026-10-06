# Configuration form tiers

<!-- GENERATED FROM configuration/snips/_composition.json by the build tooling (generate-tiers). Do not edit by hand: run `JVD_REPO=<checkout> npm run tiers -- --jvd enterprise_wan/ewan_dc_edge`. -->

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

## EVPN-VXLAN to EVPN-MPLS interconnect, VLAN-based with IRB

Family evpn-interconnect, form vlan-based-irb. OS mode Junos. Attachment: IRB unit named by routing-interface; the instance has no attachment interface.

### dc-edge1_mx480 (junos)

- `minimum`: `junos/routing-instances/evpn-interconnect/ri-evpn-interconnect-vlan-based-irb.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:irb.$IRB_UNIT
  - occurrence-selection-required: policy-statement:lo0
  - occurrence-selection-required: policy-statement:policy_ospf_bgp

### dc-edge2_mx10003 (junos)

- `minimum`: `junos/routing-instances/evpn-interconnect/ri-evpn-interconnect-vlan-based-irb.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:irb.$IRB_UNIT
  - occurrence-selection-required: policy-statement:lo0
  - occurrence-selection-required: policy-statement:policy_ospf_bgp

---

## EVPN-VXLAN to EVPN-MPLS interconnect, VLAN bundle

Family evpn-interconnect, form vlan-bundle. OS mode Junos. Attachment: none in the instance; the bundle shares one VNI toward the fabric.

### dc-edge1_mx480 (junos)

- `minimum`: `junos/routing-instances/evpn-interconnect/ri-evpn-interconnect-vlan-bundle.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: policy-statement:lo0
  - occurrence-selection-required: policy-statement:policy_ospf_bgp

### dc-edge2_mx10003 (junos)

- `minimum`: `junos/routing-instances/evpn-interconnect/ri-evpn-interconnect-vlan-bundle.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: policy-statement:lo0
  - occurrence-selection-required: policy-statement:policy_ospf_bgp

---

## Leaf MAC-VRF, VLAN-based

Family evpn-elan, form mac-vrf-vlan-based. OS mode Junos. Attachment: VLAN logical unit, on an ESI-LAG where the source uses one.

### leaf1_qfx5120-48t (junos)

- `minimum`: `junos/routing-instances/evpn-elan/ri-evpn-elan-mac-vrf-vlan-based.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_INTF
  - occurrence-selection-required: policy-statement:lo0

### leaf2_qfx5120-48t (junos)

- `minimum`: `junos/routing-instances/evpn-elan/ri-evpn-elan-mac-vrf-vlan-based.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_INTF
  - occurrence-selection-required: policy-statement:lo0

---

## Leaf MAC-VRF, VLAN bundle

Family evpn-elan, form mac-vrf-vlan-bundle. OS mode Junos. Attachment: ESI-LAG interface.

### leaf1_qfx5120-48t (junos)

- `minimum`: `junos/routing-instances/evpn-elan/ri-evpn-elan-mac-vrf-vlan-bundle.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_INTF
  - occurrence-selection-required: policy-statement:lo0

### leaf2_qfx5120-48t (junos)

- `minimum`: `junos/routing-instances/evpn-elan/ri-evpn-elan-mac-vrf-vlan-bundle.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_INTF
  - occurrence-selection-required: policy-statement:lo0

---

## WAN edge EVPN-MPLS, VLAN-based with IRB routing-interface

Family evpn-elan, form vlan-based-irb. OS mode Junos. Attachment: VLAN logical unit plus IRB unit named by routing-interface.

### wan-edge1_mx204 (junos)

- `minimum`: `junos/routing-instances/evpn-elan/ri-evpn-elan-vlan-based-irb.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:irb.$IRB_UNIT
  - occurrence-selection-required: logical-interface:$AC_INTF

---

## WAN edge EVPN-MPLS, VLAN-based with IRB l3-interface

Family evpn-elan, form vlan-based-l3-interface. OS mode Junos. Attachment: VLAN logical unit plus IRB unit named by l3-interface.

### wan-edge2_acx5448-m (junos)

- `minimum`: `junos/routing-instances/evpn-elan/ri-evpn-elan-vlan-based-l3-interface.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:irb.$IRB_UNIT
  - occurrence-selection-required: logical-interface:$AC_INTF

---

## WAN edge EVPN-MPLS, VLAN bundle

Family evpn-elan, form vlan-bundle. OS mode Junos. Attachment: VLAN-list logical unit.

### wan-edge1_mx204 (junos)

- `minimum`: `junos/routing-instances/evpn-elan/ri-evpn-elan-vlan-bundle.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_INTF

### wan-edge2_acx5448-m (junos)

- `minimum`: `junos/routing-instances/evpn-elan/ri-evpn-elan-vlan-bundle.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_INTF

---

## WAN edge EVPN-MPLS, VLAN bundle with no-gateway-community

Family evpn-elan, form vlan-bundle-no-gateway-community. OS mode Junos. Attachment: VLAN-list logical unit.

### wan-edge2_acx5448-m (junos)

- `minimum`: `junos/routing-instances/evpn-elan/ri-evpn-elan-vlan-bundle-no-gateway-community.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_INTF

---
