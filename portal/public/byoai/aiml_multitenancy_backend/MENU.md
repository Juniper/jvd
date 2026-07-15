# AI/ML Multi-Tenancy Backend BYOAI — Full Query Menu

The always-current catalog of generation asks for the **AI/ML Multi-Tenancy Backend (EVPN-VXLAN GPU fabric)** JVD — a Junos Evolved pure-L3 eBGP Clos (4× QFX5240-64OD spines, 4× QFX5240-64OD leaves) tuned for AI/RoCE workloads. Replace `N` with any count (e.g. `Generate 3 …`). All renders on the chosen device(s) with the chosen form tier (`minimum` / `with-overlay` / `as-deployed`).

## Services — per-tenant L3 (EVPN Type-5)

- `Generate N per-tenant VRFs` — `evpn-vrf-ip-prefix-routes` routing-instance, EVPN Type-5, anycast IRB gateway, GPU-server AC sub-ports (leaves)
- `Add tenant-N to <leaf>` — one more per-tenant VRF (fresh VNI / lo0 unit / IRB unit triplet)

## AI-fabric / performance

- `Add RoCEv2 lossless CoS to <device>` — DSCP classifier, PFC, ECN, lossless buffers, schedulers
- `Add the buffer-monitor telemetry to <device>` — FPC traffic-manager buffer visibility
- `Add ECMP DLB flowlet load-balancing to <device>` — dynamic load-balancing for AI fabric spreading
- `Add a 400G fabric breakout link to <device>` — 2× sub-port /31 P2P
- `Add a GPU-server tenant link to <leaf>` — 400G AC sub-port + IPv6 RA

## Add a feature to a device

- `Add LLDP to <device>`
- `Add L2-learning telemetry to <leaf>` — remote-MAC visibility via gRPC
- `Add the gRPC / telemetry base to <device>` — netconf/SSH + gRPC extension-service + cert
- `Add the Clos loop-prevention policy to <device>`

## Greenfield / turn-up

- `Build a new QFX5240-64OD leaf turn-up` — full as-deployed fabric baseline + a per-tenant VRF
- `Bootstrap a new QFX5240-64OD spine end-to-end` — chassis + underlay + EVPN overlay + policies (pure L3)

## Transport / underlay

- `Generate the eBGP fabric underlay for <device>` — leaf↔spine /31 peering, multipath, BFD
- `Generate the eBGP EVPN overlay for <device>` — loopback-to-loopback, multihop
- `Generate the routing-options ECMP-FRR block for <device>`
- `Generate the fabric loop-prevention + community policies for <device>`

## Audit / explain

- `Explain the AI/ML multi-tenancy EVPN-VXLAN design`
- `Explain the RoCEv2 lossless CoS (PFC + ECN) model`
- `Explain the ECMP DLB flowlet load-balancing for AI fabrics`
- `Explain the pure-L3 eBGP Clos underlay + EVPN overlay two-AS-tier model`
- `Explain the per-tenant VRF (EVPN Type-5) tenancy model`

---

Don't see what you need? Describe it and the assistant will tell you whether the AI/ML Multi-Tenancy Backend JVD covers it.
