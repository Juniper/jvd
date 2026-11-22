# 5-Stage EVPN-VXLAN Data Center BYOAI — Full Query Menu

The always-current catalog of generation asks for the 5-Stage EVPN-VXLAN Data Center JVD. Replace `N` with any count (e.g. `Generate 2 …`). Every service renders on the devices it is validated on, in the `minimum` form.

## Services — EVPN-VXLAN MAC-VRFs

- `Generate N EVPN-VXLAN MAC-VRF with 51 VLANs and IGMP snooping on compute-leaf1 and compute-leaf2` — validated on compute-leaf1 and compute-leaf2
- `Generate N EVPN-VXLAN MAC-VRF with 51 VLANs, IGMP snooping and OISM on storage-leaf1 and storage-leaf2` — validated on storage-leaf1, storage-leaf2, services-leaf1 and services-leaf2

## Services — EVPN Type 5 VRFs

- `Generate N EVPN Type 5 VRF with ten IRB units on storage-leaf1 and storage-leaf2` — validated on storage-leaf1 and storage-leaf2
- `Generate N EVPN Type 5 VRF with ten IRB units and DHCP relay on compute-leaf1 and compute-leaf2` — validated on compute-leaf1 and compute-leaf2
- `Generate N EVPN Type 5 VRF with twenty IRB units and DHCP relay on compute-leaf1 and compute-leaf2` — validated on compute-leaf1, compute-leaf2, storage-leaf1 and storage-leaf2
- `Generate N EVPN Type 5 VRF with OSPF, PIM and OISM on compute-leaf1 and compute-leaf2` — validated on compute-leaf1, compute-leaf2, storage-leaf1 and storage-leaf2
- `Generate N Border EVPN Type 5 VRF with eBGP to the external gateway on services-leaf1 and services-leaf2` — validated on services-leaf1 and services-leaf2
- `Generate N Border EVPN Type 5 VRF with eBGP and ten IRB units on services-leaf1 and services-leaf2` — validated on services-leaf1 and services-leaf2
- `Generate N Border EVPN Type 5 VRF with eBGP and DHCP relay on services-leaf1 and services-leaf2` — validated on services-leaf1 and services-leaf2
- `Generate N Border EVPN Type 5 VRF with eBGP, twenty IRB units and DHCP relay on services-leaf1 and services-leaf2` — validated on services-leaf1 and services-leaf2
- `Generate N Border EVPN Type 5 VRF with eBGP, OSPF, PIM and OISM on services-leaf1 and services-leaf2` — validated on services-leaf1 and services-leaf2

## Audit / explain

- `Which snippets are validated on storage-leaf1?`
- `What does a Type 5 VRF need on compute-leaf1?`
- `Explain the 5-stage underlay and overlay (super spines, POD spines, leaves) and the tier communities`
- `Explain OISM with the supplemental bridge domain in this fabric`
- `Explain the RoCEv2 class of service (PFC and ECN) on the leaves`
- `What does this library not cover?`

---

Don't see what you need? Describe it and the assistant will tell you whether the 5-Stage EVPN-VXLAN Data Center JVD covers it.
