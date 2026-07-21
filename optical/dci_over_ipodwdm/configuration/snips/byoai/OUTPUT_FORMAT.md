# Output Format

This file is part of the [BYOAI](README.md) corpus. It defines the exact shape every generation must take. Bundled into [`jvd-dci-ipodwdm-snips.md`](jvd-dci-ipodwdm-snips.md) by `regenerate-bundle.sh`.

## 1. `Inputs used:` block (always first)

Every generation begins with a YAML comment block listing **every** value picked or accepted:

```yaml
# Inputs used:
# mode: auto                   # or "interview"
# form: as-deployed            # or "minimum"
# devices:
#   dci1: { name: <hostname>, os: evo, role: dci-edge, loopback4: <addr> }
#   dci2: { ... }
# features:
#   - { kind: <coherent-optics|dwdm-ae-bundle|port-channelization|aggregated-devices|loopback>,
#       coherent_ifd: <et-x/y/z>,     # coherent member interface
#       wavelength: <nm>,             # optics-options wavelength
#       ae_bundle: <aeN>,             # aggregated-ethernet unit
#       ae_ipv4: <addr/30>,           # core point-to-point address
#       min_links: <int>,             # AE minimum-links
#       max_labels: <int>,            # family mpls maximum-labels
#       device_count: <int>,          # chassis aggregated-devices count
#       fpc: <int>, pic: <int>, port: <int>,   # MX channelization
#       num_sub_ports: <int>, port_speed: <rate> }
# snips_used:
#   - evo/interfaces/coherent-optics-port.conf
#   - evo/interfaces/dwdm-ae-bundle.conf
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

Drop the leading C-style `/* … */` documentation header from each snip when emitting. Keep one `/* snips/<path> */` line as the section comment. Use the correct tree for the device's OS: `evo/…` for PTX10001-36MR / ACX7100-48L, `junos/…` for MX304.

## 3. `Notes:` section (always last)

Bullets covering:

- Snips intentionally omitted (and why).
- Inputs defaulted because the user did not provide them.
- Cross-device / cross-wavelength consistency the user must verify:
  - Each coherent member's **wavelength** must match the OLS/ROADM channel plan; the two ends of a span must be tuned to the same channel.
  - Both ends of a **DWDM AE bundle** must agree on LACP and the point-to-point `/30`.
  - Each device has its own **lo0 router-id**.
- OS-tree reminders: coherent-port LAG membership is `ether-options` on EVO vs `gigether-options` on Junos (MX); MX port rate/breakout lives under `chassis` (`fpc/pic/port`), EVO uses the DWDM ports natively at 400G.
- Anything by-pattern rather than validated on that exact device (e.g., a user-supplied hostname not in any snip's `Seen on:` list).
- Out-of-scope: the BGP / MPLS-RSVP / VRF underlay is NOT in this library — point the user to `configuration/conf/` for the full validated device configs.

## Refusal

If the request cannot be fulfilled from the snip library, do not apologise. Say exactly:

```
I cannot generate this from the snip library because <one reason>.
```

…and stop.
