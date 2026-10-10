# Configuration form tiers

<!-- GENERATED FROM configuration/snips/_composition.json by the build tooling (generate-tiers). Do not edit by hand: run `JVD_REPO=<checkout> npm run tiers -- --jvd enterprise_wan/ewan_finance`. -->

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

## NG-MVPN sender-site VRF on a WAN edge (SPT-only, hot-root standby)

Family ng-mvpn, form spt-only-sender. OS mode Junos. Attachment: IRB unit of the EVPN virtual-switch bridge domain plus a VRF loopback unit.

### wanedge1_mx304 (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-mvpn-spt-only-sender-hot-root-standby.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: irb-service:source-occurrence
  - occurrence-selection-required: logical-interface:irb.$IRB_UNIT
  - occurrence-selection-required: logical-interface:lo0.$UNIT
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL
  - occurrence-selection-required: policy-statement:$OSPF_EXPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_1
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_2
  - occurrence-selection-required: filter:$INPUT_FILTER

### wanedge2_mx10004 (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-mvpn-spt-only-sender-hot-root-standby.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: irb-service:source-occurrence
  - occurrence-selection-required: logical-interface:irb.$IRB_UNIT
  - occurrence-selection-required: logical-interface:lo0.$UNIT
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL
  - occurrence-selection-required: policy-statement:$OSPF_EXPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_1
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_2
  - occurrence-selection-required: filter:$INPUT_FILTER

---

## NG-MVPN receiver VRF on an access point toward two customer routers (SPT-only)

Family ng-mvpn, form spt-only-receiver. OS mode Junos. Attachment: Two tagged routed units, one toward each customer router, plus a VRF loopback unit.

### ap1_mx304 (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-mvpn-spt-only-receiver-2-ce.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL_A
  - occurrence-selection-required: logical-interface:$AC_IFL_B
  - occurrence-selection-required: logical-interface:lo0.$UNIT
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL
  - occurrence-selection-required: policy-statement:$OSPF_EXPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_1
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_2
  - occurrence-selection-required: interface-parent:source-occurrence

### ap2_mx10004 (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-mvpn-spt-only-receiver-2-ce.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL_A
  - occurrence-selection-required: logical-interface:$AC_IFL_B
  - occurrence-selection-required: logical-interface:lo0.$UNIT
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL
  - occurrence-selection-required: policy-statement:$OSPF_EXPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_1
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_2
  - occurrence-selection-required: interface-parent:source-occurrence

---

## L3VPN order-entry VRF on a WAN edge (eBGP over IRB)

Family l3vpn, form ebgp-irb. OS mode Junos. Attachment: IRB unit of the EVPN virtual-switch bridge domain.

### wanedge1_mx304 (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-l3vpn-ebgp-irb.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: irb-service:source-occurrence
  - occurrence-selection-required: logical-interface:irb.$IRB_UNIT
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_1
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_2
  - occurrence-selection-required: filter:$INPUT_FILTER

### wanedge2_mx10004 (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-l3vpn-ebgp-irb.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: irb-service:source-occurrence
  - occurrence-selection-required: logical-interface:irb.$IRB_UNIT
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_1
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_2
  - occurrence-selection-required: filter:$INPUT_FILTER

---

## L3VPN order-entry VRF on an access point toward two customer routers

Family l3vpn, form ebgp-2-ce. OS mode Junos. Attachment: Two tagged routed units, one toward each customer router.

### ap1_mx304 (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-l3vpn-ebgp-2-ce.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL_A
  - occurrence-selection-required: logical-interface:$AC_IFL_B
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_1
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_2
  - occurrence-selection-required: interface-parent:source-occurrence

### ap2_mx10004 (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-l3vpn-ebgp-2-ce.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL_A
  - occurrence-selection-required: logical-interface:$AC_IFL_B
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_1
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_2
  - occurrence-selection-required: interface-parent:source-occurrence

---

## EVPN-MPLS virtual switch with single-active ESI and IRB on a WAN edge

Family e-lan, form evpn-virtual-switch-irb. OS mode Junos. Attachment: One vlan-bridge unit with a per-unit single-active ESI on the aggregate toward the Layer 2 edge, plus the IRB routing interface.

### wanedge1_mx304 (junos)

- `minimum`: `junos/routing-instances/evpn-elan/ri-evpn-virtual-switch-irb.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL
  - occurrence-selection-required: logical-interface:irb.$IRB_UNIT
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_1
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_2
  - occurrence-selection-required: interface-parent:source-occurrence
  - occurrence-selection-required: lag-member:source-occurrence
  - occurrence-selection-required: filter:$INPUT_FILTER

### wanedge2_mx10004 (junos)

- `minimum`: `junos/routing-instances/evpn-elan/ri-evpn-virtual-switch-irb.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL
  - occurrence-selection-required: logical-interface:irb.$IRB_UNIT
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_1
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_2
  - occurrence-selection-required: interface-parent:source-occurrence
  - occurrence-selection-required: lag-member:source-occurrence
  - occurrence-selection-required: filter:$INPUT_FILTER

---

## Customer-router virtual router with eBGP to both access points and PIM sparse mode

Family virtual-router, form ebgp-ibgp-pim-static-rp. OS mode MIXED. Attachment: Three tagged routed units: one toward each access point and one toward the attached host.

### cr1_acx7100-48l (evo)

- `minimum`: `evo/routing-instances/virtual-router/ri-virtual-router-ebgp-ibgp-pim-static-rp.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$IFL_1
  - occurrence-selection-required: logical-interface:$IFL_2
  - occurrence-selection-required: logical-interface:$IFL_3
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_1
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_2
  - occurrence-selection-required: interface-parent:source-occurrence

### cr2_mx480 (junos)

- `minimum`: `junos/routing-instances/virtual-router/ri-virtual-router-ebgp-ibgp-pim-static-rp-pim-last-intf-first.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$IFL_3
  - occurrence-selection-required: logical-interface:$IFL_1
  - occurrence-selection-required: logical-interface:$IFL_2
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_1
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_2
  - occurrence-selection-required: interface-parent:source-occurrence

---

## Customer-router virtual router with eBGP to both access points (unicast)

Family virtual-router, form ebgp-ibgp. OS mode MIXED. Attachment: Three tagged routed units: one toward each access point and one toward the attached host.

### cr1_acx7100-48l (evo)

- `minimum`: `evo/routing-instances/virtual-router/ri-virtual-router-ebgp-ibgp.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$IFL_1
  - occurrence-selection-required: logical-interface:$IFL_2
  - occurrence-selection-required: logical-interface:$IFL_3
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_1
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_2
  - occurrence-selection-required: interface-parent:source-occurrence

### cr2_mx480 (junos)

- `minimum`: `junos/routing-instances/virtual-router/ri-virtual-router-ebgp-ibgp.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$IFL_1
  - occurrence-selection-required: logical-interface:$IFL_2
  - occurrence-selection-required: logical-interface:$IFL_3
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_1
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_2
  - occurrence-selection-required: interface-parent:source-occurrence

---
