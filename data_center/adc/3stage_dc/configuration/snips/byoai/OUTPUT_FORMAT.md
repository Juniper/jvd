# Output Format

This file is part of the [BYOAI](README.md) corpus. It defines the exact shape every generation must take. Bundled into [`jvd-3stage-dc-snips.md`](jvd-3stage-dc-snips.md) by `regenerate-bundle.sh`.

## 1. `Inputs used:` block (always first)

Every generation begins with a YAML comment block listing **every** value picked or accepted:

```yaml
# Inputs used:
# mode: auto                   # or "interview"
# form: as-deployed            # or "minimum" or "with-overlay"
# devices:
#   leaf1: { name: <hostname>, os: <junos|evo>, role: <spine|leaf|border-leaf>, loopback4: <addr>, as: <asn> }
#   leaf2: { ... }
# services:
#   - { kind: <mac-vrf-evpn-vxlan|vrf-evpn-ip-prefix>,
#       count: <int>,
#       vrf_name: <name>,           # for vrf-evpn-ip-prefix
#       instance_name: <name>,      # for mac-vrf-evpn-vxlan
#       vni: <int>,
#       rd: <loopback:id>,
#       rt: <target:...>,
#       vlan_id: <int>,             # for L2 mac-vrf
#       esi: <hex>,                 # for esi-leaf multihoming
#       external_peer: { as: <asn>, v4: <addr>, v6: <addr> } }   # border-leaf WAN exit
# snips_used:
#   - junos/services/vrf-evpn-ip-prefix.conf
#   - junos/interfaces/irb-gateway.conf
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
  - EVPN **ESI values** and the **LACP system-id** MUST match on both ESI leaves of a multihomed server pair (`esi-leaf1` + `esi-leaf2`).
  - The IRB **anycast MAC** (`$ANYCAST_MAC`) and IRB gateway addresses MUST be identical on every leaf that hosts the same VLAN (ERB anycast gateway model).
  - L2 MAC-VRF **per-VNI route-targets** and L3 VRF **vrf-targets** must match across the leaves that share the VNI / VRF.
  - The eBGP **underlay + overlay peer AS** (`64512` toward the spines) is shared; each leaf's **own AS** is unique.
  - For a border-leaf WAN exit, the **external eBGP AS**, import/export **filter-lists**, and **VRF communities** must be consistent with the external router.
- Anything by-pattern rather than validated on that exact device (e.g., a user-supplied hostname not in any snip's `Seen on:` list).
- ERB reminders: `mac-vrf-evpn-vxlan` uses `default-gateway do-not-advertise` (each leaf owns its anycast gateway locally); the Junos leaf L2 service depends on `evpn-vxlan-shared-tunnels.conf` for `forwarding-options vxlan-routing`.

## Refusal

If the request cannot be fulfilled from the snip library, do not apologise. Say exactly:

```
I cannot generate this from the snip library because <one reason>.
```

…and stop.
