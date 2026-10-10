# Output Format

This file is part of the [BYOAI](README.md) corpus. It defines the exact shape every generation must take. Bundled into `jvd-ewan-fin-snips.md` by `regenerate-bundle.sh`.

## 1. `Inputs used:` block (always first)

Every generation begins with a YAML comment block listing **every** value picked or accepted:

```yaml
# Inputs used:
# mode: auto                   # or "interview"
# form: minimum
# devices:
#   wanedge1: { name: <hostname>, os: junos, loopback4: <addr> }
#   ap1: { name: <hostname>, os: junos, loopback4: <addr> }
# services:
#   - { kind: <ng-mvpn-sender|ng-mvpn-receiver|l3vpn-irb|l3vpn-2-ce|evpn-virtual-switch|virtual-router-multicast|virtual-router-unicast>,
#       count: <int>,
#       start_id: <int>,
#       attachments: <ifl list>,
#       rt: <rt_as:rt_id>,
#       rd: <loopback:assigned> }
# snips_used:
#   - junos/routing-instances/l3vpn/ri-mvpn-spt-only-sender-hot-root-standby.conf
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

- The prerequisites the device must already run: the snip's `Pair with:` entries and the requirements TIERS.md lists under the Blocked entry for that device (attachment interfaces, IRB units, VRF loopback units, export policies, the iBGP mesh and the EVPN virtual switch that owns an IRB). Name them; do not render them.
- Inputs defaulted because the user did not provide them.
- Cross-device consistency the user must verify: an NG-MVPN instance uses the same route targets, MVPN target, RP and group range on both WAN edges and both access points; an EVPN virtual-switch instance and its IRB unit are identical on both WAN edges; a customer-router virtual router's eBGP neighbors are the access-point PE-CE addresses of the same instance.
- Anything that is by-pattern rather than validated on that exact device.

## Refusal

If the request cannot be fulfilled from the snip library, do not apologise. Say exactly:

```
I cannot generate this from the snip library because <one reason>.
```

…and stop.
