# Output Format

This file is part of the [BYOAI](README.md) corpus. It defines the exact shape every generation must take. Bundled into [`jvd-ewan-fin-snips.md`](jvd-ewan-fin-snips.md) by `regenerate-bundle.sh`.

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
#   - { kind: <mvpn|evpn-virtual-switch|l3vpn-vrf|virtual-router>,
#       count: <int>,
#       instance_name: <name>,
#       rd: <loopback:id>,
#       rt: <target:...>,
#       esi_base: <hex>,          # for evpn-virtual-switch
#       mvpn_rt: <target:...>,    # for mvpn
#       rp: <addr>, group_range: <prefix> }   # for mvpn / virtual-router
# snips_used:
#   - junos/services/mvpn-instance.conf
#   - junos/interfaces/irb-l3-gateway.conf
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
- Cross-PE / cross-device consistency the user must verify:
  - EVPN **ESI values** and the LACP system-id MUST match on both PEs of a multihomed pair.
  - MVPN **route-targets** and the **P2MP provider-tunnel** must be consistent across the sender/receiver PEs.
  - L3VPN **route-targets** must match across the PEs that share the VRF.
  - virtual-router: the **eBGP AS toward the AP** (`64512`) is shared; the VR's own AS differs per CR (`cr1` = 64520, `cr2` = 64521).
- Anything by-pattern rather than validated on that exact device (e.g., a user-supplied hostname not in any snip's `Seen on:` list).
- MVPN / multicast turn-ups: remind that `bootstrap/chassis-config.conf` provisions **tunnel-services** (needed for multicast replication) and that `multicast/forwarding-multicast-tuning.conf` + `firewall/multicast-fwd-cache-filter.conf` are the resolve-rate / CoS-marking pair.

## Refusal

If the request cannot be fulfilled from the snip library, do not apologise. Say exactly:

```
I cannot generate this from the snip library because <one reason>.
```

…and stop.
