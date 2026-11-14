# Configuration Snippets (snips)

This `snips/` directory contains **focused, templated configuration excerpts**
extracted from the validated device configurations in [`../conf/`](../conf/).
Each file isolates one construct — an attachment unit, a class-of-service
binding, a classifier or rewrite map, an IS-IS, BGP, MPLS or CFM form, an
EVPN, VPLS or L3VPN routing instance, an L2 circuit, a filter or a policy — so
it can be read, compared and adapted without reading an eighty-thousand-line
router configuration. Every body is measured against the source: the
`Count:` header is the number of exact source instances the template
reproduces on each device.

## Topology

Cell site routers (`an1`, `an3`, `an4`) attach the radio sites; two hub
site routers (`ag1_1`, `ag1_2`) aggregate them, connect the O-DU side
through a dual-homed switch (`du`) and reflect routes for the access
segment; helper aggregation routers (`ag2_*`, `ag3_*`) carry midhaul and
backhaul toward two core routers (`cr1`, `cr2`); the services aggregation
gateway (`sag`) is the service edge in the second autonomous system,
reached through inter-AS Option B and C. Device tokens in snippet headers are
the file names in `../conf/` (for example `an4_acx7024`, `sag_mx304`).

## Layout

```
snips/
  junos/        ← Junos OS forms (MX204, MX480, MX304, QFX5210)
  evo/          ← Junos Evolved forms (ACX7024, ACX7100-48L, ACX7100-32C, ACX7509, PTX10001-36MR)
```

215 snippet files: 84 Junos, 131 EVO; 55 constructs have
byte-identical Junos and EVO forms registered as OS-scoped mirrors in
[`_snip-library.json`](_snip-library.json).

| Sub-folder | What's in it |
|---|---|
| `interfaces/` | Physical ports and aggregates, LAG members, VLAN units (bridge, CCC, routed), ESI units, IRB units with virtual gateways or static ARP/NDP entries, loopback and core units. |
| `class-of-service/` | The eight forwarding classes, schedulers, the scheduler map, the DSCP, DSCP IPv6, MPLS EXP and IEEE 802.1p classifiers and rewrite rules, and their bindings on interfaces and units. |
| `firewall/` | Multifield filters: IPv4 and IPv6 code points to forwarding classes, and the family ccc filters toward or on each access node. |
| `protocols/` | IS-IS segment routing and its interfaces, BGP global settings and groups (labeled unicast, VPN, EVPN, route target), MPLS, Ethernet CFM, L2 circuits, L2 learning. |
| `routing-instances/` | EVPN-VPWS (with or without static flow labels), EVPN flexible cross-connect, EVPN MAC-VRF (with or without IRB), BGP-VPLS and L3VPN VRFs. |
| `vlans/`, `bridge-domains/` | VLANs on the hub site routers and the O-DU switch; the SAG bridge domain with IRB. |
| `policy-options/` | Next-hop-self, inter-AS export and import, loopback, load-balance and summary policies, communities and a prefix list. |
| `routing-options/` | Router ID, AS, RIB groups, auto-bandwidth, forwarding-table load-balance export. |
| `forwarding-options/`, `chassis/` | Hash keys, load-balance label capability, aggregated-device count, port speeds and channelization. |

## Snippet headers

Every snippet starts with a C-style header whose fields follow the repository
snippet contract:

- **`Seen on:`** — every validated device whose configuration reproduces this
  exact template, split by OS. Shared applicability is not a peer relationship.
- **`Count:`** — distinct source instances of the template per device and in
  total, generated from [`_bindings.json`](_bindings.json); never hand-edited.
- **`Pair with:`** — directed, required same-device dependencies measured from
  the source: named objects a snippet references by a fixed name (a classifier,
  a policy, a community, a RIB group). Dependencies that go through a template
  value are listed as Needs in the BYOAI bundle.
- **`Peers with:`** — `n/a` for local constructs, or the verified peer
  groups (for example the two hub site routers sharing an Ethernet segment).
  Constructs whose peer cannot be verified from the configurations carry no
  claim: see Scope.

## Templated values — `$VAR` placeholders

Deployment-specific values (loopbacks, addresses, AS numbers, RD/RT subfields,
instance, group and VLAN names, interfaces and units, VLAN IDs, ESIs, service
and circuit identifiers) appear as `$VAR` placeholders. Design constants and
names other configuration references by name are left literal. Each header
lists the placeholders it uses with example values from a validated device;
the full glossary is [`_variables.md`](_variables.md).

## Source examples

[`_bindings.md`](_bindings.md) summarises, and [`_bindings.json`](_bindings.json)
records in full, the exact source instances and variable bindings each template
reproduces. Example values in headers are illustrative; the bindings are the
evidence.

## Scope

Snippets reproduce the active configuration of the thirteen design devices.
The published configurations contain no `traceoptions` and no deactivated
configuration, so nothing is excluded.

### Known limitations of the published configurations

- **Lab endpoints.** The L3VPN VRFs' eBGP peers (groups `v4ixia` and
  `v6ixia`) and the attachment circuits face a test traffic generator, and
  `du_qfx5210` stands in for the O-DU side; none is a validated CE or O-DU.
- **MAC-based filters.** The family ccc multifield filters match the source and
  destination MAC addresses of the lab endpoints; replace the MAC lists for a
  deployment.
- **sag ISO address.** `sag_mx304`'s loopback carries the same ISO address as
  `cr2_ptx10001-36mr` (`49.1022.1001.0000.0015.00`); sag runs no IS-IS.
  Reproduced as configured.
- **Scale.** The hub site routers and the SAG carry thousands of service
  instances (the SAG alone has 2,000 L2 circuits and 1,200 CFM maintenance
  associations); every snippet renders one instance.
- **Building blocks.** Snippets are building blocks, not complete device
  configurations. The device configurations under [`../conf/`](../conf/) are the
  as-captured reference.

## Topic index

Totals are source instances across all devices; OS mirrors are listed once per
OS.

| Topic | What it shows |
|---|---|
| `junos/bridge-domains/bridge-domain-irb.conf` | Bridge domain with one VLAN, one attachment circuit and an IRB routed interface (250) |
| `evo/chassis/aggregated-devices-ethernet.conf` | Aggregated Ethernet device-count for the chassis (7) |
| `junos/chassis/aggregated-devices-ethernet.conf` | Aggregated Ethernet device-count for the chassis (6) |
| `junos/chassis/fpc-mx204-port-speeds-100g-10g.conf` | MX204 port speeds: 100GbE on PIC 0 and 10GbE on PIC 1 (2) |
| `junos/chassis/fpc-mx480-pic-0-1-ports-100g.conf` | MX480 FPC with two 100GbE ports on each of PIC 0 and PIC 1 (2) |
| `junos/chassis/fpc-mx480-pic-0-ports-100g.conf` | MX480 FPC with two 100GbE ports on PIC 0 (2) |
| `junos/chassis/fpc-qfx5210-channel-speed-10g.conf` | QFX5210 ports channelized to 10GbE (1) |
| `junos/chassis/fpc-tunnel-services-pic-ports-4x10g.conf` | FPC with tunnel services on one PIC and two ports split into four 10GbE sub-ports on another (1) |
| `evo/chassis/network-services-enhanced-ip.conf` | Enhanced IP chassis network-services mode (6) |
| `junos/chassis/network-services-enhanced-ip.conf` | Enhanced IP chassis network-services mode (5) |
| `evo/class-of-service/classifiers/cl-dscp-dscp-ipv6-exp-ieee8021p.conf` | DSCP, DSCP IPv6, MPLS EXP and IEEE 802.1p behavior aggregate classifiers for the eight forwarding classes (7) |
| `junos/class-of-service/classifiers/cl-dscp-dscp-ipv6-exp-ieee8021p.conf` | DSCP, DSCP IPv6, MPLS EXP and IEEE 802.1p behavior aggregate classifiers for the eight forwarding classes (5) |
| `evo/class-of-service/forwarding-classes/fc-8class-model.conf` | Eight forwarding classes mapped to queues 0 to 7, aligned with the O-RAN multiple priority queues (7) |
| `junos/class-of-service/forwarding-classes/fc-8class-model.conf` | Eight forwarding classes mapped to queues 0 to 7, aligned with the O-RAN multiple priority queues (5) |
| `evo/class-of-service/interfaces/ifd-scheduler-map.conf` | Scheduler map on an interface (35) |
| `junos/class-of-service/interfaces/ifd-scheduler-map.conf` | Scheduler map on an interface (17) |
| `evo/class-of-service/interfaces/ifl-dscp-classifier-rewrite.conf` | DSCP classifier and rewrite rule on a logical unit (3) |
| `evo/class-of-service/interfaces/ifl-dscp-dscp-ipv6-classifier-rewrite.conf` | DSCP and DSCP IPv6 classifiers and rewrite rules on a logical unit (832) |
| `junos/class-of-service/interfaces/ifl-dscp-dscp-ipv6-classifier-rewrite.conf` | DSCP and DSCP IPv6 classifiers and rewrite rules on a logical unit (266) |
| `evo/class-of-service/interfaces/ifl-forwarding-class-high-ieee8021p-rewrite.conf` | Fixed classification to FC-HIGH with an IEEE 802.1p rewrite rule on a logical unit (250) |
| `junos/class-of-service/interfaces/ifl-forwarding-class-high-ieee8021p-rewrite.conf` | Fixed classification to FC-HIGH with an IEEE 802.1p rewrite rule on a logical unit (250) |
| `evo/class-of-service/interfaces/ifl-forwarding-class-llq-ieee8021p-rewrite.conf` | Fixed classification to FC-LLQ with an IEEE 802.1p rewrite rule on a logical unit (600) |
| `evo/class-of-service/interfaces/ifl-forwarding-class-low-ieee8021p-rewrite.conf` | Fixed classification to FC-LOW with an IEEE 802.1p rewrite rule on a logical unit (125) |
| `junos/class-of-service/interfaces/ifl-forwarding-class-low-ieee8021p-rewrite.conf` | Fixed classification to FC-LOW with an IEEE 802.1p rewrite rule on a logical unit (125) |
| `evo/class-of-service/interfaces/ifl-forwarding-class-medium-ieee8021p-rewrite.conf` | Fixed classification to FC-MEDIUM with an IEEE 802.1p rewrite rule on a logical unit (125) |
| `junos/class-of-service/interfaces/ifl-forwarding-class-medium-ieee8021p-rewrite.conf` | Fixed classification to FC-MEDIUM with an IEEE 802.1p rewrite rule on a logical unit (125) |
| `evo/class-of-service/interfaces/ifl-ieee8021p-classifier-rewrite.conf` | IEEE 802.1p classifier and rewrite rule on a logical unit (1,750) |
| `junos/class-of-service/interfaces/ifl-ieee8021p-classifier-rewrite.conf` | IEEE 802.1p classifier and rewrite rule on a logical unit (1,200) |
| `evo/class-of-service/interfaces/ifl-unit-0-exp-classifier-rewrite.conf` | MPLS EXP classifier and rewrite rule on unit 0 of a core interface (25) |
| `junos/class-of-service/interfaces/ifl-unit-0-exp-classifier-rewrite.conf` | MPLS EXP classifier and rewrite rule on unit 0 of a core interface (17) |
| `evo/class-of-service/interfaces/irb-forwarding-class-realtime-dscp-dscp-ipv6-rewrite.conf` | Fixed classification to FC-REALTIME with DSCP and DSCP IPv6 rewrite rules on a logical unit (332) |
| `junos/class-of-service/interfaces/irb-forwarding-class-realtime-dscp-dscp-ipv6-rewrite.conf` | Fixed classification to FC-REALTIME with DSCP and DSCP IPv6 rewrite rules on a logical unit (166) |
| `evo/class-of-service/rewrite-rules/rr-dscp-dscp-ipv6-exp-ieee8021p.conf` | DSCP, DSCP IPv6, MPLS EXP and IEEE 802.1p rewrite rules for the eight forwarding classes (7) |
| `junos/class-of-service/rewrite-rules/rr-dscp-dscp-ipv6-exp-ieee8021p.conf` | DSCP, DSCP IPv6, MPLS EXP and IEEE 802.1p rewrite rules for the eight forwarding classes (5) |
| `evo/class-of-service/scheduler-maps/sm-5g-scheduler.conf` | Scheduler map SM-5G-SCHEDULER binding the eight forwarding classes to their schedulers (7) |
| `junos/class-of-service/scheduler-maps/sm-5g-scheduler.conf` | Scheduler map SM-5G-SCHEDULER binding the eight forwarding classes to their schedulers (5) |
| `evo/class-of-service/schedulers/schedulers-8class-llq-low-latency.conf` | Schedulers for the eight forwarding classes: SC-LLQ shaped at priority low-latency, SC-SIGNALING strict-high, SC-REALTIME medium-high (5) |
| `evo/class-of-service/schedulers/schedulers-8class-llq-strict-high.conf` | Schedulers for the eight forwarding classes: SC-LLQ shaped at priority strict-high, SC-SIGNALING high, SC-REALTIME medium-high (2) |
| `junos/class-of-service/schedulers/schedulers-8class-llq-strict-high.conf` | Schedulers for the eight forwarding classes: SC-LLQ shaped at priority strict-high, SC-SIGNALING high, SC-REALTIME medium-high (5) |
| `evo/firewall/filter-ccc-mf-evpn-vpws-mh-an1.conf` | Multifield family ccc filter on AN1: 802.1p and source and destination MAC terms to forwarding classes (1) |
| `evo/firewall/filter-ccc-mf-evpn-vpws-mh-an3.conf` | Multifield family ccc filter on AN3: 802.1p and source and destination MAC terms to forwarding classes (1) |
| `evo/firewall/filter-ccc-mf-evpn-vpws-mh-an4.conf` | Multifield family ccc filter on AN4: 802.1p and source and destination MAC terms to forwarding classes (1) |
| `evo/firewall/filter-ccc-mf-evpn-vpws-mh-to-an1.conf` | Multifield family ccc filter toward AN1: 802.1p and source and destination MAC terms to forwarding classes (2) |
| `evo/firewall/filter-ccc-mf-evpn-vpws-mh-to-an3.conf` | Multifield family ccc filter toward AN3: 802.1p and source and destination MAC terms to forwarding classes (2) |
| `evo/firewall/filter-ccc-mf-evpn-vpws-mh-to-an4.conf` | Multifield family ccc filter toward AN4: 802.1p and source and destination MAC terms to forwarding classes (2) |
| `evo/firewall/filter-inet-mfc-dscp-forwarding-class.conf` | Interface-specific IPv4 multifield filter mapping DSCP code points to forwarding classes (4) |
| `junos/firewall/filter-inet-mfc-dscp-forwarding-class.conf` | Interface-specific IPv4 multifield filter mapping DSCP code points to forwarding classes (2) |
| `evo/firewall/filter-inet6-mfc-traffic-class-forwarding-class.conf` | Interface-specific IPv6 multifield filter mapping traffic-class code points to forwarding classes (4) |
| `junos/firewall/filter-inet6-mfc-traffic-class-forwarding-class.conf` | Interface-specific IPv6 multifield filter mapping traffic-class code points to forwarding classes (2) |
| `evo/forwarding-options/hash-key-inet-inet6-layer-3-4-mpls-all-labels-payload-ip.conf` | Hash key on Layer 3 and Layer 4 fields for IPv4 and IPv6, and on all MPLS labels plus the IP payload (4) |
| `evo/forwarding-options/hash-key-inet-inet6-layer-3-4-mpls-labels-1-3-payload.conf` | Hash key on Layer 3 and Layer 4 fields for IPv4 and IPv6, and on the first three MPLS labels plus the pseudowire and IP payload (1) |
| `junos/forwarding-options/hash-key-inet-inet6-layer-3-4-mpls-labels-1-3-payload.conf` | Hash key on Layer 3 and Layer 4 fields for IPv4 and IPv6, and on the first three MPLS labels plus the pseudowire and IP payload (2) |
| `evo/forwarding-options/hash-key-mpls-all-labels.conf` | Load-balance hash key across IPv4, IPv6, MPLS all-labels and Layer 2 (1) |
| `junos/forwarding-options/load-balance-label-capability.conf` | Label load-balancing capability (1) |
| `evo/interfaces/ifd-ae-description-flexible-lacp-fast-system-id.conf` | Aggregated Ethernet with flexible services, fast LACP and system ID (2) |
| `evo/interfaces/ifd-ae-description-mtu-lacp-fast.conf` | Aggregated Ethernet interface with a description, MTU and LACP active with fast periodic (24) |
| `junos/interfaces/ifd-ae-description-mtu-lacp-fast.conf` | Aggregated Ethernet interface with a description, MTU and LACP active with fast periodic (14) |
| `junos/interfaces/ifd-ae-flexible-lacp-fast.conf` | Flexible-services aggregated Ethernet bundle with active fast LACP (1) |
| `evo/interfaces/ifd-breakout-4x10g.conf` | Four-subport 10G physical interface breakout (1) |
| `evo/interfaces/ifd-description-mtu.conf` | Port with a description and MTU (2) |
| `evo/interfaces/ifd-description-speed-100g-mtu.conf` | 100GbE port with a description and MTU (2) |
| `evo/interfaces/ifd-flexible-ethernet-services-description-speed-10g.conf` | 10G port with flexible services (1) |
| `evo/interfaces/ifd-flexible-ethernet-services-description.conf` | Described port with flexible VLAN tagging and flexible Ethernet services (4) |
| `junos/interfaces/ifd-flexible-ethernet-services-description.conf` | Described port with flexible VLAN tagging and flexible Ethernet services (1) |
| `evo/interfaces/ifd-flexible-ethernet-services-speed-10g.conf` | 10GbE port with flexible VLAN tagging and flexible-ethernet-services encapsulation (1) |
| `junos/interfaces/ifd-flexible-ethernet-services.conf` | Port with flexible VLAN tagging and flexible Ethernet services (5) |
| `evo/interfaces/ifd-flexible-ethernet.conf` | Flexible VLAN tagging with flexible Ethernet services (5) |
| `evo/interfaces/ifd-lag-member-ether-100g.conf` | 100G aggregated Ethernet member link through ether-options (4) |
| `evo/interfaces/ifd-lag-member-ether-speed-10g.conf` | 10GbE port as a LAG member (1) |
| `evo/interfaces/ifd-lag-member-ether.conf` | Core aggregate member interface (28) |
| `junos/interfaces/ifd-lag-member-ether.conf` | Physical member link of an aggregated-Ethernet bundle (2) |
| `junos/interfaces/ifd-lag-member-gigether.conf` | Aggregated Ethernet member link through gigether-options (17) |
| `evo/interfaces/ifd-speed-100g.conf` | Port speed 100G (5) |
| `evo/interfaces/ifd-speed-10g.conf` | Interface device at 10G (7) |
| `evo/interfaces/ifd-unused.conf` | Unused physical port (2) |
| `junos/interfaces/ifl-core-inet-iso-inet6-mpls-max-labels-5-no-v6-address.conf` | Core link unit 0 with an IPv4 address, family iso, family inet6 without an address, and MPLS with five labels (1) |
| `evo/interfaces/ifl-core-inet-iso-inet6-mpls-max-labels-5.conf` | Core logical interface (28) |
| `junos/interfaces/ifl-core-inet-iso-inet6-mpls-max-labels-5.conf` | Core logical interface (13) |
| `junos/interfaces/ifl-irb-inet-inet6-description.conf` | IRB unit with a description and IPv4 and IPv6 addresses (332) |
| `junos/interfaces/ifl-irb-inet-inet6-filter-description.conf` | IRB unit with a description, IPv4 and IPv6 input filters and addresses (168) |
| `evo/interfaces/ifl-irb-inet-inet6-static-arp-ndp-mac-filter.conf` | IRB unit with IPv4 and IPv6 input filters, addresses, a static ARP and NDP entry, and a fixed MAC address (168) |
| `evo/interfaces/ifl-irb-inet-inet6-static-arp-ndp-mac.conf` | IRB unit with IPv4 and IPv6 addresses, a static ARP and NDP entry, and a fixed MAC address (332) |
| `evo/interfaces/ifl-irb-inet-inet6-virtual-gateway-filter.conf` | IRB unit with IPv4 and IPv6 input filters, addresses and virtual gateway addresses (168) |
| `evo/interfaces/ifl-irb-inet-inet6-virtual-gateway.conf` | IRB unit with IPv4 and IPv6 addresses and virtual gateway addresses (332) |
| `junos/interfaces/ifl-loopback-primary-iso-anycast-v4-sr-v6.conf` | Loopback logical interface (1) |
| `evo/interfaces/ifl-loopback-primary-secondary-iso-inet6-mpls.conf` | Loopback unit 0 with primary and secondary IPv4 addresses, an ISO address, primary and secondary IPv6 addresses, and family mpls (7) |
| `junos/interfaces/ifl-loopback-primary-secondary-iso-inet6-mpls.conf` | Loopback unit 0 with primary and secondary IPv4 addresses, an ISO address, primary and secondary IPv6 addresses, and family mpls (4) |
| `evo/interfaces/ifl-vlan-bridge-description.conf` | VLAN unit with vlan-bridge encapsulation and a description (2,550) |
| `junos/interfaces/ifl-vlan-bridge-description.conf` | VLAN unit with vlan-bridge encapsulation and a description (4,800) |
| `evo/interfaces/ifl-vlan-bridge-esi-all-active.conf` | VLAN unit with vlan-bridge encapsulation and an all-active ESI (600) |
| `evo/interfaces/ifl-vlan-ccc-description.conf` | VLAN unit with vlan-ccc encapsulation and a description (1,100) |
| `junos/interfaces/ifl-vlan-ccc-description.conf` | VLAN unit with vlan-ccc encapsulation and a description (400) |
| `evo/interfaces/ifl-vlan-ccc-esi-all-active-filter.conf` | VLAN unit with vlan-ccc encapsulation, an all-active ESI and a family ccc input filter (600) |
| `evo/interfaces/ifl-vlan-ccc-esi-all-active.conf` | VLAN unit with vlan-ccc encapsulation and an all-active ESI (600) |
| `evo/interfaces/ifl-vlan-ccc-family-ccc.conf` | Single-tagged cross-connect logical interface (2,500) |
| `junos/interfaces/ifl-vlan-ccc-family-ccc.conf` | VLAN-tagged circuit cross-connect unit with family ccc (2,500) |
| `evo/interfaces/ifl-vlan-ccc-filter.conf` | VLAN unit with vlan-ccc encapsulation and a family ccc input filter (300) |
| `evo/interfaces/ifl-vlan-inet-inet6-description.conf` | VLAN unit with a description and IPv4 and IPv6 addresses (500) |
| `junos/interfaces/ifl-vlan-inet-inet6-description.conf` | VLAN unit with a description and IPv4 and IPv6 addresses (100) |
| `evo/interfaces/ifl-vlan-inet.conf` | Single-tagged routed logical interface carrying an IPv4 customer address (6) |
| `evo/policy-options/community/community-fronthaul.conf` | FRONTHAUL community (5) |
| `evo/policy-options/community/community-service-edge.conf` | SERVICE-EDGE community (2) |
| `junos/policy-options/community/community-service-edge.conf` | SERVICE-EDGE community (1) |
| `evo/policy-options/community/community-xhaul.conf` | xHAUL community (2) |
| `evo/policy-options/policy-statement/per-packet-load-balance.conf` | Per-packet load-balance policy (pplb) — exported to the forwarding table so ECMP paths are used per-flow. (7) |
| `junos/policy-options/policy-statement/per-packet-load-balance.conf` | Per-packet load-balance policy (pplb) — exported to the forwarding table so ECMP paths are used per-flow. (5) |
| `evo/policy-options/policy-statement/ps-as-in-sag-allow.conf` | Inter-AS import policy accepting only SERVICE-EDGE routes (2) |
| `evo/policy-options/policy-statement/ps-as-out-loop-prevent.conf` | Inter-AS export policy rejecting FRONTHAUL routes and setting next-hop self on SERVICE-EDGE routes (2) |
| `junos/policy-options/policy-statement/ps-as-out-set-region-service-edge.conf` | Inter-AS export policy adding the SERVICE-EDGE community (1) |
| `junos/policy-options/policy-statement/ps-bgp-export-accept-inet3.conf` | BGP export policy accepting routes from inet.3 and rejecting the rest (1) |
| `evo/policy-options/policy-statement/ps-bgp-export-reject-inet3.conf` | BGP export policy rejecting routes from inet.3 (2) |
| `junos/policy-options/policy-statement/ps-bgp-import-neighbors.conf` | BGP import policy accepting routes from two neighbors (1) |
| `evo/policy-options/policy-statement/ps-do-not-readvertise-evpn-routes.conf` | Policy rejecting BGP-learned EVPN routes (2) |
| `evo/policy-options/policy-statement/ps-loc-pref.conf` | Policy setting local preference 200 (1) |
| `evo/policy-options/policy-statement/ps-loopback-allow.conf` | Single-term policy accepting a prefix and its more-specifics (7) |
| `junos/policy-options/policy-statement/ps-loopback-allow.conf` | Single-term policy accepting a prefix and its more-specifics (1) |
| `evo/policy-options/policy-statement/ps-next-hop-self.conf` | Next-hop-self acceptance policy (4) |
| `junos/policy-options/policy-statement/ps-next-hop-self.conf` | Next-hop-self acceptance policy (1) |
| `evo/policy-options/policy-statement/ps-nhs-commu-out-load-balance-per-packet.conf` | Next-hop-self policy with per-packet load balancing that adds the FRONTHAUL community and accepts BGP EVPN routes unchanged (1) |
| `evo/policy-options/policy-statement/ps-nhs-commu-out.conf` | Next-hop-self policy that adds the FRONTHAUL community and accepts BGP EVPN routes unchanged (2) |
| `evo/policy-options/policy-statement/ps-nhs-evpn-accept.conf` | Next-hop-self policy that accepts BGP EVPN routes unchanged (2) |
| `evo/policy-options/policy-statement/ps-ospf-summary-reject.conf` | Policy accepting one prefix and longer, rejecting everything else (2) |
| `junos/policy-options/policy-statement/ps-ospf-summary-reject.conf` | Policy accepting one prefix and longer, rejecting everything else (2) |
| `evo/policy-options/policy-statement/ps-sr-nonzero-loopback-v4.conf` | Policy SR_NONZERO_LOOPBACKS_V4 attaching a prefix segment to the IPv4 SR loopback (7) |
| `junos/policy-options/policy-statement/ps-sr-nonzero-loopback-v4.conf` | Policy SR_NONZERO_LOOPBACKS_V4 attaching a prefix segment to the IPv4 SR loopback (4) |
| `evo/policy-options/policy-statement/ps-sr-nonzero-loopback-v6.conf` | Policy SR_NONZERO_LOOPBACKS_V6 attaching a prefix segment to the IPv6 SR loopback (7) |
| `junos/policy-options/policy-statement/ps-sr-nonzero-loopback-v6.conf` | Policy SR_NONZERO_LOOPBACKS_V6 attaching a prefix segment to the IPv6 SR loopback (4) |
| `evo/policy-options/prefix-list/prefix-list-mbh-region.conf` | MBH-REGION prefix list of three loopback addresses (2) |
| `evo/protocols/bgp-advertise-from-main-vpn-tables-log-updown-multipath.conf` | BGP global settings: advertise-from-main-vpn-tables, log-updown and multipath (1) |
| `evo/protocols/bgp-advertise-from-main-vpn-tables-vpn-apply-export-log-updown-multipath.conf` | BGP global settings: advertise-from-main-vpn-tables, vpn-apply-export, log-updown and multipath (1) |
| `evo/protocols/bgp-family-inet-unicast-log-updown-multipath.conf` | BGP global settings: family inet unicast, log-updown and multipath (1) |
| `junos/protocols/bgp-group-ebgp-lu-import-bgp-import-export-as-out-2-peers.conf` | eBGP group with two peers for IPv4 and IPv6 labeled unicast, import bgp-import, export as3536-out and bgp-export (1) |
| `evo/protocols/bgp-group-ebgp-lu-route-target-import-export-1-peer.conf` | eBGP group with one peer for labeled unicast and route-target families, import as63536-in, export next-hop-self and bgp-export (1) |
| `evo/protocols/bgp-group-ebgp-multihop-lu-route-target-import-export-1-peer.conf` | Multihop eBGP group with one peer for labeled unicast and route-target families, import as63536-in, export next-hop-self and bgp-export (1) |
| `junos/protocols/bgp-group-ebgp-multihop-lu-vpn-evpn-rt-external-paths-2-peers.conf` | Multihop eBGP group with two peers for labeled unicast, VPN, L2VPN, EVPN and route-target (external-paths 2) families, exporting next-hop-self (1) |
| `evo/protocols/bgp-group-ebgp-multihop-vpn-evpn-1-peer.conf` | Multihop eBGP group (no-nexthop-change) with one peer for VPN, L2VPN, EVPN and route-target families, exporting nhs (1) |
| `evo/protocols/bgp-group-ebgp-multihop-vpn-evpn-vpn-apply-export-1-peer.conf` | Multihop eBGP group (no-nexthop-change) with one peer for VPN, L2VPN, EVPN and route-target families, exporting nhs, with vpn-apply-export (1) |
| `evo/protocols/bgp-group-ibgp-evpn-route-target-1-peer.conf` | iBGP group with one peer for EVPN and route-target families (2) |
| `evo/protocols/bgp-group-ibgp-lu-export-next-hop-self-1-peer.conf` | iBGP group with one peer for IPv4 and IPv6 labeled unicast, exporting next-hop-self (1) |
| `evo/protocols/bgp-group-ibgp-lu-export-next-hop-self-2-peers.conf` | iBGP group with two peers for IPv4 and IPv6 labeled unicast, exporting next-hop-self (2) |
| `evo/protocols/bgp-group-ibgp-lu-inet-unicast-export-next-hop-self-1-peer.conf` | iBGP group with one peer for IPv4 labeled unicast and unicast and IPv6 labeled unicast, exporting next-hop-self (1) |
| `evo/protocols/bgp-group-ibgp-lu-vpn-evpn-export-nhs-commu-out-2-peers.conf` | iBGP group with two peers for labeled unicast, VPN, L2VPN, EVPN and route-target families, exporting nhs_commu_out (3) |
| `evo/protocols/bgp-group-ibgp-rr-lu-export-as-out-2-peers.conf` | iBGP route-reflector group with two peers for IPv4 and IPv6 labeled unicast, exporting as3536-out (2) |
| `evo/protocols/bgp-group-ibgp-rr-lu-vpn-evpn-3-peers.conf` | iBGP route-reflector group with three peers for labeled unicast, VPN, L2VPN, EVPN and route-target families, exporting nhs (1) |
| `evo/protocols/bgp-group-ibgp-rr-lu-vpn-evpn-vpn-apply-export-3-peers.conf` | iBGP route-reflector group with three peers for labeled unicast, VPN, L2VPN, EVPN and route-target families, exporting nhs, with vpn-apply-export (1) |
| `evo/protocols/bgp-log-updown-multipath.conf` | BGP global settings: log-updown and multipath (4) |
| `junos/protocols/bgp-vpn-apply-export-log-updown-multipath.conf` | BGP global settings: vpn-apply-export, log-updown and multipath (1) |
| `evo/protocols/isis-ignore-attached-bit.conf` | IS-IS ignores the attached bit (4) |
| `junos/protocols/isis-ignore-attached-bit.conf` | IS-IS ignores the attached bit (3) |
| `evo/protocols/isis-interface-l1-node-protection-l2-disable-p2p-bfd.conf` | IS-IS point-to-point core interface at Level 1 only, with node-protecting post-convergence LFA, metric 10 and BFD (6) |
| `evo/protocols/isis-interface-l1-node-protection-p2p-bfd.conf` | IS-IS point-to-point core interface at Level 1 with node-protecting post-convergence LFA, metric 10 and BFD (9) |
| `evo/protocols/isis-interface-l2-node-protection-l1-disable-p2p-bfd.conf` | IS-IS point-to-point core interface at Level 2 only, with node-protecting post-convergence LFA, metric 10 and BFD (8) |
| `junos/protocols/isis-interface-l2-node-protection-l1-disable-p2p-bfd.conf` | IS-IS point-to-point core interface at Level 2 only, with node-protecting post-convergence LFA, metric 10 and BFD (12) |
| `evo/protocols/isis-interface-l2-node-protection-p2p-bfd.conf` | IS-IS point-to-point core interface at Level 2 with node-protecting post-convergence LFA, metric 10 and BFD (2) |
| `evo/protocols/isis-interface-p2p-bfd.conf` | IS-IS point-to-point core interface with BFD (1) |
| `junos/protocols/isis-level-1-disable.conf` | IS-IS Level 1 disabled (1) |
| `evo/protocols/isis-level-1-wide-metrics-only.conf` | IS-IS Level 1 with wide metrics only (5) |
| `evo/protocols/isis-level-2-disable.conf` | IS-IS Level 2 disabled (3) |
| `evo/protocols/isis-level-2-wide-metrics-only.conf` | IS-IS Level 2 with wide metrics only (4) |
| `junos/protocols/isis-level-2-wide-metrics-only.conf` | IS-IS Level 2 with wide metrics only (4) |
| `evo/protocols/isis-loopback-passive.conf` | IS-IS logical interface (7) |
| `junos/protocols/isis-loopback-passive.conf` | IS-IS logical interface (4) |
| `evo/protocols/isis-sr-node-segment-spf-ti-lfa-export.conf` | IS-IS segment routing (SRGB, node SIDs, explicit null), SPF timers, TI-LFA backup and loopback export (7) |
| `junos/protocols/isis-sr-node-segment-spf-ti-lfa-export.conf` | IS-IS segment routing (SRGB, node SIDs, explicit null), SPF timers, TI-LFA backup and loopback export (4) |
| `evo/protocols/l2-learning-global-mac-table-aging-time.conf` | Global MAC table aging time (1) |
| `evo/protocols/l2circuit-control-word-flow-label-static.conf` | Layer 2 circuit to a remote PE with control word, static flow-label transmit and receive, and pseudowire status TLV (2,000) |
| `junos/protocols/l2circuit-control-word-flow-label-static.conf` | Layer 2 circuit to a remote PE with control word, static flow-label transmit and receive, and pseudowire status TLV (2,000) |
| `evo/protocols/l2circuit-control-word.conf` | Layer 2 circuit to a remote PE with control word and pseudowire status TLV (500) |
| `junos/protocols/l2circuit-control-word.conf` | Layer 2 circuit to a remote PE with control word and pseudowire status TLV (500) |
| `evo/protocols/ldp-loopback.conf` | LDP loopback interface (5) |
| `junos/protocols/ldp-loopback.conf` | LDP loopback interface (1) |
| `junos/protocols/mpls-pccd-ipv6-tunneling-loopback-2-core.conf` | MPLS with a PCEP external controller, log-updown, no-propagate-ttl, ICMP and IPv6 tunneling, on the loopback and two core interfaces (1) |
| `evo/protocols/mpls-pccd-ipv6-tunneling-loopback-3-core.conf` | MPLS with a PCEP external controller, log-updown, no-propagate-ttl, ICMP and IPv6 tunneling, on the loopback and three core interfaces (2) |
| `junos/protocols/mpls-pccd-ipv6-tunneling-loopback-3-core.conf` | MPLS with a PCEP external controller, log-updown, no-propagate-ttl, ICMP and IPv6 tunneling, on the loopback and three core interfaces (4) |
| `evo/protocols/mpls-pccd-ipv6-tunneling-loopback-4-core.conf` | MPLS with a PCEP external controller, log-updown, no-propagate-ttl, ICMP and IPv6 tunneling, on the loopback and four core interfaces (3) |
| `evo/protocols/mpls-pccd-ipv6-tunneling-loopback-5-core.conf` | MPLS with a PCEP external controller, log-updown, no-propagate-ttl, ICMP and IPv6 tunneling, on the loopback and five core interfaces (2) |
| `evo/protocols/oam-cfm-maintenance-association-up-mep-cc-1s.conf` | Ethernet CFM maintenance association with an up MEP on a logical interface, a remote MEP and 1-second continuity checks (1,900) |
| `junos/protocols/oam-cfm-maintenance-association-up-mep-cc-1s.conf` | Ethernet CFM maintenance association with an up MEP on a logical interface, a remote MEP and 1-second continuity checks (1,200) |
| `evo/protocols/oam-cfm-maintenance-domain-level-5.conf` | Ethernet CFM maintenance domain at level 5 with name-format none (5) |
| `junos/protocols/oam-cfm-maintenance-domain-level-5.conf` | Ethernet CFM maintenance domain at level 5 with name-format none (1) |
| `evo/routing-instances/evpn-elan/ri-evpn-mac-vrf-vlan-based-irb-no-gateway-community.conf` | EVPN MAC-VRF instance, VLAN-based service, with an IRB interface and default-gateway no-gateway-community (500) |
| `junos/routing-instances/evpn-elan/ri-evpn-mac-vrf-vlan-based-irb-no-gateway-community.conf` | EVPN MAC-VRF instance, VLAN-based service, with an IRB interface and default-gateway no-gateway-community (250) |
| `evo/routing-instances/evpn-elan/ri-evpn-mac-vrf-vlan-based.conf` | EVPN MAC-VRF instance, VLAN-based service, with one VLAN and one attachment circuit (150) |
| `evo/routing-instances/evpn-vpws/ri-evpn-fxc-vlan-aware-2-uni.conf` | VLAN-aware EVPN-VPWS instance cross-connecting two attachment circuits (450) |
| `junos/routing-instances/evpn-vpws/ri-evpn-fxc-vlan-aware-2-uni.conf` | VLAN-aware EVPN-VPWS instance cross-connecting two attachment circuits (100) |
| `evo/routing-instances/evpn-vpws/ri-evpn-vpws-flow-label-static.conf` | EVPN-VPWS instance with static flow-label transmit and receive (200) |
| `junos/routing-instances/evpn-vpws/ri-evpn-vpws-flow-label-static.conf` | EVPN-VPWS instance with static flow-label transmit and receive (200) |
| `evo/routing-instances/evpn-vpws/ri-evpn-vpws.conf` | EVPN-VPWS routing-instance (MEF E-Line) (1,500) |
| `evo/routing-instances/l3vpn/ri-l3vpn-ebgp-v4-v6-as-override.conf` | L3VPN VRF with IPv4 and IPv6 eBGP sessions to the CE using as-override, and vrf-table-label (500) |
| `junos/routing-instances/l3vpn/ri-l3vpn-ebgp-v4-v6-as-override.conf` | L3VPN VRF with IPv4 and IPv6 eBGP sessions to the CE using as-override, and vrf-table-label (100) |
| `evo/routing-instances/l3vpn/ri-l3vpn-irb-router-id-vrf-table-label.conf` | L3VPN VRF with one IRB interface, a router ID and vrf-table-label (1,000) |
| `junos/routing-instances/l3vpn/ri-l3vpn-irb-router-id-vrf-table-label.conf` | L3VPN VRF with one IRB interface, a router ID and vrf-table-label (500) |
| `evo/routing-instances/vpls/ri-bgp-vpls-virtual-switch-flow-label.conf` | BGP-signalled VPLS virtual switch with flow-label transmit and receive (FAT pseudowire) and one VLAN (2,000) |
| `junos/routing-instances/vpls/ri-bgp-vpls-virtual-switch-flow-label.conf` | BGP-signalled VPLS virtual switch with flow-label transmit and receive (FAT pseudowire) and one bridge domain (2,000) |
| `evo/routing-options/auto-bandwidth-template.conf` | Auto-bandwidth template with adjust interval, threshold, statistics interval and subscription (7) |
| `junos/routing-options/auto-bandwidth-template.conf` | Auto-bandwidth template with adjust interval, threshold, statistics interval and subscription (4) |
| `evo/routing-options/autonomous-system.conf` | Device autonomous-system number (7) |
| `junos/routing-options/autonomous-system.conf` | Device autonomous-system number (5) |
| `evo/routing-options/forwarding-table-pplb-chained-nh-evpn-l3vpn.conf` | Forwarding-table load-balance export with chained composite next hops for EVPN and L3VPN (5) |
| `junos/routing-options/forwarding-table-pplb-chained-nh-evpn.conf` | Forwarding-table per-packet load balancing with chained composite next hops for EVPN (2) |
| `evo/routing-options/forwarding-table-pplb-chained-nh-l2ckt-evpn-l3vpn.conf` | Forwarding-table load-balance export with chained composite next hops for L2 circuit, EVPN and L3VPN (1) |
| `junos/routing-options/forwarding-table-pplb-chained-nh-l2ckt-evpn-l3vpn.conf` | Forwarding-table load-balance export with chained composite next hops for L2 circuit, EVPN and L3VPN (2) |
| `evo/routing-options/forwarding-table-pplb-chained-nh-l3vpn.conf` | Forwarding-table load-balance export with chained composite next hops for L3VPN (1) |
| `junos/routing-options/forwarding-table-pplb-ecmp-fast-reroute-chained-nh-l2ckt-evpn-l3vpn.conf` | Forwarding-table load-balance export with ECMP fast reroute and chained composite next hops for L2 circuit, EVPN and L3VPN (1) |
| `junos/routing-options/interface-routes-rib-group-inet.conf` | Interface routes added to the from-inet0-to-inet3 RIB group (1) |
| `evo/routing-options/no-multi-topology-routing.conf` | Multi-topology routing disabled (5) |
| `junos/routing-options/no-multi-topology-routing.conf` | Multi-topology routing disabled (1) |
| `junos/routing-options/rib-groups-from-inet0-to-inet3.conf` | RIB group copying inet.0 routes into inet.3 (1) |
| `evo/routing-options/rib-groups-inet3-to-inet0-inet6-3.conf` | RIB group copying inet.3 routes into inet.0 and inet6.3 through ALLOW_LOOPBACK (3) |
| `junos/routing-options/rib-groups-inet3-to-inet0-inet6-3.conf` | RIB group copying inet.3 routes into inet.0 and inet6.3 through ALLOW_LOOPBACK (1) |
| `evo/routing-options/rib-groups-inet3-to-inet0.conf` | RIB group copying inet.3 routes into inet.0 through ALLOW_LOOPBACK (4) |
| `evo/routing-options/router-id.conf` | Transport router identity (7) |
| `junos/routing-options/router-id.conf` | Transport router identity (5) |
| `junos/vlans/vlan-2-interfaces.conf` | VLAN with two member interfaces (1,150) |
| `evo/vlans/vlan-interface-l3-interface.conf` | VLAN with one member interface and an IRB Layer 3 interface (500) |
