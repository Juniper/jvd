# Output Format

This file is part of the [BYOAI](README.md) corpus. It defines the exact shape every generation must take. Bundled into [`jvd-5stage-snips.md`](jvd-5stage-snips.md) by `regenerate-bundle.sh`.

## 1. `Inputs used:` block (always first)

Every generation begins with a YAML comment block listing **every** value picked or accepted:

```yaml
# Inputs used:
# mode: auto                   # or "interview"
# form: as-deployed            # or "minimum"
# devices:
#   dev1: { name: <hostname>, os: <junos|evo>, role: <super-spine|server-leaf|border-leaf>, loopback4: <addr>, as: <asn> }
#   dev2: { ... }
# features:
#   - { kind: <superspine-transport|oism-multicast|rocev2-qos>,
#       pod_spine_as: <asn>,        # super-spine underlay/overlay peer AS
#       vrf_name: <name>,           # tenant VRF for OISM
#       sbd_irb: <irb.NNNN>,        # OISM Supplemental Bridge Domain IRB
#       pim_rp: <addr>,             # border-leaf external RP
#       revenue_irb: <irb.NNNN> }   # border-leaf distributed-DR IRB
# snips_used:
#   - evo/transport/superspine-underlay-ebgp.conf
#   - evo/services/oism-server-leaf.conf
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
- Cross-device consistency the user must verify:
  - The **Supplemental Bridge Domain IRB** (`irb.3500`) and tenant VRF must be consistent across all OISM leaves in a tenant.
  - The super-spine **underlay peer AS** toward a POD equals that POD's shared spine ASN; super spines share one ASN; each POD's spines share one ASN; each leaf has its own AS.
  - EVPN **Type-5 VRF vrf-targets** match across leaves sharing the VRF.
  - Per-device identifiers (loopbacks, RDs, own AS, link addresses) differ.
- Anything by-pattern rather than validated on that exact device (e.g., a user-supplied hostname not in any snip's `Seen on:` list).
- 5-stage reminders: OISM and RoCEv2 config is applied via Apstra **configlet** (Apstra 5.0 lacks native support); enhanced OISM needs the fabric-wide enable **and** the per-VRF config; QFX5130 leaves need `conserve-mcast-routes-in-pfe`; RoCEv2 drop-profiles are the ECN half of DCQCN (PFC is configured alongside — retune per fabric). For the per-POD 3-stage fabric baseline, point the user to the 3-stage DC JVD.

## Refusal

If the request cannot be fulfilled from the snip library, do not apologise. Say exactly:

```
I cannot generate this from the snip library because <one reason>.
```

…and stop.
