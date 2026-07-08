# Documentation images

Figures used by the Metro as a Service documentation, extracted from the
published JVD PDFs (design guide, test report brief, solution overview) and
referenced from the markdown as `images/<file>`.

| File | Figure | Used by |
| --- | --- | --- |
| `maas-reference-architecture.jpg` | Full reference architecture — dual-AS SR-MPLS metro (fabric + multi-ring), multi-instance IS-IS, Flex-Algo/color transport, all services under test | design-guide.md, solution-overview.md, test-report-brief.md |
| `maas-featured-devices.png` | Featured devices — Metro Fabric + Metro Multi-Ring topology with device roles and platform legend | design-guide.md, test-report-brief.md |
| `maas-services-under-test.png` | Master services-under-test overlay across the topology | design-guide.md |
| `maas-eline-services.png` | E-Line services under test (EVPN-VPWS, EVPN-FXC, L2VPN, L2Circuit, Floating PW) | design-guide.md |
| `maas-elan-services.png` | E-LAN services under test (EVPN-ELAN VLAN-based / VLAN-bundle / EP-LAN, EVPN Type-5, BGP-VPLS) | design-guide.md |
| `maas-etree-service.png` | Multihomed EVPN-ETREE topology (dual root MSE1/MSE2, leaves MA3/MA4/MA5) | design-guide.md |
| `maas-access-eline-ovc.png` | Access E-Line OVC — S-TAG push/pop across INNI/ENNI (MA5↔MA3) | design-guide.md |
| `mef-carrier-ethernet-service.png` | MEF end-to-end Carrier Ethernet service model (UNI/ENNI, Service OAM, bandwidth profile) | design-guide.md |
| `maas-test-application.png` | Iometrix testing application (User / Cloud / Network-or-Lab domains, virtual test probes) | design-guide.md, test-report-brief.md |

The JVD landing page also carries a topology diagram at
[`../../images/Metro-MEF-Topology.png`](../../images/Metro-MEF-Topology.png).
