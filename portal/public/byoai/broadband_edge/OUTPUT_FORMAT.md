# Output Format

This file is part of the [BYOAI](README.md) corpus. It defines the exact shape every generation must take. Bundled into [`jvd-bbe-snips.md`](jvd-bbe-snips.md) by `regenerate-bundle.sh`.

## 1. `Inputs used:` block (always first)

Every generation begins with a YAML comment block listing **every** value picked or accepted:

```yaml
# Inputs used:
# mode: auto                   # or "interview"
# form: as-deployed            # or "minimum" or "with-overlay"
# devices:
#   an: { name: <hostname>, os: evo, loopback4: <addr> }
#   bng: { name: <hostname>, os: junos, loopback4: <addr>, rd_loopback4: <addr> }
# services:
#   - { kind: <evpn-vpws-pppoe|evpn-vpws-ipoe|evpn-vpws-fxc|evpn-vpws-an|evpn-vpws-fxc-an|l3vpn-internet|l3vpn-radius|access-switch>,
#       count: <int>,
#       group_id: <int>,          # subscriber-group id (RD/RT tail)
#       vpws_local: <int>,        # service-id pair (AN local == BNG remote)
#       vpws_remote: <int>,
#       rt: <target:60000:...>,
#       esi_base: <hex>,          # per-group ESI; df-preference for BNG ps
#       vrf: <PPPOE_SUBS_1|dhcp-subs> }
# snips_used:
#   - junos/services/evpn-vpws-pppoe-bng.conf
#   - evo/services/evpn-vpws-an.conf
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

For an end-to-end EVPN-VPWS service, emit the **AN half** (`evo/`) and the **BNG half** (`junos/`) as separate device blocks. Drop the leading C-style `/* … */` documentation header from each snip when emitting. Keep one `/* snips/<path> */` line as the section comment. Leave `$junos-*` dynamic-profile placeholders literal (runtime-resolved by `smg-service`).

## 3. `Notes:` section (always last)

Bullets covering:

- Snips intentionally omitted (and why).
- Inputs defaulted because the user did not provide them.
- Cross-endpoint consistency the user must verify (route-target, ESI value, and the VPWS service-id pair — AN `local` == BNG `remote` and vice-versa).
- Anything that is by-pattern rather than validated on that exact device (e.g. a user-supplied hostname not in any snip's `Seen on:` list).
- For **BNG** devices: remind that `chassis pseudowire-service` + `tunnel-services` (from `bootstrap/chassis-bng.conf`) and `system services subscriber-management` are prerequisites for PWHT / dynamic-profile activation.

## Refusal

If the request cannot be fulfilled from the snip library, do not apologise. Say exactly:

```
I cannot generate this from the snip library because <one reason>.
```

…and stop.
