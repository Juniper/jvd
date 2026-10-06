# Output Format

This file is part of the [BYOAI](README.md) corpus. It defines the exact shape every generation must take. Bundled into `jvd-ewan-dc-edge-snips.md` by `regenerate-bundle.sh`.

## 1. `Inputs used:` block (always first)

Every generation begins with a YAML comment block listing **every** value picked or accepted:

```yaml
# Inputs used:
# mode: auto                   # or "interview"
# form: minimum
# devices:
#   dc-edge1: { name: <hostname>, os: junos, loopback4: <addr> }
#   dc-edge2: { ... }
# services:
#   - { kind: <interconnect-vlan-based|interconnect-vlan-bundle|
#              macvrf-vlan-based|macvrf-vlan-bundle|
#              wan-vlan-based-irb|wan-vlan-based-l3-interface|
#              wan-vlan-bundle|wan-vlan-bundle-no-gateway-community>,
#       count: <int>,
#       start_id: <int>,
#       ac_intf: <ifd.unit>,
#       rt: <rt_as:rt_id>,
#       rd_sub: <int> }
# snips_used:
#   - junos/routing-instances/evpn-interconnect/ri-evpn-interconnect-vlan-based-irb.conf
#   - junos/interfaces/ifl-irb-virtual-gateway.conf
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

- The prerequisites the device must already run: the snip's `Pair with:` entries (for `variant:ewan-bgp-overlay`, the device's `bgp-<device>.conf`) and the requirements TIERS.md lists under the Blocked entry for that device. Name them; do not render them.
- Inputs defaulted because the user did not provide them.
- Cross-device consistency the user must verify: the interconnect instances on dc-edge1 and dc-edge2 use the same instance name, `$ESI`, route targets and interconnect RD subfield; only the loopback differs. In the validated configurations every WAN edge instance's route target equals an interconnect route target (`$RT_AS_INTERCONNECT:$RT_ID_INTERCONNECT`) on the DC edges; keep them equal for the same service.
- For an interconnect instance: the `_INTERCONNECT` variables are the WAN-side (EVPN-MPLS) identity and the plain `$RT_AS` / `$RT_ID` / `$RD_SUB_ASSIGNED` are the data center (EVPN-VXLAN) identity of the same instance (see `_variables.md`).
- For wan-edge1 and wan-edge2: `chassis network-services enhanced-ip` (`junos/chassis/network-services-enhanced-ip.conf`) is the forwarding mode the validated WAN edges run for EVPN and the IRB / virtual-gateway features; confirm it is set before applying a service.
- For wan-edge2 (ACX5448-M): `junos/system/evpn-mh-firewall-profile.conf` is part of the validated baseline for EVPN multihoming.
- Anything that is by-pattern rather than validated on that exact device.

## Refusal

If the request cannot be fulfilled from the snip library, do not apologise. Say exactly:

```
I cannot generate this from the snip library because <one reason>.
```

…and stop.
