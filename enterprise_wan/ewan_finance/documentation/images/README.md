# Figure catalog — EWAN Finance & Stock Exchange

Figures extracted from the published JVD documentation for the **Enterprise
WAN for Finance & Stock Exchange** design (`jvd-ewan-finance-01-01`). The
published PDFs on juniper.net are the source of truth.

| File | Figure | Doc | Shows |
|------|--------|-----|-------|
| [`finance-network-overview.png`](finance-network-overview.png) | 1 | design guide, solution overview | Finance/stock-exchange network overview — dual market-data feeds. |
| [`securities-transaction.png`](securities-transaction.png) | 2 | design guide | Securities transaction — unicast order flow, multicast advertisement. |
| [`three-layer-architecture.png`](three-layer-architecture.png) | 3 | design guide | Three layers — WAN Edge / Access Point / Access (Customer Router). |
| [`solution-architecture.png`](solution-architecture.png) | 4 | design guide, solution overview | Architecture of the stock exchange & finance WAN. |
| [`rp-redundancy.png`](rp-redundancy.png) | 5 | design guide | Rendezvous Point (loopback / Anycast RP) in the WAN topology. |
| [`evpn-esi-multihoming.png`](evpn-esi-multihoming.png) | 6 | design guide | EVPN ESI-LAG Single-Active multihoming. |
| [`unicast-multicast-flow.png`](unicast-multicast-flow.png) | 7 | design guide | Unicast and multicast traffic flow. |
| [`l3vpn-evpn-instance.png`](l3vpn-evpn-instance.png) | 8 | design guide | L3VPN and EVPN instance — IRB steering to L3VPN. |
| [`twamp-elements.png`](twamp-elements.png) | 9 | design guide | The four elements of TWAMP. |
| [`cos-architecture.png`](cos-architecture.png) | 11 | design guide | Class of Service in the network architecture. |
| [`evpn-topology.png`](evpn-topology.png) | 12 | design guide | EVPN network topology. |
| [`ng-mvpn.png`](ng-mvpn.png) | 13 | design guide | NG-MVPN in this solution. |
| [`twamp-ap-cr.png`](twamp-ap-cr.png) | 10 | design guide | TWAMP server and clients on the access side. |
| [`validation-topology.png`](validation-topology.png) | 14 | design guide | Network topology used for validation. |
| [`network-convergence.png`](network-convergence.png) | 15 | design guide | Network convergence in the finance and stock WAN. |
| [`test-topology.png`](test-topology.png) | 1 | test report brief | Test topology — static RP with WanEdge1/WanEdge2 as RPs. |
