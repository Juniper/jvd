# Configuration form tiers

<!-- GENERATED FROM configuration/snips/_composition.json by the build tooling (generate-tiers). Do not edit by hand: run `JVD_REPO=<checkout> npm run tiers -- --jvd service_provider/broadband_edge`. -->

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

## EVPN-VPWS pseudowire between an access node and a BNG

Family e-line, form evpn-vpws. OS mode MIXED. Attachment: Access node: vlan-ccc unit on the access aggregate. BNG: unit 0 of a pseudowire-subscriber (ps) device..

### an1_acx7024 (evo)

- `minimum`: `evo/routing-instances/evpn-vpws/ri-evpn-vpws.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL
  - occurrence-selection-required: interface-parent:source-occurrence
  - occurrence-selection-required: lag-member:source-occurrence

### an2_acx7100-48l (evo)

- `minimum`: `evo/routing-instances/evpn-vpws/ri-evpn-vpws.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL
  - occurrence-selection-required: interface-parent:source-occurrence
  - occurrence-selection-required: lag-member:source-occurrence

### an3_acx7100-48l (evo)

- `minimum`: `evo/routing-instances/evpn-vpws/ri-evpn-vpws.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL
  - occurrence-selection-required: interface-parent:source-occurrence
  - occurrence-selection-required: lag-member:source-occurrence

### an4_acx7100-48l (evo)

- `minimum`: `evo/routing-instances/evpn-vpws/ri-evpn-vpws.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL
  - occurrence-selection-required: interface-parent:source-occurrence
  - occurrence-selection-required: lag-member:source-occurrence

### an5_acx7100-48l (evo)

- `minimum`: `evo/routing-instances/evpn-vpws/ri-evpn-vpws.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL
  - occurrence-selection-required: interface-parent:source-occurrence
  - occurrence-selection-required: lag-member:source-occurrence

### bng1_mx304 (junos)

- `minimum`: `junos/routing-instances/evpn-vpws/ri-evpn-vpws.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL
  - occurrence-selection-required: policy-statement:PS-PPPOE-SUBSv6
  - occurrence-selection-required: policy-statement:PS-DHCP-SUBSv6
  - occurrence-selection-required: community:PPPOE_SUBS_COMM_2
  - occurrence-selection-required: routing-instance:PPPOE_SUBS_1
  - occurrence-selection-required: policy-community:source-occurrence
  - occurrence-selection-required: logical-interface:lo0.$UNIT
  - occurrence-selection-required: policy-statement:PS-PPPOE-SUBS-1-VRF-IMPORT
  - occurrence-selection-required: policy-statement:PS-PPPOE-SUBS-1-VRF-EXPORT
  - occurrence-selection-required: community:PS-RADIUS-COMM
  - occurrence-selection-required: community:PS-Internet-COMM
  - occurrence-selection-required: community:PPPOE_SUBS_COMM_1
  - occurrence-selection-required: community:PPPOE_SUBS_COMM_2
  - occurrence-selection-required: community:PPPOE_SUBS_COMM_2
  - occurrence-selection-required: community:PS-DHCPSUBS-COMM_2
  - occurrence-selection-required: routing-instance:dhcp-subs

### bng2_mx204 (junos)

- `minimum`: `junos/routing-instances/evpn-vpws/ri-evpn-vpws.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL
  - occurrence-selection-required: policy-statement:PS-PPPOE-SUBSv6
  - occurrence-selection-required: policy-statement:PS-DHCP-SUBSv6
  - occurrence-selection-required: community:PPPOE_SUBS_COMM_2
  - occurrence-selection-required: routing-instance:PPPOE_SUBS_1
  - occurrence-selection-required: policy-community:source-occurrence
  - occurrence-selection-required: logical-interface:lo0.$UNIT
  - occurrence-selection-required: policy-statement:PS-PPPOE-SUBS-1-VRF-IMPORT
  - occurrence-selection-required: policy-statement:PS-PPPOE-SUBS-1-VRF-EXPORT
  - occurrence-selection-required: community:PS-RADIUS-COMM
  - occurrence-selection-required: community:PS-Internet-COMM
  - occurrence-selection-required: community:PPPOE_SUBS_COMM_1
  - occurrence-selection-required: community:PPPOE_SUBS_COMM_2
  - occurrence-selection-required: community:PPPOE_SUBS_COMM_2
  - occurrence-selection-required: community:PS-DHCPSUBS-COMM_2
  - occurrence-selection-required: routing-instance:dhcp-subs

### bng3_mx10004 (junos)

- `minimum`: `junos/routing-instances/evpn-vpws/ri-evpn-vpws.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL
  - occurrence-selection-required: policy-statement:PS-PPPOE-SUBSv6
  - occurrence-selection-required: policy-statement:PS-DHCP-SUBSv6
  - occurrence-selection-required: community:PPPOE_SUBS_COMM_2
  - occurrence-selection-required: routing-instance:PPPOE_SUBS_1
  - occurrence-selection-required: policy-community:source-occurrence
  - occurrence-selection-required: logical-interface:lo0.$UNIT
  - occurrence-selection-required: policy-statement:PS-PPPOE-SUBS-1-VRF-IMPORT
  - occurrence-selection-required: policy-statement:PS-PPPOE-SUBS-1-VRF-EXPORT
  - occurrence-selection-required: community:PS-RADIUS-COMM
  - occurrence-selection-required: community:PS-Internet-COMM
  - occurrence-selection-required: community:PPPOE_SUBS_COMM_1
  - occurrence-selection-required: community:PPPOE_SUBS_COMM_2
  - occurrence-selection-required: community:PPPOE_SUBS_COMM_2
  - occurrence-selection-required: community:PS-DHCPSUBS-COMM_2
  - occurrence-selection-required: routing-instance:dhcp-subs

### bng4_mx480 (junos)

- `minimum`: `junos/routing-instances/evpn-vpws/ri-evpn-vpws.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL
  - occurrence-selection-required: policy-statement:PS-PPPOE-SUBSv6
  - occurrence-selection-required: policy-statement:PS-DHCP-SUBSv6
  - occurrence-selection-required: community:PPPOE_SUBS_COMM_2
  - occurrence-selection-required: routing-instance:PPPOE_SUBS_1
  - occurrence-selection-required: policy-community:source-occurrence
  - occurrence-selection-required: logical-interface:lo0.$UNIT
  - occurrence-selection-required: policy-statement:PS-PPPOE-SUBS-1-VRF-IMPORT
  - occurrence-selection-required: policy-statement:PS-PPPOE-SUBS-1-VRF-EXPORT
  - occurrence-selection-required: community:PS-RADIUS-COMM
  - occurrence-selection-required: community:PS-Internet-COMM
  - occurrence-selection-required: community:PPPOE_SUBS_COMM_1
  - occurrence-selection-required: community:PPPOE_SUBS_COMM_2
  - occurrence-selection-required: community:PPPOE_SUBS_COMM_2
  - occurrence-selection-required: community:PS-DHCPSUBS-COMM_2
  - occurrence-selection-required: routing-instance:dhcp-subs

---

## EVPN-VPWS flexible cross-connect on an access node

Family e-line, form evpn-fxc. OS mode EVO. Attachment: Two vlan-ccc units bundled under one FXC group; the BNG end is an EVPN-VPWS instance..

### an1_acx7024 (evo)

- `minimum`: `evo/routing-instances/evpn-vpws/ri-evpn-fxc-2-uni-esi.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$IFD.$UNIT_A
  - occurrence-selection-required: logical-interface:$IFD.$UNIT_B
  - occurrence-selection-required: logical-interface:$IFD.$UNIT_A
  - occurrence-selection-required: logical-interface:$IFD.$UNIT_B
  - occurrence-selection-required: interface-parent:source-occurrence
  - occurrence-selection-required: lag-member:source-occurrence

### an2_acx7100-48l (evo)

- `minimum`: `evo/routing-instances/evpn-vpws/ri-evpn-fxc-2-uni-esi.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$IFD.$UNIT_A
  - occurrence-selection-required: logical-interface:$IFD.$UNIT_B
  - occurrence-selection-required: logical-interface:$IFD.$UNIT_A
  - occurrence-selection-required: logical-interface:$IFD.$UNIT_B
  - occurrence-selection-required: interface-parent:source-occurrence
  - occurrence-selection-required: lag-member:source-occurrence

### an3_acx7100-48l (evo)

- `minimum`: `evo/routing-instances/evpn-vpws/ri-evpn-fxc-2-uni-esi.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$IFD.$UNIT_A
  - occurrence-selection-required: logical-interface:$IFD.$UNIT_B
  - occurrence-selection-required: logical-interface:$IFD.$UNIT_A
  - occurrence-selection-required: logical-interface:$IFD.$UNIT_B
  - occurrence-selection-required: interface-parent:source-occurrence
  - occurrence-selection-required: lag-member:source-occurrence

### an4_acx7100-48l (evo)

- `minimum`: `evo/routing-instances/evpn-vpws/ri-evpn-fxc-2-uni-esi.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$IFD.$UNIT_A
  - occurrence-selection-required: logical-interface:$IFD.$UNIT_B
  - occurrence-selection-required: logical-interface:$IFD.$UNIT_A
  - occurrence-selection-required: logical-interface:$IFD.$UNIT_B
  - occurrence-selection-required: interface-parent:source-occurrence
  - occurrence-selection-required: lag-member:source-occurrence

### an5_acx7100-48l (evo)

- `minimum`: `evo/routing-instances/evpn-vpws/ri-evpn-fxc-2-uni-esi.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$IFD.$UNIT_A
  - occurrence-selection-required: logical-interface:$IFD.$UNIT_B
  - occurrence-selection-required: logical-interface:$IFD.$UNIT_A
  - occurrence-selection-required: logical-interface:$IFD.$UNIT_B
  - occurrence-selection-required: interface-parent:source-occurrence
  - occurrence-selection-required: lag-member:source-occurrence

---

## PPPoE subscriber termination on a pseudowire headend

Family bng-subscriber, form pwht-pppoe. OS mode Junos. Attachment: Pseudowire-subscriber device anchored on a tunnel PIC; unit 0 terminates the EVPN-VPWS pseudowire and stacked-VLAN auto-configuration creates the PPPoE sessions..

### bng1_mx304 (junos)

- `minimum`: `junos/interfaces/ifd-ps-pwht-pppoe.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: ps-device-capacity:source-occurrence
  - occurrence-selection-required: tunnel-pic:source-occurrence
  - occurrence-selection-required: routing-instance:PPPOE_SUBS_1
  - occurrence-selection-required: policy-community:source-occurrence
  - occurrence-selection-required: logical-interface:lo0.$UNIT
  - occurrence-selection-required: policy-statement:PS-PPPOE-SUBS-1-VRF-IMPORT
  - occurrence-selection-required: policy-statement:PS-PPPOE-SUBS-1-VRF-EXPORT
  - occurrence-selection-required: community:PS-RADIUS-COMM
  - occurrence-selection-required: community:PS-Internet-COMM
  - occurrence-selection-required: community:PPPOE_SUBS_COMM_1
  - occurrence-selection-required: community:PPPOE_SUBS_COMM_2
  - occurrence-selection-required: community:PPPOE_SUBS_COMM_2
  - occurrence-selection-required: filter:clear-df-bit
  - occurrence-selection-required: routing-instance:PPPOE_SUBS_1
  - occurrence-selection-required: policy-community:source-occurrence
  - occurrence-selection-required: logical-interface:lo0.$UNIT
  - occurrence-selection-required: policy-statement:PS-RADIUS-VRF-IMPORT
  - occurrence-selection-required: policy-statement:PS-RADIUS-VRF-EXPORT
  - occurrence-selection-required: community:PS-RADIUS-COMM
  - occurrence-selection-required: community:PS-RADIUS-COMM

### bng2_mx204 (junos)

- `minimum`: `junos/interfaces/ifd-ps-pwht-pppoe.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: ps-device-capacity:source-occurrence
  - occurrence-selection-required: tunnel-pic:source-occurrence
  - occurrence-selection-required: routing-instance:PPPOE_SUBS_1
  - occurrence-selection-required: policy-community:source-occurrence
  - occurrence-selection-required: logical-interface:lo0.$UNIT
  - occurrence-selection-required: policy-statement:PS-PPPOE-SUBS-1-VRF-IMPORT
  - occurrence-selection-required: policy-statement:PS-PPPOE-SUBS-1-VRF-EXPORT
  - occurrence-selection-required: community:PS-RADIUS-COMM
  - occurrence-selection-required: community:PS-Internet-COMM
  - occurrence-selection-required: community:PPPOE_SUBS_COMM_1
  - occurrence-selection-required: community:PPPOE_SUBS_COMM_2
  - occurrence-selection-required: community:PPPOE_SUBS_COMM_2
  - occurrence-selection-required: filter:clear-df-bit
  - occurrence-selection-required: routing-instance:PPPOE_SUBS_1
  - occurrence-selection-required: policy-community:source-occurrence
  - occurrence-selection-required: logical-interface:lo0.$UNIT
  - occurrence-selection-required: policy-statement:PS-RADIUS-VRF-IMPORT
  - occurrence-selection-required: policy-statement:PS-RADIUS-VRF-EXPORT
  - occurrence-selection-required: community:PS-RADIUS-COMM
  - occurrence-selection-required: community:PS-RADIUS-COMM

### bng3_mx10004 (junos)

- `minimum`: `junos/interfaces/ifd-ps-pwht-pppoe.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: ps-device-capacity:source-occurrence
  - occurrence-selection-required: tunnel-pic:source-occurrence
  - occurrence-selection-required: routing-instance:PPPOE_SUBS_1
  - occurrence-selection-required: policy-community:source-occurrence
  - occurrence-selection-required: logical-interface:lo0.$UNIT
  - occurrence-selection-required: policy-statement:PS-PPPOE-SUBS-1-VRF-IMPORT
  - occurrence-selection-required: policy-statement:PS-PPPOE-SUBS-1-VRF-EXPORT
  - occurrence-selection-required: community:PS-RADIUS-COMM
  - occurrence-selection-required: community:PS-Internet-COMM
  - occurrence-selection-required: community:PPPOE_SUBS_COMM_1
  - occurrence-selection-required: community:PPPOE_SUBS_COMM_2
  - occurrence-selection-required: community:PPPOE_SUBS_COMM_2
  - occurrence-selection-required: filter:clear-df-bit
  - occurrence-selection-required: routing-instance:PPPOE_SUBS_1
  - occurrence-selection-required: policy-community:source-occurrence
  - occurrence-selection-required: logical-interface:lo0.$UNIT
  - occurrence-selection-required: policy-statement:PS-RADIUS-VRF-IMPORT
  - occurrence-selection-required: policy-statement:PS-RADIUS-VRF-EXPORT
  - occurrence-selection-required: community:PS-RADIUS-COMM
  - occurrence-selection-required: community:PS-RADIUS-COMM

### bng4_mx480 (junos)

- `minimum`: `junos/interfaces/ifd-ps-pwht-pppoe.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: ps-device-capacity:source-occurrence
  - occurrence-selection-required: tunnel-pic:source-occurrence
  - occurrence-selection-required: routing-instance:PPPOE_SUBS_1
  - occurrence-selection-required: policy-community:source-occurrence
  - occurrence-selection-required: logical-interface:lo0.$UNIT
  - occurrence-selection-required: policy-statement:PS-PPPOE-SUBS-1-VRF-IMPORT
  - occurrence-selection-required: policy-statement:PS-PPPOE-SUBS-1-VRF-EXPORT
  - occurrence-selection-required: community:PS-RADIUS-COMM
  - occurrence-selection-required: community:PS-Internet-COMM
  - occurrence-selection-required: community:PPPOE_SUBS_COMM_1
  - occurrence-selection-required: community:PPPOE_SUBS_COMM_2
  - occurrence-selection-required: community:PPPOE_SUBS_COMM_2
  - occurrence-selection-required: filter:clear-df-bit
  - occurrence-selection-required: routing-instance:PPPOE_SUBS_1
  - occurrence-selection-required: policy-community:source-occurrence
  - occurrence-selection-required: logical-interface:lo0.$UNIT
  - occurrence-selection-required: policy-statement:PS-RADIUS-VRF-IMPORT
  - occurrence-selection-required: policy-statement:PS-RADIUS-VRF-EXPORT
  - occurrence-selection-required: community:PS-RADIUS-COMM
  - occurrence-selection-required: community:PS-RADIUS-COMM

---

## DHCP/IPoE subscriber termination on a pseudowire headend

Family bng-subscriber, form pwht-ipoe. OS mode Junos. Attachment: Pseudowire-subscriber device anchored on a tunnel PIC; unit 0 terminates the EVPN-VPWS pseudowire and stacked-VLAN auto-configuration creates the DHCP/IPoE sessions..

### bng1_mx304 (junos)

- `minimum`: `junos/interfaces/ifd-ps-pwht-dhcp.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: ps-device-capacity:source-occurrence
  - occurrence-selection-required: tunnel-pic:source-occurrence
  - occurrence-selection-required: routing-instance:dhcp-subs
  - occurrence-selection-required: routing-instance:dhcp-subs
  - occurrence-selection-required: policy-community:source-occurrence
  - occurrence-selection-required: logical-interface:lo0.$UNIT
  - occurrence-selection-required: policy-statement:PS-RADIUS-VRF-IMPORT
  - occurrence-selection-required: policy-statement:PS-RADIUS-VRF-EXPORT
  - occurrence-selection-required: community:PS-RADIUS-COMM
  - occurrence-selection-required: community:PS-RADIUS-COMM

### bng2_mx204 (junos)

- `minimum`: `junos/interfaces/ifd-ps-pwht-dhcp.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: ps-device-capacity:source-occurrence
  - occurrence-selection-required: tunnel-pic:source-occurrence
  - occurrence-selection-required: routing-instance:dhcp-subs
  - occurrence-selection-required: routing-instance:dhcp-subs
  - occurrence-selection-required: policy-community:source-occurrence
  - occurrence-selection-required: logical-interface:lo0.$UNIT
  - occurrence-selection-required: policy-statement:PS-RADIUS-VRF-IMPORT
  - occurrence-selection-required: policy-statement:PS-RADIUS-VRF-EXPORT
  - occurrence-selection-required: community:PS-RADIUS-COMM
  - occurrence-selection-required: community:PS-RADIUS-COMM

### bng3_mx10004 (junos)

- `minimum`: `junos/interfaces/ifd-ps-pwht-dhcp.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: ps-device-capacity:source-occurrence
  - occurrence-selection-required: tunnel-pic:source-occurrence
  - occurrence-selection-required: routing-instance:dhcp-subs
  - occurrence-selection-required: routing-instance:dhcp-subs
  - occurrence-selection-required: policy-community:source-occurrence
  - occurrence-selection-required: logical-interface:lo0.$UNIT
  - occurrence-selection-required: policy-statement:PS-RADIUS-VRF-IMPORT
  - occurrence-selection-required: policy-statement:PS-RADIUS-VRF-EXPORT
  - occurrence-selection-required: community:PS-RADIUS-COMM
  - occurrence-selection-required: community:PS-RADIUS-COMM

### bng4_mx480 (junos)

- `minimum`: `junos/interfaces/ifd-ps-pwht-dhcp.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: ps-device-capacity:source-occurrence
  - occurrence-selection-required: tunnel-pic:source-occurrence
  - occurrence-selection-required: routing-instance:dhcp-subs
  - occurrence-selection-required: routing-instance:dhcp-subs
  - occurrence-selection-required: policy-community:source-occurrence
  - occurrence-selection-required: logical-interface:lo0.$UNIT
  - occurrence-selection-required: policy-statement:PS-RADIUS-VRF-IMPORT
  - occurrence-selection-required: policy-statement:PS-RADIUS-VRF-EXPORT
  - occurrence-selection-required: community:PS-RADIUS-COMM
  - occurrence-selection-required: community:PS-RADIUS-COMM

---

## Internet VRF with eBGP to the upstream CE

Family l3vpn, form l3vpn-internet. OS mode EVO. Attachment: Dual-stack logical unit toward the upstream CE..

### cr1_ptx10004 (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-vrf-internet.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: policy-community:source-occurrence
  - occurrence-selection-required: logical-interface:$AC_IFL
  - occurrence-selection-required: policy-statement:VRF_Internet_import
  - occurrence-selection-required: policy-statement:VRF_Internet_export
  - occurrence-selection-required: community:PS-Internet-COMM
  - occurrence-selection-required: community:PPPOE_SUBS_COMM_2
  - occurrence-selection-required: community:PS-DHCPSUBS-COMM_2
  - occurrence-selection-required: community:PS-Internet-COMM
  - occurrence-selection-required: community:PS-Internet-COMM
  - occurrence-selection-required: interface-parent:source-occurrence

---

## RADIUS VRF

Family l3vpn, form l3vpn-radius. OS mode MIXED. Attachment: BNG: RADIUS loopback unit. Core router: dual-stack unit toward the RADIUS server, with OSPF..

### cr1_ptx10004 (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-radius-server-ospf.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: policy-community:source-occurrence
  - occurrence-selection-required: logical-interface:$AC_IFL
  - occurrence-selection-required: logical-interface:lo0.$UNIT
  - occurrence-selection-required: policy-statement:PS-REDIS-OSPF
  - occurrence-selection-required: policy-statement:PS-RADIUS-VRF-IMPORT
  - occurrence-selection-required: policy-statement:PS-RADIUS-VRF-EXPORT
  - occurrence-selection-required: community:PPPOE_SUBS_COMM_1
  - occurrence-selection-required: community:PS-DHCPSUBS-COMM
  - occurrence-selection-required: community:PS-RADIUS-COMM
  - occurrence-selection-required: community:PS-RADIUS-COMM

### bng1_mx304 (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-radius.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: policy-community:source-occurrence
  - occurrence-selection-required: logical-interface:lo0.$UNIT
  - occurrence-selection-required: policy-statement:PS-RADIUS-VRF-IMPORT
  - occurrence-selection-required: policy-statement:PS-RADIUS-VRF-EXPORT
  - occurrence-selection-required: community:PS-RADIUS-COMM
  - occurrence-selection-required: community:PS-RADIUS-COMM

### bng2_mx204 (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-radius.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: policy-community:source-occurrence
  - occurrence-selection-required: logical-interface:lo0.$UNIT
  - occurrence-selection-required: policy-statement:PS-RADIUS-VRF-IMPORT
  - occurrence-selection-required: policy-statement:PS-RADIUS-VRF-EXPORT
  - occurrence-selection-required: community:PS-RADIUS-COMM
  - occurrence-selection-required: community:PS-RADIUS-COMM

### bng3_mx10004 (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-radius.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: policy-community:source-occurrence
  - occurrence-selection-required: logical-interface:lo0.$UNIT
  - occurrence-selection-required: policy-statement:PS-RADIUS-VRF-IMPORT
  - occurrence-selection-required: policy-statement:PS-RADIUS-VRF-EXPORT
  - occurrence-selection-required: community:PS-RADIUS-COMM
  - occurrence-selection-required: community:PS-RADIUS-COMM

### bng4_mx480 (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-radius.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: policy-community:source-occurrence
  - occurrence-selection-required: logical-interface:lo0.$UNIT
  - occurrence-selection-required: policy-statement:PS-RADIUS-VRF-IMPORT
  - occurrence-selection-required: policy-statement:PS-RADIUS-VRF-EXPORT
  - occurrence-selection-required: community:PS-RADIUS-COMM
  - occurrence-selection-required: community:PS-RADIUS-COMM

---
