# Output Format

This file is part of the [BYOAI](README.md) corpus. It defines the exact shape every generation must take. Bundled into [`jvd-evpn-dci-snips.md`](jvd-evpn-dci-snips.md) by `regenerate-bundle.sh`.

## 1. `Inputs used:` block (always first)

Every generation begins with a YAML comment block listing **every** value picked or accepted:

```yaml
# Inputs used:
# mode: auto                   # or "interview"
# form: as-deployed            # or "minimum"
# scenario: type2_seamless     # ott | type2_seamless | type2_type5_seamless
# devices:
#   gw1: { name: <hostname>, os: <junos|evo>, role: <border-leaf-gateway|collapsed-leaf>, loopback4: <addr>, as: <asn> }
#   gw2: { ... }
# services:
#   - { kind: <dci-gateway|evpn-interconnect|type5-stretch|macsec>,
#       ic_rt: <target:...>,        # interconnect route target (must match remote DC)
#       ic_rd: <loopback:id>,       # interconnect route distinguisher
#       ic_esi: <hex>,              # all-active interconnect ESI (per DC)
#       vni_list: [<int>, ...],     # interconnected-vni-list
#       translation_vni: <int>,     # common DCI VNI when sites differ
#       vrf_name: <name>,           # for type5-stretch
#       remote_gw: { loopback: <addr>, as: <asn> },
#       macsec_ca: <name> }         # for macsec
# snips_used:
#   - evo/services/evpn-interconnect.conf
#   - evo/services/vxlan-translation-vni.conf
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
  - The interconnect **route target** (`vrf-target`) and the **translation VNIs** MUST match on the local and remote data center gateways.
  - For a **Type 5 stretch**, the L3 interconnect route target MUST be configured identically in the remote data center.
  - The all-active interconnect **ESI** is shared across the two gateways in the SAME data center (Designated Forwarder resilience).
  - Seamless stitching requires a **logical full mesh** of `evpn-gw` overlay eBGP sessions to ALL remote gateways — repeat the neighbor block per remote gateway.
  - Per-gateway identifiers (loopbacks, RDs, own eBGP AS, MACSEC CKN) differ.
- Anything by-pattern rather than validated on that exact device (e.g., a user-supplied hostname not in any snip's `Seen on:` list).
- DCI reminders: on the collapsed fabric (DC3) apply `junos/policy/leaf-to-leaf-dci-filter.conf` so DCI routes are not re-advertised between the collapsed leaves; NEVER emit a real MACSEC CAK (the source marks it `## SECRET-DATA`) — emit a placeholder and set the key out-of-band.

## Refusal

If the request cannot be fulfilled from the snip library, do not apologise. Say exactly:

```
I cannot generate this from the snip library because <one reason>.
```

…and stop.
