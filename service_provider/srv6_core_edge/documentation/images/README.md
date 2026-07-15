# Figure catalog — SP Core & Edge SRv6

Figures extracted from the published JVD documentation for the **SP Core and Edge
SRv6** design (`jvd-sp-core-edge-srv6-01-01`). Referenced from
[`../design-guide.md`](../design-guide.md). The published PDFs on juniper.net are
the source of truth.

| File | Figure | Shows |
|------|--------|-------|
| [`srv6-solution-architecture.png`](srv6-solution-architecture.png) | Fig 1 | High-level SRv6 solution architecture — service-provider core/edge with SRv6 µSID transport. |
| [`srv6-topology.png`](srv6-topology.png) | Fig 2 | Physical/logical topology — EDGE / CR / BR / MSE / CPE roles, two ASes and IS-IS areas, inter-AS boundary. |
| [`srv6-addressing-scheme.png`](srv6-addressing-scheme.png) | Fig 3 | SRv6 addressing / locator scheme (5f00::/16, per-Flex-Algo locators, structured loopbacks). |
| [`srv6-bgp-design.png`](srv6-bgp-design.png) | Fig 4 | BGP design — iBGP with CR route reflectors, multi-AFI SRv6 services, inter-AS Option C. |
| [`srv6-services.png`](srv6-services.png) | Fig 5 | Service overlay — GRT, L3VPN (µDT4/µDT6/µDT46), EVPN E-Line / VPWS (µDX2). |
| [`vrf-with-irb.png`](vrf-with-irb.png) | Fig 6 | L3VPN PE-CE attachment via IRB gateway. |
