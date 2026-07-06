# Output Format — Metro-as-a-Service

This file is part of the [BYOAI](README.md) corpus. It defines the exact
shape every generation must take. Bundled into
[`jvd-maas-snips.md`](jvd-maas-snips.md) by `regenerate-bundle.sh`.

## 1. `Inputs used:` block (always first)

Every generation begins with a YAML comment block listing **every**
value picked or accepted, including the resolved funnel path:

```yaml
# Inputs used:
# mode: auto                   # or "interview"
# form: with-cos               # or "minimum" or "as-deployed"
# service:
#   profile: E-Line            # E-Line | E-LAN | E-Tree | Access E-Line
#   multiplexing: vlan-based   # vlan-based | port-based
#   deployment: evpn-vpws      # evpn-vpws | l2vpn-kompella | l2circuit | bgp-vpls | evpn-elan | evpn-etree | ...
#   attributes:
#     homing: multihomed       # single-homed | multihomed
#     color: color-blind       # color-blind | color-aware
#     cos: yes
#     vlan_manip: none         # none | vlan-map | qinq
#   count: 1
# devices:
#   pe1: { label: MSE1, platform: MX304, os: junos }
#   pe2: { label: MA3,  platform: ACX7100-48L, os: evo }
# values:
#   instance_name: evpn_group_edge_4001
#   rd: { pe1: 10.0.0.1:4001, pe2: 10.0.0.3:4001 }
#   vrf_target: target:63535:4001
#   vlan: 4001
#   ac_unit: 4001
#   esi_id: 00:81:10:40:01:01:10:10:10:01   # multihomed only
# snips_used:
#   - junos/services/evpn-vpws-vlan-based.conf
#   - junos/interfaces/vlan-ccc-vlan-map-esi.conf
#   - junos/cos/classifiers.conf
#   - ...
```

This block makes every generation reproducible — the user can paste it
back to regenerate the same output, or edit one value and rerun.

## 2. One fenced `text` block per device

Each device block starts with a `# device:` label and groups its snips
with `/* snips/<path> */` section comments:

```text
# device: MSE1 (MX304, Junos)
/* snips/junos/services/evpn-vpws-vlan-based.conf */
<rendered config block>

/* snips/junos/interfaces/vlan-ccc-vlan-map-esi.conf */
<rendered config block>
```

Drop the leading C-style `/* … */` documentation header from each snip
when emitting. Keep one `/* snips/<path> */` line as the section comment.

## 3. `Notes:` section (always last)

Bullets covering:

- Snips intentionally omitted (and why).
- Inputs defaulted because the user did not provide them.
- Cross-PE consistency the user must verify (route-targets, ESI values,
  vpws-service-id local/remote mirroring, instance names).
- Assumptions about transport underlay / BGP overlay activation on the
  PE (this JVD's snips scope the service layer, not the underlay).
- Anything by-pattern rather than validated on that exact device
  (e.g. a user-supplied device label not in any snip's `Seen on:` list),
  or a color-aware request downgraded to color-blind on EVO.

## Refusal

If the request cannot be fulfilled from the snip library, do not
apologise. Say exactly:

```
I cannot generate this from the snip library because <one reason>.
```

…and stop.
