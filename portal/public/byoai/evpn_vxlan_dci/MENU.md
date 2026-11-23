# EVPN-VXLAN Data Center Interconnect BYOAI — Full Query Menu

The always-current catalog of generation asks for the EVPN-VXLAN Data Center Interconnect JVD. Replace `N` with any count (e.g. `Generate 2 …`). Every service renders on the devices it is validated on, in the `minimum` form; the scenario is in parentheses.

## Services — EVPN-VXLAN MAC-VRFs

- `Generate N EVPN-VXLAN MAC-VRF with 10 VLANs on dc4_storage-leaf1 and dc4_storage-leaf2 (Type 2 + Type 5)` — validated on dc4_storage-leaf1 and dc4_storage-leaf2 (Type 2 + Type 5)
- `Generate N EVPN-VXLAN MAC-VRF with 20 VLANs on dc1_leaf2 and dc1_leaf3 (Type 2)` — validated on dc1_leaf2 and dc1_leaf3 (Type 2)
- `Generate N EVPN-VXLAN MAC-VRF with 30 VLANs on dc1_leaf1 (Type 2)` — validated on dc1_leaf1 (Type 2)
- `Generate N EVPN-VXLAN MAC-VRF with 40 VLANs on dc1_esi-leaf1 and dc1_esi-leaf2 (OTT)` — validated on dc1_esi-leaf1, dc1_esi-leaf2, dc1_server-leaf1, dc2_esi-leaf1, dc2_esi-leaf2 and dc2_server-leaf1 (OTT); dc1_leaf2, dc1_leaf3, dc4_compute-leaf1 and dc4_compute-leaf2 (Type 2 + Type 5)
- `Generate N EVPN-VXLAN MAC-VRF with 50 VLANs on dc1_leaf1 (Type 2 + Type 5)` — validated on dc1_leaf1 (Type 2 + Type 5)
- `Generate N EVPN-VXLAN MAC-VRF with 20 VLANs and an EVPN interconnect with VNI translation on dc1_borderleaf1 and dc1_borderleaf2 (Type 2)` — validated on dc1_borderleaf1, dc1_borderleaf2, dc3_leaf1 and dc3_leaf2 (Type 2)
- `Generate N EVPN-VXLAN MAC-VRF with 50 VLANs and an EVPN interconnect with VNI translation on dc1_borderleaf1 and dc1_borderleaf2 (Type 2 + Type 5)` — validated on dc1_borderleaf1, dc1_borderleaf2, dc4_services-leaf1 and dc4_services-leaf2 (Type 2 + Type 5)

## Services — EVPN Type 5 VRFs

- `Generate N EVPN Type 5 VRF with ten IRB units and a loopback unit on dc1_leaf1 (Type 2)` — validated on dc1_leaf1 (Type 2); dc1_leaf1, dc4_storage-leaf1 and dc4_storage-leaf2 (Type 2 + Type 5)
- `Generate N EVPN Type 5 VRF with DHCP relay, twenty IRB units and a loopback unit (blue tenant) on dc1_esi-leaf1 and dc1_esi-leaf2 (OTT)` — validated on dc1_esi-leaf1, dc1_esi-leaf2 and dc1_server-leaf1 (OTT); dc1_leaf1, dc1_leaf2, dc1_leaf3, dc4_compute-leaf1 and dc4_compute-leaf2 (Type 2 + Type 5)
- `Generate N EVPN Type 5 VRF with DHCP relay, twenty IRB units and a loopback unit (red tenant) on dc1_esi-leaf1 and dc1_esi-leaf2 (OTT)` — validated on dc1_esi-leaf1, dc1_esi-leaf2 and dc1_server-leaf1 (OTT); dc1_leaf1, dc1_leaf2, dc1_leaf3, dc4_compute-leaf1 and dc4_compute-leaf2 (Type 2 + Type 5)
- `Generate N EVPN Type 5 VRF with DHCP relay (loopback as relay source), ten IRB units and a loopback unit (blue tenant) on dc1_leaf1 and dc1_leaf2 (Type 2)` — validated on dc1_leaf1, dc1_leaf2 and dc1_leaf3 (Type 2)
- `Generate N EVPN Type 5 VRF with DHCP relay (loopback as relay source), ten IRB units and a loopback unit (red tenant) on dc1_leaf1 and dc1_leaf2 (Type 2)` — validated on dc1_leaf1, dc1_leaf2 and dc1_leaf3 (Type 2)
- `Generate N EVPN Type 5 VRF with DHCP relay (loopback as relay source), twenty IRB units and a loopback unit (blue tenant) on dc2_esi-leaf1 and dc2_esi-leaf2 (OTT)` — validated on dc2_esi-leaf1, dc2_esi-leaf2 and dc2_server-leaf1 (OTT)
- `Generate N EVPN Type 5 VRF with DHCP relay (loopback as relay source), twenty IRB units and a loopback unit (red tenant) on dc2_esi-leaf1 and dc2_esi-leaf2 (OTT)` — validated on dc2_esi-leaf1, dc2_esi-leaf2 and dc2_server-leaf1 (OTT)
- `Generate N EVPN Type 5 VRF with an EVPN interconnect toward the remote data center, ten IRB units and a loopback unit on dc1_borderleaf1 and dc1_borderleaf2 (Type 2 + Type 5)` — validated on dc1_borderleaf1, dc1_borderleaf2, dc4_services-leaf1 and dc4_services-leaf2 (Type 2 + Type 5)
- `Generate N Border EVPN Type 5 VRF with eBGP (IPv4 and IPv6) to the external router, DHCP relay and a loopback unit (blue tenant) on dc1_borderleaf1 and dc1_borderleaf2 (OTT)` — validated on dc1_borderleaf1, dc1_borderleaf2, dc2_borderleaf1 and dc2_borderleaf2 (OTT)
- `Generate N Border EVPN Type 5 VRF with eBGP (IPv4 and IPv6) to the external router, DHCP relay (loopback as relay source), ten IRB units and a loopback unit (blue tenant) on dc1_borderleaf1 and dc1_borderleaf2 (Type 2)` — validated on dc1_borderleaf1 and dc1_borderleaf2 (Type 2)
- `Generate N Border EVPN Type 5 VRF with eBGP (IPv4 and IPv6) to the external router, DHCP relay (loopback as relay source), ten IRB units and a loopback unit (red tenant) on dc1_borderleaf1 and dc1_borderleaf2 (Type 2)` — validated on dc1_borderleaf1 and dc1_borderleaf2 (Type 2)
- `Generate N Border EVPN Type 5 VRF with eBGP (IPv4 and IPv6) to the external router, DHCP relay and a loopback unit (red tenant) on dc1_borderleaf1 and dc1_borderleaf2 (OTT)` — validated on dc1_borderleaf1, dc1_borderleaf2, dc2_borderleaf1 and dc2_borderleaf2 (OTT)
- `Generate N Border EVPN Type 5 VRF with eBGP (IPv4) to the external router, ten IRB units and a loopback unit (blue tenant) on dc3_leaf1 and dc3_leaf2 (Type 2)` — validated on dc3_leaf1 and dc3_leaf2 (Type 2)
- `Generate N Border EVPN Type 5 VRF with eBGP (IPv4) to the external router, ten IRB units and a loopback unit (red tenant) on dc3_leaf1 and dc3_leaf2 (Type 2)` — validated on dc3_leaf1 and dc3_leaf2 (Type 2)
- `Generate N Border EVPN Type 5 VRF with eBGP (IPv4 and IPv6) to the external router, an EVPN interconnect toward the remote data center, DHCP relay, twenty IRB units and a loopback unit (blue tenant) on dc1_borderleaf1 and dc1_borderleaf2 (Type 2 + Type 5)` — validated on dc1_borderleaf1, dc1_borderleaf2, dc4_services-leaf1 and dc4_services-leaf2 (Type 2 + Type 5)
- `Generate N Border EVPN Type 5 VRF with eBGP (IPv4 and IPv6) to the external router, an EVPN interconnect toward the remote data center, DHCP relay, twenty IRB units and a loopback unit (red tenant) on dc1_borderleaf1 and dc1_borderleaf2 (Type 2 + Type 5)` — validated on dc1_borderleaf1, dc1_borderleaf2, dc4_services-leaf1 and dc4_services-leaf2 (Type 2 + Type 5)

## Audit / explain

- `Which snippets are validated on dc1_borderleaf1 in the OTT scenario?`
- `What does a Type 5 VRF with an EVPN interconnect need on dc4_services-leaf1?`
- `Compare OTT, Type 2 seamless stitching and Type 2 + Type 5 seamless stitching`
- `Explain the EVPN interconnect with VNI translation on the DCI gateways`
- `Explain MACsec on the DCI links between the gateways`
- `What does this library not cover?`

---

Don't see what you need? Describe it and the assistant will tell you whether the EVPN-VXLAN Data Center Interconnect JVD covers it.
