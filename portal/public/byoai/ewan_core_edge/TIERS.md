# Configuration form tiers

<!-- GENERATED FROM configuration/snips/_composition.json by the build tooling (generate-tiers). Do not edit by hand: run `JVD_REPO=<checkout> npm run tiers -- --jvd enterprise_wan/ewan_core_edge`. -->

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

## L3VPN hub-and-spoke spoke VRF with as-override

Family l3vpn, form hub-spoke-spoke. OS mode Junos. Attachment: VLAN-tagged IPv4 unit toward the spoke CE.

### wanedge1_mx304 (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-l3vpn-ebgp-as-override-vrf-policy.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - reference-external: policy-statement:$IMPORT_POL
  - reference-external: policy-statement:$EXPORT_POL

### wanedge2_mx10008 (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-l3vpn-ebgp-as-override-vrf-policy.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - reference-external: policy-statement:$IMPORT_POL
  - reference-external: policy-statement:$EXPORT_POL

---

## L3VPN hub VRF advertising hub routes to the spokes

Family l3vpn, form hub-spoke-hub-export. OS mode EVO. Attachment: VLAN-tagged IPv4 unit toward the hub CE.

### wanedge3_acx7509 (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-l3vpn-ebgp-export-vrf-policy.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - reference-external: policy-statement:$IMPORT_POL
  - reference-external: policy-statement:$EXPORT_POL

---

## L3VPN hub VRF receiving spoke routes

Family l3vpn, form hub-spoke-hub-import. OS mode EVO. Attachment: VLAN-tagged IPv4 unit toward the hub CE.

### wanedge3_acx7509 (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-l3vpn-ebgp-vrf-policy.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - reference-external: policy-statement:$IMPORT_POL
  - reference-external: policy-statement:$EXPORT_POL

---

## L3VPN VRF with VRRP gateway redundancy and an eBGP CE session

Family l3vpn, form vrrp. OS mode MIXED. Attachment: VLAN-tagged IPv4 unit with a VRRP group.

### wanedge3_acx7509 (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-l3vpn-ebgp-router-id-vrf-target.conf`
- `self-contained`: the above plus `evo/policy-options/policy-statement/ps-bgp-to-ospf.conf`, `evo/protocols/bgp-overlay-pe-labeled-unicast.conf`
- `as-deployed`: the self-contained set plus the other snippets validated on this device.

### wanedge4_acx7100-48l (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-l3vpn-ebgp-router-id-vrf-target.conf`
- `self-contained`: the above plus `evo/policy-options/policy-statement/ps-bgp-to-ospf.conf`, `evo/protocols/bgp-overlay-pe-local-as.conf`
- `as-deployed`: the self-contained set plus the other snippets validated on this device.

### wanedge1_mx304 (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-l3vpn-ebgp-router-id-vrf-target.conf`
- `self-contained`: the above plus `junos/interfaces/ifl-vlan-inet-vrrp-accept-data.conf`, `junos/policy-options/policy-statement/ps-bgp-to-ospf.conf`, `junos/protocols/bgp-overlay-pe-labeled-unicast.conf`
- `as-deployed`: the self-contained set plus the other snippets validated on this device.

### wanedge2_mx10008 (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-l3vpn-ebgp-router-id-vrf-target.conf`
- `self-contained`: the above plus `junos/interfaces/ifl-vlan-inet-vrrp-accept-data.conf`, `junos/protocols/bgp-overlay-pe.conf`
- `as-deployed`: the self-contained set plus the other snippets validated on this device.

---

## BGP-VPLS virtual switch with one VLAN

Family vpls, form bgp-vpls-virtual-switch. OS mode MIXED. Attachment: VLAN bridge unit on the access bundle.

### wanedge3_acx7509 (evo)

- `minimum`: `evo/routing-instances/vpls/ri-vpls-virtual-switch-vlans.conf`
- `self-contained`: the above plus `evo/interfaces/ifl-vlan-bridge.conf`, `evo/policy-options/policy-statement/ps-bgp-to-ospf.conf`, `evo/protocols/bgp-overlay-pe-labeled-unicast.conf`
- `as-deployed`: the self-contained set plus the other snippets validated on this device.

### wanedge4_acx7100-48l (evo)

- `minimum`: `evo/routing-instances/vpls/ri-vpls-virtual-switch-vlans.conf`
- `self-contained`: the above plus `evo/interfaces/ifl-vlan-bridge.conf`, `evo/policy-options/policy-statement/ps-bgp-to-ospf.conf`, `evo/protocols/bgp-overlay-pe-local-as.conf`
- `as-deployed`: the self-contained set plus the other snippets validated on this device.

### wanedge1_mx304 (junos)

- `minimum`: `junos/routing-instances/vpls/ri-vpls-virtual-switch-bridge-domain.conf`
- `self-contained`: the above plus `junos/interfaces/ifl-vlan-bridge.conf`, `junos/policy-options/policy-statement/ps-bgp-to-ospf.conf`, `junos/protocols/bgp-overlay-pe-labeled-unicast.conf`
- `as-deployed`: the self-contained set plus the other snippets validated on this device.

---

## BGP-VPLS virtual switch with flow labels

Family vpls, form bgp-vpls-virtual-switch-flow-label. OS mode MIXED. Attachment: VLAN bridge unit on the access bundle.

### wanedge3_acx7509 (evo)

- `minimum`: `evo/routing-instances/vpls/ri-vpls-virtual-switch-vlans-flow-label.conf`
- `self-contained`: the above plus `evo/interfaces/ifl-vlan-bridge.conf`, `evo/policy-options/policy-statement/ps-bgp-to-ospf.conf`, `evo/protocols/bgp-overlay-pe-labeled-unicast.conf`
- `as-deployed`: the self-contained set plus the other snippets validated on this device.

### wanedge1_mx304 (junos)

- `minimum`: `junos/routing-instances/vpls/ri-vpls-virtual-switch-bridge-domain-flow-label.conf`
- `self-contained`: the above plus `junos/interfaces/ifl-vlan-bridge.conf`, `junos/policy-options/policy-statement/ps-bgp-to-ospf.conf`, `junos/protocols/bgp-overlay-pe-labeled-unicast.conf`
- `as-deployed`: the self-contained set plus the other snippets validated on this device.

---

## LDP Layer 2 circuit with a hot-standby backup pseudowire

Family l2circuit, form hot-standby. OS mode Junos. Attachment: VLAN circuit cross-connect unit.

### wanedge1_mx304 (junos)

- `minimum`: `junos/protocols/l2circuit-hsb-ethernet-vlan-control-word.conf`
- `self-contained`: the above — it names nothing further
- `as-deployed`: the self-contained set plus the other snippets validated on this device.

### wanedge2_mx10008 (junos)

- `minimum`: `junos/protocols/l2circuit-hsb-ethernet-vlan-control-word.conf`
- `self-contained`: the above — it names nothing further
- `as-deployed`: the self-contained set plus the other snippets validated on this device.

---

## LDP Layer 2 circuit

Family l2circuit, form single-homed. OS mode EVO. Attachment: VLAN circuit cross-connect unit.

### wanedge3_acx7509 (evo)

- `minimum`: `evo/protocols/l2circuit-ethernet-vlan-control-word.conf`
- `self-contained`: the above — it names nothing further
- `as-deployed`: the self-contained set plus the other snippets validated on this device.

### wanedge4_acx7100-48l (evo)

- `minimum`: `evo/protocols/l2circuit-ethernet-vlan-control-word.conf`
- `self-contained`: the above — it names nothing further
- `as-deployed`: the self-contained set plus the other snippets validated on this device.

---

## NG-MVPN VRF with a static RP over LDP point-to-multipoint tunnels

Family ngmvpn, form rp-static-group-range. OS mode Junos. Attachment: VLAN-tagged IPv4 unit and a VRF loopback unit.

### wanedge1_mx304 (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-l3vpn-mvpn-rp-static-group-range.conf`
- `self-contained`: the above plus `junos/policy-options/policy-statement/ps-bgp-to-ospf.conf`
- `as-deployed`: the self-contained set plus the other snippets validated on this device.

### wanedge2_mx10008 (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-l3vpn-mvpn-rp-static-group-range.conf`
- `self-contained`: the above plus `junos/policy-options/policy-statement/ps-bgp-to-ospf.conf`
- `as-deployed`: the self-contained set plus the other snippets validated on this device.

---

## NG-MVPN VRF acting as the PIM RP over LDP point-to-multipoint tunnels

Family ngmvpn, form rp-local. OS mode EVO. Attachment: VLAN-tagged IPv4 unit and a VRF loopback unit.

### wanedge3_acx7509 (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-l3vpn-mvpn-rp-local.conf`
- `self-contained`: the above plus `evo/policy-options/policy-statement/ps-bgp-to-ospf.conf`
- `as-deployed`: the self-contained set plus the other snippets validated on this device.

---

## NG-MVPN VRF with a static RP and null-register processing

Family ngmvpn, form rp-static-group-range-null-register. OS mode EVO. Attachment: VLAN-tagged IPv4 unit and a VRF loopback unit.

### wanedge4_acx7100-48l (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-l3vpn-mvpn-rp-static-group-range-null-register.conf`
- `self-contained`: the above plus `evo/policy-options/policy-statement/ps-bgp-to-ospf.conf`
- `as-deployed`: the self-contained set plus the other snippets validated on this device.

---

## Local switching between two units on a CE

Family l2circuit, form local-switching. OS mode MIXED. Attachment: Two VLAN circuit cross-connect units on the same device.

### ce1_acx7100-48l (evo)

- `minimum`: `evo/protocols/l2circuit-local-switching.conf`
- `self-contained`: the above plus `evo/interfaces/ifl-vlan-ccc.conf`
- `as-deployed`: the self-contained set plus the other snippets validated on this device.

### ce2_mx480 (junos)

- `minimum`: `junos/protocols/l2circuit-local-switching.conf`
- `self-contained`: the above plus `junos/interfaces/ifl-vlan-ccc.conf`
- `as-deployed`: the self-contained set plus the other snippets validated on this device.

---
