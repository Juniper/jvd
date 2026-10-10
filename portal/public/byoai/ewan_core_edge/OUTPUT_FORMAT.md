# Output Format

This file is part of the [BYOAI](README.md) corpus. It defines the exact shape every generation must take. Bundled into `jvd-ewan-core-edge-snips.md` by `regenerate-bundle.sh`.

## 1. `Inputs used:` block (always first)

Every generation begins with a YAML comment block listing **every** value picked or accepted:

```yaml
# Inputs used:
# mode: auto                   # or "interview"
# form: minimum
# devices:
#   wanedge1: { name: <hostname>, os: junos, loopback4: <addr> }
#   wanedge3: { name: <hostname>, os: evo, loopback4: <addr> }
# services:
#   - { kind: <l3vpn-vrrp|l3vpn-spoke|l3vpn-hub|bgp-vpls|l2circuit|ngmvpn|local-switching>,
#       count: <int>,
#       start_id: <int>,
#       ac_ifl: <ifd.unit>,
#       rt: <rt_as:rt_id>,
#       rd: <admin:assigned> }
# snips_used:
#   - junos/routing-instances/l3vpn/ri-l3vpn-ebgp-router-id-vrf-target.conf
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

- The prerequisites the device must already run: the snip's `Pair with:` entries (for `variant:ewan-core-edge-bgp-overlay`, the BGP overlay form whose `Seen on:` lists the device) and the requirements TIERS.md lists under the Blocked entry for that device. Name them; do not render them.
- Inputs defaulted because the user did not provide them.
- Cross-device consistency the user must verify: the WAN edges of one service use the same instance name and route target; VRRP peers share the virtual address and use different priorities; a Layer 2 circuit uses the same virtual-circuit ID on both ends.
- Anything that is by-pattern rather than validated on that exact device.

## Refusal

If the request cannot be fulfilled from the snip library, do not apologise. Say exactly:

```
I cannot generate this from the snip library because <one reason>.
```

…and stop.
