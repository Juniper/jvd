# Configuration form tiers

<!-- GENERATED FROM configuration/snips/_composition.json by the build tooling (generate-tiers). Do not edit by hand: run `JVD_REPO=<checkout> npm run tiers`. -->

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
| `with-overlay` | Compatibility alias. For a BGP-signalled form it means `self-contained`, which already pulls in that device's overlay form. |

A tier never implies that a larger closure is a minimal protocol requirement.
If a form's overlay, variant or dependency cannot be resolved for the target
device, the request fails closed: say so and generate nothing for it.

## Required operator inputs

Some constructs are a choice, not a default. Ask for them; never preselect.

Each choice applies only to the service families listed against it. If
the requested service's family is not listed, never ask: either that
service's own tier entry already resolves the construct to a single
validated provider, in which case bind it silently, or the service does
not use the construct at all, in which case leave it out. Never add a
construct that the service's own tier entry does not name.

- **community:$COLOR_COMMUNITY** — applies to `e-line`, `e-lan`, `e-tree`, `e-access` only. Service tier, and the operator must state it. Gold is the more common binding but it is not a default: bronze is validated on an3_acx7100-48l, ma1-1_acx7024, ma1-2_acx7024, meg1_acx7100-32c and meg2_acx7509, and the two steer onto different transport classes.
- **policy-statement:$EXPORT_POL** — applies to `l3vpn` only. The export policy carries the customer prefixes, so the choice is a service parameter the operator must state: address family, how many CE prefixes the VRF advertises, and whether the routes are coloured. All forms are validated in the JVD and none is a default — ma4_mx204 alone splits 999 coloured v4 against 1000 v6.

---

## EVPN-VPWS services

Family e-line, form vlan-aware. OS mode MIXED. Attachment: vlan-ccc logical unit on a LAG or physical UNI.

### an3_acx7100-48l (evo)

- `minimum`: `evo/routing-instances/evpn-vpws/ri-evpn-vpws.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_INTF
  - occurrence-selection-required: group:GR-BGP-BCP
  - occurrence-selection-required: policy-statement:PS-BGP-EXPORT
  - occurrence-selection-required: rib-group:RG-REMOTE-LOOPBACKS
  - occurrence-selection-required: policy-statement:PS-LOCAL-LOOPBACK
  - occurrence-selection-required: policy-statement:PS-REMOTE-LOOPBACKS
  - occurrence-selection-required: community:CM-LOOPBACK
  - occurrence-selection-required: community:CM-NO-ADVERTISE
  - occurrence-selection-required: route-distinguisher-id:global
  - occurrence-selection-required: community:CM-ACCESS-FABRIC

### ma1-1_acx7024 (evo)

- `minimum`: `evo/routing-instances/evpn-vpws/ri-evpn-vpws.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_INTF
  - occurrence-selection-required: group:GR-BGP-BCP
  - occurrence-selection-required: policy-statement:PS-BGP-TRANSPORT-EXPORT
  - occurrence-selection-required: policy-statement:nhs1
  - occurrence-selection-required: rib-group:RG-REMOTE-LOOPBACKS
  - occurrence-selection-required: policy-statement:PS-LOCAL-LOOPBACK
  - occurrence-selection-required: policy-statement:PS-REMOTE-LOOPBACKS
  - occurrence-selection-required: community:CM-LOOPBACK
  - occurrence-selection-required: community:CM-NO-ADVERTISE
  - occurrence-selection-required: route-distinguisher-id:global

### ma1-2_acx7024 (evo)

- `minimum`: `evo/routing-instances/evpn-vpws/ri-evpn-vpws.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_INTF
  - occurrence-selection-required: group:GR-BGP-BCP
  - occurrence-selection-required: policy-statement:PS-BGP-TRANSPORT-EXPORT
  - occurrence-selection-required: policy-statement:nhs1
  - occurrence-selection-required: rib-group:RG-REMOTE-LOOPBACKS
  - occurrence-selection-required: policy-statement:PS-LOCAL-LOOPBACK
  - occurrence-selection-required: policy-statement:PS-REMOTE-LOOPBACKS
  - occurrence-selection-required: community:CM-LOOPBACK
  - occurrence-selection-required: community:CM-NO-ADVERTISE
  - occurrence-selection-required: route-distinguisher-id:global

### meg1_acx7100-32c (evo)

- `minimum`: `evo/routing-instances/evpn-vpws/ri-evpn-vpws.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_INTF
  - occurrence-selection-required: group:GR-BGP-BCP
  - occurrence-selection-required: policy-statement:IMPORT-BGP
  - occurrence-selection-required: policy-statement:PS-BGP-RR-EXPORT
  - occurrence-selection-required: policy-statement:PS-IBGP-CR-EXPORT
  - occurrence-selection-required: rib-group:RG-REMOTE-LOOPBACKS
  - occurrence-selection-required: rib-group:RG-REMOTE-LOOPBACKS
  - occurrence-selection-required: policy-statement:PS-LOCAL-LOOPBACK
  - occurrence-selection-required: policy-statement:PS-REMOTE-LOOPBACKS
  - occurrence-selection-required: community:CM-LOOPBACK
  - occurrence-selection-required: community:CM-NO-ADVERTISE
  - occurrence-selection-required: route-distinguisher-id:global
  - occurrence-selection-required: community:CM-SERVICE-EDGE
  - occurrence-selection-required: community:CM-REGIONAL-BORDER
  - occurrence-selection-required: community:CM-TC-4000-GOLD
  - occurrence-selection-required: community:CM-TC-6000-BRONZE
  - occurrence-selection-required: community:CM-ACCESS-FABRIC
  - occurrence-selection-required: community:CM-ACCESS-FABRIC
  - occurrence-selection-required: community:CM-TC-4000-GOLD
  - occurrence-selection-required: community:CM-TC-6000-BRONZE
  - occurrence-selection-required: community:CM-ACCESS-FABRIC
  - occurrence-selection-required: community:CM-ACCESS-FABRIC
  - occurrence-selection-required: prefix-list:PL-AN-NODES
  - occurrence-selection-required: prefix-list:PL-AN-NODES
  - occurrence-selection-required: community:CM-METRO-RING
  - occurrence-selection-required: community:CM-REGIONAL-BORDER
  - occurrence-selection-required: community:CM-SERVICE-EDGE
  - occurrence-selection-required: prefix-list:PL-CORE
  - occurrence-selection-required: prefix-list:PL-FABRIC

### meg2_acx7509 (evo)

- `minimum`: `evo/routing-instances/evpn-vpws/ri-evpn-vpws.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_INTF
  - occurrence-selection-required: group:GR-BGP-BCP
  - occurrence-selection-required: policy-statement:IMPORT-BGP
  - occurrence-selection-required: policy-statement:PS-BGP-RR-EXPORT
  - occurrence-selection-required: policy-statement:PS-IBGP-CR-EXPORT
  - occurrence-selection-required: rib-group:RG-REMOTE-LOOPBACKS
  - occurrence-selection-required: rib-group:RG-REMOTE-LOOPBACKS
  - occurrence-selection-required: policy-statement:PS-LOCAL-LOOPBACK
  - occurrence-selection-required: policy-statement:PS-REMOTE-LOOPBACKS
  - occurrence-selection-required: community:CM-LOOPBACK
  - occurrence-selection-required: community:CM-NO-ADVERTISE
  - occurrence-selection-required: route-distinguisher-id:global
  - occurrence-selection-required: community:CM-SERVICE-EDGE
  - occurrence-selection-required: community:CM-REGIONAL-BORDER
  - occurrence-selection-required: community:CM-TC-4000-GOLD
  - occurrence-selection-required: community:CM-TC-6000-BRONZE
  - occurrence-selection-required: community:CM-ACCESS-FABRIC
  - occurrence-selection-required: community:CM-ACCESS-FABRIC
  - occurrence-selection-required: community:CM-TC-4000-GOLD
  - occurrence-selection-required: community:CM-TC-6000-BRONZE
  - occurrence-selection-required: community:CM-ACCESS-FABRIC
  - occurrence-selection-required: community:CM-ACCESS-FABRIC
  - occurrence-selection-required: prefix-list:PL-AN-NODES
  - occurrence-selection-required: prefix-list:PL-AN-NODES
  - occurrence-selection-required: community:CM-METRO-RING
  - occurrence-selection-required: community:CM-REGIONAL-BORDER
  - occurrence-selection-required: community:CM-SERVICE-EDGE
  - occurrence-selection-required: prefix-list:PL-CORE
  - occurrence-selection-required: prefix-list:PL-FABRIC

### an1_mx204 (junos)

- `minimum`: `junos/routing-instances/evpn-vpws/ri-evpn-vpws.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_INTF
  - occurrence-selection-required: group:GR-BGP-BCP
  - occurrence-selection-required: policy-statement:PS-BGP-EXPORT
  - occurrence-selection-required: rib-group:RG-REMOTE-LOOPBACKS
  - occurrence-selection-required: policy-statement:PS-LOCAL-LOOPBACK
  - occurrence-selection-required: policy-statement:PS-REMOTE-LOOPBACKS
  - occurrence-selection-required: community:CM-LOOPBACK
  - occurrence-selection-required: community:CM-NO-ADVERTISE
  - occurrence-selection-required: route-distinguisher-id:global

### an2_acx5448 (junos)

- `minimum`: `junos/routing-instances/evpn-vpws/ri-evpn-vpws.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_INTF
  - occurrence-selection-required: group:GR-BGP-BCP
  - occurrence-selection-required: policy-statement:PS-BGP-EXPORT
  - occurrence-selection-required: rib-group:RG-REMOTE-LOOPBACKS
  - occurrence-selection-required: policy-statement:PS-LOCAL-LOOPBACK
  - occurrence-selection-required: policy-statement:PS-REMOTE-LOOPBACKS
  - occurrence-selection-required: community:CM-LOOPBACK
  - occurrence-selection-required: community:CM-NO-ADVERTISE
  - occurrence-selection-required: route-distinguisher-id:global

### an4_acx710 (junos)

- `minimum`: `junos/routing-instances/evpn-vpws/ri-evpn-vpws.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_INTF
  - occurrence-selection-required: policy-statement:PS-BGP-EXPORT
  - occurrence-selection-required: rib-group:RG-REMOTE-LOOPBACKS
  - occurrence-selection-required: policy-statement:PS-LOCAL-LOOPBACK
  - occurrence-selection-required: policy-statement:PS-REMOTE-LOOPBACKS
  - occurrence-selection-required: community:CM-LOOPBACK
  - occurrence-selection-required: community:CM-NO-ADVERTISE
  - occurrence-selection-required: route-distinguisher-id:global
  - occurrence-selection-required: community:CM-ACCESS-FABRIC

---

## port-based EVPN-VPWS services

**Not generatable.** MENU advertises a port-based form but no distinct entry snippet models it; TIERS reaches it only through an interface pattern, and a pattern may not count as supported.

---

## EVPN-FXC services

Family e-line, form flexible-cross-connect. OS mode MIXED. Attachment: N vlan-ccc UNIs bundled under one FXC group.

### an3_acx7100-48l (evo)

- `minimum`: `evo/routing-instances/evpn-vpws/ri-evpn-fxc-4-uni.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_INTF.$UNIT_A
  - occurrence-selection-required: logical-interface:$AC_INTF.$UNIT_B
  - occurrence-selection-required: logical-interface:$AC_INTF.$UNIT_C
  - occurrence-selection-required: logical-interface:$AC_INTF.$UNIT_D
  - occurrence-selection-required: group:GR-BGP-BCP
  - occurrence-selection-required: policy-statement:PS-BGP-EXPORT
  - occurrence-selection-required: rib-group:RG-REMOTE-LOOPBACKS
  - occurrence-selection-required: policy-statement:PS-LOCAL-LOOPBACK
  - occurrence-selection-required: policy-statement:PS-REMOTE-LOOPBACKS
  - occurrence-selection-required: community:CM-LOOPBACK
  - occurrence-selection-required: community:CM-NO-ADVERTISE
  - occurrence-selection-required: route-distinguisher-id:global
  - occurrence-selection-required: community:CM-ACCESS-FABRIC

### mse1_mx304 (junos)

- `minimum`: `junos/routing-instances/evpn-vpws/ri-evpn-fxc-4-uni.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_INTF.$UNIT_A
  - occurrence-selection-required: logical-interface:$AC_INTF.$UNIT_B
  - occurrence-selection-required: logical-interface:$AC_INTF.$UNIT_C
  - occurrence-selection-required: logical-interface:$AC_INTF.$UNIT_D
  - occurrence-selection-required: group:GR-BGP-BCP
  - occurrence-selection-required: policy-statement:PS-AS63535-IMPORT
  - occurrence-selection-required: policy-statement:PS-EBGP-CR-EXPORT
  - occurrence-selection-required: policy-statement:IMPORT-BGP
  - occurrence-selection-required: policy-statement:PS-IBGP-MDR-EXPORT
  - occurrence-selection-required: policy-statement:PS-MSE-IMPORT
  - occurrence-selection-required: policy-statement:PS-IBGP-MSE-EXPORT
  - occurrence-selection-required: policy-statement:IMPORT-BGP
  - occurrence-selection-required: rib-group:RG-REMOTE-LOOPBACKS
  - occurrence-selection-required: rib-group:RG-REMOTE-LOOPBACKS
  - occurrence-selection-required: rib-group:RG-REMOTE-LOOPBACKS
  - occurrence-selection-required: policy-statement:PS-REMOTE-LOOPBACKS
  - occurrence-selection-required: community:CM-NO-ADVERTISE
  - occurrence-selection-required: community:CM-LOOPBACK
  - occurrence-selection-required: community:CM-ACCESS-FABRIC
  - occurrence-selection-required: community:CM-SERVICE-EDGE
  - occurrence-selection-required: prefix-list:PL-AN-REGION
  - occurrence-selection-required: community:CM-METRO-RING
  - occurrence-selection-required: community:CM-REGION-EDGE
  - occurrence-selection-required: community:CM-METRO-FABRIC
  - occurrence-selection-required: community:CM-REGION-EDGE
  - occurrence-selection-required: community:CM-REGION-EDGE
  - occurrence-selection-required: condition:Floating-PW-Condition
  - occurrence-selection-required: prefix-list:PL-MSE-PRIMARY
  - occurrence-selection-required: community:CM-ACCESS-FABRIC
  - occurrence-selection-required: community:CM-METRO-FABRIC
  - occurrence-selection-required: community:CM-METRO-RING
  - occurrence-selection-required: community:CM-SERVICE-EDGE
  - occurrence-selection-required: community:CM-SERVICE-EDGE
  - occurrence-selection-required: prefix-list:PL-AN-REGION
  - occurrence-selection-required: prefix-list:PL-MSE
  - occurrence-selection-required: community:CM-METRO-FABRIC

---

## Kompella L2VPN pseudowires

Family e-line, form rfc4761. OS mode MIXED. Attachment: vlan-ccc logical unit.

### an3_acx7100-48l (evo)

- `minimum`: `evo/routing-instances/l2vpn/ri-l2vpn-kompella.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_INTF
  - occurrence-selection-required: group:GR-BGP-BCP
  - occurrence-selection-required: policy-statement:PS-BGP-EXPORT
  - occurrence-selection-required: rib-group:RG-REMOTE-LOOPBACKS
  - occurrence-selection-required: policy-statement:PS-LOCAL-LOOPBACK
  - occurrence-selection-required: policy-statement:PS-REMOTE-LOOPBACKS
  - occurrence-selection-required: community:CM-LOOPBACK
  - occurrence-selection-required: community:CM-NO-ADVERTISE
  - occurrence-selection-required: route-distinguisher-id:global
  - occurrence-selection-required: community:CM-ACCESS-FABRIC

### ma5_mx204 (junos)

- `minimum`: `junos/routing-instances/l2vpn/ri-l2vpn-kompella-site.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_INTF
  - occurrence-selection-required: group:BGP-BCP
  - occurrence-selection-required: policy-statement:PS-BGP-TRANSPORT-EXPORT
  - occurrence-selection-required: policy-statement:nhs1
  - occurrence-selection-required: rib-group:RG-REMOTE-LOOPBACKS
  - occurrence-selection-required: policy-statement:PS-LOCAL-LOOPBACK
  - occurrence-selection-required: policy-statement:PS-REMOTE-LOOPBACKS
  - occurrence-selection-required: community:CM-LOOPBACK
  - occurrence-selection-required: community:CM-NO-ADVERTISE
  - occurrence-selection-required: route-distinguisher-id:global
  - occurrence-selection-required: community:CM-METRO-RING

---

## L2Circuit hot-standby pseudowires

Family e-line, form hot-standby. OS mode EVO. Attachment: vlan-ccc logical unit.

### meg2_acx7509 (evo)

- `minimum`: `evo/protocols/l2circuit-hsb-pe.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_INTF.$UNIT
  - occurrence-selection-required: interface-parent:source-occurrence
  - occurrence-selection-required: filter:50MB_filter

---

## L2Circuit floating pseudowires

Family e-line, form floating-pseudowire. OS mode MIXED. Attachment: static-label PW onto a ps<N> pseudowire-subscriber anchor.

### mse1_mx304 (junos)

- `minimum`: `junos/protocols/l2circuit-floating-pw.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$PS_INTF.0
  - occurrence-selection-required: interface-device:source-occurrence
  - occurrence-selection-required: ps-device-capacity:source-occurrence
  - occurrence-selection-required: tunnel-pic:source-occurrence

### mse2_mx304 (junos)

- `minimum`: `junos/protocols/l2circuit-floating-pw.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$PS_INTF.0
  - occurrence-selection-required: interface-device:source-occurrence
  - occurrence-selection-required: ps-device-capacity:source-occurrence
  - occurrence-selection-required: tunnel-pic:source-occurrence

---

## L2Circuit local-switching cross-connects

Family e-access, form local-switching. OS mode EVO. Attachment: two vlan-ccc UNIs on one PE.

### ma3_acx7100-48l (evo)

- `minimum`: `evo/protocols/l2circuit-lsw.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_INTF_1.$UNIT_1
  - occurrence-selection-required: logical-interface:$AC_INTF_2.$UNIT_2

---

## EVPN-ELAN instances

Family e-lan, form vlan-based. OS mode MIXED. Attachment: vlan-bridge logical unit.

### an3_acx7100-48l (evo)

- `minimum`: `evo/routing-instances/evpn-elan/ri-evpn-elan-vlan-based-export.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: policy-community:source-occurrence
  - occurrence-selection-required: logical-interface:$AC_INTF
  - occurrence-selection-required: logical-interface:$AC_INTF
  - occurrence-selection-required: policy-statement:$INSTANCE_NAME
  - occurrence-selection-required: community:${INSTANCE_NAME}_RT
  - occurrence-selection-required: community:$COLOR_COMMUNITY
  - occurrence-selection-required: group:GR-BGP-BCP
  - occurrence-selection-required: policy-statement:PS-BGP-EXPORT
  - occurrence-selection-required: rib-group:RG-REMOTE-LOOPBACKS
  - occurrence-selection-required: policy-statement:PS-LOCAL-LOOPBACK
  - occurrence-selection-required: policy-statement:PS-REMOTE-LOOPBACKS
  - occurrence-selection-required: community:CM-LOOPBACK
  - occurrence-selection-required: community:CM-NO-ADVERTISE
  - occurrence-selection-required: route-distinguisher-id:global
  - occurrence-selection-required: community:CM-ACCESS-FABRIC

### ma1-1_acx7024 (evo)

- `minimum`: `evo/routing-instances/evpn-elan/ri-evpn-elan-vlan-based-export.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: policy-community:source-occurrence
  - occurrence-selection-required: logical-interface:$AC_INTF
  - occurrence-selection-required: logical-interface:$AC_INTF
  - occurrence-selection-required: policy-statement:$INSTANCE_NAME
  - occurrence-selection-required: community:${INSTANCE_NAME}_RT
  - occurrence-selection-required: community:$COLOR_COMMUNITY
  - occurrence-selection-required: group:GR-BGP-BCP
  - occurrence-selection-required: policy-statement:PS-BGP-TRANSPORT-EXPORT
  - occurrence-selection-required: policy-statement:nhs1
  - occurrence-selection-required: rib-group:RG-REMOTE-LOOPBACKS
  - occurrence-selection-required: policy-statement:PS-LOCAL-LOOPBACK
  - occurrence-selection-required: policy-statement:PS-REMOTE-LOOPBACKS
  - occurrence-selection-required: community:CM-LOOPBACK
  - occurrence-selection-required: community:CM-NO-ADVERTISE
  - occurrence-selection-required: route-distinguisher-id:global

### ma1-2_acx7024 (evo)

- `minimum`: `evo/routing-instances/evpn-elan/ri-evpn-elan-vlan-based-export.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: policy-community:source-occurrence
  - occurrence-selection-required: logical-interface:$AC_INTF
  - occurrence-selection-required: logical-interface:$AC_INTF
  - occurrence-selection-required: policy-statement:$INSTANCE_NAME
  - occurrence-selection-required: community:${INSTANCE_NAME}_RT
  - occurrence-selection-required: community:$COLOR_COMMUNITY
  - occurrence-selection-required: group:GR-BGP-BCP
  - occurrence-selection-required: policy-statement:PS-BGP-TRANSPORT-EXPORT
  - occurrence-selection-required: policy-statement:nhs1
  - occurrence-selection-required: rib-group:RG-REMOTE-LOOPBACKS
  - occurrence-selection-required: policy-statement:PS-LOCAL-LOOPBACK
  - occurrence-selection-required: policy-statement:PS-REMOTE-LOOPBACKS
  - occurrence-selection-required: community:CM-LOOPBACK
  - occurrence-selection-required: community:CM-NO-ADVERTISE
  - occurrence-selection-required: route-distinguisher-id:global

### meg1_acx7100-32c (evo)

- `minimum`: `evo/routing-instances/evpn-elan/ri-evpn-elan-vlan-based-export.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: policy-community:source-occurrence
  - occurrence-selection-required: logical-interface:$AC_INTF
  - occurrence-selection-required: logical-interface:$AC_INTF
  - occurrence-selection-required: policy-statement:$INSTANCE_NAME
  - occurrence-selection-required: community:${INSTANCE_NAME}_RT
  - occurrence-selection-required: community:$COLOR_COMMUNITY
  - occurrence-selection-required: group:GR-BGP-BCP
  - occurrence-selection-required: policy-statement:IMPORT-BGP
  - occurrence-selection-required: policy-statement:PS-BGP-RR-EXPORT
  - occurrence-selection-required: policy-statement:PS-IBGP-CR-EXPORT
  - occurrence-selection-required: rib-group:RG-REMOTE-LOOPBACKS
  - occurrence-selection-required: rib-group:RG-REMOTE-LOOPBACKS
  - occurrence-selection-required: policy-statement:PS-LOCAL-LOOPBACK
  - occurrence-selection-required: policy-statement:PS-REMOTE-LOOPBACKS
  - occurrence-selection-required: community:CM-LOOPBACK
  - occurrence-selection-required: community:CM-NO-ADVERTISE
  - occurrence-selection-required: route-distinguisher-id:global
  - occurrence-selection-required: community:CM-SERVICE-EDGE
  - occurrence-selection-required: community:CM-REGIONAL-BORDER
  - occurrence-selection-required: community:CM-TC-4000-GOLD
  - occurrence-selection-required: community:CM-TC-6000-BRONZE
  - occurrence-selection-required: community:CM-ACCESS-FABRIC
  - occurrence-selection-required: community:CM-ACCESS-FABRIC
  - occurrence-selection-required: community:CM-TC-4000-GOLD
  - occurrence-selection-required: community:CM-TC-6000-BRONZE
  - occurrence-selection-required: community:CM-ACCESS-FABRIC
  - occurrence-selection-required: community:CM-ACCESS-FABRIC
  - occurrence-selection-required: prefix-list:PL-AN-NODES
  - occurrence-selection-required: prefix-list:PL-AN-NODES
  - occurrence-selection-required: community:CM-METRO-RING
  - occurrence-selection-required: community:CM-REGIONAL-BORDER
  - occurrence-selection-required: community:CM-SERVICE-EDGE
  - occurrence-selection-required: prefix-list:PL-CORE
  - occurrence-selection-required: prefix-list:PL-FABRIC

### meg2_acx7509 (evo)

- `minimum`: `evo/routing-instances/evpn-elan/ri-evpn-elan-vlan-based-export.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: policy-community:source-occurrence
  - occurrence-selection-required: logical-interface:$AC_INTF
  - occurrence-selection-required: logical-interface:$AC_INTF
  - occurrence-selection-required: policy-statement:$INSTANCE_NAME
  - occurrence-selection-required: community:${INSTANCE_NAME}_RT
  - occurrence-selection-required: community:$COLOR_COMMUNITY
  - occurrence-selection-required: group:GR-BGP-BCP
  - occurrence-selection-required: policy-statement:IMPORT-BGP
  - occurrence-selection-required: policy-statement:PS-BGP-RR-EXPORT
  - occurrence-selection-required: policy-statement:PS-IBGP-CR-EXPORT
  - occurrence-selection-required: rib-group:RG-REMOTE-LOOPBACKS
  - occurrence-selection-required: rib-group:RG-REMOTE-LOOPBACKS
  - occurrence-selection-required: policy-statement:PS-LOCAL-LOOPBACK
  - occurrence-selection-required: policy-statement:PS-REMOTE-LOOPBACKS
  - occurrence-selection-required: community:CM-LOOPBACK
  - occurrence-selection-required: community:CM-NO-ADVERTISE
  - occurrence-selection-required: route-distinguisher-id:global
  - occurrence-selection-required: community:CM-SERVICE-EDGE
  - occurrence-selection-required: community:CM-REGIONAL-BORDER
  - occurrence-selection-required: community:CM-TC-4000-GOLD
  - occurrence-selection-required: community:CM-TC-6000-BRONZE
  - occurrence-selection-required: community:CM-ACCESS-FABRIC
  - occurrence-selection-required: community:CM-ACCESS-FABRIC
  - occurrence-selection-required: community:CM-TC-4000-GOLD
  - occurrence-selection-required: community:CM-TC-6000-BRONZE
  - occurrence-selection-required: community:CM-ACCESS-FABRIC
  - occurrence-selection-required: community:CM-ACCESS-FABRIC
  - occurrence-selection-required: prefix-list:PL-AN-NODES
  - occurrence-selection-required: prefix-list:PL-AN-NODES
  - occurrence-selection-required: community:CM-METRO-RING
  - occurrence-selection-required: community:CM-REGIONAL-BORDER
  - occurrence-selection-required: community:CM-SERVICE-EDGE
  - occurrence-selection-required: prefix-list:PL-CORE
  - occurrence-selection-required: prefix-list:PL-FABRIC

### an1_mx204 (junos)

- `minimum`: `junos/routing-instances/evpn-elan/ri-evpn-elan-vlan-based.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_INTF.$VLAN_UNIT
  - occurrence-selection-required: group:GR-BGP-BCP
  - occurrence-selection-required: policy-statement:PS-BGP-EXPORT
  - occurrence-selection-required: rib-group:RG-REMOTE-LOOPBACKS
  - occurrence-selection-required: policy-statement:PS-LOCAL-LOOPBACK
  - occurrence-selection-required: policy-statement:PS-REMOTE-LOOPBACKS
  - occurrence-selection-required: community:CM-LOOPBACK
  - occurrence-selection-required: community:CM-NO-ADVERTISE
  - occurrence-selection-required: route-distinguisher-id:global

### an2_acx5448 (junos)

- `minimum`: `junos/routing-instances/evpn-elan/ri-evpn-elan-vlan-based.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_INTF.$VLAN_UNIT
  - occurrence-selection-required: group:GR-BGP-BCP
  - occurrence-selection-required: policy-statement:PS-BGP-EXPORT
  - occurrence-selection-required: rib-group:RG-REMOTE-LOOPBACKS
  - occurrence-selection-required: policy-statement:PS-LOCAL-LOOPBACK
  - occurrence-selection-required: policy-statement:PS-REMOTE-LOOPBACKS
  - occurrence-selection-required: community:CM-LOOPBACK
  - occurrence-selection-required: community:CM-NO-ADVERTISE
  - occurrence-selection-required: route-distinguisher-id:global

---

## port-based EVPN-ELAN instances

Family e-lan, form port-based. OS mode EVO. Attachment: single full-port UNI.

### an3_acx7100-48l (evo)

- `minimum`: `evo/routing-instances/evpn-elan/ri-evpn-port-based.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_INTF
  - occurrence-selection-required: group:GR-BGP-BCP
  - occurrence-selection-required: policy-statement:PS-BGP-EXPORT
  - occurrence-selection-required: rib-group:RG-REMOTE-LOOPBACKS
  - occurrence-selection-required: policy-statement:PS-LOCAL-LOOPBACK
  - occurrence-selection-required: policy-statement:PS-REMOTE-LOOPBACKS
  - occurrence-selection-required: community:CM-LOOPBACK
  - occurrence-selection-required: community:CM-NO-ADVERTISE
  - occurrence-selection-required: route-distinguisher-id:global
  - occurrence-selection-required: community:CM-ACCESS-FABRIC

### ma1-2_acx7024 (evo)

- `minimum`: `evo/routing-instances/evpn-elan/ri-evpn-port-based.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_INTF
  - occurrence-selection-required: group:GR-BGP-BCP
  - occurrence-selection-required: policy-statement:PS-BGP-TRANSPORT-EXPORT
  - occurrence-selection-required: policy-statement:nhs1
  - occurrence-selection-required: rib-group:RG-REMOTE-LOOPBACKS
  - occurrence-selection-required: policy-statement:PS-LOCAL-LOOPBACK
  - occurrence-selection-required: policy-statement:PS-REMOTE-LOOPBACKS
  - occurrence-selection-required: community:CM-LOOPBACK
  - occurrence-selection-required: community:CM-NO-ADVERTISE
  - occurrence-selection-required: route-distinguisher-id:global

---

## BGP-VPLS instances

Family e-lan, form rfc4761-vpls. OS mode MIXED. Attachment: vlan-bridge logical unit.

### an3_acx7100-48l (evo)

- `minimum`: `evo/routing-instances/vpls/ri-bgp-vpls-vlan.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_INTF
  - occurrence-selection-required: group:GR-BGP-BCP
  - occurrence-selection-required: policy-statement:PS-BGP-EXPORT
  - occurrence-selection-required: rib-group:RG-REMOTE-LOOPBACKS
  - occurrence-selection-required: policy-statement:PS-LOCAL-LOOPBACK
  - occurrence-selection-required: policy-statement:PS-REMOTE-LOOPBACKS
  - occurrence-selection-required: community:CM-LOOPBACK
  - occurrence-selection-required: community:CM-NO-ADVERTISE
  - occurrence-selection-required: route-distinguisher-id:global
  - occurrence-selection-required: community:CM-ACCESS-FABRIC

### ma1-2_acx7024 (evo)

- `minimum`: `evo/routing-instances/vpls/ri-bgp-vpls-vlan.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_INTF
  - occurrence-selection-required: group:GR-BGP-BCP
  - occurrence-selection-required: policy-statement:PS-BGP-TRANSPORT-EXPORT
  - occurrence-selection-required: policy-statement:nhs1
  - occurrence-selection-required: rib-group:RG-REMOTE-LOOPBACKS
  - occurrence-selection-required: policy-statement:PS-LOCAL-LOOPBACK
  - occurrence-selection-required: policy-statement:PS-REMOTE-LOOPBACKS
  - occurrence-selection-required: community:CM-LOOPBACK
  - occurrence-selection-required: community:CM-NO-ADVERTISE
  - occurrence-selection-required: route-distinguisher-id:global

### meg1_acx7100-32c (evo)

- `minimum`: `evo/routing-instances/vpls/ri-bgp-vpls-vlan.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_INTF
  - occurrence-selection-required: group:GR-BGP-BCP
  - occurrence-selection-required: policy-statement:IMPORT-BGP
  - occurrence-selection-required: policy-statement:PS-BGP-RR-EXPORT
  - occurrence-selection-required: policy-statement:PS-IBGP-CR-EXPORT
  - occurrence-selection-required: rib-group:RG-REMOTE-LOOPBACKS
  - occurrence-selection-required: rib-group:RG-REMOTE-LOOPBACKS
  - occurrence-selection-required: policy-statement:PS-LOCAL-LOOPBACK
  - occurrence-selection-required: policy-statement:PS-REMOTE-LOOPBACKS
  - occurrence-selection-required: community:CM-LOOPBACK
  - occurrence-selection-required: community:CM-NO-ADVERTISE
  - occurrence-selection-required: route-distinguisher-id:global
  - occurrence-selection-required: community:CM-SERVICE-EDGE
  - occurrence-selection-required: community:CM-REGIONAL-BORDER
  - occurrence-selection-required: community:CM-TC-4000-GOLD
  - occurrence-selection-required: community:CM-TC-6000-BRONZE
  - occurrence-selection-required: community:CM-ACCESS-FABRIC
  - occurrence-selection-required: community:CM-ACCESS-FABRIC
  - occurrence-selection-required: community:CM-TC-4000-GOLD
  - occurrence-selection-required: community:CM-TC-6000-BRONZE
  - occurrence-selection-required: community:CM-ACCESS-FABRIC
  - occurrence-selection-required: community:CM-ACCESS-FABRIC
  - occurrence-selection-required: prefix-list:PL-AN-NODES
  - occurrence-selection-required: prefix-list:PL-AN-NODES
  - occurrence-selection-required: community:CM-METRO-RING
  - occurrence-selection-required: community:CM-REGIONAL-BORDER
  - occurrence-selection-required: community:CM-SERVICE-EDGE
  - occurrence-selection-required: prefix-list:PL-CORE
  - occurrence-selection-required: prefix-list:PL-FABRIC

### meg2_acx7509 (evo)

- `minimum`: `evo/routing-instances/vpls/ri-bgp-vpls-vlan.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_INTF
  - occurrence-selection-required: group:GR-BGP-BCP
  - occurrence-selection-required: policy-statement:IMPORT-BGP
  - occurrence-selection-required: policy-statement:PS-BGP-RR-EXPORT
  - occurrence-selection-required: policy-statement:PS-IBGP-CR-EXPORT
  - occurrence-selection-required: rib-group:RG-REMOTE-LOOPBACKS
  - occurrence-selection-required: rib-group:RG-REMOTE-LOOPBACKS
  - occurrence-selection-required: policy-statement:PS-LOCAL-LOOPBACK
  - occurrence-selection-required: policy-statement:PS-REMOTE-LOOPBACKS
  - occurrence-selection-required: community:CM-LOOPBACK
  - occurrence-selection-required: community:CM-NO-ADVERTISE
  - occurrence-selection-required: route-distinguisher-id:global
  - occurrence-selection-required: community:CM-SERVICE-EDGE
  - occurrence-selection-required: community:CM-REGIONAL-BORDER
  - occurrence-selection-required: community:CM-TC-4000-GOLD
  - occurrence-selection-required: community:CM-TC-6000-BRONZE
  - occurrence-selection-required: community:CM-ACCESS-FABRIC
  - occurrence-selection-required: community:CM-ACCESS-FABRIC
  - occurrence-selection-required: community:CM-TC-4000-GOLD
  - occurrence-selection-required: community:CM-TC-6000-BRONZE
  - occurrence-selection-required: community:CM-ACCESS-FABRIC
  - occurrence-selection-required: community:CM-ACCESS-FABRIC
  - occurrence-selection-required: prefix-list:PL-AN-NODES
  - occurrence-selection-required: prefix-list:PL-AN-NODES
  - occurrence-selection-required: community:CM-METRO-RING
  - occurrence-selection-required: community:CM-REGIONAL-BORDER
  - occurrence-selection-required: community:CM-SERVICE-EDGE
  - occurrence-selection-required: prefix-list:PL-CORE
  - occurrence-selection-required: prefix-list:PL-FABRIC

### ma5_mx204 (junos)

- `minimum`: `junos/routing-instances/vpls/ri-bgp-vpls-site-range.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_INTF
  - occurrence-selection-required: interface-parent:source-occurrence
  - occurrence-selection-required: group:BGP-BCP
  - occurrence-selection-required: policy-statement:PS-BGP-TRANSPORT-EXPORT
  - occurrence-selection-required: policy-statement:nhs1
  - occurrence-selection-required: rib-group:RG-REMOTE-LOOPBACKS
  - occurrence-selection-required: policy-statement:PS-LOCAL-LOOPBACK
  - occurrence-selection-required: policy-statement:PS-REMOTE-LOOPBACKS
  - occurrence-selection-required: community:CM-LOOPBACK
  - occurrence-selection-required: community:CM-NO-ADVERTISE
  - occurrence-selection-required: route-distinguisher-id:global
  - occurrence-selection-required: community:CM-METRO-RING

---

## LDP-VPLS instances

Family e-lan, form rfc4762-vpls. OS mode EVO. Attachment: vlan-bridge logical unit.

### an3_acx7100-48l (evo)

- `minimum`: `evo/routing-instances/vpls/ri-ldp-vpls.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_INTF

---

## EVPN E-Tree services

Family e-tree, form root-leaf. OS mode Junos. Attachment: vlan-bridge logical unit, root or leaf.

### ma4_mx204 (junos)

- `minimum`: `junos/routing-instances/evpn-etree/ri-evpn-etree.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_INTF.$UNIT
  - occurrence-selection-required: group:BGP-BCP
  - occurrence-selection-required: group:GR-BGP-BCP
  - occurrence-selection-required: policy-statement:PS-BGP-TRANSPORT-EXPORT
  - occurrence-selection-required: policy-statement:nhs1
  - occurrence-selection-required: rib-group:RG-REMOTE-LOOPBACKS
  - occurrence-selection-required: policy-statement:PS-LOCAL-LOOPBACK
  - occurrence-selection-required: policy-statement:PS-REMOTE-LOOPBACKS
  - occurrence-selection-required: community:CM-LOOPBACK
  - occurrence-selection-required: community:CM-NO-ADVERTISE
  - occurrence-selection-required: route-distinguisher-id:global
  - occurrence-selection-required: community:CM-METRO-RING

### ma5_mx204 (junos)

- `minimum`: `junos/routing-instances/evpn-etree/ri-evpn-etree.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_INTF.$UNIT
  - occurrence-selection-required: group:BGP-BCP
  - occurrence-selection-required: policy-statement:PS-BGP-TRANSPORT-EXPORT
  - occurrence-selection-required: policy-statement:nhs1
  - occurrence-selection-required: rib-group:RG-REMOTE-LOOPBACKS
  - occurrence-selection-required: policy-statement:PS-LOCAL-LOOPBACK
  - occurrence-selection-required: policy-statement:PS-REMOTE-LOOPBACKS
  - occurrence-selection-required: community:CM-LOOPBACK
  - occurrence-selection-required: community:CM-NO-ADVERTISE
  - occurrence-selection-required: route-distinguisher-id:global
  - occurrence-selection-required: community:CM-METRO-RING

### mse1_mx304 (junos)

- `minimum`: `junos/routing-instances/evpn-etree/ri-evpn-etree.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_INTF.$UNIT
  - occurrence-selection-required: group:GR-BGP-BCP
  - occurrence-selection-required: policy-statement:PS-AS63535-IMPORT
  - occurrence-selection-required: policy-statement:PS-EBGP-CR-EXPORT
  - occurrence-selection-required: policy-statement:IMPORT-BGP
  - occurrence-selection-required: policy-statement:PS-IBGP-MDR-EXPORT
  - occurrence-selection-required: policy-statement:PS-MSE-IMPORT
  - occurrence-selection-required: policy-statement:PS-IBGP-MSE-EXPORT
  - occurrence-selection-required: policy-statement:IMPORT-BGP
  - occurrence-selection-required: rib-group:RG-REMOTE-LOOPBACKS
  - occurrence-selection-required: rib-group:RG-REMOTE-LOOPBACKS
  - occurrence-selection-required: rib-group:RG-REMOTE-LOOPBACKS
  - occurrence-selection-required: policy-statement:PS-REMOTE-LOOPBACKS
  - occurrence-selection-required: community:CM-NO-ADVERTISE
  - occurrence-selection-required: community:CM-LOOPBACK
  - occurrence-selection-required: community:CM-ACCESS-FABRIC
  - occurrence-selection-required: community:CM-SERVICE-EDGE
  - occurrence-selection-required: prefix-list:PL-AN-REGION
  - occurrence-selection-required: community:CM-METRO-RING
  - occurrence-selection-required: community:CM-REGION-EDGE
  - occurrence-selection-required: community:CM-METRO-FABRIC
  - occurrence-selection-required: community:CM-REGION-EDGE
  - occurrence-selection-required: community:CM-REGION-EDGE
  - occurrence-selection-required: condition:Floating-PW-Condition
  - occurrence-selection-required: prefix-list:PL-MSE-PRIMARY
  - occurrence-selection-required: community:CM-ACCESS-FABRIC
  - occurrence-selection-required: community:CM-METRO-FABRIC
  - occurrence-selection-required: community:CM-METRO-RING
  - occurrence-selection-required: community:CM-SERVICE-EDGE
  - occurrence-selection-required: community:CM-SERVICE-EDGE
  - occurrence-selection-required: prefix-list:PL-AN-REGION
  - occurrence-selection-required: prefix-list:PL-MSE
  - occurrence-selection-required: community:CM-METRO-FABRIC

### mse2_mx304 (junos)

- `minimum`: `junos/routing-instances/evpn-etree/ri-evpn-etree.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_INTF.$UNIT
  - occurrence-selection-required: group:GR-BGP-BCP
  - occurrence-selection-required: policy-statement:PS-AS63535-IMPORT
  - occurrence-selection-required: policy-statement:PS-EBGP-CR-EXPORT
  - occurrence-selection-required: policy-statement:IMPORT-BGP
  - occurrence-selection-required: policy-statement:PS-IBGP-MDR-EXPORT
  - occurrence-selection-required: policy-statement:PS-MSE-IMPORT
  - occurrence-selection-required: policy-statement:PS-IBGP-MSE-EXPORT
  - occurrence-selection-required: policy-statement:IMPORT-BGP
  - occurrence-selection-required: rib-group:RG-REMOTE-LOOPBACKS
  - occurrence-selection-required: rib-group:RG-REMOTE-LOOPBACKS
  - occurrence-selection-required: rib-group:RG-REMOTE-LOOPBACKS
  - occurrence-selection-required: policy-statement:PS-REMOTE-LOOPBACKS
  - occurrence-selection-required: community:CM-NO-ADVERTISE
  - occurrence-selection-required: community:CM-LOOPBACK
  - occurrence-selection-required: community:CM-ACCESS-FABRIC
  - occurrence-selection-required: community:CM-SERVICE-EDGE
  - occurrence-selection-required: prefix-list:PL-AN-REGION
  - occurrence-selection-required: community:CM-METRO-RING
  - occurrence-selection-required: community:CM-REGION-EDGE
  - occurrence-selection-required: community:CM-METRO-FABRIC
  - occurrence-selection-required: community:CM-REGION-EDGE
  - occurrence-selection-required: community:CM-REGION-EDGE
  - occurrence-selection-required: condition:Floating-PW-Condition
  - occurrence-selection-required: prefix-list:PL-MSE-PRIMARY
  - occurrence-selection-required: community:CM-ACCESS-FABRIC
  - occurrence-selection-required: community:CM-METRO-FABRIC
  - occurrence-selection-required: community:CM-METRO-RING
  - occurrence-selection-required: community:CM-SERVICE-EDGE
  - occurrence-selection-required: community:CM-SERVICE-EDGE
  - occurrence-selection-required: prefix-list:PL-AN-REGION
  - occurrence-selection-required: prefix-list:PL-MSE
  - occurrence-selection-required: community:CM-METRO-FABRIC

---

## EVPN-ELAN with IRB

Family irb, form type2-only. OS mode MIXED. Attachment: vlan-bridge unit plus an irb unit.

### an3_acx7100-48l (evo)

- `minimum`: `evo/routing-instances/evpn-elan/ri-evpn-elan-irb.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_INTF
  - occurrence-selection-required: logical-interface:$IRB_UNIT
  - occurrence-selection-required: group:GR-BGP-BCP
  - occurrence-selection-required: policy-statement:PS-BGP-EXPORT
  - occurrence-selection-required: rib-group:RG-REMOTE-LOOPBACKS
  - occurrence-selection-required: policy-statement:PS-LOCAL-LOOPBACK
  - occurrence-selection-required: policy-statement:PS-REMOTE-LOOPBACKS
  - occurrence-selection-required: community:CM-LOOPBACK
  - occurrence-selection-required: community:CM-NO-ADVERTISE
  - occurrence-selection-required: route-distinguisher-id:global
  - occurrence-selection-required: community:CM-ACCESS-FABRIC

### meg1_acx7100-32c (evo)

- `minimum`: `evo/routing-instances/evpn-elan/ri-evpn-elan-irb.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_INTF
  - occurrence-selection-required: logical-interface:$IRB_UNIT
  - occurrence-selection-required: group:GR-BGP-BCP
  - occurrence-selection-required: policy-statement:IMPORT-BGP
  - occurrence-selection-required: policy-statement:PS-BGP-RR-EXPORT
  - occurrence-selection-required: policy-statement:PS-IBGP-CR-EXPORT
  - occurrence-selection-required: rib-group:RG-REMOTE-LOOPBACKS
  - occurrence-selection-required: rib-group:RG-REMOTE-LOOPBACKS
  - occurrence-selection-required: policy-statement:PS-LOCAL-LOOPBACK
  - occurrence-selection-required: policy-statement:PS-REMOTE-LOOPBACKS
  - occurrence-selection-required: community:CM-LOOPBACK
  - occurrence-selection-required: community:CM-NO-ADVERTISE
  - occurrence-selection-required: route-distinguisher-id:global
  - occurrence-selection-required: community:CM-SERVICE-EDGE
  - occurrence-selection-required: community:CM-REGIONAL-BORDER
  - occurrence-selection-required: community:CM-TC-4000-GOLD
  - occurrence-selection-required: community:CM-TC-6000-BRONZE
  - occurrence-selection-required: community:CM-ACCESS-FABRIC
  - occurrence-selection-required: community:CM-ACCESS-FABRIC
  - occurrence-selection-required: community:CM-TC-4000-GOLD
  - occurrence-selection-required: community:CM-TC-6000-BRONZE
  - occurrence-selection-required: community:CM-ACCESS-FABRIC
  - occurrence-selection-required: community:CM-ACCESS-FABRIC
  - occurrence-selection-required: prefix-list:PL-AN-NODES
  - occurrence-selection-required: prefix-list:PL-AN-NODES
  - occurrence-selection-required: community:CM-METRO-RING
  - occurrence-selection-required: community:CM-REGIONAL-BORDER
  - occurrence-selection-required: community:CM-SERVICE-EDGE
  - occurrence-selection-required: prefix-list:PL-CORE
  - occurrence-selection-required: prefix-list:PL-FABRIC

### meg2_acx7509 (evo)

- `minimum`: `evo/routing-instances/evpn-elan/ri-evpn-elan-irb.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_INTF
  - occurrence-selection-required: logical-interface:$IRB_UNIT
  - occurrence-selection-required: group:GR-BGP-BCP
  - occurrence-selection-required: policy-statement:IMPORT-BGP
  - occurrence-selection-required: policy-statement:PS-BGP-RR-EXPORT
  - occurrence-selection-required: policy-statement:PS-IBGP-CR-EXPORT
  - occurrence-selection-required: rib-group:RG-REMOTE-LOOPBACKS
  - occurrence-selection-required: rib-group:RG-REMOTE-LOOPBACKS
  - occurrence-selection-required: policy-statement:PS-LOCAL-LOOPBACK
  - occurrence-selection-required: policy-statement:PS-REMOTE-LOOPBACKS
  - occurrence-selection-required: community:CM-LOOPBACK
  - occurrence-selection-required: community:CM-NO-ADVERTISE
  - occurrence-selection-required: route-distinguisher-id:global
  - occurrence-selection-required: community:CM-SERVICE-EDGE
  - occurrence-selection-required: community:CM-REGIONAL-BORDER
  - occurrence-selection-required: community:CM-TC-4000-GOLD
  - occurrence-selection-required: community:CM-TC-6000-BRONZE
  - occurrence-selection-required: community:CM-ACCESS-FABRIC
  - occurrence-selection-required: community:CM-ACCESS-FABRIC
  - occurrence-selection-required: community:CM-TC-4000-GOLD
  - occurrence-selection-required: community:CM-TC-6000-BRONZE
  - occurrence-selection-required: community:CM-ACCESS-FABRIC
  - occurrence-selection-required: community:CM-ACCESS-FABRIC
  - occurrence-selection-required: prefix-list:PL-AN-NODES
  - occurrence-selection-required: prefix-list:PL-AN-NODES
  - occurrence-selection-required: community:CM-METRO-RING
  - occurrence-selection-required: community:CM-REGIONAL-BORDER
  - occurrence-selection-required: community:CM-SERVICE-EDGE
  - occurrence-selection-required: prefix-list:PL-CORE
  - occurrence-selection-required: prefix-list:PL-FABRIC

### mse1_mx304 (junos)

- `minimum`: `junos/routing-instances/evpn-elan/ri-evpn-elan-irb.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_INTF.$UNIT
  - occurrence-selection-required: logical-interface:irb.$IRB_UNIT
  - occurrence-selection-required: interface-parent:source-occurrence
  - occurrence-selection-required: group:GR-EDGE-INTF
  - occurrence-selection-required: group:GR-BGP-BCP
  - occurrence-selection-required: policy-statement:PS-AS63535-IMPORT
  - occurrence-selection-required: policy-statement:PS-EBGP-CR-EXPORT
  - occurrence-selection-required: policy-statement:IMPORT-BGP
  - occurrence-selection-required: policy-statement:PS-IBGP-MDR-EXPORT
  - occurrence-selection-required: policy-statement:PS-MSE-IMPORT
  - occurrence-selection-required: policy-statement:PS-IBGP-MSE-EXPORT
  - occurrence-selection-required: policy-statement:IMPORT-BGP
  - occurrence-selection-required: rib-group:RG-REMOTE-LOOPBACKS
  - occurrence-selection-required: rib-group:RG-REMOTE-LOOPBACKS
  - occurrence-selection-required: rib-group:RG-REMOTE-LOOPBACKS
  - occurrence-selection-required: policy-statement:PS-REMOTE-LOOPBACKS
  - occurrence-selection-required: community:CM-NO-ADVERTISE
  - occurrence-selection-required: community:CM-LOOPBACK
  - occurrence-selection-required: community:CM-ACCESS-FABRIC
  - occurrence-selection-required: community:CM-SERVICE-EDGE
  - occurrence-selection-required: prefix-list:PL-AN-REGION
  - occurrence-selection-required: community:CM-METRO-RING
  - occurrence-selection-required: community:CM-REGION-EDGE
  - occurrence-selection-required: community:CM-METRO-FABRIC
  - occurrence-selection-required: community:CM-REGION-EDGE
  - occurrence-selection-required: community:CM-REGION-EDGE
  - occurrence-selection-required: condition:Floating-PW-Condition
  - occurrence-selection-required: prefix-list:PL-MSE-PRIMARY
  - occurrence-selection-required: community:CM-ACCESS-FABRIC
  - occurrence-selection-required: community:CM-METRO-FABRIC
  - occurrence-selection-required: community:CM-METRO-RING
  - occurrence-selection-required: community:CM-SERVICE-EDGE
  - occurrence-selection-required: community:CM-SERVICE-EDGE
  - occurrence-selection-required: prefix-list:PL-AN-REGION
  - occurrence-selection-required: prefix-list:PL-MSE
  - occurrence-selection-required: community:CM-METRO-FABRIC

### mse2_mx304 (junos)

- `minimum`: `junos/routing-instances/evpn-elan/ri-evpn-elan-irb.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_INTF.$UNIT
  - occurrence-selection-required: logical-interface:irb.$IRB_UNIT
  - occurrence-selection-required: interface-parent:source-occurrence
  - occurrence-selection-required: group:GR-EDGE-INTF
  - occurrence-selection-required: group:GR-BGP-BCP
  - occurrence-selection-required: policy-statement:PS-AS63535-IMPORT
  - occurrence-selection-required: policy-statement:PS-EBGP-CR-EXPORT
  - occurrence-selection-required: policy-statement:IMPORT-BGP
  - occurrence-selection-required: policy-statement:PS-IBGP-MDR-EXPORT
  - occurrence-selection-required: policy-statement:PS-MSE-IMPORT
  - occurrence-selection-required: policy-statement:PS-IBGP-MSE-EXPORT
  - occurrence-selection-required: policy-statement:IMPORT-BGP
  - occurrence-selection-required: rib-group:RG-REMOTE-LOOPBACKS
  - occurrence-selection-required: rib-group:RG-REMOTE-LOOPBACKS
  - occurrence-selection-required: rib-group:RG-REMOTE-LOOPBACKS
  - occurrence-selection-required: policy-statement:PS-REMOTE-LOOPBACKS
  - occurrence-selection-required: community:CM-NO-ADVERTISE
  - occurrence-selection-required: community:CM-LOOPBACK
  - occurrence-selection-required: community:CM-ACCESS-FABRIC
  - occurrence-selection-required: community:CM-SERVICE-EDGE
  - occurrence-selection-required: prefix-list:PL-AN-REGION
  - occurrence-selection-required: community:CM-METRO-RING
  - occurrence-selection-required: community:CM-REGION-EDGE
  - occurrence-selection-required: community:CM-METRO-FABRIC
  - occurrence-selection-required: community:CM-REGION-EDGE
  - occurrence-selection-required: community:CM-REGION-EDGE
  - occurrence-selection-required: condition:Floating-PW-Condition
  - occurrence-selection-required: prefix-list:PL-MSE-PRIMARY
  - occurrence-selection-required: community:CM-ACCESS-FABRIC
  - occurrence-selection-required: community:CM-METRO-FABRIC
  - occurrence-selection-required: community:CM-METRO-RING
  - occurrence-selection-required: community:CM-SERVICE-EDGE
  - occurrence-selection-required: community:CM-SERVICE-EDGE
  - occurrence-selection-required: prefix-list:PL-AN-REGION
  - occurrence-selection-required: prefix-list:PL-MSE
  - occurrence-selection-required: community:CM-METRO-FABRIC

---

## EVPN-ELAN with L3 (Type-2 + Type-5)

Family irb, form type2-plus-type5. OS mode MIXED. Attachment: irb unit shared with the EVPN-ELAN half.

### an3_acx7100-48l (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-l3vpn-evpn-vrf-policy.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: irb-service:source-occurrence
  - occurrence-selection-required: policy-community:source-occurrence
  - occurrence-selection-required: logical-interface:irb.$IRB_UNIT
  - occurrence-selection-required: policy-statement:$IMPORT_POL
  - occurrence-selection-required: policy-statement:$EXPORT_POL
  - occurrence-selection-required: community:$INSTANCE_NAME
  - occurrence-selection-required: group:GR-BGP-BCP
  - occurrence-selection-required: policy-statement:PS-BGP-EXPORT
  - occurrence-selection-required: rib-group:RG-REMOTE-LOOPBACKS
  - occurrence-selection-required: policy-statement:PS-LOCAL-LOOPBACK
  - occurrence-selection-required: policy-statement:PS-REMOTE-LOOPBACKS
  - occurrence-selection-required: community:CM-LOOPBACK
  - occurrence-selection-required: community:CM-NO-ADVERTISE
  - occurrence-selection-required: route-distinguisher-id:global
  - occurrence-selection-required: community:CM-ACCESS-FABRIC
  - occurrence-selection-required: community:CM-L3VPN-PUB
  - occurrence-selection-required: community:$INSTANCE_NAME

### mse1_mx304 (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-l3vpn-evpn-vrf-policy.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: irb-service:source-occurrence
  - occurrence-selection-required: policy-community:source-occurrence
  - occurrence-selection-required: logical-interface:irb.$IRB_UNIT
  - occurrence-selection-required: policy-statement:$IMPORT_POL
  - occurrence-selection-required: policy-statement:$EXPORT_POL
  - occurrence-selection-required: community:$INSTANCE_NAME
  - occurrence-selection-required: group:GR-BGP-BCP
  - occurrence-selection-required: policy-statement:PS-AS63535-IMPORT
  - occurrence-selection-required: policy-statement:PS-EBGP-CR-EXPORT
  - occurrence-selection-required: policy-statement:IMPORT-BGP
  - occurrence-selection-required: policy-statement:PS-IBGP-MDR-EXPORT
  - occurrence-selection-required: policy-statement:PS-MSE-IMPORT
  - occurrence-selection-required: policy-statement:PS-IBGP-MSE-EXPORT
  - occurrence-selection-required: policy-statement:IMPORT-BGP
  - occurrence-selection-required: rib-group:RG-REMOTE-LOOPBACKS
  - occurrence-selection-required: rib-group:RG-REMOTE-LOOPBACKS
  - occurrence-selection-required: rib-group:RG-REMOTE-LOOPBACKS
  - occurrence-selection-required: policy-statement:PS-REMOTE-LOOPBACKS
  - occurrence-selection-required: community:CM-NO-ADVERTISE
  - occurrence-selection-required: community:CM-LOOPBACK
  - occurrence-selection-required: community:CM-ACCESS-FABRIC
  - occurrence-selection-required: community:CM-SERVICE-EDGE
  - occurrence-selection-required: prefix-list:PL-AN-REGION
  - occurrence-selection-required: community:CM-METRO-RING
  - occurrence-selection-required: community:CM-REGION-EDGE
  - occurrence-selection-required: community:CM-METRO-FABRIC
  - occurrence-selection-required: community:CM-REGION-EDGE
  - occurrence-selection-required: community:CM-REGION-EDGE
  - occurrence-selection-required: condition:Floating-PW-Condition
  - occurrence-selection-required: prefix-list:PL-MSE-PRIMARY
  - occurrence-selection-required: community:CM-ACCESS-FABRIC
  - occurrence-selection-required: community:CM-METRO-FABRIC
  - occurrence-selection-required: community:CM-METRO-RING
  - occurrence-selection-required: community:CM-SERVICE-EDGE
  - occurrence-selection-required: community:CM-SERVICE-EDGE
  - occurrence-selection-required: prefix-list:PL-AN-REGION
  - occurrence-selection-required: prefix-list:PL-MSE
  - occurrence-selection-required: community:CM-METRO-FABRIC
  - occurrence-selection-required: community:CM-L3VPN-PUB
  - occurrence-selection-required: community:$INSTANCE_NAME

---

## slim L3VPN anchor VRFs

Family irb, form slim-anchor. OS mode MIXED. Attachment: irb unit anchored to a MAC-VRF.

### meg1_acx7100-32c (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-l3vpn-irb.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: irb-service:source-occurrence
  - occurrence-selection-required: logical-interface:irb.$IRB_UNIT
  - occurrence-selection-required: group:GR-BGP-BCP
  - occurrence-selection-required: policy-statement:IMPORT-BGP
  - occurrence-selection-required: policy-statement:PS-BGP-RR-EXPORT
  - occurrence-selection-required: policy-statement:PS-IBGP-CR-EXPORT
  - occurrence-selection-required: rib-group:RG-REMOTE-LOOPBACKS
  - occurrence-selection-required: rib-group:RG-REMOTE-LOOPBACKS
  - occurrence-selection-required: policy-statement:PS-LOCAL-LOOPBACK
  - occurrence-selection-required: policy-statement:PS-REMOTE-LOOPBACKS
  - occurrence-selection-required: community:CM-LOOPBACK
  - occurrence-selection-required: community:CM-NO-ADVERTISE
  - occurrence-selection-required: route-distinguisher-id:global
  - occurrence-selection-required: community:CM-SERVICE-EDGE
  - occurrence-selection-required: community:CM-REGIONAL-BORDER
  - occurrence-selection-required: community:CM-TC-4000-GOLD
  - occurrence-selection-required: community:CM-TC-6000-BRONZE
  - occurrence-selection-required: community:CM-ACCESS-FABRIC
  - occurrence-selection-required: community:CM-ACCESS-FABRIC
  - occurrence-selection-required: community:CM-TC-4000-GOLD
  - occurrence-selection-required: community:CM-TC-6000-BRONZE
  - occurrence-selection-required: community:CM-ACCESS-FABRIC
  - occurrence-selection-required: community:CM-ACCESS-FABRIC
  - occurrence-selection-required: prefix-list:PL-AN-NODES
  - occurrence-selection-required: prefix-list:PL-AN-NODES
  - occurrence-selection-required: community:CM-METRO-RING
  - occurrence-selection-required: community:CM-REGIONAL-BORDER
  - occurrence-selection-required: community:CM-SERVICE-EDGE
  - occurrence-selection-required: prefix-list:PL-CORE
  - occurrence-selection-required: prefix-list:PL-FABRIC

### meg2_acx7509 (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-l3vpn-irb.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: irb-service:source-occurrence
  - occurrence-selection-required: logical-interface:irb.$IRB_UNIT
  - occurrence-selection-required: group:GR-BGP-BCP
  - occurrence-selection-required: policy-statement:IMPORT-BGP
  - occurrence-selection-required: policy-statement:PS-BGP-RR-EXPORT
  - occurrence-selection-required: policy-statement:PS-IBGP-CR-EXPORT
  - occurrence-selection-required: rib-group:RG-REMOTE-LOOPBACKS
  - occurrence-selection-required: rib-group:RG-REMOTE-LOOPBACKS
  - occurrence-selection-required: policy-statement:PS-LOCAL-LOOPBACK
  - occurrence-selection-required: policy-statement:PS-REMOTE-LOOPBACKS
  - occurrence-selection-required: community:CM-LOOPBACK
  - occurrence-selection-required: community:CM-NO-ADVERTISE
  - occurrence-selection-required: route-distinguisher-id:global
  - occurrence-selection-required: community:CM-SERVICE-EDGE
  - occurrence-selection-required: community:CM-REGIONAL-BORDER
  - occurrence-selection-required: community:CM-TC-4000-GOLD
  - occurrence-selection-required: community:CM-TC-6000-BRONZE
  - occurrence-selection-required: community:CM-ACCESS-FABRIC
  - occurrence-selection-required: community:CM-ACCESS-FABRIC
  - occurrence-selection-required: community:CM-TC-4000-GOLD
  - occurrence-selection-required: community:CM-TC-6000-BRONZE
  - occurrence-selection-required: community:CM-ACCESS-FABRIC
  - occurrence-selection-required: community:CM-ACCESS-FABRIC
  - occurrence-selection-required: prefix-list:PL-AN-NODES
  - occurrence-selection-required: prefix-list:PL-AN-NODES
  - occurrence-selection-required: community:CM-METRO-RING
  - occurrence-selection-required: community:CM-REGIONAL-BORDER
  - occurrence-selection-required: community:CM-SERVICE-EDGE
  - occurrence-selection-required: prefix-list:PL-CORE
  - occurrence-selection-required: prefix-list:PL-FABRIC

### mse1_mx304 (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-l3vpn-irb.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:irb.$IRB_UNIT
  - occurrence-selection-required: group:GR-BGP-BCP
  - occurrence-selection-required: policy-statement:PS-AS63535-IMPORT
  - occurrence-selection-required: policy-statement:PS-EBGP-CR-EXPORT
  - occurrence-selection-required: policy-statement:IMPORT-BGP
  - occurrence-selection-required: policy-statement:PS-IBGP-MDR-EXPORT
  - occurrence-selection-required: policy-statement:PS-MSE-IMPORT
  - occurrence-selection-required: policy-statement:PS-IBGP-MSE-EXPORT
  - occurrence-selection-required: policy-statement:IMPORT-BGP
  - occurrence-selection-required: rib-group:RG-REMOTE-LOOPBACKS
  - occurrence-selection-required: rib-group:RG-REMOTE-LOOPBACKS
  - occurrence-selection-required: rib-group:RG-REMOTE-LOOPBACKS
  - occurrence-selection-required: policy-statement:PS-REMOTE-LOOPBACKS
  - occurrence-selection-required: community:CM-NO-ADVERTISE
  - occurrence-selection-required: community:CM-LOOPBACK
  - occurrence-selection-required: community:CM-ACCESS-FABRIC
  - occurrence-selection-required: community:CM-SERVICE-EDGE
  - occurrence-selection-required: prefix-list:PL-AN-REGION
  - occurrence-selection-required: community:CM-METRO-RING
  - occurrence-selection-required: community:CM-REGION-EDGE
  - occurrence-selection-required: community:CM-METRO-FABRIC
  - occurrence-selection-required: community:CM-REGION-EDGE
  - occurrence-selection-required: community:CM-REGION-EDGE
  - occurrence-selection-required: condition:Floating-PW-Condition
  - occurrence-selection-required: prefix-list:PL-MSE-PRIMARY
  - occurrence-selection-required: community:CM-ACCESS-FABRIC
  - occurrence-selection-required: community:CM-METRO-FABRIC
  - occurrence-selection-required: community:CM-METRO-RING
  - occurrence-selection-required: community:CM-SERVICE-EDGE
  - occurrence-selection-required: community:CM-SERVICE-EDGE
  - occurrence-selection-required: prefix-list:PL-AN-REGION
  - occurrence-selection-required: prefix-list:PL-MSE
  - occurrence-selection-required: community:CM-METRO-FABRIC

### mse2_mx304 (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-l3vpn-irb.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:irb.$IRB_UNIT
  - occurrence-selection-required: group:GR-BGP-BCP
  - occurrence-selection-required: policy-statement:PS-AS63535-IMPORT
  - occurrence-selection-required: policy-statement:PS-EBGP-CR-EXPORT
  - occurrence-selection-required: policy-statement:IMPORT-BGP
  - occurrence-selection-required: policy-statement:PS-IBGP-MDR-EXPORT
  - occurrence-selection-required: policy-statement:PS-MSE-IMPORT
  - occurrence-selection-required: policy-statement:PS-IBGP-MSE-EXPORT
  - occurrence-selection-required: policy-statement:IMPORT-BGP
  - occurrence-selection-required: rib-group:RG-REMOTE-LOOPBACKS
  - occurrence-selection-required: rib-group:RG-REMOTE-LOOPBACKS
  - occurrence-selection-required: rib-group:RG-REMOTE-LOOPBACKS
  - occurrence-selection-required: policy-statement:PS-REMOTE-LOOPBACKS
  - occurrence-selection-required: community:CM-NO-ADVERTISE
  - occurrence-selection-required: community:CM-LOOPBACK
  - occurrence-selection-required: community:CM-ACCESS-FABRIC
  - occurrence-selection-required: community:CM-SERVICE-EDGE
  - occurrence-selection-required: prefix-list:PL-AN-REGION
  - occurrence-selection-required: community:CM-METRO-RING
  - occurrence-selection-required: community:CM-REGION-EDGE
  - occurrence-selection-required: community:CM-METRO-FABRIC
  - occurrence-selection-required: community:CM-REGION-EDGE
  - occurrence-selection-required: community:CM-REGION-EDGE
  - occurrence-selection-required: condition:Floating-PW-Condition
  - occurrence-selection-required: prefix-list:PL-MSE-PRIMARY
  - occurrence-selection-required: community:CM-ACCESS-FABRIC
  - occurrence-selection-required: community:CM-METRO-FABRIC
  - occurrence-selection-required: community:CM-METRO-RING
  - occurrence-selection-required: community:CM-SERVICE-EDGE
  - occurrence-selection-required: community:CM-SERVICE-EDGE
  - occurrence-selection-required: prefix-list:PL-AN-REGION
  - occurrence-selection-required: prefix-list:PL-MSE
  - occurrence-selection-required: community:CM-METRO-FABRIC

---

## L3VPN VRFs with PE-CE eBGP

Family l3vpn, form pe-ce-ebgp. OS mode MIXED. Attachment: family inet logical unit toward the CE.

### an3_acx7100-48l (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-l3vpn-bgp-vrf-policy.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: policy-community:source-occurrence
  - occurrence-selection-required: logical-interface:$AC_INTF
  - occurrence-selection-required: policy-statement:$IMPORT_POL
  - occurrence-selection-required: policy-statement:$EXPORT_POL
  - occurrence-selection-required: community:$INSTANCE_NAME
  - occurrence-selection-required: community:CM-INET-DEFAULT
  - occurrence-selection-required: interface-parent:source-occurrence
  - occurrence-selection-required: group:GR-BGP-BCP
  - occurrence-selection-required: policy-statement:PS-BGP-EXPORT
  - occurrence-selection-required: rib-group:RG-REMOTE-LOOPBACKS
  - occurrence-selection-required: policy-statement:PS-LOCAL-LOOPBACK
  - occurrence-selection-required: policy-statement:PS-REMOTE-LOOPBACKS
  - occurrence-selection-required: community:CM-LOOPBACK
  - occurrence-selection-required: community:CM-NO-ADVERTISE
  - occurrence-selection-required: route-distinguisher-id:global
  - occurrence-selection-required: community:CM-ACCESS-FABRIC

### ma3_acx7100-48l (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-l3vpn-bgp-vrf-policy.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: policy-community:source-occurrence
  - occurrence-selection-required: logical-interface:$AC_INTF
  - occurrence-selection-required: policy-statement:$IMPORT_POL
  - occurrence-selection-required: policy-statement:$EXPORT_POL
  - occurrence-selection-required: community:$INSTANCE_NAME
  - occurrence-selection-required: community:CM-INET-DEFAULT
  - occurrence-selection-required: interface-parent:source-occurrence
  - occurrence-selection-required: group:GR-BGP-BCP
  - occurrence-selection-required: policy-statement:PS-BGP-TRANSPORT-EXPORT
  - occurrence-selection-required: policy-statement:nhs1
  - occurrence-selection-required: rib-group:RG-REMOTE-LOOPBACKS
  - occurrence-selection-required: policy-statement:PS-LOCAL-LOOPBACK
  - occurrence-selection-required: policy-statement:PS-REMOTE-LOOPBACKS
  - occurrence-selection-required: community:CM-LOOPBACK
  - occurrence-selection-required: community:CM-NO-ADVERTISE
  - occurrence-selection-required: route-distinguisher-id:global
  - occurrence-selection-required: community:CM-METRO-RING
  - occurrence-selection-required: community:CM-METRO-RING

### ma4_mx204 (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-l3vpn-bgp-vrf-policy.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: policy-community:source-occurrence
  - occurrence-selection-required: logical-interface:$AC_INTF
  - occurrence-selection-required: policy-statement:$IMPORT_POL
  - occurrence-selection-required: policy-statement:$EXPORT_POL
  - occurrence-selection-required: community:$INSTANCE_NAME
  - occurrence-selection-required: community:CM-INET-DEFAULT
  - occurrence-selection-required: interface-parent:source-occurrence
  - occurrence-selection-required: group:BGP-BCP
  - occurrence-selection-required: group:GR-BGP-BCP
  - occurrence-selection-required: policy-statement:PS-BGP-TRANSPORT-EXPORT
  - occurrence-selection-required: policy-statement:nhs1
  - occurrence-selection-required: rib-group:RG-REMOTE-LOOPBACKS
  - occurrence-selection-required: policy-statement:PS-LOCAL-LOOPBACK
  - occurrence-selection-required: policy-statement:PS-REMOTE-LOOPBACKS
  - occurrence-selection-required: community:CM-LOOPBACK
  - occurrence-selection-required: community:CM-NO-ADVERTISE
  - occurrence-selection-required: route-distinguisher-id:global
  - occurrence-selection-required: community:CM-METRO-RING

### mse1_mx304 (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-l3vpn-bgp-vrf-policy-auto-export.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: policy-community:source-occurrence
  - occurrence-selection-required: logical-interface:$AC_INTF
  - occurrence-selection-required: policy-statement:$IMPORT_POL
  - occurrence-selection-required: policy-statement:$EXPORT_POL
  - occurrence-selection-required: community:$INSTANCE_NAME
  - occurrence-selection-required: community:CM-INET-DEFAULT
  - occurrence-selection-required: interface-parent:source-occurrence
  - occurrence-selection-required: group:GR-BGP-BCP
  - occurrence-selection-required: policy-statement:PS-AS63535-IMPORT
  - occurrence-selection-required: policy-statement:PS-EBGP-CR-EXPORT
  - occurrence-selection-required: policy-statement:IMPORT-BGP
  - occurrence-selection-required: policy-statement:PS-IBGP-MDR-EXPORT
  - occurrence-selection-required: policy-statement:PS-MSE-IMPORT
  - occurrence-selection-required: policy-statement:PS-IBGP-MSE-EXPORT
  - occurrence-selection-required: policy-statement:IMPORT-BGP
  - occurrence-selection-required: rib-group:RG-REMOTE-LOOPBACKS
  - occurrence-selection-required: rib-group:RG-REMOTE-LOOPBACKS
  - occurrence-selection-required: rib-group:RG-REMOTE-LOOPBACKS
  - occurrence-selection-required: policy-statement:PS-REMOTE-LOOPBACKS
  - occurrence-selection-required: community:CM-NO-ADVERTISE
  - occurrence-selection-required: community:CM-LOOPBACK
  - occurrence-selection-required: community:CM-ACCESS-FABRIC
  - occurrence-selection-required: community:CM-SERVICE-EDGE
  - occurrence-selection-required: prefix-list:PL-AN-REGION
  - occurrence-selection-required: community:CM-METRO-RING
  - occurrence-selection-required: community:CM-REGION-EDGE
  - occurrence-selection-required: community:CM-METRO-FABRIC
  - occurrence-selection-required: community:CM-REGION-EDGE
  - occurrence-selection-required: community:CM-REGION-EDGE
  - occurrence-selection-required: condition:Floating-PW-Condition
  - occurrence-selection-required: prefix-list:PL-MSE-PRIMARY
  - occurrence-selection-required: community:CM-ACCESS-FABRIC
  - occurrence-selection-required: community:CM-METRO-FABRIC
  - occurrence-selection-required: community:CM-METRO-RING
  - occurrence-selection-required: community:CM-SERVICE-EDGE
  - occurrence-selection-required: community:CM-SERVICE-EDGE
  - occurrence-selection-required: prefix-list:PL-AN-REGION
  - occurrence-selection-required: prefix-list:PL-MSE
  - occurrence-selection-required: community:CM-METRO-FABRIC

### mse2_mx304 (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-l3vpn-bgp-vrf-policy-auto-export.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: policy-community:source-occurrence
  - occurrence-selection-required: logical-interface:$AC_INTF
  - occurrence-selection-required: policy-statement:$IMPORT_POL
  - occurrence-selection-required: policy-statement:$EXPORT_POL
  - occurrence-selection-required: community:$INSTANCE_NAME
  - occurrence-selection-required: community:CM-INET-DEFAULT
  - occurrence-selection-required: interface-parent:source-occurrence
  - occurrence-selection-required: group:GR-BGP-BCP
  - occurrence-selection-required: policy-statement:PS-AS63535-IMPORT
  - occurrence-selection-required: policy-statement:PS-EBGP-CR-EXPORT
  - occurrence-selection-required: policy-statement:IMPORT-BGP
  - occurrence-selection-required: policy-statement:PS-IBGP-MDR-EXPORT
  - occurrence-selection-required: policy-statement:PS-MSE-IMPORT
  - occurrence-selection-required: policy-statement:PS-IBGP-MSE-EXPORT
  - occurrence-selection-required: policy-statement:IMPORT-BGP
  - occurrence-selection-required: rib-group:RG-REMOTE-LOOPBACKS
  - occurrence-selection-required: rib-group:RG-REMOTE-LOOPBACKS
  - occurrence-selection-required: rib-group:RG-REMOTE-LOOPBACKS
  - occurrence-selection-required: policy-statement:PS-REMOTE-LOOPBACKS
  - occurrence-selection-required: community:CM-NO-ADVERTISE
  - occurrence-selection-required: community:CM-LOOPBACK
  - occurrence-selection-required: community:CM-ACCESS-FABRIC
  - occurrence-selection-required: community:CM-SERVICE-EDGE
  - occurrence-selection-required: prefix-list:PL-AN-REGION
  - occurrence-selection-required: community:CM-METRO-RING
  - occurrence-selection-required: community:CM-REGION-EDGE
  - occurrence-selection-required: community:CM-METRO-FABRIC
  - occurrence-selection-required: community:CM-REGION-EDGE
  - occurrence-selection-required: community:CM-REGION-EDGE
  - occurrence-selection-required: condition:Floating-PW-Condition
  - occurrence-selection-required: prefix-list:PL-MSE-PRIMARY
  - occurrence-selection-required: community:CM-ACCESS-FABRIC
  - occurrence-selection-required: community:CM-METRO-FABRIC
  - occurrence-selection-required: community:CM-METRO-RING
  - occurrence-selection-required: community:CM-SERVICE-EDGE
  - occurrence-selection-required: community:CM-SERVICE-EDGE
  - occurrence-selection-required: prefix-list:PL-AN-REGION
  - occurrence-selection-required: prefix-list:PL-MSE
  - occurrence-selection-required: community:CM-METRO-FABRIC

---

## L3VPN VRFs with PE-CE OSPF

Family l3vpn, form pe-ce-ospf. OS mode MIXED. Attachment: family inet logical unit toward the CE.

### an3_acx7100-48l (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-l3vpn-ospf-vrf-policy-auto-export.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: policy-community:source-occurrence
  - occurrence-selection-required: logical-interface:$AC_INTF
  - occurrence-selection-required: policy-statement:$IMPORT_POL
  - occurrence-selection-required: policy-statement:$EXPORT_POL
  - occurrence-selection-required: community:$INSTANCE_NAME
  - occurrence-selection-required: community:CM-INET-DEFAULT
  - occurrence-selection-required: interface-parent:source-occurrence
  - occurrence-selection-required: group:GR-BGP-BCP
  - occurrence-selection-required: policy-statement:PS-BGP-EXPORT
  - occurrence-selection-required: rib-group:RG-REMOTE-LOOPBACKS
  - occurrence-selection-required: policy-statement:PS-LOCAL-LOOPBACK
  - occurrence-selection-required: policy-statement:PS-REMOTE-LOOPBACKS
  - occurrence-selection-required: community:CM-LOOPBACK
  - occurrence-selection-required: community:CM-NO-ADVERTISE
  - occurrence-selection-required: route-distinguisher-id:global
  - occurrence-selection-required: community:CM-ACCESS-FABRIC

### ma3_acx7100-48l (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-l3vpn-ospf-vrf-policy-auto-export.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: policy-community:source-occurrence
  - occurrence-selection-required: logical-interface:$AC_INTF
  - occurrence-selection-required: policy-statement:$IMPORT_POL
  - occurrence-selection-required: policy-statement:$EXPORT_POL
  - occurrence-selection-required: community:$INSTANCE_NAME
  - occurrence-selection-required: community:CM-INET-DEFAULT
  - occurrence-selection-required: interface-parent:source-occurrence
  - occurrence-selection-required: group:GR-BGP-BCP
  - occurrence-selection-required: policy-statement:PS-BGP-TRANSPORT-EXPORT
  - occurrence-selection-required: policy-statement:nhs1
  - occurrence-selection-required: rib-group:RG-REMOTE-LOOPBACKS
  - occurrence-selection-required: policy-statement:PS-LOCAL-LOOPBACK
  - occurrence-selection-required: policy-statement:PS-REMOTE-LOOPBACKS
  - occurrence-selection-required: community:CM-LOOPBACK
  - occurrence-selection-required: community:CM-NO-ADVERTISE
  - occurrence-selection-required: route-distinguisher-id:global
  - occurrence-selection-required: community:CM-METRO-RING
  - occurrence-selection-required: community:CM-METRO-RING

### ma4_mx204 (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-l3vpn-ospf-vrf-policy.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: policy-community:source-occurrence
  - occurrence-selection-required: logical-interface:$AC_INTF
  - occurrence-selection-required: policy-statement:$IMPORT_POL
  - occurrence-selection-required: policy-statement:$EXPORT_POL
  - occurrence-selection-required: community:$INSTANCE_NAME
  - occurrence-selection-required: community:CM-INET-DEFAULT
  - occurrence-selection-required: community:CM-L3VPN-PUB
  - occurrence-selection-required: community:$INSTANCE_NAME
  - occurrence-selection-required: community:$INSTANCE_NAME
  - occurrence-selection-required: interface-parent:source-occurrence
  - occurrence-selection-required: group:BGP-BCP
  - occurrence-selection-required: group:GR-BGP-BCP
  - occurrence-selection-required: policy-statement:PS-BGP-TRANSPORT-EXPORT
  - occurrence-selection-required: policy-statement:nhs1
  - occurrence-selection-required: rib-group:RG-REMOTE-LOOPBACKS
  - occurrence-selection-required: policy-statement:PS-LOCAL-LOOPBACK
  - occurrence-selection-required: policy-statement:PS-REMOTE-LOOPBACKS
  - occurrence-selection-required: community:CM-LOOPBACK
  - occurrence-selection-required: community:CM-NO-ADVERTISE
  - occurrence-selection-required: route-distinguisher-id:global
  - occurrence-selection-required: community:CM-METRO-RING

### mse1_mx304 (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-l3vpn-ospf-vrf-policy-auto-export.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: policy-community:source-occurrence
  - occurrence-selection-required: logical-interface:$AC_INTF
  - occurrence-selection-required: policy-statement:$IMPORT_POL
  - occurrence-selection-required: policy-statement:$EXPORT_POL
  - occurrence-selection-required: community:$INSTANCE_NAME
  - occurrence-selection-required: community:CM-INET-DEFAULT
  - occurrence-selection-required: interface-parent:source-occurrence
  - occurrence-selection-required: group:GR-BGP-BCP
  - occurrence-selection-required: policy-statement:PS-AS63535-IMPORT
  - occurrence-selection-required: policy-statement:PS-EBGP-CR-EXPORT
  - occurrence-selection-required: policy-statement:IMPORT-BGP
  - occurrence-selection-required: policy-statement:PS-IBGP-MDR-EXPORT
  - occurrence-selection-required: policy-statement:PS-MSE-IMPORT
  - occurrence-selection-required: policy-statement:PS-IBGP-MSE-EXPORT
  - occurrence-selection-required: policy-statement:IMPORT-BGP
  - occurrence-selection-required: rib-group:RG-REMOTE-LOOPBACKS
  - occurrence-selection-required: rib-group:RG-REMOTE-LOOPBACKS
  - occurrence-selection-required: rib-group:RG-REMOTE-LOOPBACKS
  - occurrence-selection-required: policy-statement:PS-REMOTE-LOOPBACKS
  - occurrence-selection-required: community:CM-NO-ADVERTISE
  - occurrence-selection-required: community:CM-LOOPBACK
  - occurrence-selection-required: community:CM-ACCESS-FABRIC
  - occurrence-selection-required: community:CM-SERVICE-EDGE
  - occurrence-selection-required: prefix-list:PL-AN-REGION
  - occurrence-selection-required: community:CM-METRO-RING
  - occurrence-selection-required: community:CM-REGION-EDGE
  - occurrence-selection-required: community:CM-METRO-FABRIC
  - occurrence-selection-required: community:CM-REGION-EDGE
  - occurrence-selection-required: community:CM-REGION-EDGE
  - occurrence-selection-required: condition:Floating-PW-Condition
  - occurrence-selection-required: prefix-list:PL-MSE-PRIMARY
  - occurrence-selection-required: community:CM-ACCESS-FABRIC
  - occurrence-selection-required: community:CM-METRO-FABRIC
  - occurrence-selection-required: community:CM-METRO-RING
  - occurrence-selection-required: community:CM-SERVICE-EDGE
  - occurrence-selection-required: community:CM-SERVICE-EDGE
  - occurrence-selection-required: prefix-list:PL-AN-REGION
  - occurrence-selection-required: prefix-list:PL-MSE
  - occurrence-selection-required: community:CM-METRO-FABRIC

### mse2_mx304 (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-l3vpn-ospf-vrf-policy-auto-export.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: policy-community:source-occurrence
  - occurrence-selection-required: logical-interface:$AC_INTF
  - occurrence-selection-required: policy-statement:$IMPORT_POL
  - occurrence-selection-required: policy-statement:$EXPORT_POL
  - occurrence-selection-required: community:$INSTANCE_NAME
  - occurrence-selection-required: community:CM-INET-DEFAULT
  - occurrence-selection-required: interface-parent:source-occurrence
  - occurrence-selection-required: group:GR-BGP-BCP
  - occurrence-selection-required: policy-statement:PS-AS63535-IMPORT
  - occurrence-selection-required: policy-statement:PS-EBGP-CR-EXPORT
  - occurrence-selection-required: policy-statement:IMPORT-BGP
  - occurrence-selection-required: policy-statement:PS-IBGP-MDR-EXPORT
  - occurrence-selection-required: policy-statement:PS-MSE-IMPORT
  - occurrence-selection-required: policy-statement:PS-IBGP-MSE-EXPORT
  - occurrence-selection-required: policy-statement:IMPORT-BGP
  - occurrence-selection-required: rib-group:RG-REMOTE-LOOPBACKS
  - occurrence-selection-required: rib-group:RG-REMOTE-LOOPBACKS
  - occurrence-selection-required: rib-group:RG-REMOTE-LOOPBACKS
  - occurrence-selection-required: policy-statement:PS-REMOTE-LOOPBACKS
  - occurrence-selection-required: community:CM-NO-ADVERTISE
  - occurrence-selection-required: community:CM-LOOPBACK
  - occurrence-selection-required: community:CM-ACCESS-FABRIC
  - occurrence-selection-required: community:CM-SERVICE-EDGE
  - occurrence-selection-required: prefix-list:PL-AN-REGION
  - occurrence-selection-required: community:CM-METRO-RING
  - occurrence-selection-required: community:CM-REGION-EDGE
  - occurrence-selection-required: community:CM-METRO-FABRIC
  - occurrence-selection-required: community:CM-REGION-EDGE
  - occurrence-selection-required: community:CM-REGION-EDGE
  - occurrence-selection-required: condition:Floating-PW-Condition
  - occurrence-selection-required: prefix-list:PL-MSE-PRIMARY
  - occurrence-selection-required: community:CM-ACCESS-FABRIC
  - occurrence-selection-required: community:CM-METRO-FABRIC
  - occurrence-selection-required: community:CM-METRO-RING
  - occurrence-selection-required: community:CM-SERVICE-EDGE
  - occurrence-selection-required: community:CM-SERVICE-EDGE
  - occurrence-selection-required: prefix-list:PL-AN-REGION
  - occurrence-selection-required: prefix-list:PL-MSE
  - occurrence-selection-required: community:CM-METRO-FABRIC

---
