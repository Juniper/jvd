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
| `TIERS.md` | Generated service → snip-set per form tier and device. Only `minimum` is qualified and selectable for this JVD (see below) |
| `DEFAULTS.md` | Lab auto-fill values (device inventory, BGP overlay, example service values, numbering conventions) |
| `OUTPUT_FORMAT.md` | Required output shape |
| `MENU.md` | Browser-facing catalog of generation asks |
| `jvd-ewan-core-edge-snips.md` | Full snip bundle (Config-mode corpus) |
| `jvd-ewan-core-edge-byoai-prompt.txt` | Extracted prompt (standalone, for launch URLs) |
| `regenerate-bundle.sh` | Rebuilds TIERS.md, snips.md and prompt.txt after changes |
| `make-manifest.py` | Generates `MANIFEST.json` once the same-device dependency declaration is qualified; not used for this JVD yet |
| `make-launch-links.sh` | Prints ChatGPT/Claude/Gemini launch URLs |

This bundle has no `MANIFEST.json`. The manifest is derived from a qualified same-device dependency
declaration, which this JVD does not have: the published configurations reference interfaces and
loopbacks that they do not define (library README [Scope](../README.md#scope)).

## Configuration mode vs Design mode

**Configuration mode** generates source-backed building blocks from the [snip library](../). The AI fetches `jvd-ewan-core-edge-snips.md` once, then renders per your request. Services: L3VPN VRFs with VRRP, hub-and-spoke L3VPN spoke and hub VRFs, BGP-VPLS, Layer 2 circuits, NG-MVPN VRFs and CE local switching, in the `minimum` form: the service construct only, on a device that already runs its prerequisites, which the assistant lists. The larger tiers that [`TIERS.md`](TIERS.md) lists (`self-contained`, `as-deployed`) are **not qualified and not selectable** for this JVD: they are computed from same-device dependencies that are not yet qualified, so the assistant never offers or renders them. The [device configurations](../../conf/) are the as-captured reference. Known limitations of the published configurations are in the library README [Scope](../README.md#scope).

**Design mode** answers architecture questions from the [documentation corpus](../../../documentation/). It fetches the [datasheet](../../../documentation/datasheet.md) first, then the [design guide](../../../documentation/design-guide.md), [solution overview](../../../documentation/solution-overview.md) and [test report brief](../../../documentation/test-report-brief.md) on demand.

## Regenerate

After any change to the snip library:

```bash
cd enterprise_wan/ewan_core_edge/configuration/snips
JVD_BUILDER=<git-jvd-builder checkout> ./byoai/regenerate-bundle.sh
```

The script regenerates `TIERS.md` from the service forms and dependency projection in [`_composition.json`](../_composition.json) with the private builder, and adds the tier-qualification note above to the bundle. It writes `MANIFEST.json` only when the library declares a qualified dependency contract. Then run `JVD_REPO=<checkout> node $JVD_BUILDER/engine/js/generate-snips.mjs` to update the portal mirror.
