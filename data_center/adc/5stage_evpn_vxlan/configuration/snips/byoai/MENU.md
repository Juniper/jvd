# 5-Stage EVPN-VXLAN Data Center BYOAI — Full Query Menu

The always-current catalog of generation asks for the **5-Stage EVPN-VXLAN Data Center** JVD — a web-scale ERB fabric with lean super spines above Compute, Storage, and Services PODs, built with Juniper Apstra. This library focuses on the 5-stage-distinctive config; for the per-POD 3-stage fabric baseline see the [3-stage DC JVD](../../../../3stage_dc/). All items render on the chosen device(s) with the chosen form tier (`minimum` / `as-deployed`).

## Lean super-spine transport

- `Generate the super-spine underlay for <superspine>` — lean eBGP to POD spines (IPv6, BFD)
- `Generate the super-spine EVPN overlay relay for <superspine>` — relay EVPN routes between PODs (multihop, no-nexthop-change)

## OISM multicast

- `Generate enhanced OISM for a server leaf <leaf>` — per-VRF SBD + PIM accept-remote-source + OSPF, plus the fabric-wide enhanced-oism enable
- `Generate the OISM PIM-EVPN gateway for a border leaf <services-leaf>` — external multicast via Classic L3 (pim-evpn-gateway, static RP, distributed-DR)
- `Add the QFX5130 OISM PFE conservation to <leaf>` — conserve-mcast-routes-in-pfe
- `Enable enhanced OISM on <leaf>` — forwarding-options multicast-replication evpn irb enhanced-oism

## RoCEv2 congestion management

- `Generate the RoCEv2 DCQCN drop-profiles for <leaf>` — ECN WRED dp0/dp1 (retune per fabric)

## Greenfield / turn-up

- `Build the full OISM config for a services border leaf` — enable + PIM-EVPN gateway + PFE conserve
- `Build the lean super-spine transport (underlay + overlay relay)`

## Audit / explain

- `Which snips are EVO-only vs Junos-only?`
- `Explain lean super spines and how EVPN routes relay between PODs`
- `Explain enhanced OISM (BDNE) and the Supplemental Bridge Domain`
- `Explain the border-leaf PIM-EVPN gateway (external multicast)`
- `Explain RoCEv2 DCQCN — PFC vs ECN`

---

Don't see what you need? Describe it and the assistant will tell you whether the 5-Stage JVD covers it (and point you to the 3-stage DC JVD for POD-fabric baseline config).
