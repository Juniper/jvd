# AI Data Center Frontend Fabric for Inference BYOAI — Full Query Menu

The always-current catalog of generation asks for the **AI Data Center Frontend Fabric for Inference** JVD — a Junos Evolved pure-L3 eBGP Clos (2× QFX5220-32CD spines, 4× QFX5130-32CD leaves) that carries AI inference request/response traffic between clients, Envoy load balancers, and AMD MI300X GPU servers. Replace `N` with any count (e.g. `Generate 2 …`). All renders on the chosen device(s) with the chosen form tier (`minimum` / `with-transport` / `as-deployed`).

## Services — frontend cluster VLAN

- `Generate N frontend cluster VLANs` — `frontend-cluster-vlan` + IRB L3 gateway + server/client access trunk (leaves)
- `Add a frontend cluster VLAN to <leaf>` — one more cluster VLAN (fresh VLAN name / ID / IRB unit / gateway subnet)
- `Attach a GPU server to <leaf>` — access trunk + native VLAN into the cluster VLAN
- `Attach an Envoy / GenAI-Perf client host to <leaf>` — client-side access trunk

## Add a feature to a device

- `Add LLDP to <device>`
- `Add L2-learning telemetry to <leaf>` — remote-MAC visibility via gRPC
- `Add RSTP to <device>` — leaf edge / BPDU-guard, or spine disable
- `Add the gRPC / Apstra base to <device>` — system + extension-service gRPC + TLS cert
- `Add the fabric loop-prevention + community policies to <device>`
- `Add the PFE per-packet load-balance policy to <device>`

## Greenfield / turn-up

- `Build a new QFX5130-32CD leaf turn-up` — full as-deployed fabric baseline + a frontend cluster VLAN
- `Bootstrap a new QFX5220-32CD spine end-to-end` — chassis + underlay + fabric policies (pure L3, no VLAN/IRB)

## Transport / underlay

- `Generate the eBGP fabric underlay for <device>` — leaf↔spine /31 peering, multipath, BFD
- `Generate the routing-options ECMP-FRR block for <device>`
- `Generate the fabric P2P links for <device>` — leaf 400G breakout /31 or spine direct /31
- `Generate the loopback for <device>`
- `Generate the fabric loop-prevention + community policies for <device>`

## Audit / explain

- `Explain the AI inference frontend fabric design`
- `Explain single node vs multinode (Envoy) inference traffic flows`
- `Explain the SGLang Router / worker behavior`
- `Explain the eBGP Clos underlay + fabric loop-prevention model`
- `Explain the benchmark methodology (TTFT / TPS) and results`
- `Summarize what's validated in this JVD`

---

Don't see what you need? Describe it and the assistant will tell you whether the AI Inference Frontend Fabric JVD covers it.
