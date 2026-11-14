# Configuration form tiers

<!-- GENERATED FROM configuration/snips/_composition.json by the build tooling (generate-tiers). Do not edit by hand: run `JVD_REPO=<checkout> npm run tiers -- --jvd service_provider/low_latency_queueing`. -->

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

## EVPN-VPWS point-to-point service

Family e-line, form evpn-vpws. OS mode EVO. Attachment: VLAN CCC unit toward the cell site or hub site attachment..

### ag1_1_acx7509 (evo)

- `minimum`: `evo/routing-instances/evpn-vpws/ri-evpn-vpws.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_INTF

### ag1_2_acx7100-32c (evo)

- `minimum`: `evo/routing-instances/evpn-vpws/ri-evpn-vpws.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_INTF

### an1_acx7100-48l (evo)

- `minimum`: `evo/routing-instances/evpn-vpws/ri-evpn-vpws.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_INTF

### an3_acx7100-48l (evo)

- `minimum`: `evo/routing-instances/evpn-vpws/ri-evpn-vpws.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_INTF

### an4_acx7024 (evo)

- `minimum`: `evo/routing-instances/evpn-vpws/ri-evpn-vpws.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_INTF

---

## EVPN-VPWS service with static flow labels (FAT pseudowire)

Family e-line, form evpn-vpws-flow-label-static. OS mode MIXED. Attachment: VLAN CCC unit toward the cell site or service edge attachment..

### an4_acx7024 (evo)

- `minimum`: `evo/routing-instances/evpn-vpws/ri-evpn-vpws-flow-label-static.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL

### sag_mx304 (junos)

- `minimum`: `junos/routing-instances/evpn-vpws/ri-evpn-vpws-flow-label-static.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL

---

## EVPN flexible cross-connect, VLAN-aware, two attachment circuits

Family e-line, form evpn-fxc-vlan-aware-2-uni. OS mode MIXED. Attachment: Two VLAN CCC units on the attachment port..

### ag1_1_acx7509 (evo)

- `minimum`: `evo/routing-instances/evpn-vpws/ri-evpn-fxc-vlan-aware-2-uni.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_INTF_A
  - occurrence-selection-required: logical-interface:$AC_INTF_B

### ag1_2_acx7100-32c (evo)

- `minimum`: `evo/routing-instances/evpn-vpws/ri-evpn-fxc-vlan-aware-2-uni.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_INTF_A
  - occurrence-selection-required: logical-interface:$AC_INTF_B

### an4_acx7024 (evo)

- `minimum`: `evo/routing-instances/evpn-vpws/ri-evpn-fxc-vlan-aware-2-uni.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_INTF_A
  - occurrence-selection-required: logical-interface:$AC_INTF_B

### sag_mx304 (junos)

- `minimum`: `junos/routing-instances/evpn-vpws/ri-evpn-fxc-vlan-aware-2-uni.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_INTF_A
  - occurrence-selection-required: logical-interface:$AC_INTF_B

---

## Layer 2 circuit (LDP pseudowire) with control word

Family e-line, form l2circuit-control-word. OS mode MIXED. Attachment: VLAN CCC unit toward the attachment..

### an1_acx7100-48l (evo)

- `minimum`: `evo/protocols/l2circuit-control-word.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL

### an3_acx7100-48l (evo)

- `minimum`: `evo/protocols/l2circuit-control-word.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL

### an4_acx7024 (evo)

- `minimum`: `evo/protocols/l2circuit-control-word.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL

### sag_mx304 (junos)

- `minimum`: `junos/protocols/l2circuit-control-word.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL

---

## Layer 2 circuit with control word and static flow labels (FAT pseudowire)

Family e-line, form l2circuit-control-word-flow-label-static. OS mode MIXED. Attachment: VLAN CCC unit toward the attachment..

### ag1_1_acx7509 (evo)

- `minimum`: `evo/protocols/l2circuit-control-word-flow-label-static.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL

### ag1_2_acx7100-32c (evo)

- `minimum`: `evo/protocols/l2circuit-control-word-flow-label-static.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL

### sag_mx304 (junos)

- `minimum`: `junos/protocols/l2circuit-control-word-flow-label-static.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL

---

## EVPN-ELAN MAC-VRF, VLAN-based service

Family e-lan, form evpn-elan-vlan-based. OS mode EVO. Attachment: VLAN bridge unit on the attachment port..

### ag1_1_acx7509 (evo)

- `minimum`: `evo/routing-instances/evpn-elan/ri-evpn-mac-vrf-vlan-based.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL
  - occurrence-selection-required: logical-interface:$AC_IFL

### ag1_2_acx7100-32c (evo)

- `minimum`: `evo/routing-instances/evpn-elan/ri-evpn-mac-vrf-vlan-based.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL
  - occurrence-selection-required: logical-interface:$AC_IFL

### an4_acx7024 (evo)

- `minimum`: `evo/routing-instances/evpn-elan/ri-evpn-mac-vrf-vlan-based.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL
  - occurrence-selection-required: logical-interface:$AC_IFL

---

## EVPN MAC-VRF, VLAN-based service, with an IRB interface

Family e-lan, form evpn-elan-vlan-based-irb. OS mode MIXED. Attachment: VLAN bridge unit on the attachment port and an IRB unit for the Layer 3 gateway..

### ag1_1_acx7509 (evo)

- `minimum`: `evo/routing-instances/evpn-elan/ri-evpn-mac-vrf-vlan-based-irb-no-gateway-community.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL
  - occurrence-selection-required: logical-interface:$AC_IFL
  - occurrence-selection-required: logical-interface:$IRB_IFL

### ag1_2_acx7100-32c (evo)

- `minimum`: `evo/routing-instances/evpn-elan/ri-evpn-mac-vrf-vlan-based-irb-no-gateway-community.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL
  - occurrence-selection-required: logical-interface:$AC_IFL
  - occurrence-selection-required: logical-interface:$IRB_IFL

### sag_mx304 (junos)

- `minimum`: `junos/routing-instances/evpn-elan/ri-evpn-mac-vrf-vlan-based-irb-no-gateway-community.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL
  - occurrence-selection-required: logical-interface:$IRB_IFL
  - occurrence-selection-required: logical-interface:$AC_IFL

---

## BGP-signalled VPLS with flow labels (FAT pseudowire)

Family e-lan, form bgp-vpls-flow-label. OS mode MIXED. Attachment: VLAN bridge unit on the attachment port..

### ag1_1_acx7509 (evo)

- `minimum`: `evo/routing-instances/vpls/ri-bgp-vpls-virtual-switch-flow-label.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL

### ag1_2_acx7100-32c (evo)

- `minimum`: `evo/routing-instances/vpls/ri-bgp-vpls-virtual-switch-flow-label.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL

### an1_acx7100-48l (evo)

- `minimum`: `evo/routing-instances/vpls/ri-bgp-vpls-virtual-switch-flow-label.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL

### an3_acx7100-48l (evo)

- `minimum`: `evo/routing-instances/vpls/ri-bgp-vpls-virtual-switch-flow-label.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL

### an4_acx7024 (evo)

- `minimum`: `evo/routing-instances/vpls/ri-bgp-vpls-virtual-switch-flow-label.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL

### sag_mx304 (junos)

- `minimum`: `junos/routing-instances/vpls/ri-bgp-vpls-virtual-switch-flow-label.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL
  - occurrence-selection-required: logical-interface:$AC_IFL

---

## L3VPN VRF with an IRB interface

Family l3vpn, form l3vpn-irb. OS mode MIXED. Attachment: IRB unit that is the Layer 3 interface of a midhaul bridge domain..

### ag1_1_acx7509 (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-l3vpn-irb-router-id-vrf-table-label.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: irb-service:source-occurrence
  - occurrence-selection-required: logical-interface:$IRB_IFL

### ag1_2_acx7100-32c (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-l3vpn-irb-router-id-vrf-table-label.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: irb-service:source-occurrence
  - occurrence-selection-required: logical-interface:$IRB_IFL

### sag_mx304 (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-l3vpn-irb-router-id-vrf-table-label.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: irb-service:source-occurrence
  - occurrence-selection-required: logical-interface:$IRB_IFL

---

## L3VPN VRF with IPv4 and IPv6 eBGP to the CE

Family l3vpn, form l3vpn-ebgp-v4-v6. OS mode MIXED. Attachment: Dual-stack VLAN unit toward the CE..

### ag1_1_acx7509 (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-l3vpn-ebgp-v4-v6-as-override.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL

### ag1_2_acx7100-32c (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-l3vpn-ebgp-v4-v6-as-override.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL

### an1_acx7100-48l (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-l3vpn-ebgp-v4-v6-as-override.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL

### an3_acx7100-48l (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-l3vpn-ebgp-v4-v6-as-override.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL

### an4_acx7024 (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-l3vpn-ebgp-v4-v6-as-override.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL

### sag_mx304 (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-l3vpn-ebgp-v4-v6-as-override.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL

---
