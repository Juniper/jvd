When creating or modifying a configuration snip
(`configuration/snips/{junos,evo}/<category>/<name>.conf`), follow
[SNIP-CONTRACT.md](../SNIP-CONTRACT.md) exactly.

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
