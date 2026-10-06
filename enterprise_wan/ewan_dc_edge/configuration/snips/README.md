# Configuration Snippets (snips)

This `snips/` directory contains **focused, templated configuration excerpts**
extracted from the validated device configurations in [`../conf/`](../conf/).
Each file isolates one construct — an interconnect instance, a MAC-VRF, an
ESI-LAG, an anycast-gateway IRB unit, a BGP or OSPF form — so it can be read,
compared and adapted without reading a multi-thousand-line device
configuration. Every body is measured against the source: the `Count:` header
is the number of exact source instances the template reproduces on each device.

## Topology

![Enterprise Data Center Edge topology](../../images/ewan-dc-edge-topology.png)

Device tokens in snippet headers are the file names in `../conf/`:
`dc-edge1_mx480`, `dc-edge2_mx10003` (gateways), `wan-edge1_mx204`,
`wan-edge2_acx5448-m` (WAN PEs), `p1_acx7100-48l`, `p2_ptx10001-36mr` (P
routers, Junos Evolved), `spine1_qfx5200`, `spine2_qfx5200`, `leaf1_qfx5120-48t`,
`leaf2_qfx5120-48t` and `tor1_ex4200-48t`, `tor2_ex4200-48t`.

## Layout

```
snips/
  junos/        ← Junos OS forms (MX480, MX10003, MX204, ACX5448-M, QFX5200, QFX5120-48T, EX4200-48T)
  evo/          ← Junos Evolved forms (ACX7100-48L, PTX10001-36MR)
```

| Sub-folder | What's in it |
|---|---|
| `routing-instances/evpn-interconnect/` | Gateway instances that stitch an EVPN-VXLAN VNI to an EVPN-MPLS instance through `protocols evpn interconnect` (VLAN-based with IRB, VLAN-bundle). |
| `routing-instances/evpn-elan/` | Leaf MAC-VRFs (VLAN-based, VLAN-bundle) and WAN-edge EVPN-MPLS instances (VLAN-based with IRB, VLAN-bundle). |
| `interfaces/` | ESI-LAGs toward the top-of-rack switches, LAG members, per-VLAN and VLAN-range attachment units, anycast-gateway IRB units, core and fabric-underlay links, loopback. |
| `protocols/` | Complete per-device BGP forms (fabric underlay eBGP, VXLAN overlay iBGP with the gateways as route reflectors, EVPN-MPLS iBGP), OSPF area 0 forms, LFA options, MPLS, LDP, LLDP. |
| `policy-options/policy-statement/` | Loopback export, OSPF-to-BGP export and per-packet load-balancing policies. |
| `routing-options/` | Autonomous system, router-id, forwarding-table load-balancing / ECMP fast-reroute / chained composite next-hop forms, next-hop hierarchy resolution. |
| `forwarding-options/` | EVPN-VXLAN shared tunnels and the VXLAN routing resource profile (leaves); L2 circuit control passthrough (P). |
| `chassis/` | Aggregated-device count, enhanced-ip network services, channelised ports and complete FPC port-speed profiles. |
| `vlans/` | Named VLAN sets (`vlan-id-list` on the leaves, `vlan-range` on the EX4200 top-of-rack switches). |
| `groups/` | The `intSpeeds` port-speed group on p2. |

## Snippet headers

Every snippet starts with a C-style header whose fields follow the repository
snippet contract:

- **`Seen on:`** — every validated device whose configuration reproduces this
  exact template, split by OS. Shared applicability is not a peer relationship.
- **`Count:`** — distinct source instances of the template per device and in
  total, generated from [`_bindings.json`](_bindings.json); never hand-edited.
- **`Variant group:`** — the per-device BGP forms publish `ewan-bgp-overlay`
  with the EVPN address family they signal; EVPN instances require it with
  `variant:ewan-bgp-overlay families=evpn`.
- **`Pair with:`** — directed, required same-device dependencies (for example a
  BGP form's export policies). Attachment-unit and IRB prerequisites are
  measured source references and are recorded in the generated dependency
  evidence rather than listed here.
- **`Peers with:`** — verified configured cross-device relationships. No
  snippet in this library carries the field yet: multipoint EVPN membership is
  not published as a peer relationship, and the BGP session evidence depends on
  loopback addresses that most devices receive from a configuration group (see
  *Scope*).

## Templated values — `$VAR` placeholders

Deployment-specific values (loopbacks, RD/RT tails, instance names, attachment
units, VNIs, ESIs, LACP system-ids) appear as `$VAR` placeholders. Values that
are JVD-wide constants are left literal. Each header lists the placeholders it
uses with example values from the device it was extracted from; the full
glossary is [`_variables.md`](_variables.md).

An interconnect instance carries two RT/RD pairs. The plain `$RT_AS` / `$RT_ID`
/ `$RD_SUB_ASSIGNED` are the fabric-side (EVPN-VXLAN) identity; the
`$RT_AS_INTERCONNECT` / `$RT_ID_INTERCONNECT` / `$RD_SUB_INTERCONNECT` set is
the WAN-side (EVPN-MPLS) identity inside `protocols evpn interconnect`. The two
sets coexist only in bodies that contain an interconnect block.

## Source examples

[`_bindings.md`](_bindings.md) summarises, and [`_bindings.json`](_bindings.json)
records in full, the exact source instances and variable bindings each template
reproduces. Example values in headers are illustrative; the bindings are the
evidence. [`_peers.json`](_peers.json) records the peer-relationship analysis for
every snippet, including the reason a relationship is not published.

## Topic index

Paths without an OS prefix are relative to the selected OS directory.

| Topic | What it shows |
|---|---|
| `routing-instances/evpn-interconnect/ri-evpn-interconnect-vlan-based-irb.conf` | Gateway VLAN-based interconnect instance with IRB and all-active interconnect ESI (1,451 per gateway) |
| `routing-instances/evpn-interconnect/ri-evpn-interconnect-vlan-bundle.conf` | Gateway VLAN-bundle interconnect instance |
| `routing-instances/evpn-elan/ri-evpn-elan-mac-vrf-vlan-based.conf` | Leaf MAC-VRF, one VLAN / one VNI (1,451 per leaf) |
| `routing-instances/evpn-elan/ri-evpn-elan-mac-vrf-vlan-bundle.conf` | Leaf MAC-VRF VLAN-bundle |
| `routing-instances/evpn-elan/ri-evpn-elan-vlan-based-irb.conf` | WAN-edge EVPN-MPLS VLAN-based instance, IRB via `routing-interface` (MX204) |
| `routing-instances/evpn-elan/ri-evpn-elan-vlan-based-l3-interface.conf` | Same service, IRB via `l3-interface` (ACX5448-M) |
| `routing-instances/evpn-elan/ri-evpn-elan-vlan-bundle.conf` | WAN-edge VLAN-bundle instance with per-instance label allocation |
| `interfaces/ifd-ae-flexible-lacp-esi.conf` | Leaf ESI-LAG toward the top-of-rack switch (per-VLAN units) |
| `interfaces/ifd-ae-flexible-lacp-esi-df-preference.conf` | ESI-LAG with preference-based designated-forwarder election |
| `interfaces/ifd-ae-ethernet-bridge-lacp-esi.conf` | Port-based ESI-LAG for bundle services |
| `interfaces/ifd-ae-lacp-trunk-vlan.conf` | Top-of-rack side of the LAG: plain LACP trunk |
| `interfaces/ifl-vlan-bridge.conf` | Per-VLAN attachment unit (`encapsulation vlan-bridge`) |
| `interfaces/ifl-irb-virtual-gateway.conf` | Anycast-gateway IRB unit (6,399 units across gateways and WAN edges) |
| `interfaces/ifl-core-inet-mpls.conf` | WAN core link, inet + mpls |
| `interfaces/ifl-core-inet.conf` | Fabric underlay link, inet only |
| `protocols/bgp-dc-edge1.conf` … `bgp-spine2.conf` | Complete per-device BGP forms |
| `protocols/ospf-area0-dc-edge1.conf` … `ospf-area0-p2.conf` | Complete per-device OSPF area 0 forms |
| `protocols/ospf-backup-spf-options.conf` | Remote LFA / node-link degradation options |
| `forwarding-options/evpn-vxlan-shared-tunnels.conf` | Shared VXLAN tunnels — what lets 1,500 MAC-VRFs fit the leaf |
| `routing-options/forwarding-table-pplb-ecmp-fast-reroute-chained-nh-evpn.conf` | Leaf forwarding-table form |
| `chassis/fpc-mx10003-8x100g-1x4x10g.conf` | Gateway FPC port-speed profile |

## Scope

Constructs are templated as the source deploys them. Items below are present in
the source configurations but are **not yet** represented in this library; they
are tracked, not excluded:

- **Large fixed-cardinality instances.** VLAN-aware (virtual-switch) interconnect
  and WAN-edge instances with 20 bridge domains, leaf VLAN-aware MAC-VRFs with 20
  VLANs, tenant and MPLS L3VPN VRFs with 20–87 IRB members, and the ERB
  (edge-routed bridging) instances. Their bodies are too long for a faithful
  fixed-size template with the current tooling; their populations are measured
  and listed in the [JVD README](../../README.md#validated-scale).
- **LDP on most devices.** LDP forms that name `lo0.0` cannot be verified where
  the loopback is delivered by the `global` configuration group rather than by a
  top-level `interfaces lo0` (dc-edge1, wan-edge1/2, p1/p2); only the dc-edge2
  form is published.
- **The `global` configuration group and its `apply-groups`.** On nine of the
  twelve devices the design loopback and router-id are configured inside
  `groups global` alongside lab management settings. Until that group's
  design content is separated from the management scaffolding by review, neither
  the group nor its application is templated.
- **Lab and test scaffolding** (an unreferenced firewall filter, a disabled
  IS-IS/SRv6 trial on dc-edge1, a `traceoptions` instance, an EVPN-VPWS
  instance whose attachment unit is not configured) is pending adjudication and
  is not templated.

## Pairing with documentation

Read the snippets together with the [design guide](../../documentation/design-guide.md),
[solution overview](../../documentation/solution-overview.md) and
[test report brief](../../documentation/test-report-brief.md); the
[JVD README](../../README.md) carries the hardware table and validated scale.
