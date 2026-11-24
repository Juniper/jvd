# Output Format

This file is part of the [BYOAI](README.md) corpus. It defines the exact shape every generation must take. Bundled into `jvd-evpn-dci-snips.md` by `regenerate-bundle.sh`.

## 1. `Inputs used:` block (always first)

Every generation begins with a YAML comment block listing **every** value picked or accepted:

```yaml
# Inputs used:
# mode: auto                   # or "interview"
# form: minimum
# scenario: <dc1-dc2_ott|dc1-dc3_type2_seamless|dc1-dc4_type2_type5_seamless>
# devices:
#   dc1_leaf1: { name: <hostname>, os: junos, loopback4: <addr> }
#   dc1_borderleaf1: { name: <hostname>, os: evo, loopback4: <addr> }
# services:
#   - { kind: <evpn-mac-vrf-10-vlans|evpn-mac-vrf-20-vlans|evpn-mac-vrf-30-vlans|evpn-mac-vrf-40-vlans|evpn-mac-vrf-50-vlans|evpn-mac-vrf-interconnect-20-vlans|evpn-mac-vrf-interconnect-50-vlans|evpn-type5-vrf-10-irb|evpn-type5-vrf-dhcp-relay-20-irb-blue|evpn-type5-vrf-dhcp-relay-20-irb-red|evpn-type5-vrf-dhcp-relay-overrides-10-irb-blue|evpn-type5-vrf-dhcp-relay-overrides-10-irb-red|evpn-type5-vrf-dhcp-relay-overrides-20-irb-blue|evpn-type5-vrf-dhcp-relay-overrides-20-irb-red|evpn-type5-vrf-interconnect-10-irb|evpn-type5-vrf-ebgp-dhcp-relay-blue|evpn-type5-vrf-ebgp-dhcp-relay-overrides-10-irb-blue|evpn-type5-vrf-ebgp-dhcp-relay-overrides-10-irb-red|evpn-type5-vrf-ebgp-dhcp-relay-red|evpn-type5-vrf-ebgp-inet-10-irb-blue|evpn-type5-vrf-ebgp-inet-10-irb-red|evpn-type5-vrf-ebgp-interconnect-dhcp-relay-20-irb-blue|evpn-type5-vrf-ebgp-interconnect-dhcp-relay-20-irb-red>,
#       count: <int>,
#       start_id: <int>,
#       ac_ifl: <ifd.unit>,
#       rt: <rt_as:rt_id>,
#       rd: <admin:assigned> }
# snips_used:
#   - evo/routing-instances/l3vpn/ri-vrf-evpn-type-5-10-irb.conf
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

- The prerequisites the device must already run: the snip's `Pair with:` entries, the applicable entries of its Needs list and the requirements TIERS.md lists under the Blocked entry for that device. Name them; do not render them.
- Inputs defaulted because the user did not provide them.
- Cross-device consistency the user must verify: a MAC-VRF or Type 5 VRF uses the same instance name, VNIs and route targets on every device of the data center that carries it; each device's route distinguishers start with its own loopback; an EVPN interconnect uses the same interconnect route target on the DCI gateways of both data centers; the IRB units a VRF lists must exist in the device's MAC-VRF VLANs, and the VRF loopback unit must exist on the device.
- Anything that is by-pattern rather than validated on that exact device.

## Refusal

If the request cannot be fulfilled from the snip library, do not apologise. Say exactly:

```
I cannot generate this from the snip library because <one reason>.
```

…and stop.
