# TIERS — Enterprise Data Center Edge

Per-service snippet sets for the three form tiers. This is a derived view of the snippet headers
(`Seen on`, `Pair with`) and the dependency declarations in
[`_composition.json`](../_composition.json); those are authoritative. If this file and a snippet
header disagree, follow the snippet header and say so in `Notes:`. Nothing here adds a requirement.

## What the tiers mean

| Tier | What it includes |
|---|---|
| `minimum` | Only the service construct. Assumes the device already runs the attachment interfaces and the BGP overlay the service needs. |
| `self-contained` | Everything the service declares, resolved recursively for the target device: its attachment and IRB units (with their parent and member interfaces when the chosen attachment uses them) and the device's `ewan-bgp-overlay` provider with that provider's required policies. |
| `as-deployed` | The self-contained set plus the validated baseline this JVD runs on that device (see *Device baselines*). The baseline is the validated device configuration, not an additional service requirement. |
| `with-overlay` | Compatibility alias for `self-contained`. Every service in this library declares the BGP overlay as required, so there is no separate level between the service's own interfaces and its overlay. |

A requirement names the referenced slot(s) and the snippets that may define them, narrowed to
snippets measured on the service's devices. Each referenced slot is satisfied by whichever listed
snippet defines it on the target device (its `Seen on`); include only the ones the rendered
service actually references. `conditional` entries apply only when the chosen attachment uses
that construct (an aggregated or flexible-services parent, or aggregate member links).
If a requirement cannot be resolved for the target device, fail closed: say so and generate
nothing for that service.

## Interconnect — VLAN-based with IRB

Service: `junos/routing-instances/evpn-interconnect/ri-evpn-interconnect-vlan-based-irb.conf`  
Validated on: dc-edge1, dc-edge2

### minimum

- `junos/routing-instances/evpn-interconnect/ri-evpn-interconnect-vlan-based-irb.conf`

### self-contained

- the minimum set, plus:
  - logical-interface (required): `irb.$IRB_UNIT` defined by `junos/interfaces/ifl-irb-virtual-gateway.conf`
  - variant `ewan-bgp-overlay families=evpn` — the provider measured on the target device:
    - dc-edge1: `junos/protocols/bgp-dc-edge1.conf`
      - policy-statement (required): each of `lo0`, `policy_ospf_bgp` defined by one of `junos/policy-options/policy-statement/ps-export-loopback.conf`, `junos/policy-options/policy-statement/ps-export-ospf-area0.conf`
    - dc-edge2: `junos/protocols/bgp-dc-edge2.conf`
      - policy-statement (required): each of `lo0`, `policy_ospf_bgp` defined by one of `junos/policy-options/policy-statement/ps-export-loopback.conf`, `junos/policy-options/policy-statement/ps-export-ospf-area0.conf`

### as-deployed

- the self-contained set, plus the device baseline for dc-edge1, dc-edge2.

## Interconnect — VLAN bundle

Service: `junos/routing-instances/evpn-interconnect/ri-evpn-interconnect-vlan-bundle.conf`  
Validated on: dc-edge1, dc-edge2

### minimum

- `junos/routing-instances/evpn-interconnect/ri-evpn-interconnect-vlan-bundle.conf`

### self-contained

- the minimum set, plus:
  - (no interface requirement is declared for this form)
  - variant `ewan-bgp-overlay families=evpn` — the provider measured on the target device:
    - dc-edge1: `junos/protocols/bgp-dc-edge1.conf`
      - policy-statement (required): each of `lo0`, `policy_ospf_bgp` defined by one of `junos/policy-options/policy-statement/ps-export-loopback.conf`, `junos/policy-options/policy-statement/ps-export-ospf-area0.conf`
    - dc-edge2: `junos/protocols/bgp-dc-edge2.conf`
      - policy-statement (required): each of `lo0`, `policy_ospf_bgp` defined by one of `junos/policy-options/policy-statement/ps-export-loopback.conf`, `junos/policy-options/policy-statement/ps-export-ospf-area0.conf`

### as-deployed

- the self-contained set, plus the device baseline for dc-edge1, dc-edge2.

## Leaf MAC-VRF — VLAN-based

Service: `junos/routing-instances/evpn-elan/ri-evpn-elan-mac-vrf-vlan-based.conf`  
Validated on: leaf1, leaf2

### minimum

- `junos/routing-instances/evpn-elan/ri-evpn-elan-mac-vrf-vlan-based.conf`

### self-contained

- the minimum set, plus:
  - logical-interface (required): `$AC_INTF` defined by one of `junos/interfaces/ifl-vlan-bridge-ethernet-switching.conf`, `junos/interfaces/ifl-vlan-bridge.conf`
    - when `ifl-vlan-bridge-ethernet-switching.conf` is used:
      - interface-parent (conditional): the parent physical interface (`@source:interface-parent`) defined by `junos/interfaces/ifd-ae-flexible-lacp-esi.conf`
        - when `ifd-ae-flexible-lacp-esi.conf` is used:
          - lag-member (conditional): the aggregate member links (`@source:lag-member`) defined by `junos/interfaces/ifd-lag-member-ether.conf`
      - lag-member (conditional): the aggregate member links (`@source:lag-member`) defined by `junos/interfaces/ifd-lag-member-ether.conf`
    - when `ifl-vlan-bridge.conf` is used:
      - interface-parent (conditional): the parent physical interface (`@source:interface-parent`) defined by one of `junos/interfaces/ifd-ae-flexible-lacp-esi.conf`, `junos/interfaces/ifd-ae-flexible-lacp-fast-esi-min-links.conf`
        - when `ifd-ae-flexible-lacp-esi.conf` is used:
          - lag-member (conditional): the aggregate member links (`@source:lag-member`) defined by `junos/interfaces/ifd-lag-member-ether.conf`
        - when `ifd-ae-flexible-lacp-fast-esi-min-links.conf` is used:
          - lag-member (conditional): the aggregate member links (`@source:lag-member`) defined by `junos/interfaces/ifd-lag-member-ether.conf`
      - lag-member (conditional): the aggregate member links (`@source:lag-member`) defined by `junos/interfaces/ifd-lag-member-ether.conf`
  - variant `ewan-bgp-overlay families=evpn` — the provider measured on the target device:
    - leaf1: `junos/protocols/bgp-leaf1.conf`
      - policy-statement (required): `lo0` defined by `junos/policy-options/policy-statement/ps-export-loopback.conf`
    - leaf2: `junos/protocols/bgp-leaf2.conf`
      - policy-statement (required): `lo0` defined by `junos/policy-options/policy-statement/ps-export-loopback.conf`

### as-deployed

- the self-contained set, plus the device baseline for leaf1, leaf2.

## Leaf MAC-VRF — VLAN bundle

Service: `junos/routing-instances/evpn-elan/ri-evpn-elan-mac-vrf-vlan-bundle.conf`  
Validated on: leaf1, leaf2

### minimum

- `junos/routing-instances/evpn-elan/ri-evpn-elan-mac-vrf-vlan-bundle.conf`

### self-contained

- the minimum set, plus:
  - logical-interface (required): `$AC_INTF` defined by `junos/interfaces/ifd-ae-ethernet-bridge-lacp-esi.conf`
    - when `ifd-ae-ethernet-bridge-lacp-esi.conf` is used:
      - lag-member (conditional): the aggregate member links (`@source:lag-member`) defined by `junos/interfaces/ifd-lag-member-ether.conf`
  - variant `ewan-bgp-overlay families=evpn` — the provider measured on the target device:
    - leaf1: `junos/protocols/bgp-leaf1.conf`
      - policy-statement (required): `lo0` defined by `junos/policy-options/policy-statement/ps-export-loopback.conf`
    - leaf2: `junos/protocols/bgp-leaf2.conf`
      - policy-statement (required): `lo0` defined by `junos/policy-options/policy-statement/ps-export-loopback.conf`

### as-deployed

- the self-contained set, plus the device baseline for leaf1, leaf2.

## WAN edge EVPN-MPLS — VLAN-based with IRB (routing-interface)

Service: `junos/routing-instances/evpn-elan/ri-evpn-elan-vlan-based-irb.conf`  
Validated on: wan-edge1

### minimum

- `junos/routing-instances/evpn-elan/ri-evpn-elan-vlan-based-irb.conf`

### self-contained

- the minimum set, plus:
  - logical-interface (required): each of `irb.$IRB_UNIT`, `$AC_INTF` defined by one of `junos/interfaces/ifl-irb-virtual-gateway.conf`, `junos/interfaces/ifl-vlan-bridge.conf`
    - when `ifl-vlan-bridge.conf` is used:
      - interface-parent (conditional): the parent physical interface (`@source:interface-parent`) defined by `junos/interfaces/ifd-flexible-ethernet-services.conf`
  - variant `ewan-bgp-overlay families=evpn` — the provider measured on the target device:
    - wan-edge1: `junos/protocols/bgp-wan-edge1.conf`

### as-deployed

- the self-contained set, plus the device baseline for wan-edge1.

## WAN edge EVPN-MPLS — VLAN-based with IRB (l3-interface)

Service: `junos/routing-instances/evpn-elan/ri-evpn-elan-vlan-based-l3-interface.conf`  
Validated on: wan-edge2

### minimum

- `junos/routing-instances/evpn-elan/ri-evpn-elan-vlan-based-l3-interface.conf`

### self-contained

- the minimum set, plus:
  - logical-interface (required): each of `irb.$IRB_UNIT`, `$AC_INTF` defined by one of `junos/interfaces/ifl-irb-virtual-gateway.conf`, `junos/interfaces/ifl-vlan-bridge.conf`
    - when `ifl-vlan-bridge.conf` is used:
      - interface-parent (conditional): the parent physical interface (`@source:interface-parent`) defined by `junos/interfaces/ifd-flexible-ethernet-services-description.conf`
  - variant `ewan-bgp-overlay families=evpn` — the provider measured on the target device:
    - wan-edge2: `junos/protocols/bgp-wan-edge2.conf`

### as-deployed

- the self-contained set, plus the device baseline for wan-edge2.

## WAN edge EVPN-MPLS — VLAN bundle

Service: `junos/routing-instances/evpn-elan/ri-evpn-elan-vlan-bundle.conf`  
Validated on: wan-edge1, wan-edge2

### minimum

- `junos/routing-instances/evpn-elan/ri-evpn-elan-vlan-bundle.conf`

### self-contained

- the minimum set, plus:
  - logical-interface (required): `$AC_INTF` defined by one of `junos/interfaces/ifl-vlan-bridge-vlan-list-family-bridge.conf`, `junos/interfaces/ifl-vlan-bridge-vlan-list.conf`
    - when `ifl-vlan-bridge-vlan-list-family-bridge.conf` is used:
      - interface-parent (conditional): the parent physical interface (`@source:interface-parent`) defined by `junos/interfaces/ifd-flexible-ethernet-services.conf`
    - when `ifl-vlan-bridge-vlan-list.conf` is used:
      - interface-parent (conditional): the parent physical interface (`@source:interface-parent`) defined by `junos/interfaces/ifd-flexible-ethernet-services-description.conf`
  - variant `ewan-bgp-overlay families=evpn` — the provider measured on the target device:
    - wan-edge1: `junos/protocols/bgp-wan-edge1.conf`
    - wan-edge2: `junos/protocols/bgp-wan-edge2.conf`

### as-deployed

- the self-contained set, plus the device baseline for wan-edge1, wan-edge2.

## WAN edge EVPN-MPLS — VLAN bundle, no-gateway-community

Service: `junos/routing-instances/evpn-elan/ri-evpn-elan-vlan-bundle-no-gateway-community.conf`  
Validated on: wan-edge2

### minimum

- `junos/routing-instances/evpn-elan/ri-evpn-elan-vlan-bundle-no-gateway-community.conf`

### self-contained

- the minimum set, plus:
  - logical-interface (required): `$AC_INTF` defined by `junos/interfaces/ifl-vlan-bridge-vlan-list.conf`
    - when `ifl-vlan-bridge-vlan-list.conf` is used:
      - interface-parent (conditional): the parent physical interface (`@source:interface-parent`) defined by `junos/interfaces/ifd-flexible-ethernet-services-description.conf`
  - variant `ewan-bgp-overlay families=evpn` — the provider measured on the target device:
    - wan-edge2: `junos/protocols/bgp-wan-edge2.conf`

### as-deployed

- the self-contained set, plus the device baseline for wan-edge2.

## Device baselines

Snippets measured on each device, other than its service instances. Use for `as-deployed`
and for greenfield / turn-up requests. A snippet already in the self-contained set is emitted once.

### dc-edge1_mx480

- `junos/groups/apply-global-three.conf`
- `junos/groups/gr-global-dc-edge1.conf`
- `junos/groups/gr-re0-empty.conf`
- `junos/groups/gr-re1-empty-block.conf`
- `junos/interfaces/ifd-description.conf`
- `junos/interfaces/ifd-flexible-ethernet-services.conf`
- `junos/interfaces/ifl-core-inet-mpls.conf`
- `junos/interfaces/ifl-core-inet.conf`
- `junos/interfaces/ifl-irb-virtual-gateway-preferred.conf`
- `junos/interfaces/ifl-irb-virtual-gateway.conf`
- `junos/interfaces/ifl-vlan-inet.conf`
- `junos/policy-options/policy-statement/per-packet-load-balance.conf`
- `junos/policy-options/policy-statement/ps-export-loopback.conf`
- `junos/policy-options/policy-statement/ps-export-ospf-area0.conf`
- `junos/protocols/bgp-dc-edge1.conf`
- `junos/protocols/ldp-interface-all-loopback.conf`
- `junos/protocols/lldp-interface-all-management.conf`
- `junos/protocols/mpls-interface-all.conf`
- `junos/protocols/ospf-area0-dc-edge1.conf`
- `junos/protocols/ospf-backup-spf-options.conf`
- `junos/routing-options/autonomous-system.conf`
- `junos/routing-options/forwarding-table-pplb-ecmp-fast-reroute.conf`
- `junos/routing-options/resolution-preserve-nexthop-hierarchy.conf`

### dc-edge2_mx10003

- `junos/chassis/fpc-mx10003-6x100g.conf`
- `junos/chassis/fpc-mx10003-8x100g-1x4x10g.conf`
- `junos/groups/apply-global-three.conf`
- `junos/groups/gr-global-dc-edge2.conf`
- `junos/groups/gr-re0-empty.conf`
- `junos/groups/gr-re1-empty-block.conf`
- `junos/interfaces/ifd-description.conf`
- `junos/interfaces/ifd-flexible-ethernet-services.conf`
- `junos/interfaces/ifl-core-inet-mpls.conf`
- `junos/interfaces/ifl-core-inet.conf`
- `junos/interfaces/ifl-irb-virtual-gateway-preferred.conf`
- `junos/interfaces/ifl-irb-virtual-gateway-second-address.conf`
- `junos/interfaces/ifl-irb-virtual-gateway.conf`
- `junos/interfaces/ifl-loopback-inet.conf`
- `junos/interfaces/ifl-vlan-inet.conf`
- `junos/policy-options/policy-statement/per-packet-load-balance.conf`
- `junos/policy-options/policy-statement/ps-export-loopback.conf`
- `junos/policy-options/policy-statement/ps-export-ospf-area0.conf`
- `junos/protocols/bgp-dc-edge2.conf`
- `junos/protocols/ldp-interface-3-core-all-loopback.conf`
- `junos/protocols/mpls-interface-3-core.conf`
- `junos/protocols/ospf-area0-dc-edge2.conf`
- `junos/protocols/ospf-backup-spf-options.conf`
- `junos/routing-options/autonomous-system.conf`
- `junos/routing-options/forwarding-table-pplb-ecmp-fast-reroute.conf`

### wan-edge1_mx204

- `junos/chassis/aggregated-devices-ethernet.conf`
- `junos/chassis/fpc-mx204-3x100g-8x10g-sub-ports.conf`
- `junos/chassis/network-services-enhanced-ip.conf`
- `junos/groups/apply-global-three.conf`
- `junos/groups/gr-global-wan-edge1.conf`
- `junos/groups/gr-re0-empty.conf`
- `junos/groups/gr-re1-empty.conf`
- `junos/interfaces/ifd-flexible-ethernet-services.conf`
- `junos/interfaces/ifl-bridge-trunk-vlan-list.conf`
- `junos/interfaces/ifl-core-inet-mpls.conf`
- `junos/interfaces/ifl-irb-virtual-gateway-no-accept-data.conf`
- `junos/interfaces/ifl-irb-virtual-gateway-preferred.conf`
- `junos/interfaces/ifl-irb-virtual-gateway.conf`
- `junos/interfaces/ifl-vlan-bridge-vlan-list-family-bridge.conf`
- `junos/interfaces/ifl-vlan-bridge.conf`
- `junos/policy-options/policy-statement/per-packet-load-balance.conf`
- `junos/protocols/bgp-wan-edge1.conf`
- `junos/protocols/ldp-interface-2-core-all-loopback.conf`
- `junos/protocols/mpls-interface-2-core.conf`
- `junos/protocols/ospf-area0-wan-edge1.conf`
- `junos/protocols/ospf-backup-spf-options.conf`
- `junos/routing-options/autonomous-system.conf`
- `junos/routing-options/forwarding-table-pplb-chained-nh-evpn.conf`
- `junos/routing-options/router-id.conf`

### wan-edge2_acx5448-m

- `junos/chassis/aggregated-devices-ethernet.conf`
- `junos/chassis/network-services-enhanced-ip.conf`
- `junos/groups/apply-global-three.conf`
- `junos/groups/gr-global-wan-edge2.conf`
- `junos/groups/gr-re0-loopback.conf`
- `junos/groups/gr-re1-empty.conf`
- `junos/interfaces/ifd-flexible-ethernet-services-description.conf`
- `junos/interfaces/ifl-core-inet-mpls.conf`
- `junos/interfaces/ifl-irb-virtual-gateway.conf`
- `junos/interfaces/ifl-vlan-bridge-vlan-list.conf`
- `junos/interfaces/ifl-vlan-bridge.conf`
- `junos/policy-options/policy-statement/per-packet-load-balance.conf`
- `junos/protocols/bgp-wan-edge2.conf`
- `junos/protocols/ldp-interface-2-core-all-loopback.conf`
- `junos/protocols/mpls-interface-2-core.conf`
- `junos/protocols/ospf-area0-wan-edge2.conf`
- `junos/protocols/ospf-backup-spf-options.conf`
- `junos/routing-options/autonomous-system.conf`
- `junos/routing-options/forwarding-table-pplb-chained-nh-evpn.conf`
- `junos/routing-options/router-id.conf`
- `junos/system/evpn-mh-firewall-profile.conf`

### p1_acx7100-48l

- `evo/groups/apply-global-one.conf`
- `evo/groups/gr-global-p1.conf`
- `evo/interfaces/ifd-speed-100g-enable.conf`
- `evo/interfaces/ifd-speed-100g.conf`
- `evo/interfaces/ifl-core-inet-mpls.conf`
- `evo/policy-options/policy-statement/per-packet-load-balance.conf`
- `evo/protocols/ldp-interface-4-core-loopback.conf`
- `evo/protocols/mpls-interface-4-core-all.conf`
- `evo/protocols/ospf-area0-p1.conf`
- `evo/protocols/ospf-backup-spf-options.conf`
- `evo/routing-options/forwarding-table-pplb.conf`
- `evo/routing-options/router-id.conf`

### p2_ptx10001-36mr

- `evo/forwarding-options/l2circuit-control-passthrough.conf`
- `evo/groups/apply-global-two.conf`
- `evo/groups/gr-global-p2.conf`
- `evo/groups/gr-intspeeds-4x100g.conf`
- `evo/interfaces/ifl-core-inet-mpls.conf`
- `evo/policy-options/policy-statement/per-packet-load-balance.conf`
- `evo/protocols/ldp-interface-all-loopback.conf`
- `evo/protocols/ldp-interface-management-disable.conf`
- `evo/protocols/lldp-interface-all.conf`
- `evo/protocols/mpls-interface-all.conf`
- `evo/protocols/mpls-interface-management-disable.conf`
- `evo/protocols/ospf-area0-p2.conf`
- `evo/routing-options/forwarding-table-pplb.conf`
- `evo/routing-options/router-id.conf`

### spine1_qfx5200

- `junos/chassis/fpc-pic-port-channel-speed-10g.conf`
- `junos/groups/apply-global-two.conf`
- `junos/groups/gr-global-spine1.conf`
- `junos/groups/gr-member0-empty.conf`
- `junos/interfaces/ifl-core-inet.conf`
- `junos/interfaces/ifl-loopback-inet.conf`
- `junos/policy-options/policy-statement/per-packet-load-balance.conf`
- `junos/policy-options/policy-statement/ps-export-loopback.conf`
- `junos/protocols/bgp-spine1.conf`
- `junos/routing-options/autonomous-system.conf`
- `junos/routing-options/forwarding-table-pplb-ecmp-fast-reroute.conf`

### spine2_qfx5200

- `junos/chassis/fpc-pic-port-channel-speed-10g.conf`
- `junos/groups/apply-global-three.conf`
- `junos/groups/gr-global-spine2.conf`
- `junos/groups/gr-member0-loopback.conf`
- `junos/groups/gr-re1-empty.conf`
- `junos/interfaces/ifl-core-inet.conf`
- `junos/interfaces/ifl-loopback-inet.conf`
- `junos/policy-options/policy-statement/per-packet-load-balance.conf`
- `junos/policy-options/policy-statement/ps-export-loopback.conf`
- `junos/protocols/bgp-spine2.conf`
- `junos/routing-options/forwarding-table-pplb-ecmp-fast-reroute.conf`
- `junos/routing-options/router-id.conf`

### leaf1_qfx5120-48t

- `junos/chassis/aggregated-devices-ethernet.conf`
- `junos/chassis/fpc-pic-port-channel-speed-10g.conf`
- `junos/forwarding-options/evpn-vxlan-shared-tunnels.conf`
- `junos/forwarding-options/vxlan-routing.conf`
- `junos/groups/apply-global-three.conf`
- `junos/groups/gr-global-leaf1.conf`
- `junos/groups/gr-member0-loopback.conf`
- `junos/groups/gr-re1-empty.conf`
- `junos/interfaces/ifd-ae-ethernet-bridge-lacp-esi.conf`
- `junos/interfaces/ifd-ae-flexible-lacp-esi-df-preference.conf`
- `junos/interfaces/ifd-ae-flexible-lacp-esi.conf`
- `junos/interfaces/ifd-ae-flexible-lacp-fast-esi-min-links.conf`
- `junos/interfaces/ifd-lag-member-ether.conf`
- `junos/interfaces/ifl-core-inet.conf`
- `junos/interfaces/ifl-irb-virtual-gateway-no-accept-data.conf`
- `junos/interfaces/ifl-irb-virtual-gateway-preferred.conf`
- `junos/interfaces/ifl-vlan-bridge-ethernet-switching.conf`
- `junos/interfaces/ifl-vlan-bridge.conf`
- `junos/policy-options/policy-statement/per-packet-load-balance.conf`
- `junos/policy-options/policy-statement/ps-export-loopback.conf`
- `junos/protocols/bgp-leaf1.conf`
- `junos/routing-options/autonomous-system.conf`
- `junos/routing-options/forwarding-table-pplb-ecmp-fast-reroute-chained-nh-evpn.conf`
- `junos/vlans/vlan-id-list.conf`

### leaf2_qfx5120-48t

- `junos/chassis/aggregated-devices-ethernet.conf`
- `junos/chassis/fpc-pic-port-channel-speed-10g.conf`
- `junos/forwarding-options/evpn-vxlan-shared-tunnels.conf`
- `junos/forwarding-options/vxlan-routing.conf`
- `junos/groups/apply-global-three.conf`
- `junos/groups/gr-global-leaf2.conf`
- `junos/groups/gr-member0-loopback.conf`
- `junos/groups/gr-re1-empty.conf`
- `junos/interfaces/ifd-ae-ethernet-bridge-lacp-esi.conf`
- `junos/interfaces/ifd-ae-flexible-lacp-esi-df-preference.conf`
- `junos/interfaces/ifd-ae-flexible-lacp-esi.conf`
- `junos/interfaces/ifd-ae-flexible-lacp-fast-esi-min-links.conf`
- `junos/interfaces/ifd-lag-member-ether.conf`
- `junos/interfaces/ifl-core-inet.conf`
- `junos/interfaces/ifl-irb-virtual-gateway-preferred.conf`
- `junos/interfaces/ifl-vlan-bridge-ethernet-switching.conf`
- `junos/interfaces/ifl-vlan-bridge.conf`
- `junos/policy-options/policy-statement/per-packet-load-balance.conf`
- `junos/policy-options/policy-statement/ps-export-loopback.conf`
- `junos/protocols/bgp-leaf2.conf`
- `junos/routing-options/autonomous-system.conf`
- `junos/routing-options/forwarding-table-pplb-ecmp-fast-reroute-chained-nh-evpn.conf`
- `junos/vlans/vlan-id-list.conf`

### tor1_ex4200-48t

- `junos/chassis/aggregated-devices-ethernet.conf`
- `junos/groups/apply-global-three.conf`
- `junos/groups/gr-global-tor1.conf`
- `junos/groups/gr-member0-empty.conf`
- `junos/groups/gr-re1-empty.conf`
- `junos/interfaces/ifd-ae-lacp-trunk-vlan.conf`
- `junos/interfaces/ifd-lag-member-ether.conf`
- `junos/vlans/vlan-range.conf`

### tor2_ex4200-48t

- `junos/chassis/aggregated-devices-ethernet.conf`
- `junos/groups/apply-global-three.conf`
- `junos/groups/gr-global-tor2.conf`
- `junos/groups/gr-member0-loopback.conf`
- `junos/groups/gr-re1-empty.conf`
- `junos/interfaces/ifd-ae-lacp-fast-trunk-vlan.conf`
- `junos/interfaces/ifd-ae-lacp-trunk-vlan.conf`
- `junos/interfaces/ifd-lag-member-ether.conf`
- `junos/vlans/vlan-range.conf`

## Add a feature

Feature asks render one snippet plus its `Pair with` targets, only on a device in its `Seen on`.

| Ask | Snippet | Topic | Seen on | Pair with |
|---|---|---|---|---|
| Per-packet load balancing | `junos/routing-options/forwarding-table-pplb-ecmp-fast-reroute.conf` | Forwarding-table per-packet load balancing with ECMP fast reroute | dc-edge1, dc-edge2, spine1, spine2 | `junos/policy-options/policy-statement/per-packet-load-balance.conf` |
| Per-packet load balancing | `junos/routing-options/forwarding-table-pplb-chained-nh-evpn.conf` | Forwarding-table per-packet load balancing with chained composite next hops for EVPN | wan-edge1, wan-edge2 | `junos/policy-options/policy-statement/per-packet-load-balance.conf` |
| Per-packet load balancing | `junos/routing-options/forwarding-table-pplb-ecmp-fast-reroute-chained-nh-evpn.conf` | Forwarding-table per-packet load balancing, ECMP fast reroute and chained composite next hops for EVPN | leaf1, leaf2 | `junos/policy-options/policy-statement/per-packet-load-balance.conf` |
| Per-packet load balancing | `evo/routing-options/forwarding-table-pplb.conf` | Forwarding-table per-packet load balancing (EVO) | p1, p2 | `evo/policy-options/policy-statement/per-packet-load-balance.conf` |
| Per-packet load balancing | `junos/policy-options/policy-statement/per-packet-load-balance.conf` | Per-packet (per-flow) load-balancing policy | dc-edge1, dc-edge2, leaf1, leaf2, spine1, spine2, wan-edge1, wan-edge2 | none |
| OSPF loop-free alternates | `junos/protocols/ospf-backup-spf-options.conf` | OSPF loop-free-alternate backup computation options | dc-edge1, dc-edge2, wan-edge1, wan-edge2 | none |
| OSPF loop-free alternates | `evo/protocols/ospf-backup-spf-options.conf` | OSPF loop-free-alternate backup computation options | p1 | none |
| EVPN-VXLAN shared tunnels | `junos/forwarding-options/evpn-vxlan-shared-tunnels.conf` | EVPN-VXLAN shared tunnels | leaf1, leaf2 | none |
| EVPN multihoming firewall profile | `junos/system/evpn-mh-firewall-profile.conf` | EVPN multihoming firewall profile | wan-edge2 | none |

## Not in the library

The library README *Scope* lists constructs present in the source but not yet templated: VLAN-aware
(virtual-switch) interconnect and WAN-edge instances with 20 bridge domains, leaf VLAN-aware MAC-VRFs
with 20 VLANs, tenant and MPLS L3VPN VRFs with 20–87 IRB members, the ERB (edge-routed bridging)
instances, and leaf / top-of-rack trunk units with long VLAN member lists. Refuse generation for them.
