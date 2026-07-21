# Output Format

This file is part of the [BYOAI](README.md) corpus. It defines the exact shape every generation must take. Bundled into [`jvd-aiml-inf-snips.md`](jvd-aiml-inf-snips.md) by `regenerate-bundle.sh`.

## 1. `Inputs used:` block (always first)

Every generation begins with a YAML comment block listing **every** value picked or accepted:

```yaml
# Inputs used:
# mode: auto                   # or "interview"
# form: as-deployed            # or "minimum" or "with-transport"
# devices:
#   leaf3: { name: <hostname>, os: evo, role: <leaf|spine>, loopback4: <addr>, as: <asn>, tier_tag: <n> }
#   spine1: { ... }
# services:
#   - { kind: frontend-cluster-vlan,
#       count: <int>,
#       vlan_name: <vnN>,
#       vlan_id: <int>,
#       irb_unit: <int>,
#       gateway: <addr>,
#       access_interface: <port>,
#       peer_desc: <endpoint> }
# snips_used:
#   - evo/services/frontend-cluster-vlan.conf
#   - evo/interfaces/irb-cluster-gateway.conf
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

Drop the leading C-style `/* … */` documentation header from each snip when emitting. Keep one `/* snips/<path> */` line as the section comment. For a snip with LEAF and SPINE variants, emit ONLY the variant matching the device's role.

## 3. `Notes:` section (always last)

Bullets covering:

- Snips intentionally omitted (and why).
- Inputs defaulted because the user did not provide them.
- Role selection: whether each device used the LEAF or SPINE variant of the dual-variant snips.
- Cross-device consistency the user must verify:
  - The eBGP Clos **per-device AS** is unique; each session's peer-AS MUST equal the neighbor's own local AS.
  - Fabric /31 **link addressing** must be consistent on both ends of each leaf↔spine link.
  - The **fabric vs IRB MTU** differ: 9216/9170 on fabric links, 9000 on the IRB gateway.
- Anything by-pattern rather than validated on that exact device (e.g. a user-supplied hostname not in any snip's `Seen on:` list).
- Reminder: this frontend fabric is a pure IPv4 eBGP Clos — there is **no** EVPN/VXLAN overlay, no RoCE CoS, and a VLAN does not stretch across leafs.

## Refusal

If the request cannot be fulfilled from the snip library, do not apologise. Say exactly:

```
I cannot generate this from the snip library because <one reason>.
```

…and stop.
