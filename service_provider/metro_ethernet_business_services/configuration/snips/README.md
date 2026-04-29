# Configuration Snippets (snips)

This `snips/` directory contains **focused, copy-pasteable configuration excerpts** extracted from the full validated device configurations in [`../conf/`](../conf/) and [`../set/`](../set/). Each file isolates a single concept (a service overlay, a routing protocol, a CoS profile, etc.) so it can be referenced, shared, or adapted without wading through a multi-thousand-line device config.

## Topology

![Metro EBS Topology](../../images/metro-ebs-topology.png)

> Refer to the topology when reading any snippet — the **role** in each filename (e.g., `an1`, `ag1-1`, `cr1`, `ma3`, `mse1`) maps directly to a device shown above.

## Naming Convention

```
<topic>__<role>-<platform>.conf
```

- **`<topic>`** — what the snippet does (e.g., `evpn-vpws`, `isis-srmpls-tilfa`, `schedulers`).
- **`<role>`** — the device role from the topology (`an1`, `ag1-1`, `cr1`, `mse1`, `ma3`, etc.).
- **`<platform>`** — the Junos hardware platform (e.g., `mx204`, `acx7100-32c`, `ptx10001-36mr`).

The double underscore (`__`) separates the topic from its source so you can quickly grep or sort:

```
ls services/evpn-vpws*    # all EVPN-VPWS variants across platforms
ls services/*__an1-mx204* # all snippets sourced from AN1
```

When the same pattern is implemented differently across platforms, multiple variants live side-by-side (e.g., MX vs ACX EVPN multihoming knobs).

## Folder Layout

| Folder | What's in it |
|---|---|
| `apply-groups/` | Reusable templated config blocks (`GR-EDGE-INTF`, `GR-CORE-INTF`, `GR-ISIS-BCP`, etc.) applied via `apply-groups`. The foundation for keeping per-device configs DRY. |
| `transport/` | Underlay: ISIS with SR-MPLS and TI-LFA, MPLS/segment-routing, BGP overlay sessions (inet-vpn, l2vpn, evpn, inet6-vpn). |
| `services/` | MEF service overlays: EVPN-VPWS, EVPN-ELAN (mac-vrf), EVPN-FXC, EVPN-ETREE, floating pseudowires with Anycast-SID, BGP-VPLS, L2VPN, L2Circuit, L3VPN. |
| `cos/` | Class-of-service: forwarding-classes, schedulers, scheduler-maps, classifiers, rewrite-rules. |
| `policy/` | Routing policies and communities — route-targets per service, BGP-CT color-aware policies. |
| `firewall/` | Filters and policers (rate-limiting and marking templates). |
| `interfaces/` | Representative interface patterns: edge flexible-vlan with bridge family, LAG with ESI for active/active multihoming, core-facing ISIS+MPLS interface. |

## Current Snippets

Extracted from [`../conf/an1_mx204.conf`](../conf/an1_mx204.conf):

| File | What it shows |
|---|---|
| `apply-groups/gr-edge-intf__an1-mx204.conf` | Customer-facing interface baseline (MTU, flex-vlan, optics alarms) |
| `apply-groups/gr-edge-intf-mh__an1-mx204.conf` | Multi-homed edge variant (no hold-time) |
| `apply-groups/gr-core-intf__an1-mx204.conf` | Core-facing baseline (jumbo MTU, mpls max-labels 14) |
| `apply-groups/gr-isis-bcp__an1-mx204.conf` | ISIS best-current-practice timers |
| `apply-groups/gr-bgp-bcp__an1-mx204.conf` | BGP best-current-practice timers |
| `transport/isis-srmpls-tilfa__an1-mx204.conf` | ISIS underlay with SR-MPLS, TI-LFA, Flex-Algo |
| `transport/mpls-segment-routing__an1-mx204.conf` | SRGB, admin-groups, ipv6-tunneling |
| `transport/bgp-overlay__an1-mx204.conf` | iBGP to RR with all overlay AFs (inet/inet6 LU, inet-vpn, inet6-vpn, l2vpn, evpn, route-target) |
| `services/evpn-vpws__an1-mx204.conf` | MEF E-Line via EVPN-VPWS routing-instance |
| `services/evpn-elan-mac-vrf__an1-mx204.conf` | MEF E-LAN via EVPN mac-vrf routing-instance |
| `cos/forwarding-classes__an1-mx204.conf` | 6-class queue model |
| `cos/schedulers__an1-mx204.conf` | Schedulers + scheduler-map for the 6-class model |
| `firewall/policers__an1-mx204.conf` | 5/50 Mbps rate-limit policers and family-any filter |
| `interfaces/lag-esi-multihoming__an1-mx204.conf` | Edge LAG with per-unit ESI (VPWS + ELAN attachment-circuits) |
| `interfaces/core-isis-mpls__an1-mx204.conf` | Core-facing LAG carrying inet/iso/inet6/mpls |

## Scope

Snippets are **excerpts**, not standalone configs. They:

- Preserve their original Junos hierarchy (e.g., a `services/evpn-vpws__an1-mx204.conf` snippet contains the `routing-instances { … }` wrapper so it's syntactically valid in context).
- Are **not** edited or generalized — they are real, validated config from the full device files. This guarantees the patterns shown here actually work in the validated topology.
- Are **not exhaustive** — only the most pedagogically valuable patterns are extracted. The full configurations remain in [`../conf/`](../conf/) and [`../set/`](../set/) for complete reference.

## Pairing with Documentation

The patterns shown here are described and validated in the [Metro EBS JVD](https://www.juniper.net/documentation/us/en/software/jvd/jvd-metro-ebs-03-01/index.html) and its [Solution Overview PDF](https://www.juniper.net/documentation/us/en/software/jvd/sol-overview-metro-ebs-03-01.pdf).
