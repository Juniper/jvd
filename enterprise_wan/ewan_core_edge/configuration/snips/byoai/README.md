# BYOAI — Enterprise WAN Core and Edge

**Bring Your Own AI** assistant bundle for the Enterprise WAN Core and Edge JVD. Works with any AI that has web-fetch capability (ChatGPT Plus, Claude Pro, Gemini Advanced, local models with browsing).

## Quick start

1. Open a fresh chat in your AI of choice.
2. Paste the fenced block from [`SYSTEM_PROMPT.md`](SYSTEM_PROMPT.md) as the system prompt (or as the first user message).
3. The AI will greet you with the mode menu. Pick **Configuration** or **Design**.

Or use the one-click launch links: `./make-launch-links.sh`

## Files

| File | Purpose |
|------|---------|
| `SYSTEM_PROMPT.md` | The prompt (fenced block = paste this into your AI) |
| `TIERS.md` | Generated service → snip-set per form tier and device |
| `DEFAULTS.md` | Lab auto-fill values (device inventory, BGP overlay, example service values, numbering conventions) |
| `OUTPUT_FORMAT.md` | Required output shape |
| `MENU.md` | Browser-facing catalog of generation asks |
| `jvd-ewan-core-edge-snips.md` | Full snip bundle (Config-mode corpus) |
| `jvd-ewan-core-edge-byoai-prompt.txt` | Extracted prompt (standalone, for launch URLs) |
| `MANIFEST.json` | Per-snip index for on-demand fetch |
| `regenerate-bundle.sh` | Rebuilds snips.md + prompt.txt + MANIFEST after changes |
| `make-manifest.py` | Generates MANIFEST.json |
| `make-launch-links.sh` | Prints ChatGPT/Claude/Gemini launch URLs |

## Configuration mode vs Design mode

**Configuration mode** generates source-backed building blocks from the [snip library](../). The AI fetches `jvd-ewan-core-edge-snips.md` once, then renders per your request. Services: L3VPN VRFs with VRRP, hub-and-spoke L3VPN spoke and hub VRFs, BGP-VPLS, Layer 2 circuits, NG-MVPN VRFs and CE local switching, in the `minimum` form: the service construct only, on a device that already runs its prerequisites, which the assistant lists. The larger tiers in [`TIERS.md`](TIERS.md) are not dependency-qualified for this JVD, so the assistant does not offer them; the [device configurations](../../conf/) are the as-captured reference. Known limitations of the published configurations are in the library README [Scope](../README.md#scope).

**Design mode** answers architecture questions from the [documentation corpus](../../../documentation/). It fetches the [datasheet](../../../documentation/datasheet.md) first, then the [design guide](../../../documentation/design-guide.md), [solution overview](../../../documentation/solution-overview.md) and [test report brief](../../../documentation/test-report-brief.md) on demand.

## Regenerate

After any change to the snip library:

```bash
cd enterprise_wan/ewan_core_edge/configuration/snips
JVD_BUILDER=<git-jvd-builder checkout> ./byoai/regenerate-bundle.sh
```

The script regenerates `TIERS.md` from the service forms and dependency projection in [`_composition.json`](../_composition.json) and writes `MANIFEST.json`, both with the private builder. Then run `JVD_REPO=<checkout> node $JVD_BUILDER/engine/js/generate-snips.mjs` to update the portal mirror.
