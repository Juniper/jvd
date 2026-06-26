# Metro Ethernet Business Services – Juniper Validated Design (JVD)

> Production-ready Cloud Metro architecture with MEF 3.0 EVPN, VPLS, L2VPN, and L3VPN services across a scalable Metro Fabric and multi-ring core.

The Metro Ethernet Business Services (Metro EBS) JVD defines a production-ready Cloud Metro architecture composed of a scalable Metro Fabric for access and aggregation, seamlessly integrated with a resilient multi-ring core. This validated design enables x-to-anything connectivity across MEF 3.0-compliant EVPN, VPLS, L2VPN, and L3VPN services. Leveraging Juniper ACX, MX, and PTX Series platforms, the solution supports interdomain color-aware transport, TI-LFA-based resiliency, and intent-based traffic steering for high-performance, future-ready metro deployments.

---

## 🧱 Solution Highlights

- **Metro Fabric + Multi-Ring Core**: Separation of access/aggregation and core domains with seamless interworking
- **Segment Routing (SR-MPLS)** transport with TI-LFA for sub-50ms convergence
- **MEF-compliant service overlays**, including:
  - **EVPN-VPWS**, **EVPN-FXC**, **EVPN-ELAN**, **EVPN-ETREE**
  - **Floating Pseudowires** with Anycast-SID and vESI for active-active L2 resiliency
  - **BGP-VPLS**, **L2VPN**, **L2Circuit**, **L3VPN**, and **EVPN ELAN Type 5**
- **End-to-end resiliency** with active/standby and active/active redundancy
- **Transport Classes** and **BGP Classful Transport (BGP-CT)** for traffic steering
- Validated on platforms including **ACX7024, ACX7100-32C, ACX7100-48L, ACX5448, ACX710, MX204, MX304, PTX10001-36Mr**

---

## 🧪 Test Coverage & Validation

The JVD includes over 1,400 tests across 20+ scenarios, validating:

- Control plane convergence and data plane resiliency
- EVPN service provisioning and interoperability
- TI-LFA fast reroute, BFD, and multipath traffic engineering
- L2/L3 service failover and scaling benchmarks
- Standards compliance with MEF 3.0 service definitions

---

## 📄 Documentation

- **JVD Document:**  
  [Metro EBS JVD](https://www.juniper.net/documentation/us/en/software/jvd/jvd-metro-ebs-03-01/index.html)

- **Solution Overview:**  
  [PDF Overview](https://www.juniper.net/documentation/us/en/software/jvd/sol-overview-metro-ebs-03-01.pdf)

- **Test Report Brief:**  
  [PDF Test Brief](https://www.juniper.net/documentation/us/en/software/jvd/test-report-brief-metro-ebs-03-01.pdf)

- **🎥 YouTube Overview:**  
  [Watch the video](https://www.youtube.com/watch?v=dh3qvZMIhXA)

---

## 📦 Extended Design: Metro as a Service (MaaS)

This solution is extended by the [Metro as a Service (MaaS) JVD](https://www.juniper.net/documentation/us/en/software/jvd/jvd-metro-ebs-mef-03-02/index.html), which builds upon Metro EBS by introducing a richer services portfolio and full end-to-end MEF 3.0 conformance over a Cloud Metro architecture.

- **MaaS Solution Overview:**  
  [PDF Overview](https://www.juniper.net/documentation/us/en/software/jvd/solution-overview-metro-ebs-mef-03-02.pdf)

- **Test Report Brief:**  
  [PDF Test Brief](https://www.juniper.net/documentation/us/en/software/jvd/test-report-brief-metro-ebs-mef-03-02.pdf)

- **GitHub Configurations:**  
  [Metro as a Service](../metro_as_a_service/)

---

## Validated Hardware

| Juniper Product | Role | Config |
|---|---|---|
| **PTX10001-36MR** | Core Router | [`cr1_ptx10001-36mr.conf`](configuration/conf/cr1_ptx10001-36mr.conf), [`cr2_ptx10001-36mr.conf`](configuration/conf/cr2_ptx10001-36mr.conf) |
| **ACX7509** | Metro Domain Router | [`mdr1_acx7509.conf`](configuration/conf/mdr1_acx7509.conf) |
| **MX10003** | Metro Domain Router | [`mdr2_mx10003.conf`](configuration/conf/mdr2_mx10003.conf) |
| **ACX7100-32C** | Metro Edge Gateway | [`meg1_acx7100-32c.conf`](configuration/conf/meg1_acx7100-32c.conf), [`meg2_acx7509.conf`](configuration/conf/meg2_acx7509.conf) |
| **MX304** | Metro SE | [`mse1_mx304.conf`](configuration/conf/mse1_mx304.conf), [`mse2_mx304.conf`](configuration/conf/mse2_mx304.conf) |
| **MX204** | Metro Aggregation / Access Node | [`ma2_mx204.conf`](configuration/conf/ma2_mx204.conf), [`ma4_mx204.conf`](configuration/conf/ma4_mx204.conf), [`ma5_mx204.conf`](configuration/conf/ma5_mx204.conf), [`an1_mx204.conf`](configuration/conf/an1_mx204.conf) |
| **ACX7024** | Metro Aggregation | [`ma1-1_acx7024.conf`](configuration/conf/ma1-1_acx7024.conf), [`ma1-2_acx7024.conf`](configuration/conf/ma1-2_acx7024.conf) |
| **ACX7100-48L** | Metro Aggregation / Access Node | [`ma3_acx7100-48l.conf`](configuration/conf/ma3_acx7100-48l.conf), [`an3_acx7100-48l.conf`](configuration/conf/an3_acx7100-48l.conf) |
| **ACX5448** | Access Node | [`an2_acx5448.conf`](configuration/conf/an2_acx5448.conf) |
| **ACX710** | Access Node | [`an4_acx710.conf`](configuration/conf/an4_acx710.conf) |
| **ACX7100-32C** | Aggregation Gateway | [`ag1-1_acx7100-32c.conf`](configuration/conf/ag1-1_acx7100-32c.conf), [`ag1-2_acx7100-32c.conf`](configuration/conf/ag1-2_acx7100-32c.conf) |

---

![Metro EBS Topology](images/metro-ebs-topology.png)
