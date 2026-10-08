Framework artifact locations: [JVD Framework Index](FRAMEWORK-INDEX.md).

When creating or modifying a configuration snip
(`configuration/snips/{junos,evo}/<category>/<name>.conf`), follow
[SNIP-CONTRACT.md](SNIP-CONTRACT.md) exactly.

- Do not invent header fields, values, cross-references, or relationship
  semantics.
- `Topic:` is one physical line.
- `Seen on:` contains only exact validated device tokens (or `(none)`) — never
  `see`, paths, `.conf` names, or prose like "all PEs".
- `Pair with:` lists only required same-device snip dependencies, and is
  directed (not reciprocal).
- Keep Junos and EVO files separate; cross-OS links are derived, not authored.

A new or modified snip is incomplete until strict header validation
(`npm --prefix portal run snips:validate`) and the authorized roundtrip
verification pass.

## Protected files

`.github/SNIP-CONTRACT.md` is a protected normative contract.

Never modify, regenerate, replace, rename, or unlock this file without explicit user approval for the specific proposed contract change.

If a task appears to require changing `SNIP-CONTRACT.md`, stop before editing it and explain:
1. what semantic contract change is required;
2. why the existing contract is insufficient; and
3. why the issue cannot be handled in tooling, parser/grammar knowledge, or JVD-local metadata instead.

Approval to perform a broader task, modernization, extraction, validation, or bug fix does not constitute approval to change this contract.
