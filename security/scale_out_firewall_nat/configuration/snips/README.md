# Configuration Snippets (snips)

This `snips/` directory contains **focused, copy-pasteable configuration excerpts**
extracted from the full validated device configurations in ../conf/. Each file
isolates a single CSDS ScaleOut SFW/NAT building block (the TLB load balancer,
a source-NAT pool, MNHA, security zones/policies, a scale-out BGP plane, …) so it
can be referenced, shared, or adapted without wading through a multi-hundred-line
device config.

## Topology

![CSDS ScaleOut topology](../../images/CSDS-general.png)

MX Series routers act as **stateless load balancers** (ECMP consistent-hash or
RE-based TLB in Direct Server Return mode) distributing traffic across a scaled-out
farm of SRX4600 Stateful-Firewall / CGNAT gateways in MNHA pairs. See
../../documentation/ for the full design corpus (Enterprise SFW+Source-NAT and
Service-Provider CGNAT variants).

## Layout

```
snips/
  junos/        ← Junos OS examples (MX304 + SRX4600 — the whole JVD is Junos)
```

This JVD deploys only Junos devices, so there is no `evo/` tree. Categories:

| Sub-folder | What's in it |
|---|---|
| `nat/` | SRX source-NAT — NAPT44 into an RFC6598 100.64/10 pool (address-pooling paired), NAT64 source/destination stanzas, and the MX route-filter-list that advertises the pools |
| `load-balancing/` | RE-based Traffic Load Balancer (TLB, Direct Server Return) + network-monitoring health-check profiles |
| `high-availability/` | SRX Multinode High Availability (MNHA): chassis SRG0 with BFD monitor + install-on-failure route, and the active/backup as-path-prepend signalling policies |
| `security/` | SRX security zones and stateful-firewall policies (SFW44/SFW66/NAT64/SNAT) + address-book |
| `transport/` | Scale-out BGP planes (MX VRFs, SRX VR-1 per-plane eBGP, MNHA-VR ICL), TLB forwarding instances, symmetric enhanced-hash-key, and the gateway-emulator peering |
| `firewall/` | Filter-based forwarding steering SFW/NAT traffic into the TLB forwarding instances (v4 + v6) |
| `interfaces/` | AE per-plane sub-units (v4 + v6), the MX north-side flexible-service AC, TLB health-check / MNHA loopbacks |
| `bootstrap/` | SRX management services (netconf/ssh + web-management on the TLB health-check port) |

## Header schema

Every snip opens with a fixed 5-section header:

```
/*
 * Topic:   <one-line description>
 * Seen on:
 *   Junos: <device basenames>
 * Highlights:  <non-obvious knobs / interactions>
 * Pair with:   <same-device dependencies — junos/<cat>/<name>.conf>
 * JVD peer devices (observed interop):  <cross-device interop>
 * Variables:   <$VAR  e.g. value>
 */
<templated body>
```

## Variables

Identifiers that vary between deployments are templated as `$VAR`. See
[_variables.md](_variables.md) for the full glossary and the render command.
These validated lab configs contain **no secret material**, so there are no
secret placeholders to supply.

## Device roles

| Device (basename) | Role |
|---|---|
| `mx1_mx304` | MX304 stateless load balancer / Traffic Orchestrator (RE-based TLB) |
| `srx1a` / `srx1b` (`srx4600`) | SRX4600 SFW/CGNAT gateways — MNHA pair 1 (NAPT pool 100.64.1.0/24) |
| `srx2a` / `srx2b` (`srx4600`) | SRX4600 SFW/CGNAT gateways — MNHA pair 2 (NAPT pool 100.64.3.0/24) |
| `gateway_emulator_mx304` | North-side gateway/route emulator (test harness — client/server + default origination) |

## Note on NAT64

The lab configs carry NAT64 (v6→v4) source and destination NAT stanzas, so they are
templated here under `nat/srx-nat64.conf` for fidelity. The published design guides
scope NAT64 as a **non-goal** — NAPT44 (source-NAT into 100.64/10) is the tested and
validated feature.
