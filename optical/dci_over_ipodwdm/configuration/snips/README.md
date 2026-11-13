# Configuration Snippets (snips)

This `snips/` directory contains **focused, templated configuration excerpts**
extracted from the validated device configurations in [`../conf/`](../conf/).
Each file isolates one construct — a coherent optics port, a DWDM aggregate or
its core unit, an OSPF, RSVP, MPLS or BGP form, an L3VPN routing instance, a
policy or a system setting — so it can be read, compared and adapted without
reading a four-thousand-line router configuration. Every body is measured
against the source: the `Count:` header is the number of exact source
instances the template reproduces on each device.

## Topology

Three DCI edge routers connect in a triangle over aggregated DWDM links built
from 400G coherent optics plugged into the routers; each router also has a
customer-facing port toward a test traffic generator. Device tokens in snippet
headers are the file names in `../conf/`: `dci1_ptx10001-36mr`, `dci2_mx304`
and `dci3_acx7100-48l`.

## Layout

```
snips/
  junos/        ← Junos OS forms (MX304)
  evo/          ← Junos Evolved forms (PTX10001-36MR, ACX7100-48L)
```

49 snippet files: 23 Junos, 26 EVO; 20 constructs have
byte-identical Junos and EVO forms registered as OS-scoped mirrors in
[`_snip-library.json`](_snip-library.json).

| Sub-folder | What's in it |
|---|---|
| `interfaces/` | Coherent optics ports as aggregate members with their DWDM wavelength (EVO `ether-options`, Junos `gigether-options`), the DWDM aggregate and its IPv4/MPLS core unit, the customer-facing port and its VLAN units, the loopback. |
| `protocols/` | OSPF traffic engineering and the backbone area, RSVP, MPLS with the 200 RSVP-TE LSPs, the iBGP group for L3VPN. |
| `routing-instances/l3vpn/` | The L3VPN VRF with an eBGP session to the customer side (100 per router). |
| `policy-options/` | The per-flow load-balance policy. |
| `routing-options/` | Router ID, AS, maximum ECMP, forwarding-table load-balance export. |
| `chassis/` | Aggregated Ethernet device count, MX304 port speeds. |
| `system/` | Login accounts, NETCONF and gRPC services, console, time zone, NTP, syslog. |

## Snippet headers

Every snippet starts with a C-style header whose fields follow the repository
snippet contract:

- **`Seen on:`** — every validated device whose configuration reproduces this
  exact template, split by OS. Shared applicability is not a peer relationship.
- **`Count:`** — distinct source instances of the template per device and in
  total, generated from [`_bindings.json`](_bindings.json); never hand-edited.
- **`Pair with:`** — directed, required same-device dependencies measured from
  the source. In this library every dependency goes through a template value (a
  unit, a policy name, an aggregate), so the headers list none; the typed
  requirements are in the BYOAI manifest and listed as Needs in the bundle.
- **`Peers with:`** — `n/a` for local constructs. Session and link constructs
  (iBGP, LACP, the VRF's eBGP session) carry no claim: see Scope.

## Templated values — `$VAR` placeholders

Deployment-specific values (loopbacks, addresses, AS numbers, RD/RT subfields,
instance and group names, interfaces and units, VLANs, wavelengths, LSP names)
appear as `$VAR` placeholders. Design constants are left literal. Each header
lists the placeholders it uses with example values from a validated device; the
full glossary is [`_variables.md`](_variables.md).

## Source examples

[`_bindings.md`](_bindings.md) summarises, and [`_bindings.json`](_bindings.json)
records in full, the exact source instances and variable bindings each template
reproduces. Example values in headers are illustrative; the bindings are the
evidence.

## Scope

Snippets reproduce the active configuration of the three design routers. The
published configurations contain no `traceoptions` and no deactivated
configuration, so nothing is excluded.

### Known limitations of the published configurations

- **dci2 core address.** dci2's `ae12` IPv4 address is malformed in both
  published copies (`10.12..1.2/30` in the configuration, none in the set
  file). The snippet binds it as captured.
- **dci3 addressing.** dci3's loopback, router ID, iBGP neighbors and LSP
  targets use 11.1.1.x, while dci1 and dci2 address dci3 as 10.1.1.3. Each
  router is reproduced as configured; for this reason the iBGP full mesh cannot
  be verified as a peer relationship.
- **Scale artifact.** The MPLS form carries all 200 LSPs of a router (100 to
  each other router) because a label-switched path is not an independently
  selectable block; it is the validated scale configuration, not a template to
  copy line by line.
- **Lab services.** The VRFs' customer side faces a test traffic generator, not
  a validated CE; gRPC telemetry runs clear-text without authentication.
- **Building blocks.** Snippets are building blocks, not complete device
  configurations. The device configurations under [`../conf/`](../conf/) are the
  as-captured reference.

## Topic index

Totals are source instances across all devices; OS mirrors are listed once per
OS.

| Topic | What it shows |
|---|---|
| `evo/chassis/aggregated-devices-ethernet.conf` | Aggregated Ethernet device count (2) |
| `junos/chassis/aggregated-devices-ethernet.conf` | Aggregated Ethernet device count (1) |
| `junos/chassis/fpc-mx304-5x400g-1x100g-1x4x10g.conf` | MX304 port speeds for 400G coherent optics (1) |
| `evo/interfaces/ifd-core-aggregate-min-links-lacp-fast.conf` | Aggregated Ethernet core bundle with minimum links and fast active LACP (4) |
| `junos/interfaces/ifd-core-aggregate-min-links-lacp-fast.conf` | Aggregated Ethernet core bundle with minimum links and fast active LACP (2) |
| `evo/interfaces/ifd-flexible-ethernet-services-100g.conf` | Port at 100G with flexible VLAN tagging and flexible Ethernet services (1) |
| `evo/interfaces/ifd-flexible-ethernet-services.conf` | Port with flexible VLAN tagging and flexible Ethernet services (1) |
| `junos/interfaces/ifd-flexible-ethernet-services.conf` | Port with flexible VLAN tagging and flexible Ethernet services (1) |
| `evo/interfaces/ifd-lag-member-ether-wavelength.conf` | Coherent optics port as an aggregated Ethernet member, with its DWDM wavelength (9) |
| `junos/interfaces/ifd-lag-member-gigether-wavelength.conf` | Coherent optics port as an aggregated Ethernet member, with its DWDM wavelength (5) |
| `evo/interfaces/ifl-core-inet-mpls-max-labels-5.conf` | Core logical interface with IPv4 and MPLS (4) |
| `junos/interfaces/ifl-core-inet-mpls-max-labels-5.conf` | Core logical interface with IPv4 and MPLS (2) |
| `evo/interfaces/ifl-loopback-inet.conf` | Loopback unit with one IPv4 address (2) |
| `junos/interfaces/ifl-loopback-inet.conf` | Loopback unit with one IPv4 address (1) |
| `evo/interfaces/ifl-vlan-inet.conf` | VLAN-tagged IPv4 unit (200) |
| `junos/interfaces/ifl-vlan-inet.conf` | VLAN-tagged IPv4 unit (100) |
| `evo/policy-options/policy-statement/per-flow-load-balance.conf` | Per-flow load-balance policy (2) |
| `junos/policy-options/policy-statement/per-flow-load-balance.conf` | Per-flow load-balance policy (1) |
| `evo/protocols/bgp-ibgp-inet-vpn-2-peers.conf` | iBGP group for L3VPN with two loopback neighbors (2) |
| `junos/protocols/bgp-ibgp-inet-vpn-2-peers.conf` | iBGP group for L3VPN with two loopback neighbors (1) |
| `evo/protocols/mpls-te-200-lsp-2-core.conf` | MPLS traffic engineering with 200 RSVP LSPs and two core interfaces (2) |
| `junos/protocols/mpls-te-200-lsp-2-core.conf` | MPLS traffic engineering with 200 RSVP LSPs and two core interfaces (1) |
| `evo/protocols/ospf-area0-loopback-2-p2p-core.conf` | OSPF backbone area with a passive loopback and two point-to-point core interfaces (2) |
| `junos/protocols/ospf-area0-loopback-2-p2p-core.conf` | OSPF backbone area with a passive loopback and two point-to-point core interfaces (1) |
| `evo/protocols/ospf-traffic-engineering.conf` | OSPF traffic-engineering extensions (2) |
| `junos/protocols/ospf-traffic-engineering.conf` | OSPF traffic-engineering extensions (1) |
| `evo/protocols/rsvp-interface-2-core.conf` | RSVP on two core interfaces (2) |
| `junos/protocols/rsvp-interface-2-core.conf` | RSVP on two core interfaces (1) |
| `evo/routing-instances/l3vpn/ri-l3vpn-ebgp-local-as-vrf-target.conf` | L3VPN VRF with an eBGP CE session that sets a local AS, and a route target (200) |
| `junos/routing-instances/l3vpn/ri-l3vpn-ebgp-local-as-vrf-target.conf` | L3VPN VRF with an eBGP CE session that sets a local AS, and a route target (100) |
| `evo/routing-options/autonomous-system.conf` | Autonomous system number (2) |
| `junos/routing-options/autonomous-system.conf` | Autonomous system number (1) |
| `evo/routing-options/forwarding-table-pplb-chained-nh-evpn.conf` | Forwarding-table load-balance export with chained composite next hops for EVPN (2) |
| `junos/routing-options/forwarding-table-pplb-chained-nh-evpn.conf` | Forwarding-table load-balance export with chained composite next hops for EVPN (1) |
| `evo/routing-options/maximum-ecmp.conf` | Maximum ECMP paths (2) |
| `junos/routing-options/maximum-ecmp.conf` | Maximum ECMP paths (1) |
| `evo/routing-options/router-id.conf` | Router ID (2) |
| `junos/routing-options/router-id.conf` | Router ID (1) |
| `evo/system/login-2-users-super-user.conf` | Two local super-user accounts with encrypted passwords (2) |
| `junos/system/login-2-users-super-user.conf` | Two local super-user accounts with encrypted passwords (1) |
| `evo/system/ntp-server.conf` | NTP server (1) |
| `evo/system/ports-console-log-out.conf` | Console log-out on disconnect (1) |
| `junos/system/ports-console-log-out.conf` | Console log-out on disconnect (1) |
| `evo/system/processes-ntp-enable.conf` | NTP process enabled (1) |
| `evo/system/services-grpc-clear-text-netconf-ssh.conf` | Clear-text gRPC for telemetry and NETCONF over SSH (1) |
| `evo/system/services-netconf-ssh-grpc-clear-text.conf` | NETCONF over SSH and clear-text gRPC for telemetry (1) |
| `junos/system/services-netconf-ssh-grpc-clear-text.conf` | NETCONF over SSH and clear-text gRPC for telemetry (1) |
| `junos/system/syslog-file-messages-pfe-any.conf` | Syslog messages file with all PFE events (1) |
| `evo/system/time-zone.conf` | System time zone (1) |
