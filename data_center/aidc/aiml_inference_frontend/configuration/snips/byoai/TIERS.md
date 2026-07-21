# Configuration Form Tiers

This file is part of the [BYOAI](README.md) corpus. It tells the AI which snippet files to include for the service at each verbosity tier. It is bundled into [`jvd-aiml-inf-snips.md`](jvd-aiml-inf-snips.md) by `regenerate-bundle.sh`.

For the chosen tier, the AI includes ONLY the snips listed — and ONLY those — unless the user explicitly asks for more. This JVD is **Junos Evolved (EVO) only** — every file is under `evo/`. All snips carry a `Variant: Evolved-OS (EVO)` tag; five carry both a LEAF and a SPINE variant (pick the one matching the target role).

The "service" delivered by this frontend fabric is the **frontend cluster VLAN** (one L2 domain per leaf with an L3 IRB gateway, into which inference clients / Envoy hosts / GPU servers attach). Underlay transport and fabric policy are shared baseline.

---

## Shared fabric baseline (referenced by `as-deployed`)

Underlay + fabric policy + telemetry, common to every device:

- `evo/transport/bgp-ebgp-fabric-underlay.conf` *(LEAF or SPINE variant)*
- `evo/transport/routing-options-ecmp-frr.conf`
- `evo/interfaces/fabric-p2p-links.conf` *(LEAF breakout or SPINE direct variant)*
- `evo/interfaces/loopback.conf`
- `evo/policy/community-definitions.conf`
- `evo/policy/allpodnetworks-direct-redistribution.conf` *(LEAF or SPINE variant)*
- `evo/policy/clos-loop-prevention.conf` *(LEAF or SPINE variant)*
- `evo/policy/pfe-load-balance.conf`
- `evo/bootstrap/system-grpc-apstra.conf`
- `evo/bootstrap/security-grpc-cert.conf`
- `evo/oam/lldp-interface-all.conf`
- `evo/oam/rstp-fabric.conf` *(LEAF or SPINE variant)*
- `evo/oam/l2-learning-telemetry.conf` *(leaf-only)*

---

## Service — frontend cluster VLAN (leaf-side)

The user-facing "service": attach an inference client / Envoy host / GPU server
to a cluster VLAN with an L3 gateway on a leaf.

### `minimum`
Just the leaf-side access + VLAN + gateway. Assumes a working eBGP fabric
(underlay + policies) is already present. Best for brownfield adds.

- `evo/services/frontend-cluster-vlan.conf`
- `evo/interfaces/irb-cluster-gateway.conf`
- `evo/interfaces/server-access-trunk.conf`

### `with-transport`
`minimum` + the eBGP fabric underlay so the leaf actually reaches the fabric.
Best when you're not sure the underlay is present on this leaf.

- everything in `minimum`, plus:
- `evo/transport/bgp-ebgp-fabric-underlay.conf` *(LEAF variant)*
- `evo/transport/routing-options-ecmp-frr.conf`
- `evo/interfaces/fabric-p2p-links.conf` *(LEAF variant)*
- `evo/interfaces/loopback.conf`
- `evo/policy/community-definitions.conf`
- `evo/policy/allpodnetworks-direct-redistribution.conf` *(LEAF variant)*
- `evo/policy/clos-loop-prevention.conf` *(LEAF variant)*
- `evo/policy/pfe-load-balance.conf`

### `as-deployed`
Full JVD fabric baseline: the service + the entire **shared fabric baseline**
above (underlay + policies + bootstrap + OAM). Best for a greenfield leaf
turn-up or a complete working example.

- the service snips (`minimum`), plus the full **shared fabric baseline**.

---

## Spine turn-up

A spine carries NO service instances (pure L3). A spine `as-deployed` is the
**shared fabric baseline** with the SPINE variants selected — no VLAN, no IRB,
no access trunk, no l2-learning telemetry.

---

## Add-a-feature (single snip on demand)

- `Add LLDP` → `evo/oam/lldp-interface-all.conf`
- `Add L2-learning telemetry` (leaf) → `evo/oam/l2-learning-telemetry.conf`
- `Add RSTP` → `evo/oam/rstp-fabric.conf` *(LEAF edge or SPINE disable variant)*
- `Add the gRPC / Apstra base` → `evo/bootstrap/system-grpc-apstra.conf` + `evo/bootstrap/security-grpc-cert.conf`
- `Add the fabric loop-prevention policies` → `evo/policy/clos-loop-prevention.conf` + `evo/policy/community-definitions.conf`
- `Add a fabric P2P link` → `evo/interfaces/fabric-p2p-links.conf`
