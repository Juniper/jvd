# Output Format

This file is part of the [BYOAI](README.md) corpus. It defines the exact shape every generation must take. Bundled into [`jvd-so-fwnat-snips.md`](jvd-so-fwnat-snips.md) by `regenerate-bundle.sh`.

## 1. `Inputs used:` block (always first)

Every generation begins with a YAML comment block listing **every** value picked or accepted:

```yaml
# Inputs used:
# mode: auto                   # or "interview"
# form: as-deployed            # or "minimum" or "with-bgp"
# devices:
#   - { name: <hostname>, os: junos, role: <MX-LB|SRX|GW> }
# component:
#   kind: <mx-load-balancer|srx-sfw-nat|srx-mnha|gw-emulator|add-feature>
#   nat: { type: napt44, pool: srx_nat_pool1, prefix: 100.64.1.0/24, pooling: paired }
#   as: { srx: 65000, trust: 65200, untrust: 65400, mnha: 65050 }
#   planes: { trust: 10.1.1.x/30, untrust: 10.2.1.x/30, mnha: 10.3.1.x/30 }
# snips_used:
#   - junos/load-balancing/tlb-sfw-dsr.conf
#   - junos/firewall/mx-fbf-tlb-redirect.conf
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

For an end-to-end scale-out example, emit the **MX load-balancer** and the **SRX SFW/NAT gateway** as separate device blocks. Drop the leading C-style `/* … */` documentation header from each snip when emitting. Keep one `/* snips/<path> */` line as the section comment.

## 3. `Notes:` section (always last)

Bullets covering:

- Snips intentionally omitted (and why).
- Inputs defaulted because the user did not provide them.
- Cross-device consistency the user must verify: per-plane /30s match between the MX and SRX sides; the SRX share one local-as (`$SRX_AS`) while the MX side uses `as-override`; the TLB TCP health-check port matches the SRX `web-management http` port (8088); the MNHA signal-route (`$SIG_ROUTE`) matches on both nodes; the health-check anchor (`$HC_SRC`, SRX lo0.1) is the same on both nodes of a pair.
- NAT: the source-NAT NAPT44 pool `$NAPT_PREFIX` is **unique per MNHA pair** (100.64.1.0/24 on pair 1, 100.64.3.0/24 on pair 2) so translations never collide; `address-pooling paired` must stay set for endpoint-independent mapping.
- Prerequisites: for **SRX**, MNHA needs `chassis high-availability` (SRG0 + BFD monitor + install-on-failure signal-route) plus the active/backup signal-route export policies. For **MX-LB**, RE-based TLB needs `services traffic-load-balance routing-engine-mode` on MX304/MX10000 (already in `tlb-sfw-dsr.conf`).
- **NAT64 is a non-goal.** If NAT64 was requested and emitted, state clearly it is present in the lab configs but OUTSIDE the validated NAPT44 design.
- Anything that is by-pattern rather than validated on that exact device (e.g. a user-supplied hostname not in any snip's `Seen on:` list).

## Refusal

If the request cannot be fulfilled from the snip library, do not apologise. Say exactly:

```
I cannot generate this from the snip library because <one reason>.
```

…and stop.
