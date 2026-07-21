# BYOAI — Bring Your Own AI (Collapsed Data Center Fabric)

Generate validated Junos configuration for the **Collapsed Data Center Fabric** JVD using any AI you already have (Claude, ChatGPT, Gemini, a local model). The AI is grounded in this JVD's published, validated snippet library — it does not invent syntax. The fabric is a two-switch EVPN-VXLAN collapsed-spine design (no separate spine tier) built with Juniper Apstra for small data centers.

Two modes:

- **Configuration mode** — a guided interview produces ready-to-deploy config from the 6-snip library: the direct leaf-to-leaf eBGP underlay + EVPN overlay, a VLAN-aware MAC-VRF, ESI-LAG multihomed access, an anycast IRB gateway, and the loopback.
- **Design mode** — explore the architecture, grounded in the JVD documentation corpus ([`../../../documentation/`](../../../documentation/)): datasheet, design guide, solution overview, and test report brief. Answers are cited to the docs.

## Quick start

1. Open a fresh chat in your AI.
2. Paste the fenced block from [`SYSTEM_PROMPT.md`](SYSTEM_PROMPT.md) into the system-prompt slot (or as your first message).
3. The assistant shows a **mode menu**. Pick Configuration or Design.
4. It fetches the corpus it needs from GitHub and proceeds.

One-click launch URLs (AIs with web fetch):

```bash
./make-launch-links.sh
```

For detailed usage + the tested-and-working AI compatibility list, see [Using BYOAI](https://github.com/Juniper/jvd/blob/main/portal/public/USING-BYOAI.md).

## Files in this folder

| File | Purpose |
|------|---------|
| [`SYSTEM_PROMPT.md`](SYSTEM_PROMPT.md) | The system prompt (paste the fenced block) |
| `jvd-collapsed-byoai-prompt.txt` | Extracted fenced block, standalone |
| `jvd-collapsed-snips.md` | Full snip bundle (Config-mode corpus) |
| `MANIFEST.json` | Per-snip index for on-demand fetch |
| [`TIERS.md`](TIERS.md) | feature → snip set per form tier |
| [`DEFAULTS.md`](DEFAULTS.md) | auto-fill lab defaults |
| [`OUTPUT_FORMAT.md`](OUTPUT_FORMAT.md) | required output shape |
| [`MENU.md`](MENU.md) | full catalog of generation asks |
| `regenerate-bundle.sh` | rebuild the bundle after snip changes |
| `make-manifest.py` | rebuild MANIFEST.json |
| `make-launch-links.sh` | print one-click launch URLs |

## Configuration mode vs Design mode

**Configuration mode** fetches the snip bundle (`jvd-collapsed-snips.md`) and generates config. **Design mode** fetches the design corpus and answers architecture questions, grounded and cited:

- [`../../../documentation/datasheet.md`](../../../documentation/datasheet.md) (fetched first)
- [`../../../documentation/design-guide.md`](../../../documentation/design-guide.md)
- [`../../../documentation/solution-overview.md`](../../../documentation/solution-overview.md)
- [`../../../documentation/test-report-brief.md`](../../../documentation/test-report-brief.md)

The snip bundle is not required for Design mode.

## Regenerating after snip changes

After editing any `.conf` in `../junos/`, or any file in this folder, re-run:

```bash
./regenerate-bundle.sh
```

This rebuilds `jvd-collapsed-snips.md`, extracts `jvd-collapsed-byoai-prompt.txt`, and regenerates `MANIFEST.json`. Then regenerate the portal mirror from the repo root:

```bash
node portal/scripts/generate-snips.mjs
```

and commit the refreshed `portal/public/byoai/collapsed_dc_fabric/`.
