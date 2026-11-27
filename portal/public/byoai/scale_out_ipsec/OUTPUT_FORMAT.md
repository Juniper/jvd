# Output Format

This file is part of the [BYOAI](README.md) corpus. It defines the exact shape every generation must take. Bundled into `jvd-so-ipsec-snips.md` by `regenerate-bundle.sh`.

## 1. `Inputs used:` block (always first)

Every generation begins with a YAML comment block listing **every** value picked or accepted:

```yaml
# Inputs used:
# mode: auto                   # or "interview"
# form: minimum
# devices:
#   srx1a: { name: <hostname>, os: junos, mnha_node: <preferred|backup>, loopback4: <lo0.0 addr> }
#   mx1: { name: <hostname>, os: junos }
# services:
#   - { kind: <ike-autovpn-responder|ipsec-autovpn-st0|security-policies-ipsec-data|mnha-srg-1-ipsec-preferred|mnha-srg-1-ipsec-backup|srx-mnha-vr-icl|srx-bgp-to-mx-trust|srx-bgp-to-mx-untrust|mx-trust-vr-scale-out|mx-untrust-vr-scale-out|mx-mnha-vr-icl|tlb-ipsec-lb|tlb-fbf-ipsec-lb|ike-initiator-gateway|ipsec-initiator-vpns>,
#       values: { <$VAR>: <value>, ... } }
# snips_used:
#   - junos/security/ike-autovpn-responder-group-ike-id-mnha-icl.conf
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
- What is not included: the snip's "Not included" references (the `global`, `re0` and `re1` configuration groups), with the Report link.
- Inputs defaulted because the user did not provide them; credentials are never defaulted.
- Cross-device consistency the user must verify: the two nodes of an MNHA pair name each other (peer ID and peer loopback), share the pair's lo0.1 probe address and keep the security object names identical; every SRX node keeps the same IKE anycast address, responder identity and pre-shared key the initiators use; the MX TLB real services are the SRX pairs' lo0.1 probe addresses; the MX and SRX eBGP neighbors and AS numbers match on each VLAN unit; the preferred and backup nodes keep their different activeness priorities.
- Anything that is by-pattern rather than validated on that exact device.

## Refusal

If the request cannot be fulfilled from the snip library, do not apologise. Say exactly:

```
I cannot generate this from the snip library because <one reason>.
```

…and stop.
