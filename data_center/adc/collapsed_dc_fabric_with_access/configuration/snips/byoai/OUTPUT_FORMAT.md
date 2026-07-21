# Output Format

This file is part of the [BYOAI](README.md) corpus. It defines the exact shape every generation must take. Bundled into [`jvd-collapsed-access-snips.md`](jvd-collapsed-access-snips.md) by `regenerate-bundle.sh`.

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
#   - { kind: <access-tier|mac-vrf|esi-lag>,
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
  - ESI-LAG **ESI value** and **LACP system-id** MUST be identical on both members of the same AE bundle — the two collapsed leaves for an access uplink, or the two access switches for a server downlink (that is what makes it all-active).
  - MAC-VRF **per-VNI route-targets** MUST match across every device sharing that VNI.
  - The access pair are eBGP peers with each other (l3clos-a); each device has its own loopback and AS.
- Anything by-pattern rather than validated on that exact device (e.g., a user-supplied hostname not in any snip's `Seen on:` list).
- Access-tier reminders: the EX4400 access switches are EVPN-VXLAN **VTEPs** (not L2-only) — they need the access underlay (`l3clos-a`), the access overlay (`l3clos-a-evpn`), the EVPN-VXLAN forwarding (`vtep-source-interface lo0.0` + `vxlan-routing`) and at least one MAC-VRF (`evpn-1`) before overlay reachability works. The anycast IRB gateway lives on the collapsed leaves (base Collapsed Fabric JVD), not in this access library.

## Refusal

If the request cannot be fulfilled from the snip library, do not apologise. Say exactly:

```
I cannot generate this from the snip library because <one reason>.
```

…and stop.
