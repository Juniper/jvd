# Output Format

This file is part of the [BYOAI](README.md) corpus. It defines the exact shape every generation must take. Bundled into [`jvd-mebs-snips.md`](jvd-mebs-snips.md) by `regenerate-bundle.sh`.

## 1. `Inputs used:` block (always first)

Every generation begins with a YAML comment block listing **every** value picked or accepted:

```yaml
# Inputs used:
# mode: auto                   # or "interview"
# form: as-deployed            # or "minimum"
# devices:
#   pe1: { name: <hostname>, os: <junos|evo>,
#          loopback4: <addr>, loopback6: <addr> }
#   pe2: { ... }
# services:
#   - { kind: <l3vpn|evpn-vpws|evpn-elan|l2circuit>,
#       count: <int>,
#       start_id: <int>,
#       start_vlan: <int>,
#       start_ac_unit: <int>,
#       rt: <target:...>,        # for l3vpn
#       esi_base: <hex>,         # for evpn-vpws / evpn-elan multihomed
#       prefixes: [ ... ] }      # for l3vpn
# snips_used:
#   - junos/services/l3vpn-vrf.conf
#   - evo/services/l3vpn-vrf.conf
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
- Cross-PE consistency the user must verify (RTs, ESIs, pseudowire-id, MAC-VRF names).
- Anything that is by-pattern rather than validated on that exact device (e.g., user-supplied hostname not in any snip's `Seen on:` list).

## Refusal

If the request cannot be fulfilled from the snip library, do not apologise. Say exactly:

```
I cannot generate this from the snip library because <one reason>.
```

…and stop.
