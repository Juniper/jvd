# Output Format

This file is part of the [BYOAI](README.md) corpus. It defines the exact shape
every generation must take. Bundled into [`jvd-llq-snips.md`](jvd-llq-snips.md) by
`regenerate-bundle.sh`.

## 1. `Inputs used:` block (always first)

Every generation begins with a YAML comment block listing **every** value picked
or accepted:

```yaml
# Inputs used:
# mode: auto                   # or "interview"
# form: as-deployed            # or "minimum" or "with-overlay"
# devices:
#   pe1: { name: <hostname>, os: <junos|evo>, role: <csr|hsr|agg|core|sag>, loopback4: <addr> }
#   pe2: { ... }
# services:
#   - { kind: <evpn-vpws|evpn-fxc|evpn-elan|evpn-elan-irb|l3vpn-irb|bgp-vpls>,
#       count: <int>,
#       start_id: <int>,
#       start_vlan: <int>,
#       start_ac_unit: <int>,
#       rt: <target:...>,
#       esi_base: <hex>,         # for multihomed fronthaul services
#       irb_subnet: <prefix> }   # for evpn-elan-irb / l3vpn-irb
# snips_used:
#   - evo/services/evpn-vpws-vlan-based-mh.conf
#   - evo/cos/cos-binding-l2-fronthaul-static.conf
#   - ...
```

This block makes every generation reproducible — the user can paste it back to
regenerate the same output.

## 2. One fenced `text` block per device

Each device block starts with a `# device:` label and groups its snips with
`/* snips/<path> */` section comments:

```text
# device: <hostname>
/* snips/<path-to-snip>.conf */
<rendered config block>

/* snips/<path-to-next-snip>.conf */
<rendered config block>
```

Drop the leading C-style `/* … */` documentation header from each snip when
emitting. Keep one `/* snips/<path> */` line as the section comment.

## 3. `Notes:` section (always last)

Bullets covering:

- Snips intentionally omitted (and why).
- Inputs defaulted because the user did not provide them.
- Cross-PE consistency the user must verify (RTs, ESIs, VPWS service-id pairs,
  MAC-VRF / instance names).
- Anything that is by-pattern rather than validated on that exact device (e.g. a
  user-supplied hostname not in any snip's `Seen on:` list).
- **CoS priority realization:** on ACX (access/aggregation) FC-LLQ uses the
  hardware `priority low-latency` scheduler (`cos/schedulers-low-latency.conf`);
  on MX (SAG/aggregation) and PTX (core) FC-LLQ falls back to `priority
  strict-high` (`cos/schedulers-strict-high.conf`) — pick the file that matches
  the device family, and flag when a service spans both.
- **Fronthaul classification:** dedicated eCPRI units may use
  `cos-binding-l2-fronthaul-static.conf` (static FC-LLQ, no classifier) vs
  `cos-binding-l2-fronthaul.conf` (802.1p classification). MAC pools in
  `filter-mf-ecpri-fronthaul.conf` are lab-specific — remind the user to
  substitute site eCPRI/PTP MAC addresses.

## Refusal

If the request cannot be fulfilled from the snip library, do not apologise. Say
exactly:

```
I cannot generate this from the snip library because <one reason>.
```

…and stop.
