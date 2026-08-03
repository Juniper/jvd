# Output Format

This file is part of the [BYOAI](README.md) corpus. It defines the exact shape every generation must take. Bundled into [`jvd-ewan-core-edge-snips.md`](jvd-ewan-core-edge-snips.md) by `regenerate-bundle.sh`.

## 1. `Inputs used:` block (always first)

Every generation begins with a YAML comment block listing **every** value picked or accepted:

```yaml
# Inputs used:
# mode: auto                   # or "interview"
# form: as-deployed            # or "minimum" or "with-overlay"
# devices:
#   pe1: { name: <hostname>, os: <junos|evo>, loopback4: <addr> }
#   pe2: { ... }
# services:
#   - { kind: <l3vpn-vrrp|l3vpn-spoke|vpls|l2ckt|ngmvpn|ngmvpn-hub-spoke>,
#       count: <int>,
#       start_id: <int>,
#       start_unit: <int>,
#       vrf_target: <target:...>,
#       rd: <rd> }
# snips_used:
#   - junos/services/l3vpn-vrf-vrrp.conf
#   - evo/services/vpls-virtual-switch.conf
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
- Cross-PE consistency the user must verify (RTs, VPLS-IDs, site-identifiers).
- Anything that is by-pattern rather than validated on that exact device.
- For EVO devices: remind that `network-services enhanced-ip` (from `bootstrap/chassis.conf`) is a prerequisite for MPLS/VPN and requires a reboot if not already set.

## Refusal

If the request cannot be fulfilled from the snip library, do not apologise. Say exactly:

```
I cannot generate this from the snip library because <one reason>.
```

…and stop.
