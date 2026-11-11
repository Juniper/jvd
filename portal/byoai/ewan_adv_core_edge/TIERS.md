# Configuration form tiers

<!-- GENERATED FROM configuration/snips/_composition.json by the build tooling (generate-tiers). Do not edit by hand: run `JVD_REPO=<checkout> npm run tiers -- --jvd enterprise_wan/ewan_adv_core_edge`. -->

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

## EVPN-VPWS point-to-point service with control word

Family e-line, form evpn-vpws-control-word. OS mode MIXED. Attachment: VLAN CCC unit on an all-active Ethernet segment aggregate toward the CE..

### wanedge3_acx7509 (evo)

- `minimum`: `evo/routing-instances/evpn-vpws/ri-evpn-vpws-control-word.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL

### wanedge4_acx7100-48l (evo)

- `minimum`: `evo/routing-instances/evpn-vpws/ri-evpn-vpws-control-word.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL

### wanedge1_mx304 (junos)

- `minimum`: `junos/routing-instances/evpn-vpws/ri-evpn-vpws-control-word.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL

### wanedge2_mx10004 (junos)

- `minimum`: `junos/routing-instances/evpn-vpws/ri-evpn-vpws-control-word.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL

---

## EVPN flexible cross-connect, VLAN-aware, two attachment circuits

Family e-line, form evpn-fxc-vlan-aware-2-uni. OS mode MIXED. Attachment: Two VLAN CCC units on an all-active Ethernet segment aggregate toward the CE..

### wanedge3_acx7509 (evo)

- `minimum`: `evo/routing-instances/evpn-vpws/ri-evpn-fxc-vlan-aware-2-uni.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL_A
  - occurrence-selection-required: logical-interface:$AC_IFL_B

### wanedge4_acx7100-48l (evo)

- `minimum`: `evo/routing-instances/evpn-vpws/ri-evpn-fxc-vlan-aware-2-uni.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL_A
  - occurrence-selection-required: logical-interface:$AC_IFL_B

### wanedge1_mx304 (junos)

- `minimum`: `junos/routing-instances/evpn-vpws/ri-evpn-fxc-vlan-aware-2-uni.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL_A
  - occurrence-selection-required: logical-interface:$AC_IFL_B

### wanedge2_mx10004 (junos)

- `minimum`: `junos/routing-instances/evpn-vpws/ri-evpn-fxc-vlan-aware-2-uni.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL_A
  - occurrence-selection-required: logical-interface:$AC_IFL_B

---

## EVPN-ELAN with two attachment circuits

Family e-lan, form evpn-elan-2-uni. OS mode MIXED. Attachment: Two VLAN bridge units toward the CE; Junos uses an EVPN instance, EVO a VLAN-bundle MAC-VRF..

### wanedge3_acx7509 (evo)

- `minimum`: `evo/routing-instances/evpn-elan/ri-evpn-elan-vlan-bundle-2-uni-no-control-word.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL_A
  - occurrence-selection-required: logical-interface:$AC_IFL_B

### wanedge4_acx7100-48l (evo)

- `minimum`: `evo/routing-instances/evpn-elan/ri-evpn-elan-vlan-bundle-2-uni-no-control-word.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL_A
  - occurrence-selection-required: logical-interface:$AC_IFL_B

### wanedge1_mx304 (junos)

- `minimum`: `junos/routing-instances/evpn-elan/ri-evpn-elan-2-uni.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL_A
  - occurrence-selection-required: logical-interface:$AC_IFL_B

### wanedge2_mx10004 (junos)

- `minimum`: `junos/routing-instances/evpn-elan/ri-evpn-elan-2-uni.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL_A
  - occurrence-selection-required: logical-interface:$AC_IFL_B

---

## EVPN-ELAN with one attachment circuit

Family e-lan, form evpn-elan-1-uni. OS mode MIXED. Attachment: One VLAN bridge unit toward the CE; Junos uses an EVPN instance, EVO a VLAN-based MAC-VRF..

### wanedge3_acx7509 (evo)

- `minimum`: `evo/routing-instances/evpn-elan/ri-evpn-elan-vlan-based-no-control-word.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL

### wanedge4_acx7100-48l (evo)

- `minimum`: `evo/routing-instances/evpn-elan/ri-evpn-elan-vlan-based-no-control-word.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL

### wanedge1_mx304 (junos)

- `minimum`: `junos/routing-instances/evpn-elan/ri-evpn-elan-no-normalization.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL

### wanedge2_mx10004 (junos)

- `minimum`: `junos/routing-instances/evpn-elan/ri-evpn-elan-no-normalization.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL

---

## EVPN-ELAN with an IRB gateway

Family e-lan, form evpn-elan-irb. OS mode MIXED. Attachment: One VLAN bridge unit toward the CE and an IRB unit as the layer 3 gateway..

### wanedge3_acx7509 (evo)

- `minimum`: `evo/routing-instances/evpn-elan/ri-evpn-elan-vlan-based-irb.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL
  - occurrence-selection-required: logical-interface:$IRB_UNIT

### wanedge4_acx7100-48l (evo)

- `minimum`: `evo/routing-instances/evpn-elan/ri-evpn-elan-vlan-based-irb.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL
  - occurrence-selection-required: logical-interface:$IRB_UNIT

### wanedge1_mx304 (junos)

- `minimum`: `junos/routing-instances/evpn-elan/ri-evpn-elan-irb-no-normalization.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$IRB_UNIT
  - occurrence-selection-required: logical-interface:$AC_IFL

### wanedge2_mx10004 (junos)

- `minimum`: `junos/routing-instances/evpn-elan/ri-evpn-elan-irb-no-normalization.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$IRB_UNIT
  - occurrence-selection-required: logical-interface:$AC_IFL

---

## EVPN Type 5 IP-prefix VRF

Family l3vpn, form evpn-type5-vrf. OS mode MIXED. Attachment: IRB unit of an EVPN-ELAN service as the VRF interface..

### wanedge3_acx7509 (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-l3vpn-evpn-ip-prefix-vrf-target.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: irb-service:source-occurrence
  - occurrence-selection-required: logical-interface:$IRB_UNIT

### wanedge4_acx7100-48l (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-l3vpn-evpn-ip-prefix-vrf-target.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: irb-service:source-occurrence
  - occurrence-selection-required: logical-interface:$IRB_UNIT

### wanedge1_mx304 (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-l3vpn-evpn-ip-prefix-vrf-target.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: irb-service:source-occurrence
  - occurrence-selection-required: logical-interface:$IRB_UNIT

### wanedge2_mx10004 (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-l3vpn-evpn-ip-prefix-vrf-target.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: irb-service:source-occurrence
  - occurrence-selection-required: logical-interface:$IRB_UNIT

---
