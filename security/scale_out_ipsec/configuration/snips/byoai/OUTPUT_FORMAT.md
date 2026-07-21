# Output Format

This file is part of the [BYOAI](README.md) corpus. It defines the exact shape every generation must take. Bundled into [`jvd-so-ipsec-snips.md`](jvd-so-ipsec-snips.md) by `regenerate-bundle.sh`.

## 1. `Inputs used:` block (always first)

Every generation begins with a YAML comment block listing **every** value picked or accepted:

```yaml
# Inputs used:
# mode: auto                   # or "interview"
# form: as-deployed            # or "minimum" or "with-bgp"
# devices:
#   - { name: <hostname>, os: junos, role: <MX-LB|SRX|MX-INIT> }
# component:
#   kind: <mx-load-balancer|srx-secgw|srx-mnha|mx-initiator|add-feature>
#   ike_vip: 10.100.0.1        # shared anycast IKE gateway
#   as: { mx: 10000, srx: 65000, trust: 65200, untrust: 65400, mnha: 65050 }
#   planes: { trust: 10.1.1.x/30, untrust: 10.2.1.x/30, mnha: 10.3.1.x/30 }
# snips_used:
#   - junos/load-balancing/tlb-ipsec-dsr.conf
#   - junos/firewall/fbf-ipsec-lb-redirect.conf
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

For an end-to-end scale-out example, emit the **MX load-balancer** and the **SRX gateway** as separate device blocks. Drop the leading C-style `/* … */` documentation header from each snip when emitting. Keep one `/* snips/<path> */` line as the section comment.

## 3. `Notes:` section (always last)

Bullets covering:

- Snips intentionally omitted (and why).
- Inputs defaulted because the user did not provide them.
- Cross-device consistency the user must verify: the anycast IKE VIP is IDENTICAL on every SRX and the TLB virtual-service; per-plane /30s match between the MX and SRX sides; the SRX share one local-as while the MX TRUST group uses `as-override`; MNHA signal-routes match.
- Secrets: `$IKE_PSK` / `$L3HA_PSK` / `$INIT_PSK` are placeholders — the user MUST supply real encrypted keys.
- Prerequisites: for **SRX** MNHA, `chassis high-availability` + the HA-link-encryption VPN + signal policies must be present. For **MX-LB**, RE-based TLB needs `services traffic-load-balance routing-engine-mode` on MX304/MX10000.
- Anything that is by-pattern rather than validated on that exact device (e.g. a user-supplied hostname not in any snip's `Seen on:` list).

## Refusal

If the request cannot be fulfilled from the snip library, do not apologise. Say exactly:

```
I cannot generate this from the snip library because <one reason>.
```

…and stop.
