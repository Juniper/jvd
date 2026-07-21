# Collapsed Data Center Fabric BYOAI — Full Query Menu

The always-current catalog of generation asks for the **Collapsed Data Center Fabric** JVD — a two-switch EVPN-VXLAN collapsed-spine fabric (no separate spine tier) built with Juniper Apstra for small data centers. All items render on the chosen device(s) with the chosen form tier (`minimum` / `as-deployed`).

## Fabric transport (direct leaf-to-leaf)

- `Generate the direct leaf-to-leaf underlay for <leaf>` — eBGP underlay between the two collapsed switches (l3clos-l)
- `Generate the direct EVPN overlay for <leaf>` — eBGP EVPN overlay over loopbacks (l3clos-l-evpn)

## Services (L2 / L3)

- `Generate a VLAN-aware MAC-VRF` — evpn-1, 1 VNI per VLAN, per-VNI route targets
- `Add a VLAN with an anycast IRB gateway` — MAC-VRF VNI + anycast IRB (identical mac + address on both switches)

## Access / multihoming

- `Add an ESI-LAG to <leaf-pair>` — all-active multihomed access (AE + ESI + LACP, matched on both switches)

## Interfaces

- `Generate the loopback for <leaf>` — lo0 router-id / VTEP / per-VRF loopbacks

## Greenfield / turn-up

- `Build a full collapsed two-switch turn-up` — direct underlay + overlay + loopback + MAC-VRF + anycast IRB + ESI-LAG

## Audit / explain

- `Explain the collapsed-spine architecture (why no spine tier)`
- `Explain direct leaf-to-leaf eBGP underlay + EVPN overlay`
- `Explain the VLAN-aware MAC-VRF and anycast IRB gateway model`
- `Explain ESI-LAG all-active multihoming across two collapsed switches`
- `When should I use collapsed vs 3-stage?`

---

Don't see what you need? Describe it and the assistant will tell you whether the Collapsed Data Center Fabric JVD covers it (and point you to the Access-Switches JVDE or 3-stage DC JVD for scale-out).
