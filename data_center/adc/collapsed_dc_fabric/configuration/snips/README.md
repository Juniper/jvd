# Configuration Snippets (snips)

This `snips/` directory contains **focused, templated configuration excerpts**
extracted from the validated device configurations in [`../conf/`](../conf/).
Each file isolates one construct — a fabric link, an ESI-LAG access port, the
EVPN-VXLAN MAC-VRF, an EVPN Type 5 VRF, an eBGP underlay or EVPN overlay group, a
routing policy or community, or a system service — so it can be read, compared
and adapted on its own. Every body
is measured against the source: the `Count:` header is the number of exact
source instances the template reproduces on each device.

## Topology

A two-switch EVPN-VXLAN collapsed-spine fabric managed by Juniper Apstra: two
QFX5120-48Y leaves (`leaf1`, `leaf2`) running **Junos OS** perform the spine,
leaf and border-leaf roles at once and peer directly: an eBGP underlay over their
interconnect links and an EVPN overlay between their loopbacks. Servers attach
over ESI-LAG access trunks to a VLAN-aware EVPN-VXLAN MAC-VRF with 40 VLANs, whose
IRB gateways are routed in two EVPN Type 5 VRFs; each VRF peers over eBGP with an
external router (MX204) that is not part of the published configurations. Device
tokens in snippet headers are the file names in `../conf/` (`leaf1_qfx5120-48y`,
`leaf2_qfx5120-48y`).

## Layout

```
snips/
  junos/        ← Junos OS forms (QFX5120-48Y)
```

41 snippet files, all Junos.

| Sub-folder | What's in it |
|---|---|
| `interfaces/` | Interconnect links and their /31 units, ESI-LAG access bundles and their member ports, trunk units, IRB units, and the loopback. |
| `routing-instances/` | The EVPN-VXLAN MAC-VRF with its 40 VLANs (`evpn-elan/`) and the EVPN Type 5 VRF with eBGP to the external router (`l3vpn/`). |
| `protocols/` | BGP global options, the eBGP underlay and EVPN overlay groups, EVPN options, LLDP, RSTP and Layer 2 learning telemetry. |
| `policy-options/` | Export, import and loopback policies, route-filter lists, the fabric communities and the per-packet load-balancing policy. |
| `routing-options/`, `forwarding-options/` | Router ID, AS, graceful restart, the forwarding-table load-balance export, and hashing. |
| `system/`, `security/`, `chassis/` | Host name, management instance, console, NETCONF and the gRPC service over SSL, its local certificate, and aggregated-device count. |

## Snippet headers

Every snippet starts with a C-style header whose fields follow the repository
snippet contract:

- **`Seen on:`** — every validated device whose configuration reproduces this
  exact template, split by OS. Shared applicability is not a peer relationship.
- **`Count:`** — distinct source instances of the template per device and in
  total, generated from [`_bindings.json`](_bindings.json); never hand-edited.
- **`Pair with:`** — directed, required same-device dependencies measured from
  the source: named objects a snippet references by a fixed name (here the
  `FABRIC_COMMUNITIES` community). Dependencies that go through a template value
  are listed as Needs in the BYOAI bundle.
- **`Peers with:`** — `n/a` for local constructs. Constructs whose peer
  cannot be verified from the configurations carry no claim: see Scope.

## Templated values — `$VAR` placeholders

Deployment-specific values (loopbacks, addresses, AS numbers, interface, instance,
VLAN, group, policy, term and community names, VLAN IDs, VNIs, ESIs, route
distinguishers and targets) appear as `$VAR`
placeholders. Design constants and the names other configuration references by
name are left literal. Each header lists the placeholders it uses with example
values from a validated device; the full glossary is
[`_variables.md`](_variables.md).

## Source examples

[`_bindings.md`](_bindings.md) summarises, and [`_bindings.json`](_bindings.json)
records in full, the exact source instances and variable bindings each template
reproduces. Example values in headers are illustrative; the bindings are the
evidence.

## Scope

Snippets reproduce the active configuration of the two design devices. The NETCONF
`traceoptions` on each leaf are excluded by standing policy
([`_source-exclusions.json`](_source-exclusions.json)); the published
configurations contain no software version stamp and no deactivated configuration.

### Known limitations of the published configurations

- **External router.** The VRFs' eBGP peer (an MX204) is not part of the
  published configurations; its side of each session is not modeled.
- **gRPC certificate.** The local certificate's private key is removed from the
  published configurations (`<REMOVED>`); supply your own certificate and key.
- **Peers.** The interconnect links, the eBGP underlay and EVPN overlay groups
  carry verified leaf-to-leaf peers. System, LLDP, RSTP, Layer 2 learning, EVPN
  options, the ESI-LAG bundle, both routing instances, the certificate and the BGP
  global options have no peer rule and carry no claim.
- **Building blocks.** Snippets are building blocks, not complete device
  configurations. The device configurations under [`../conf/`](../conf/) are the
  as-captured reference.

## Topic index

Totals are source instances across all devices.

| Topic | What it shows |
|---|---|
| `junos/chassis/aggregated-devices-ethernet.conf` | Aggregated Ethernet device-count for the chassis (2) |
| `junos/forwarding-options/evpn-vxlan-shared-tunnels.conf` | EVPN-VXLAN shared tunnels (2) |
| `junos/forwarding-options/vxlan-routing-next-hop-interface-num-overlay-ecmp.conf` | VXLAN routing with next-hop and interface-number allocations and overlay ECMP (2) |
| `junos/interfaces/ifd-ae-esi-all-active-lacp-system-id.conf` | Aggregated Ethernet interface for an ESI-LAG: all-active Ethernet segment, active LACP with a fixed system ID and a 9216-byte MTU (2) |
| `junos/interfaces/ifd-description-mtu-9216.conf` | Physical interface with a description and a 9216-byte MTU (6) |
| `junos/interfaces/ifd-flexible-vlan-tagging-native-vlan-1.conf` | Physical interface with a description, flexible VLAN tagging and native VLAN 1 for VLAN-tagged Layer 3 units (2) |
| `junos/interfaces/ifd-lag-member-hold-time-up-100000.conf` | Aggregated Ethernet member link with a description and a hold-up timer of 100000 ms (2) |
| `junos/interfaces/ifl-core-inet-mtu-9170.conf` | Unit 0 with an IPv4 address and a 9170-byte family MTU on a leaf-to-leaf link (4) |
| `junos/interfaces/ifl-ethernet-switching-trunk-40-vlans.conf` | Unit 0 as an Ethernet-switching trunk carrying 40 VLANs (4) |
| `junos/interfaces/ifl-loopback-inet.conf` | Loopback unit with one IPv4 address (6) |
| `junos/interfaces/ifl-unit-0-inet-no-address.conf` | Unit 0 with family inet and no address (102) |
| `junos/interfaces/ifl-vlan-inet.conf` | VLAN-tagged unit with a description and an IPv4 address (4) |
| `junos/interfaces/irb-inet-mtu-9000-mac.conf` | IRB unit with an IPv4 gateway address, a 9000-byte family MTU and a configured MAC address (80) |
| `junos/policy-options/community/community-2-members.conf` | Community with two standard members (10) |
| `junos/policy-options/community/fabric-communities.conf` | FABRIC_COMMUNITIES: the fabric-internal communities that external export policies delete (2) |
| `junos/policy-options/policy-statement/per-packet-load-balance-no-term.conf` | Per-packet load-balancing policy without terms (2) |
| `junos/policy-options/policy-statement/ps-accept-all.conf` | Policy with a single term that accepts everything (2) |
| `junos/policy-options/policy-statement/ps-direct-inet-community-add-reject.conf` | Policy that accepts direct IPv4 routes with a community added and rejects everything else (6) |
| `junos/policy-options/policy-statement/ps-from-policy-bgp-accept-reject.conf` | Policy that accepts the routes another policy accepts and BGP routes, and rejects everything else (6) |
| `junos/policy-options/policy-statement/ps-route-filter-list-community-add-reject-inet.conf` | Import policy that accepts IPv4 routes in a route-filter list with a community added and rejects other IPv4 routes (4) |
| `junos/policy-options/policy-statement/ps-route-filter-list-community-delete-reject-inet.conf` | Export policy that accepts IPv4 routes in a route-filter list with the fabric communities removed and rejects other IPv4 routes (4) |
| `junos/policy-options/route-filter-list-4-upto-2-exact.conf` | Route-filter list with every non-default IPv4 prefix length, four prefixes up to /32 and two exact /32 prefixes (4) |
| `junos/policy-options/route-filter-list-default-route.conf` | Route-filter list that matches only the IPv4 default route (4) |
| `junos/protocols/bgp-group-ebgp-evpn-overlay-1-peer-bfd.conf` | eBGP EVPN overlay group to the peer loopback (multihop TTL 1, no next-hop change), BFD at 3000 ms and multiple-AS multipath (2) |
| `junos/protocols/bgp-group-ebgp-underlay-2-peers-bfd.conf` | eBGP underlay group with two directly connected peers, export policy, BFD at 1000 ms and multiple-AS multipath (2) |
| `junos/protocols/bgp-log-updown-graceful-restart-multipath.conf` | BGP global options: log-updown, graceful restart without helping on shared-fate BFD down, and multipath (2) |
| `junos/protocols/evpn-no-core-isolation.conf` | EVPN no-core-isolation setting (2) |
| `junos/protocols/l2-learning-telemetry-remote-entries.conf` | Layer 2 learning telemetry that includes remote entries (2) |
| `junos/protocols/lldp-interface-all-port-id-interface-name.conf` | LLDP on all interfaces with the interface name as port ID and the interface description as port description (2) |
| `junos/protocols/rstp-bridge-priority-0-2-edge-bpdu-block.conf` | RSTP with bridge priority 0, two edge interfaces and BPDU block on edge (2) |
| `junos/routing-instances/evpn-elan/ri-mac-vrf-vlan-aware-vxlan-40-vlans.conf` | VLAN-aware MAC-VRF with VXLAN encapsulation, 40 VLANs with VNIs and IRB interfaces, per-VNI route targets and two access interfaces (2) |
| `junos/routing-instances/l3vpn/ri-vrf-evpn-type-5-ebgp-20-irb.conf` | VRF with EVPN Type 5 IP prefix routes over VXLAN, an eBGP session to an external router, 20 IRB interfaces and a loopback unit (4) |
| `junos/routing-options/autonomous-system.conf` | Device autonomous-system number (2) |
| `junos/routing-options/forwarding-table-pplb-ecmp-fast-reroute-chained-nh-evpn.conf` | Forwarding-table per-packet load balancing, ECMP fast reroute and chained composite next hops for EVPN (2) |
| `junos/routing-options/graceful-restart.conf` | Graceful restart (2) |
| `junos/routing-options/router-id.conf` | Transport router identity (2) |
| `junos/security/certificates-local.conf` | Local certificate and private key used by the gRPC SSL service (2) |
| `junos/system/host-name.conf` | System host name (2) |
| `junos/system/management-instance.conf` | Dedicated management routing instance (mgmt_junos) for the management interface and services (2) |
| `junos/system/ports-console-log-out.conf` | Console log-out on disconnect (2) |
| `junos/system/services-netconf-ssh-grpc-ssl-local-certificate.conf` | NETCONF over SSH, SSH with root login, SFTP and a rate limit, and a gRPC extension service over SSL on port 32767 in the management instance (2) |
