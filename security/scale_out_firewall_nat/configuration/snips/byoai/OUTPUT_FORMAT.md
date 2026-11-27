# Output Format

This file is part of the [BYOAI](README.md) corpus. It defines the exact shape every generation must take. Bundled into `jvd-so-fwnat-snips.md` by `regenerate-bundle.sh`.

## 1. `Inputs used:` block (always first)

Every generation begins with a YAML comment block listing **every** value picked or accepted:

```yaml
# Inputs used:
# mode: auto                   # or "interview"
# form: minimum
# devices:
#   srx1a: { name: <hostname>, os: junos, mnha_node: <A|B>, loopback4: <lo0.0 addr> }
#   mx1: { name: <hostname>, os: junos }
# services:
#   - { kind: <source-nat-napt44-nat64|security-policies-sfw-nat|mnha-srg-0-signal-route|srx-mnha-vr-icl|srx-vr-1-scale-out|mx-trust-vr-scale-out|mx-untrust-vr-scale-out|mx-mnha-vr-icl|tlb-sfw-trust|tlb-sfw-untrust|tlb-sfw-trust-ipv6|tlb-sfw-untrust-ipv6|tlb-fbf-trust|tlb-fbf-untrust>,
#       values: { <$VAR>: <value>, ... } }
# snips_used:
#   - junos/security/nat-source-napt44-nat64-pools-destination-nat64.conf
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
- What is not included: the snip's "Not included" references (the `global`, `re0` and `re1` configuration groups; `lo0.0` on the MX), with the Report link.
- Inputs defaulted because the user did not provide them.
- Cross-device consistency the user must verify: the two nodes of an MNHA pair name each other (peer ID and peer loopback) and keep the security object names identical; each MNHA pair has its own NAT pool prefixes, which its VR-1 discard routes and untrust export policy advertise; the MX TLB real services are the SRX pairs' lo0.1 addresses; the MX and SRX eBGP neighbors and AS numbers match on each VLAN unit; the A and B nodes keep their different AS-path prepend lengths.
- Anything that is by-pattern rather than validated on that exact device.

## Refusal

If the request cannot be fulfilled from the snip library, do not apologise. Say exactly:

```
I cannot generate this from the snip library because <one reason>.
```

…and stop.
