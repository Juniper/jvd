# Output Format

This file is part of the [BYOAI](README.md) corpus. It defines the exact shape every generation must take. Bundled into [`jvd-aiml-mtb-snips.md`](jvd-aiml-mtb-snips.md) by `regenerate-bundle.sh`.

## 1. `Inputs used:` block (always first)

Every generation begins with a YAML comment block listing **every** value picked or accepted:

```yaml
# Inputs used:
# mode: auto                   # or "interview"
# form: as-deployed            # or "minimum" or "with-overlay"
# devices:
#   leaf1: { name: <hostname>, os: evo, role: <leaf|spine>, loopback4: <addr>, as: <asn>, tier_tag: <n> }
#   leaf2: { ... }
# services:
#   - { kind: evpn-vrf-ip-prefix-routes,
#       count: <int>,
#       tenant: <tenant-N>,
#       vni: <int>,
#       rd: <loopback:vni>,
#       rt: <target:vni:1>,
#       irb_unit: <int>,
#       lo_unit: <int>,
#       gateway: <addr>,
#       ac_interfaces: [ <sub-port>, ... ] }
# snips_used:
#   - evo/services/evpn-vrf-ip-prefix-routes.conf
#   - evo/interfaces/irb-tenant-gateway.conf
#   - ...
```

This block makes every generation reproducible — the user can paste it back to regenerate the same output.

## 2. One fenced `text` block per device

Each device block starts with a `# device:` label and groups its snips with `/* snips/<path> */` section comments:

```text
# device: <hostname>
/* snips/<path-to-snip>.conf */
<rendered config block>

/* snips/<path-to-next-snip>.conf */
<rendered config block>
```

Drop the leading C-style `/* … */` documentation header from each snip when emitting. Keep one `/* snips/<path> */` line as the section comment.

## 3. `Notes:` section (always last)

Bullets covering:

- Snips intentionally omitted (and why).
- Inputs defaulted because the user did not provide them.
- Role selection: whether each device used the LEAF or SPINE variant of the dual-variant snips.
- Cross-device consistency the user must verify:
  - The IRB **anycast MAC** (`$ANYCAST_MAC`) and per-tenant gateway addresses MUST be identical on every leaf that hosts the tenant subnet.
  - Per-tenant **VNI**, **route-distinguisher pattern** (`${LO0_V4}:${VNI}`), and **vrf-target** (`target:${VNI}:1`) must be consistent across the leaves that share the tenant.
  - The eBGP Clos **per-device AS** is unique; peer AS values must match the neighbor's local AS.
  - **RoCEv2 CoS** (forwarding-class / queue names, PFC/ECN settings) is a JVD-wide constant — identical on every fabric device.
- Anything by-pattern rather than validated on that exact device (e.g., a user-supplied hostname not in any snip's `Seen on:` list).
- AI-fabric reminders: RoCEv2 lossless CoS + `chassis-buffer-monitor` telemetry + `ecmp-dlb-flowlet` DLB are the AI/RoCE performance triad; the fabric and IRB/server MTUs differ (9216/9170 fabric, 9000 tenant).

## Refusal

If the request cannot be fulfilled from the snip library, do not apologise. Say exactly:

```
I cannot generate this from the snip library because <one reason>.
```

…and stop.
