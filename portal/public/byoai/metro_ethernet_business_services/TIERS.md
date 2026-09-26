# Configuration form tiers

<!-- GENERATED FROM configuration/snips/_composition.json by portal/scripts/generate-tiers.mjs. Do not edit by hand: run `npm --prefix portal run tiers`. -->

This file tells the assistant which snippet files to include for each service
form at each tier. It is generated from the composition matrix, so every path
below resolves to a real snippet and every device listed is one the form is
validated on.

## What the tiers mean

| Tier | What it includes |
|---|---|
| `minimum` | Only the service construct. Assumes the PE already runs the underlay and the overlay the service needs. |
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
- `self-contained`: the above plus `evo/groups/gr-bgp-bcp-an3.conf`, `evo/policy-options/community/cm-access-fabric.conf`, `evo/policy-options/community/cm-loopback.conf`, `evo/policy-options/community/cm-no-advertise.conf`, `evo/policy-options/policy-statement/loopback-rib-leak.conf`, `evo/policy-options/policy-statement/ps-bgp-export.conf`, `evo/protocols/bgp-overlay-an3.conf`, `evo/routing-options/rib-groups.conf`, `evo/routing-options/transport-class.conf`, `junos/policy-options/policy-statement/ps-remote-loopbacks-mse.conf`
- `as-deployed`: the self-contained set plus this device's validated underlay, apply-group, CoS and OAM baselines.

### ma1-1_acx7024 (evo)

- `minimum`: `evo/routing-instances/evpn-vpws/ri-evpn-vpws.conf`
- `self-contained`: the above plus `evo/groups/gr-bgp-bcp.conf`, `evo/policy-options/community/cm-loopback.conf`, `evo/policy-options/community/cm-metro-ring.conf`, `evo/policy-options/community/cm-no-advertise.conf`, `evo/policy-options/policy-statement/loopback-rib-leak.conf`, `evo/policy-options/policy-statement/nhs1-ma1-1.conf`, `evo/policy-options/policy-statement/ps-bgp-transport-export.conf`, `evo/protocols/bgp-overlay.conf`, `evo/routing-options/rib-groups.conf`, `evo/routing-options/transport-class.conf`, `junos/policy-options/policy-statement/ps-remote-loopbacks-mse.conf`
- `as-deployed`: the self-contained set plus this device's validated underlay, apply-group, CoS and OAM baselines.

### ma1-2_acx7024 (evo)

- `minimum`: `evo/routing-instances/evpn-vpws/ri-evpn-vpws.conf`
- `self-contained`: the above plus `evo/groups/gr-bgp-bcp.conf`, `evo/policy-options/community/cm-loopback.conf`, `evo/policy-options/community/cm-metro-ring.conf`, `evo/policy-options/community/cm-no-advertise.conf`, `evo/policy-options/policy-statement/loopback-rib-leak.conf`, `evo/policy-options/policy-statement/nhs1-ma1-1.conf`, `evo/policy-options/policy-statement/ps-bgp-transport-export.conf`, `evo/protocols/bgp-overlay.conf`, `evo/routing-options/rib-groups.conf`, `evo/routing-options/transport-class.conf`, `junos/policy-options/policy-statement/ps-remote-loopbacks-mse.conf`
- `as-deployed`: the self-contained set plus this device's validated underlay, apply-group, CoS and OAM baselines.

### meg1_acx7100-32c (evo)

- `minimum`: `evo/routing-instances/evpn-vpws/ri-evpn-vpws.conf`
- `self-contained`: the above plus `evo/groups/gr-bgp-bcp.conf`, `evo/policy-options/community/cm-access-fabric.conf`, `evo/policy-options/community/cm-loopback.conf`, `evo/policy-options/community/cm-metro-ring.conf`, `evo/policy-options/community/cm-no-advertise.conf`, `evo/policy-options/community/cm-regional-border.conf`, `evo/policy-options/community/cm-service-edge.conf`, `evo/policy-options/community/cm-tc-4000-gold.conf`, `evo/policy-options/community/cm-tc-6000-bronze.conf`, `evo/policy-options/policy-statement/loopback-rib-leak.conf`, `evo/policy-options/policy-statement/ps-bgp-rr-export.conf`, `evo/policy-options/policy-statement/ps-ibgp-cr-export-meg1.conf`, `evo/policy-options/policy-statement/ps-import-bgp-lo0-filter.conf`, `evo/policy-options/prefix-list/pl-an-nodes.conf`, `evo/policy-options/prefix-list/pl-core.conf`, `evo/policy-options/prefix-list/pl-fabric.conf`, `evo/protocols/bgp-overlay-meg1.conf`, `evo/routing-options/rib-groups.conf`, `evo/routing-options/transport-class.conf`, `junos/policy-options/policy-statement/ps-remote-loopbacks-mse.conf`
- `as-deployed`: the self-contained set plus this device's validated underlay, apply-group, CoS and OAM baselines.

### meg2_acx7509 (evo)

- `minimum`: `evo/routing-instances/evpn-vpws/ri-evpn-vpws.conf`
- `self-contained`: the above plus `evo/groups/gr-bgp-bcp.conf`, `evo/policy-options/community/cm-access-fabric.conf`, `evo/policy-options/community/cm-loopback.conf`, `evo/policy-options/community/cm-metro-ring.conf`, `evo/policy-options/community/cm-no-advertise.conf`, `evo/policy-options/community/cm-regional-border.conf`, `evo/policy-options/community/cm-service-edge.conf`, `evo/policy-options/community/cm-tc-4000-gold.conf`, `evo/policy-options/community/cm-tc-6000-bronze.conf`, `evo/policy-options/policy-statement/loopback-rib-leak.conf`, `evo/policy-options/policy-statement/ps-bgp-rr-export.conf`, `evo/policy-options/policy-statement/ps-ibgp-cr-export-meg1.conf`, `evo/policy-options/policy-statement/ps-import-bgp-lo0-filter.conf`, `evo/policy-options/prefix-list/pl-an-nodes.conf`, `evo/policy-options/prefix-list/pl-core.conf`, `evo/policy-options/prefix-list/pl-fabric.conf`, `evo/protocols/bgp-overlay-meg2.conf`, `evo/routing-options/rib-groups.conf`, `evo/routing-options/transport-class.conf`, `junos/policy-options/policy-statement/ps-remote-loopbacks-mse.conf`
- `as-deployed`: the self-contained set plus this device's validated underlay, apply-group, CoS and OAM baselines.

### an1_mx204 (junos)

- `minimum`: `junos/routing-instances/evpn-vpws/ri-evpn-vpws.conf`
- `self-contained`: the above plus `junos/groups/gr-bgp-bcp.conf`, `junos/policy-options/community/cm-access-fabric.conf`, `junos/policy-options/community/cm-loopback.conf`, `junos/policy-options/community/cm-no-advertise.conf`, `junos/policy-options/policy-statement/loopback-rib-leak.conf`, `junos/policy-options/policy-statement/ps-bgp-export.conf`, `junos/policy-options/policy-statement/ps-remote-loopbacks-mse.conf`, `junos/protocols/bgp-overlay.conf`, `junos/routing-options/rib-groups.conf`, `junos/routing-options/transport-class.conf`
- `as-deployed`: the self-contained set plus this device's validated underlay, apply-group, CoS and OAM baselines.

### an2_acx5448 (junos)

- `minimum`: `junos/routing-instances/evpn-vpws/ri-evpn-vpws.conf`
- `self-contained`: the above plus `junos/groups/gr-bgp-bcp.conf`, `junos/policy-options/community/cm-access-fabric.conf`, `junos/policy-options/community/cm-loopback.conf`, `junos/policy-options/community/cm-no-advertise.conf`, `junos/policy-options/policy-statement/loopback-rib-leak.conf`, `junos/policy-options/policy-statement/ps-bgp-export.conf`, `junos/policy-options/policy-statement/ps-remote-loopbacks-mse.conf`, `junos/protocols/bgp-overlay.conf`, `junos/routing-options/rib-groups.conf`, `junos/routing-options/transport-class.conf`
- `as-deployed`: the self-contained set plus this device's validated underlay, apply-group, CoS and OAM baselines.

### an4_acx710 (junos)

- `minimum`: `junos/routing-instances/evpn-vpws/ri-evpn-vpws.conf`
- `self-contained`: the above plus `junos/policy-options/community/cm-access-fabric.conf`, `junos/policy-options/community/cm-loopback.conf`, `junos/policy-options/community/cm-no-advertise.conf`, `junos/policy-options/policy-statement/loopback-rib-leak.conf`, `junos/policy-options/policy-statement/ps-bgp-export.conf`, `junos/policy-options/policy-statement/ps-remote-loopbacks-mse.conf`, `junos/protocols/bgp-overlay-an4.conf`, `junos/routing-options/rib-groups.conf`, `junos/routing-options/transport-class-fallback-none.conf`
- `as-deployed`: the self-contained set plus this device's validated underlay, apply-group, CoS and OAM baselines.

---

## port-based EVPN-VPWS services

**Not generatable.** MENU advertises a port-based form but no distinct entry snippet models it; TIERS reaches it only through an interface pattern, and a pattern may not count as supported.

---

## EVPN-FXC services

Family e-line, form flexible-cross-connect. OS mode MIXED. Attachment: N vlan-ccc UNIs bundled under one FXC group.

### an3_acx7100-48l (evo)

- `minimum`: `evo/routing-instances/evpn-vpws/ri-evpn-fxc-4-uni.conf`
- `self-contained`: the above plus `evo/groups/gr-bgp-bcp-an3.conf`, `evo/groups/gr-edge-intf.conf`, `evo/policy-options/community/cm-access-fabric.conf`, `evo/policy-options/community/cm-loopback.conf`, `evo/policy-options/community/cm-no-advertise.conf`, `evo/policy-options/policy-statement/loopback-rib-leak.conf`, `evo/policy-options/policy-statement/ps-bgp-export.conf`, `evo/protocols/bgp-overlay-an3.conf`, `evo/routing-options/rib-groups.conf`, `evo/routing-options/transport-class.conf`, `junos/policy-options/policy-statement/ps-remote-loopbacks-mse.conf`
- `as-deployed`: the self-contained set plus this device's validated underlay, apply-group, CoS and OAM baselines.

### mse1_mx304 (junos)

- `minimum`: `junos/routing-instances/evpn-vpws/ri-evpn-fxc-4-uni.conf`
- `self-contained`: the above plus `junos/groups/gr-bgp-bcp.conf`, `junos/groups/gr-edge-intf.conf`, `junos/policy-options/community/cm-access-fabric.conf`, `junos/policy-options/community/cm-loopback.conf`, `junos/policy-options/community/cm-metro-fabric.conf`, `junos/policy-options/community/cm-metro-ring.conf`, `junos/policy-options/community/cm-no-advertise.conf`, `junos/policy-options/community/cm-region-edge.conf`, `junos/policy-options/community/cm-service-edge.conf`, `junos/policy-options/policy-statement/ps-as63535-import.conf`, `junos/policy-options/policy-statement/ps-ebgp-cr-export.conf`, `junos/policy-options/policy-statement/ps-ibgp-mdr-export-mse1.conf`, `junos/policy-options/policy-statement/ps-ibgp-mse-export.conf`, `junos/policy-options/policy-statement/ps-import-bgp-lo0-filter-evpn.conf`, `junos/policy-options/policy-statement/ps-mse-import.conf`, `junos/policy-options/policy-statement/ps-remote-loopbacks-mse.conf`, `junos/policy-options/prefix-list/pl-an-region.conf`, `junos/policy-options/prefix-list/pl-mse-primary.conf`, `junos/policy-options/prefix-list/pl-mse.conf`, `junos/protocols/bgp-overlay-mse1.conf`, `junos/routing-options/rib-group-remote-loopbacks-mse.conf`
- `as-deployed`: the self-contained set plus this device's validated underlay, apply-group, CoS and OAM baselines.

---

## Kompella L2VPN pseudowires

Family e-line, form rfc4761. OS mode MIXED. Attachment: vlan-ccc logical unit.

### an3_acx7100-48l (evo)

- `minimum`: `evo/routing-instances/l2vpn/ri-l2vpn-kompella.conf`
- `self-contained`: the above plus `evo/groups/gr-fatpw-label.conf`
- `as-deployed`: the self-contained set plus this device's validated underlay, apply-group, CoS and OAM baselines.

### ma5_mx204 (junos)

- `minimum`: `evo/routing-instances/l2vpn/ri-l2vpn-kompella.conf`
- `self-contained`: the above plus `junos/groups/gr-fatpw-label.conf`
- `as-deployed`: the self-contained set plus this device's validated underlay, apply-group, CoS and OAM baselines.

---

## L2Circuit hot-standby pseudowires

Family e-line, form hot-standby. OS mode EVO. Attachment: vlan-ccc logical unit.

### meg2_acx7509 (evo)

- `minimum`: `evo/protocols/l2circuit-hsb-pe.conf`
- `self-contained`: the above plus `evo/groups/gr-fatpw-lb.conf`, `evo/groups/gr-l2ckt-hs.conf`
- `as-deployed`: the self-contained set plus this device's validated underlay, apply-group, CoS and OAM baselines.

---

## L2Circuit floating pseudowires

Family e-line, form floating-pseudowire. OS mode MIXED. Attachment: static-label PW onto a ps<N> pseudowire-subscriber anchor.

### mse1_mx304 (junos)

- `minimum`: `junos/protocols/l2circuit-floating-pw.conf`
- `self-contained`: the above plus `junos/chassis/pseudowire-service.conf`, `junos/chassis/tunnel-services.conf`, `junos/interfaces/ifd-ps-transport.conf`
- `as-deployed`: the self-contained set plus this device's validated underlay, apply-group, CoS and OAM baselines.

### mse2_mx304 (junos)

- `minimum`: `junos/protocols/l2circuit-floating-pw.conf`
- `self-contained`: the above plus `junos/chassis/pseudowire-service.conf`, `junos/chassis/tunnel-services.conf`, `junos/interfaces/ifd-ps-transport.conf`
- `as-deployed`: the self-contained set plus this device's validated underlay, apply-group, CoS and OAM baselines.

---

## L2Circuit local-switching cross-connects

Family e-access, form local-switching. OS mode EVO. Attachment: two vlan-ccc UNIs on one PE.

### ma3_acx7100-48l (evo)

- `minimum`: `evo/protocols/l2circuit-lsw.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_INTF_1.$UNIT_1
  - occurrence-provider-closure-failed: logical-interface:$AC_INTF_1.$UNIT_1
  - occurrence-selection-required: logical-interface:$AC_INTF_2.$UNIT_2
  - occurrence-provider-closure-failed: logical-interface:$AC_INTF_2.$UNIT_2

---

## EVPN-ELAN instances

Family e-lan, form vlan-based. OS mode MIXED. Attachment: vlan-bridge logical unit.

### an3_acx7100-48l (evo)

- `minimum`: `evo/routing-instances/evpn-elan/ri-evpn-elan-vlan-based-export.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-no-applicable-provider: logical-interface:$AC_INTF
  - occurrence-no-applicable-provider: logical-interface:$AC_INTF

### ma1-1_acx7024 (evo)

- `minimum`: `evo/routing-instances/evpn-elan/ri-evpn-elan-vlan-based-export.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-no-applicable-provider: logical-interface:$AC_INTF
  - occurrence-no-applicable-provider: logical-interface:$AC_INTF

### ma1-2_acx7024 (evo)

- `minimum`: `evo/routing-instances/evpn-elan/ri-evpn-elan-vlan-based-export.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-no-applicable-provider: logical-interface:$AC_INTF
  - occurrence-no-applicable-provider: logical-interface:$AC_INTF

### meg1_acx7100-32c (evo)

- `minimum`: `evo/routing-instances/evpn-elan/ri-evpn-elan-vlan-based-export.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-no-applicable-provider: logical-interface:$AC_INTF
  - occurrence-no-applicable-provider: logical-interface:$AC_INTF

### meg2_acx7509 (evo)

- `minimum`: `evo/routing-instances/evpn-elan/ri-evpn-elan-vlan-based-export.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-no-applicable-provider: logical-interface:$AC_INTF
  - occurrence-no-applicable-provider: logical-interface:$AC_INTF

### an1_mx204 (junos)

- `minimum`: `junos/routing-instances/evpn-elan/ri-evpn-elan-vlan-based.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_INTF.$VLAN_UNIT
  - occurrence-provider-closure-failed: logical-interface:$AC_INTF.$VLAN_UNIT

### an2_acx5448 (junos)

- `minimum`: `junos/routing-instances/evpn-elan/ri-evpn-elan-vlan-based.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_INTF.$VLAN_UNIT
  - occurrence-provider-closure-failed: logical-interface:$AC_INTF.$VLAN_UNIT

---

## port-based EVPN-ELAN instances

Family e-lan, form port-based. OS mode EVO. Attachment: single full-port UNI.

### an3_acx7100-48l (evo)

- `minimum`: `evo/routing-instances/evpn-elan/ri-evpn-port-based.conf`
- `self-contained`: the above plus `evo/groups/gr-bgp-bcp-an3.conf`, `evo/policy-options/community/cm-access-fabric.conf`, `evo/policy-options/community/cm-loopback.conf`, `evo/policy-options/community/cm-no-advertise.conf`, `evo/policy-options/policy-statement/loopback-rib-leak.conf`, `evo/policy-options/policy-statement/ps-bgp-export.conf`, `evo/protocols/bgp-overlay-an3.conf`, `evo/routing-options/rib-groups.conf`, `evo/routing-options/transport-class.conf`, `junos/policy-options/policy-statement/ps-remote-loopbacks-mse.conf`
- `as-deployed`: the self-contained set plus this device's validated underlay, apply-group, CoS and OAM baselines.

### ma1-2_acx7024 (evo)

- `minimum`: `evo/routing-instances/evpn-elan/ri-evpn-port-based.conf`
- `self-contained`: the above plus `evo/groups/gr-bgp-bcp.conf`, `evo/policy-options/community/cm-loopback.conf`, `evo/policy-options/community/cm-metro-ring.conf`, `evo/policy-options/community/cm-no-advertise.conf`, `evo/policy-options/policy-statement/loopback-rib-leak.conf`, `evo/policy-options/policy-statement/nhs1-ma1-1.conf`, `evo/policy-options/policy-statement/ps-bgp-transport-export.conf`, `evo/protocols/bgp-overlay.conf`, `evo/routing-options/rib-groups.conf`, `evo/routing-options/transport-class.conf`, `junos/policy-options/policy-statement/ps-remote-loopbacks-mse.conf`
- `as-deployed`: the self-contained set plus this device's validated underlay, apply-group, CoS and OAM baselines.

---

## BGP-VPLS instances

Family e-lan, form rfc4761-vpls. OS mode MIXED. Attachment: vlan-bridge logical unit.

### an3_acx7100-48l (evo)

- `minimum`: `evo/routing-instances/vpls/ri-bgp-vpls-vlan.conf`
- `self-contained`: the above — it names nothing further
- `as-deployed`: the self-contained set plus this device's validated underlay, apply-group, CoS and OAM baselines.

### ma1-2_acx7024 (evo)

- `minimum`: `evo/routing-instances/vpls/ri-bgp-vpls-vlan.conf`
- `self-contained`: the above — it names nothing further
- `as-deployed`: the self-contained set plus this device's validated underlay, apply-group, CoS and OAM baselines.

### meg1_acx7100-32c (evo)

- `minimum`: `evo/routing-instances/vpls/ri-bgp-vpls-vlan.conf`
- `self-contained`: the above — it names nothing further
- `as-deployed`: the self-contained set plus this device's validated underlay, apply-group, CoS and OAM baselines.

### meg2_acx7509 (evo)

- `minimum`: `evo/routing-instances/vpls/ri-bgp-vpls-vlan.conf`
- `self-contained`: the above — it names nothing further
- `as-deployed`: the self-contained set plus this device's validated underlay, apply-group, CoS and OAM baselines.

### ma5_mx204 (junos)

- `minimum`: `junos/routing-instances/vpls/ri-bgp-vpls-site-range.conf`
- `self-contained`: the above plus `junos/groups/bgp-bcp-ma5.conf`, `junos/policy-options/community/cm-loopback.conf`, `junos/policy-options/community/cm-metro-ring.conf`, `junos/policy-options/community/cm-no-advertise.conf`, `junos/policy-options/policy-statement/loopback-rib-leak.conf`, `junos/policy-options/policy-statement/nhs1.conf`, `junos/policy-options/policy-statement/ps-bgp-transport-export.conf`, `junos/policy-options/policy-statement/ps-remote-loopbacks-mse.conf`, `junos/protocols/bgp-overlay-ma5.conf`, `junos/routing-options/rib-groups.conf`, `junos/routing-options/transport-class.conf`
- `as-deployed`: the self-contained set plus this device's validated underlay, apply-group, CoS and OAM baselines.

---

## LDP-VPLS instances

Family e-lan, form rfc4762-vpls. OS mode EVO. Attachment: vlan-bridge logical unit.

### an3_acx7100-48l (evo)

- `minimum`: `evo/routing-instances/vpls/ri-ldp-vpls.conf`
- `self-contained`: the above — it names nothing further
- `as-deployed`: the self-contained set plus this device's validated underlay, apply-group, CoS and OAM baselines.

---

## EVPN E-Tree services

Family e-tree, form root-leaf. OS mode Junos. Attachment: vlan-bridge logical unit, root or leaf.

### ma4_mx204 (junos)

- `minimum`: `junos/routing-instances/evpn-etree/ri-evpn-etree.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_INTF.$UNIT

### ma5_mx204 (junos)

- `minimum`: `junos/routing-instances/evpn-etree/ri-evpn-etree.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_INTF.$UNIT

### mse1_mx304 (junos)

- `minimum`: `junos/routing-instances/evpn-etree/ri-evpn-etree.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_INTF.$UNIT

### mse2_mx304 (junos)

- `minimum`: `junos/routing-instances/evpn-etree/ri-evpn-etree.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_INTF.$UNIT

---

## EVPN-ELAN with IRB

Family irb, form type2-only. OS mode MIXED. Attachment: vlan-bridge unit plus an irb unit.

### an3_acx7100-48l (evo)

- `minimum`: `evo/routing-instances/evpn-elan/ri-evpn-elan-irb.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-no-applicable-provider: logical-interface:$AC_INTF
  - occurrence-no-applicable-provider: logical-interface:$IRB_UNIT

### meg1_acx7100-32c (evo)

- `minimum`: `evo/routing-instances/evpn-elan/ri-evpn-elan-irb.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-no-applicable-provider: logical-interface:$AC_INTF
  - occurrence-no-applicable-provider: logical-interface:$IRB_UNIT

### meg2_acx7509 (evo)

- `minimum`: `evo/routing-instances/evpn-elan/ri-evpn-elan-irb.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-no-applicable-provider: logical-interface:$AC_INTF
  - occurrence-no-applicable-provider: logical-interface:$IRB_UNIT

### mse1_mx304 (junos)

- `minimum`: `junos/routing-instances/evpn-elan/ri-evpn-elan-irb.conf`
- `self-contained`: the above plus `junos/groups/gr-bgp-bcp.conf`, `junos/groups/gr-edge-intf.conf`, `junos/interfaces/ethernet-bridge.conf`, `junos/interfaces/ifl-irb-inet.conf`, `junos/policy-options/community/cm-access-fabric.conf`, `junos/policy-options/community/cm-loopback.conf`, `junos/policy-options/community/cm-metro-fabric.conf`, `junos/policy-options/community/cm-metro-ring.conf`, `junos/policy-options/community/cm-no-advertise.conf`, `junos/policy-options/community/cm-region-edge.conf`, `junos/policy-options/community/cm-service-edge.conf`, `junos/policy-options/policy-statement/ps-as63535-import.conf`, `junos/policy-options/policy-statement/ps-ebgp-cr-export.conf`, `junos/policy-options/policy-statement/ps-ibgp-mdr-export-mse1.conf`, `junos/policy-options/policy-statement/ps-ibgp-mse-export.conf`, `junos/policy-options/policy-statement/ps-import-bgp-lo0-filter-evpn.conf`, `junos/policy-options/policy-statement/ps-mse-import.conf`, `junos/policy-options/policy-statement/ps-remote-loopbacks-mse.conf`, `junos/policy-options/prefix-list/pl-an-region.conf`, `junos/policy-options/prefix-list/pl-mse-primary.conf`, `junos/policy-options/prefix-list/pl-mse.conf`, `junos/protocols/bgp-overlay-mse1.conf`, `junos/routing-options/rib-group-remote-loopbacks-mse.conf`
- `as-deployed`: the self-contained set plus this device's validated underlay, apply-group, CoS and OAM baselines.

### mse2_mx304 (junos)

- `minimum`: `junos/routing-instances/evpn-elan/ri-evpn-elan-irb.conf`
- `self-contained`: the above plus `junos/groups/gr-bgp-bcp.conf`, `junos/groups/gr-edge-intf.conf`, `junos/interfaces/ethernet-bridge.conf`, `junos/interfaces/ifl-irb-inet.conf`, `junos/policy-options/community/cm-access-fabric.conf`, `junos/policy-options/community/cm-loopback.conf`, `junos/policy-options/community/cm-metro-fabric.conf`, `junos/policy-options/community/cm-metro-ring.conf`, `junos/policy-options/community/cm-no-advertise.conf`, `junos/policy-options/community/cm-region-edge.conf`, `junos/policy-options/community/cm-service-edge.conf`, `junos/policy-options/policy-statement/ps-as63535-import.conf`, `junos/policy-options/policy-statement/ps-ebgp-cr-export.conf`, `junos/policy-options/policy-statement/ps-ibgp-mdr-export-mse1.conf`, `junos/policy-options/policy-statement/ps-ibgp-mse-export.conf`, `junos/policy-options/policy-statement/ps-import-bgp-lo0-filter-evpn.conf`, `junos/policy-options/policy-statement/ps-mse-import.conf`, `junos/policy-options/policy-statement/ps-remote-loopbacks-mse.conf`, `junos/policy-options/prefix-list/pl-an-region.conf`, `junos/policy-options/prefix-list/pl-mse-primary.conf`, `junos/policy-options/prefix-list/pl-mse.conf`, `junos/protocols/bgp-overlay-mse2.conf`, `junos/routing-options/rib-group-remote-loopbacks-mse.conf`
- `as-deployed`: the self-contained set plus this device's validated underlay, apply-group, CoS and OAM baselines.

---

## EVPN-ELAN with L3 (Type-2 + Type-5)

Family irb, form type2-plus-type5. OS mode MIXED. Attachment: irb unit shared with the EVPN-ELAN half.

### an3_acx7100-48l (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-l3vpn-evpn-vrf-policy.conf`
- `self-contained`: the above plus `evo/groups/gr-bgp-bcp-an3.conf`, `evo/groups/gr-l3vpn.conf`, `evo/interfaces/ifl-irb-inet.conf`, `evo/policy-options/community/cm-access-fabric.conf`, `evo/policy-options/community/cm-l3vpn-pub.conf`, `evo/policy-options/community/cm-l3vpn.conf`, `evo/policy-options/community/cm-loopback.conf`, `evo/policy-options/community/cm-no-advertise.conf`, `evo/policy-options/policy-statement/loopback-rib-leak.conf`, `evo/policy-options/policy-statement/ps-bgp-export.conf`, `evo/policy-options/policy-statement/ps-export-l3vpn-public.conf`, `evo/policy-options/policy-statement/ps-import-l3vpn.conf`, `evo/protocols/bgp-overlay-an3.conf`, `evo/routing-options/rib-groups.conf`, `evo/routing-options/transport-class.conf`, `junos/policy-options/policy-statement/ps-remote-loopbacks-mse.conf`
- `as-deployed`: the self-contained set plus this device's validated underlay, apply-group, CoS and OAM baselines.

### mse1_mx304 (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-l3vpn-evpn-vrf-policy.conf`
- `self-contained`: the above plus `junos/groups/gr-bgp-bcp.conf`, `junos/groups/gr-l3vpn.conf`, `junos/interfaces/ifl-irb-inet.conf`, `junos/policy-options/community/cm-access-fabric.conf`, `junos/policy-options/community/cm-l3vpn-pub.conf`, `junos/policy-options/community/cm-l3vpn.conf`, `junos/policy-options/community/cm-loopback.conf`, `junos/policy-options/community/cm-metro-fabric.conf`, `junos/policy-options/community/cm-metro-ring.conf`, `junos/policy-options/community/cm-no-advertise.conf`, `junos/policy-options/community/cm-region-edge.conf`, `junos/policy-options/community/cm-service-edge.conf`, `junos/policy-options/policy-statement/ps-as63535-import.conf`, `junos/policy-options/policy-statement/ps-ebgp-cr-export.conf`, `junos/policy-options/policy-statement/ps-export-l3vpn-public.conf`, `junos/policy-options/policy-statement/ps-ibgp-mdr-export-mse1.conf`, `junos/policy-options/policy-statement/ps-ibgp-mse-export.conf`, `junos/policy-options/policy-statement/ps-import-bgp-lo0-filter-evpn.conf`, `junos/policy-options/policy-statement/ps-import-l3vpn.conf`, `junos/policy-options/policy-statement/ps-mse-import.conf`, `junos/policy-options/policy-statement/ps-remote-loopbacks-mse.conf`, `junos/policy-options/prefix-list/pl-an-region.conf`, `junos/policy-options/prefix-list/pl-mse-primary.conf`, `junos/policy-options/prefix-list/pl-mse.conf`, `junos/protocols/bgp-overlay-mse1.conf`, `junos/routing-options/rib-group-remote-loopbacks-mse.conf`
- `as-deployed`: the self-contained set plus this device's validated underlay, apply-group, CoS and OAM baselines.

---

## slim L3VPN anchor VRFs

Family irb, form slim-anchor. OS mode MIXED. Attachment: irb unit anchored to a MAC-VRF.

### meg1_acx7100-32c (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-l3vpn-irb.conf`
- `self-contained`: the above plus `evo/groups/gr-bgp-bcp.conf`, `evo/interfaces/ifl-irb-virtual-gateway.conf`, `evo/policy-options/community/cm-access-fabric.conf`, `evo/policy-options/community/cm-loopback.conf`, `evo/policy-options/community/cm-metro-ring.conf`, `evo/policy-options/community/cm-no-advertise.conf`, `evo/policy-options/community/cm-regional-border.conf`, `evo/policy-options/community/cm-service-edge.conf`, `evo/policy-options/community/cm-tc-4000-gold.conf`, `evo/policy-options/community/cm-tc-6000-bronze.conf`, `evo/policy-options/policy-statement/loopback-rib-leak.conf`, `evo/policy-options/policy-statement/ps-bgp-rr-export.conf`, `evo/policy-options/policy-statement/ps-ibgp-cr-export-meg1.conf`, `evo/policy-options/policy-statement/ps-import-bgp-lo0-filter.conf`, `evo/policy-options/prefix-list/pl-an-nodes.conf`, `evo/policy-options/prefix-list/pl-core.conf`, `evo/policy-options/prefix-list/pl-fabric.conf`, `evo/protocols/bgp-overlay-meg1.conf`, `evo/routing-options/rib-groups.conf`, `evo/routing-options/transport-class.conf`, `junos/policy-options/policy-statement/ps-remote-loopbacks-mse.conf`
- `as-deployed`: the self-contained set plus this device's validated underlay, apply-group, CoS and OAM baselines.

### meg2_acx7509 (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-l3vpn-irb.conf`
- `self-contained`: the above plus `evo/groups/gr-bgp-bcp.conf`, `evo/interfaces/ifl-irb-virtual-gateway.conf`, `evo/policy-options/community/cm-access-fabric.conf`, `evo/policy-options/community/cm-loopback.conf`, `evo/policy-options/community/cm-metro-ring.conf`, `evo/policy-options/community/cm-no-advertise.conf`, `evo/policy-options/community/cm-regional-border.conf`, `evo/policy-options/community/cm-service-edge.conf`, `evo/policy-options/community/cm-tc-4000-gold.conf`, `evo/policy-options/community/cm-tc-6000-bronze.conf`, `evo/policy-options/policy-statement/loopback-rib-leak.conf`, `evo/policy-options/policy-statement/ps-bgp-rr-export.conf`, `evo/policy-options/policy-statement/ps-ibgp-cr-export-meg1.conf`, `evo/policy-options/policy-statement/ps-import-bgp-lo0-filter.conf`, `evo/policy-options/prefix-list/pl-an-nodes.conf`, `evo/policy-options/prefix-list/pl-core.conf`, `evo/policy-options/prefix-list/pl-fabric.conf`, `evo/protocols/bgp-overlay-meg2.conf`, `evo/routing-options/rib-groups.conf`, `evo/routing-options/transport-class.conf`, `junos/policy-options/policy-statement/ps-remote-loopbacks-mse.conf`
- `as-deployed`: the self-contained set plus this device's validated underlay, apply-group, CoS and OAM baselines.

### mse1_mx304 (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-l3vpn-irb.conf`
- `self-contained`: the above plus `junos/groups/gr-bgp-bcp.conf`, `junos/groups/gr-l3vpn.conf`, `junos/interfaces/ifl-irb-inet.conf`, `junos/policy-options/community/cm-access-fabric.conf`, `junos/policy-options/community/cm-loopback.conf`, `junos/policy-options/community/cm-metro-fabric.conf`, `junos/policy-options/community/cm-metro-ring.conf`, `junos/policy-options/community/cm-no-advertise.conf`, `junos/policy-options/community/cm-region-edge.conf`, `junos/policy-options/community/cm-service-edge.conf`, `junos/policy-options/policy-statement/ps-as63535-import.conf`, `junos/policy-options/policy-statement/ps-ebgp-cr-export.conf`, `junos/policy-options/policy-statement/ps-ibgp-mdr-export-mse1.conf`, `junos/policy-options/policy-statement/ps-ibgp-mse-export.conf`, `junos/policy-options/policy-statement/ps-import-bgp-lo0-filter-evpn.conf`, `junos/policy-options/policy-statement/ps-mse-import.conf`, `junos/policy-options/policy-statement/ps-remote-loopbacks-mse.conf`, `junos/policy-options/prefix-list/pl-an-region.conf`, `junos/policy-options/prefix-list/pl-mse-primary.conf`, `junos/policy-options/prefix-list/pl-mse.conf`, `junos/protocols/bgp-overlay-mse1.conf`, `junos/routing-options/rib-group-remote-loopbacks-mse.conf`
- `as-deployed`: the self-contained set plus this device's validated underlay, apply-group, CoS and OAM baselines.

### mse2_mx304 (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-l3vpn-irb.conf`
- `self-contained`: the above plus `junos/groups/gr-bgp-bcp.conf`, `junos/groups/gr-l3vpn.conf`, `junos/interfaces/ifl-irb-inet.conf`, `junos/policy-options/community/cm-access-fabric.conf`, `junos/policy-options/community/cm-loopback.conf`, `junos/policy-options/community/cm-metro-fabric.conf`, `junos/policy-options/community/cm-metro-ring.conf`, `junos/policy-options/community/cm-no-advertise.conf`, `junos/policy-options/community/cm-region-edge.conf`, `junos/policy-options/community/cm-service-edge.conf`, `junos/policy-options/policy-statement/ps-as63535-import.conf`, `junos/policy-options/policy-statement/ps-ebgp-cr-export.conf`, `junos/policy-options/policy-statement/ps-ibgp-mdr-export-mse1.conf`, `junos/policy-options/policy-statement/ps-ibgp-mse-export.conf`, `junos/policy-options/policy-statement/ps-import-bgp-lo0-filter-evpn.conf`, `junos/policy-options/policy-statement/ps-mse-import.conf`, `junos/policy-options/policy-statement/ps-remote-loopbacks-mse.conf`, `junos/policy-options/prefix-list/pl-an-region.conf`, `junos/policy-options/prefix-list/pl-mse-primary.conf`, `junos/policy-options/prefix-list/pl-mse.conf`, `junos/protocols/bgp-overlay-mse2.conf`, `junos/routing-options/rib-group-remote-loopbacks-mse.conf`
- `as-deployed`: the self-contained set plus this device's validated underlay, apply-group, CoS and OAM baselines.

---

## L3VPN VRFs with PE-CE eBGP

Family l3vpn, form pe-ce-ebgp. OS mode MIXED. Attachment: family inet logical unit toward the CE.

### an3_acx7100-48l (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-l3vpn-bgp-vrf-policy.conf`
- `self-contained`: the above plus `evo/groups/gr-bgp-bcp-an3.conf`, `evo/policy-options/community/cm-access-fabric.conf`, `evo/policy-options/community/cm-inet-default.conf`, `evo/policy-options/community/cm-l3vpn.conf`, `evo/policy-options/community/cm-loopback.conf`, `evo/policy-options/community/cm-no-advertise.conf`, `evo/policy-options/policy-statement/loopback-rib-leak.conf`, `evo/policy-options/policy-statement/ps-bgp-export.conf`, `evo/policy-options/policy-statement/ps-import-l3vpn-internet.conf`, `evo/protocols/bgp-overlay-an3.conf`, `evo/routing-options/rib-groups.conf`, `evo/routing-options/transport-class.conf`, `junos/policy-options/policy-statement/ps-remote-loopbacks-mse.conf`
  - ask for **policy-statement:$EXPORT_POL**, one of `evo/policy-options/policy-statement/ps-export-l3vpn-public-default-2.conf`, `evo/policy-options/policy-statement/ps-export-l3vpn-public-default-3.conf`, `evo/policy-options/policy-statement/ps-export-l3vpn-public-default-4.conf`, `evo/policy-options/policy-statement/ps-export-l3vpn-public-default-v6-2.conf`, `evo/policy-options/policy-statement/ps-export-l3vpn-public-default-v6-4.conf`
- `as-deployed`: the self-contained set plus this device's validated underlay, apply-group, CoS and OAM baselines.

### ma3_acx7100-48l (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-l3vpn-bgp-vrf-policy.conf`
- `self-contained`: the above plus `evo/groups/gr-bgp-bcp.conf`, `evo/policy-options/community/cm-inet-default.conf`, `evo/policy-options/community/cm-l3vpn.conf`, `evo/policy-options/community/cm-loopback.conf`, `evo/policy-options/community/cm-metro-ring.conf`, `evo/policy-options/community/cm-no-advertise.conf`, `evo/policy-options/policy-statement/loopback-rib-leak.conf`, `evo/policy-options/policy-statement/nhs1-ma3.conf`, `evo/policy-options/policy-statement/ps-bgp-transport-export.conf`, `evo/policy-options/policy-statement/ps-import-l3vpn-internet.conf`, `evo/protocols/bgp-overlay-ma3.conf`, `evo/routing-options/rib-groups.conf`, `evo/routing-options/transport-class.conf`, `junos/policy-options/policy-statement/ps-remote-loopbacks-mse.conf`
  - ask for **policy-statement:$EXPORT_POL**, one of `evo/policy-options/policy-statement/ps-export-l3vpn-public-default-3.conf`, `evo/policy-options/policy-statement/ps-export-l3vpn-public-default-4.conf`, `evo/policy-options/policy-statement/ps-export-l3vpn-public-default-v6-2.conf`, `evo/policy-options/policy-statement/ps-export-l3vpn-public-default-v6-4.conf`
- `as-deployed`: the self-contained set plus this device's validated underlay, apply-group, CoS and OAM baselines.

### ma4_mx204 (junos)

- `minimum`: `evo/routing-instances/l3vpn/ri-l3vpn-bgp-vrf-policy.conf`
- `self-contained`: the above plus `junos/groups/bgp-bcp-ma5.conf`, `junos/groups/gr-bgp-bcp.conf`, `junos/policy-options/community/cm-inet-default.conf`, `junos/policy-options/community/cm-l3vpn.conf`, `junos/policy-options/community/cm-loopback.conf`, `junos/policy-options/community/cm-metro-ring.conf`, `junos/policy-options/community/cm-no-advertise.conf`, `junos/policy-options/policy-statement/loopback-rib-leak.conf`, `junos/policy-options/policy-statement/nhs1.conf`, `junos/policy-options/policy-statement/ps-bgp-transport-export.conf`, `junos/policy-options/policy-statement/ps-import-l3vpn-internet.conf`, `junos/policy-options/policy-statement/ps-remote-loopbacks-mse.conf`, `junos/protocols/bgp-overlay-ma4.conf`, `junos/routing-options/rib-groups.conf`, `junos/routing-options/transport-class.conf`
  - ask for **policy-statement:$EXPORT_POL**, one of `junos/policy-options/policy-statement/ps-export-l3vpn-public-default-3-color.conf`, `junos/policy-options/policy-statement/ps-export-l3vpn-public-default-3.conf`, `junos/policy-options/policy-statement/ps-export-l3vpn-public-default-v6-3.conf`
- `as-deployed`: the self-contained set plus this device's validated underlay, apply-group, CoS and OAM baselines.

### mse1_mx304 (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-l3vpn-bgp-vrf-policy-auto-export.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: policy-community:source-occurrence

### mse2_mx304 (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-l3vpn-bgp-vrf-policy-auto-export.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: policy-community:source-occurrence

---

## L3VPN VRFs with PE-CE OSPF

Family l3vpn, form pe-ce-ospf. OS mode MIXED. Attachment: family inet logical unit toward the CE.

### an3_acx7100-48l (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-l3vpn-ospf-vrf-policy-auto-export.conf`
- `self-contained`: the above plus `evo/groups/gr-bgp-bcp-an3.conf`, `evo/policy-options/community/cm-access-fabric.conf`, `evo/policy-options/community/cm-inet-default.conf`, `evo/policy-options/community/cm-l3vpn.conf`, `evo/policy-options/community/cm-loopback.conf`, `evo/policy-options/community/cm-no-advertise.conf`, `evo/policy-options/policy-statement/loopback-rib-leak.conf`, `evo/policy-options/policy-statement/ps-bgp-export.conf`, `evo/policy-options/policy-statement/ps-import-l3vpn-internet.conf`, `evo/protocols/bgp-overlay-an3.conf`, `evo/routing-options/rib-groups.conf`, `evo/routing-options/transport-class.conf`, `junos/policy-options/policy-statement/ps-remote-loopbacks-mse.conf`
  - ask for **policy-statement:$EXPORT_POL**, one of `evo/policy-options/policy-statement/ps-export-l3vpn-public-default-2.conf`, `evo/policy-options/policy-statement/ps-export-l3vpn-public-default-3.conf`, `evo/policy-options/policy-statement/ps-export-l3vpn-public-default-4.conf`, `evo/policy-options/policy-statement/ps-export-l3vpn-public-default-v6-2.conf`, `evo/policy-options/policy-statement/ps-export-l3vpn-public-default-v6-4.conf`
- `as-deployed`: the self-contained set plus this device's validated underlay, apply-group, CoS and OAM baselines.

### ma3_acx7100-48l (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-l3vpn-ospf-vrf-policy-auto-export.conf`
- `self-contained`: the above plus `evo/groups/gr-bgp-bcp.conf`, `evo/policy-options/community/cm-inet-default.conf`, `evo/policy-options/community/cm-l3vpn.conf`, `evo/policy-options/community/cm-loopback.conf`, `evo/policy-options/community/cm-metro-ring.conf`, `evo/policy-options/community/cm-no-advertise.conf`, `evo/policy-options/policy-statement/loopback-rib-leak.conf`, `evo/policy-options/policy-statement/nhs1-ma3.conf`, `evo/policy-options/policy-statement/ps-bgp-transport-export.conf`, `evo/policy-options/policy-statement/ps-import-l3vpn-internet.conf`, `evo/protocols/bgp-overlay-ma3.conf`, `evo/routing-options/rib-groups.conf`, `evo/routing-options/transport-class.conf`, `junos/policy-options/policy-statement/ps-remote-loopbacks-mse.conf`
  - ask for **policy-statement:$EXPORT_POL**, one of `evo/policy-options/policy-statement/ps-export-l3vpn-public-default-3.conf`, `evo/policy-options/policy-statement/ps-export-l3vpn-public-default-4.conf`, `evo/policy-options/policy-statement/ps-export-l3vpn-public-default-v6-2.conf`, `evo/policy-options/policy-statement/ps-export-l3vpn-public-default-v6-4.conf`
- `as-deployed`: the self-contained set plus this device's validated underlay, apply-group, CoS and OAM baselines.

### ma4_mx204 (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-l3vpn-ospf-vrf-policy.conf`
- `self-contained`: the above plus `junos/groups/bgp-bcp-ma5.conf`, `junos/groups/gr-bgp-bcp.conf`, `junos/groups/gr-l3vpn.conf`, `junos/policy-options/community/cm-inet-default.conf`, `junos/policy-options/community/cm-l3vpn-pub.conf`, `junos/policy-options/community/cm-l3vpn.conf`, `junos/policy-options/community/cm-loopback.conf`, `junos/policy-options/community/cm-metro-ring.conf`, `junos/policy-options/community/cm-no-advertise.conf`, `junos/policy-options/policy-statement/loopback-rib-leak.conf`, `junos/policy-options/policy-statement/nhs1.conf`, `junos/policy-options/policy-statement/ps-bgp-transport-export.conf`, `junos/policy-options/policy-statement/ps-export-l3vpn-public-default-3.conf`, `junos/policy-options/policy-statement/ps-import-l3vpn-internet.conf`, `junos/policy-options/policy-statement/ps-remote-loopbacks-mse.conf`, `junos/protocols/bgp-overlay-ma4.conf`, `junos/routing-options/rib-groups.conf`, `junos/routing-options/transport-class.conf`
  - ask for **policy-statement:$EXPORT_POL**, one of `junos/policy-options/policy-statement/ps-export-l3vpn-public-default-3-color.conf`, `junos/policy-options/policy-statement/ps-export-l3vpn-public-default-3.conf`, `junos/policy-options/policy-statement/ps-export-l3vpn-public-default-v6-3.conf`
- `as-deployed`: the self-contained set plus this device's validated underlay, apply-group, CoS and OAM baselines.

### mse1_mx304 (junos)

- `minimum`: `evo/routing-instances/l3vpn/ri-l3vpn-ospf-vrf-policy-auto-export.conf`
- `self-contained`: the above plus `junos/groups/gr-bgp-bcp.conf`, `junos/policy-options/community/cm-access-fabric.conf`, `junos/policy-options/community/cm-inet-default.conf`, `junos/policy-options/community/cm-l3vpn.conf`, `junos/policy-options/community/cm-loopback.conf`, `junos/policy-options/community/cm-metro-fabric.conf`, `junos/policy-options/community/cm-metro-ring.conf`, `junos/policy-options/community/cm-no-advertise.conf`, `junos/policy-options/community/cm-region-edge.conf`, `junos/policy-options/community/cm-service-edge.conf`, `junos/policy-options/policy-statement/ps-as63535-import.conf`, `junos/policy-options/policy-statement/ps-ebgp-cr-export.conf`, `junos/policy-options/policy-statement/ps-ibgp-mdr-export-mse1.conf`, `junos/policy-options/policy-statement/ps-ibgp-mse-export.conf`, `junos/policy-options/policy-statement/ps-import-bgp-lo0-filter-evpn.conf`, `junos/policy-options/policy-statement/ps-import-l3vpn-internet.conf`, `junos/policy-options/policy-statement/ps-mse-import.conf`, `junos/policy-options/policy-statement/ps-remote-loopbacks-mse.conf`, `junos/policy-options/prefix-list/pl-an-region.conf`, `junos/policy-options/prefix-list/pl-mse-primary.conf`, `junos/policy-options/prefix-list/pl-mse.conf`, `junos/protocols/bgp-overlay-mse1.conf`, `junos/routing-options/rib-group-remote-loopbacks-mse.conf`
  - ask for **policy-statement:$EXPORT_POL**, one of `junos/policy-options/policy-statement/ps-export-l3vpn-public-default-2.conf`, `junos/policy-options/policy-statement/ps-export-l3vpn-public-default-3.conf`, `junos/policy-options/policy-statement/ps-export-l3vpn-public-default-v6-2.conf`, `junos/policy-options/policy-statement/ps-export-l3vpn-public-default-v6-3.conf`
- `as-deployed`: the self-contained set plus this device's validated underlay, apply-group, CoS and OAM baselines.

### mse2_mx304 (junos)

- `minimum`: `evo/routing-instances/l3vpn/ri-l3vpn-ospf-vrf-policy-auto-export.conf`
- `self-contained`: the above plus `junos/groups/gr-bgp-bcp.conf`, `junos/policy-options/community/cm-access-fabric.conf`, `junos/policy-options/community/cm-inet-default.conf`, `junos/policy-options/community/cm-l3vpn.conf`, `junos/policy-options/community/cm-loopback.conf`, `junos/policy-options/community/cm-metro-fabric.conf`, `junos/policy-options/community/cm-metro-ring.conf`, `junos/policy-options/community/cm-no-advertise.conf`, `junos/policy-options/community/cm-region-edge.conf`, `junos/policy-options/community/cm-service-edge.conf`, `junos/policy-options/policy-statement/ps-as63535-import.conf`, `junos/policy-options/policy-statement/ps-ebgp-cr-export.conf`, `junos/policy-options/policy-statement/ps-ibgp-mdr-export-mse1.conf`, `junos/policy-options/policy-statement/ps-ibgp-mse-export.conf`, `junos/policy-options/policy-statement/ps-import-bgp-lo0-filter-evpn.conf`, `junos/policy-options/policy-statement/ps-import-l3vpn-internet.conf`, `junos/policy-options/policy-statement/ps-mse-import.conf`, `junos/policy-options/policy-statement/ps-remote-loopbacks-mse.conf`, `junos/policy-options/prefix-list/pl-an-region.conf`, `junos/policy-options/prefix-list/pl-mse-primary.conf`, `junos/policy-options/prefix-list/pl-mse.conf`, `junos/protocols/bgp-overlay-mse2.conf`, `junos/routing-options/rib-group-remote-loopbacks-mse.conf`
  - ask for **policy-statement:$EXPORT_POL**, one of `junos/policy-options/policy-statement/ps-export-l3vpn-public-default-2.conf`, `junos/policy-options/policy-statement/ps-export-l3vpn-public-default-3.conf`, `junos/policy-options/policy-statement/ps-export-l3vpn-public-default-4.conf`, `junos/policy-options/policy-statement/ps-export-l3vpn-public-default-v6-2.conf`, `junos/policy-options/policy-statement/ps-export-l3vpn-public-default-v6-3.conf`, `junos/policy-options/policy-statement/ps-export-l3vpn-public-default-v6-4.conf`
- `as-deployed`: the self-contained set plus this device's validated underlay, apply-group, CoS and OAM baselines.

---
