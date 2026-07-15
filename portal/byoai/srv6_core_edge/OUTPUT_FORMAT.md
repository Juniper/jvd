# Output Format

This file is part of the [BYOAI](README.md) corpus. It defines the exact shape every generation must take. Bundled into [`jvd-srv6-snips.md`](jvd-srv6-snips.md) by `regenerate-bundle.sh`.

## 1. `Inputs used:` block (always first)

Every generation begins with a YAML comment block listing **every** value picked or accepted:

```yaml
# Inputs used:
# mode: auto                   # or "interview"
# form: as-deployed            # or "minimum" or "with-overlay"
# devices:
#   pe1: { name: <hostname>, os: <junos|evo>, loopback6: <addr>, locator: <SL-FA-000|128|129> }
#   pe2: { ... }
# services:
#   - { kind: <l3vpn-srv6|evpn-vpws-srv6|l3vpn-evpn-t5-srv6|cpe-virtual-router>,
#       count: <int>,
#       vpn_id: <int>,
#       rd_seed: <pe-v4-loopback>,
#       rt: <target:AS:VPN_ID>,
#       locator: <SL-FA-000|128|129>,
#       esi: <hex>,              # for evpn-vpws-srv6
#       attachment: <pe-ce-direct|pe-ce-irb|cpe-attachment> }
# snips_used:
#   - junos/services/l3vpn-srv6-vrf.conf
#   - evo/services/l3vpn-srv6-vrf.conf
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

Drop the leading C-style `/* … */` doc header from each snip when emitting. Keep one `/* snips/<path> */` line as the section comment. Reference apply-groups via `apply-groups [ NAME ];` rather than expanding them inline, unless the user asks for flattened config.

## 3. `Notes:` section (always last)

Bullets covering:

- Snips intentionally omitted (and why).
- Inputs defaulted because the user did not provide them.
- Cross-PE consistency the user must verify (route-targets, VPWS service-ids, ESI values, SRv6 locators).
- Anything by-pattern rather than validated on that exact device (e.g. a user-supplied hostname not in any snip's `Seen on:` list).
- **EVO scope:** `br1_ptx10002-36qdd` is the only EVO device and runs **L3VPN-SRv6 only** — EVPN-VPWS, EVPN Type-5, and CPE virtual-router are Junos-only. Flag if the user asks for an EVPN service on EVO.
- **Overlay assumption:** for `minimum`, remind that `advertise-srv6-service` / `accept-srv6-service` must already be active on the PE's iBGP-to-RR group.

## Refusal

If the request cannot be fulfilled from the snip library, do not apologise. Say exactly:

```
I cannot generate this from the snip library because <one reason>.
```

…and stop.
