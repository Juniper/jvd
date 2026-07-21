# Output Format

This file is part of the [BYOAI](README.md) corpus. It defines the exact shape every generation must take. Bundled into [`jvd-collapsed-snips.md`](jvd-collapsed-snips.md) by `regenerate-bundle.sh`.

## 1. `Inputs used:` block (always first)

Every generation begins with a YAML comment block listing **every** value picked or accepted:

```yaml
# Inputs used:
# mode: auto                   # or "interview"
# form: as-deployed            # or "minimum"
# devices:
#   leaf1: { name: <hostname>, os: junos, role: collapsed-leaf, loopback4: <addr>, as: <asn> }
#   leaf2: { ... }
# features:
#   - { kind: <collapsed-fabric|mac-vrf|esi-access>,
#       vni: <int>,                 # MAC-VRF VNI
#       vni_rt: <target:...>,        # per-VNI route target
#       irb_unit: <int>,             # anycast IRB unit
#       irb_address: <addr/len>,     # anycast gateway (same on both switches)
#       anycast_mac: <mac>,          # anycast gateway MAC (same on both switches)
#       esi: <hex>,                  # ESI-LAG ESI (same on both switches)
#       lacp_system_id: <mac> }      # ESI-LAG LACP system-id (same on both switches)
# snips_used:
#   - junos/services/mac-vrf-evpn-vxlan.conf
#   - junos/interfaces/irb-anycast-gateway.conf
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
  - ESI-LAG **ESI value** and **LACP system-id** MUST be identical on both collapsed switches for the same AE bundle (that is what makes it all-active).
  - The anycast IRB **`mac`** and gateway **address** MUST be identical on both switches for the same VLAN.
  - MAC-VRF **per-VNI route-targets** MUST match across both switches.
  - The two leaves are eBGP peers with each other; each has its own loopback and AS.
- Anything by-pattern rather than validated on that exact device (e.g., a user-supplied hostname not in any snip's `Seen on:` list).
- Collapsed reminders: the VLAN-aware MAC-VRF uses `default-gateway do-not-advertise` (each switch owns its anycast gateway locally); the direct EVPN overlay (`l3clos-l-evpn`) runs over loopbacks and the underlay (`l3clos-l`) over the point-to-point links between the two switches.

## Refusal

If the request cannot be fulfilled from the snip library, do not apologise. Say exactly:

```
I cannot generate this from the snip library because <one reason>.
```

…and stop.
