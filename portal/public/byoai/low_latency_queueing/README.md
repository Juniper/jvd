# BYOAI — Low Latency QoS Design for 5G

**Bring Your Own AI** assistant bundle for the Low Latency QoS Design for 5G JVD. Works with any AI that has web-fetch capability (ChatGPT Plus, Claude Pro, Gemini Advanced, local models with browsing).

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
| `DEFAULTS.md` | Lab auto-fill values (device inventory and the first measured instance of each service on each router) |
| `OUTPUT_FORMAT.md` | Required output shape |
| `MENU.md` | Browser-facing catalog of generation asks |
| `jvd-llq-snips.md` | Full snip bundle (Config-mode corpus); each snip lists its Needs and, where the validated configuration lacks a referenced object, what is Not included |
| `jvd-llq-byoai-prompt.txt` | Extracted prompt (standalone, for launch URLs) |
| `MANIFEST.json` | Per-snip fetch manifest with each snip's same-device requirements and the references it cannot include |
| `regenerate-bundle.sh` | Rebuilds TIERS.md, MANIFEST.json, snips.md and prompt.txt after changes |
| `make-manifest.py` | Generates `MANIFEST.json` with the private builder |
| `make-launch-links.sh` | Prints ChatGPT/Claude/Gemini launch URLs |

## Configuration mode vs Design mode

**Configuration mode** generates source-backed building blocks from the [snip library](../). The AI fetches `jvd-llq-snips.md` once, then renders per your request. Services: EVPN-VPWS (with or without static flow labels), EVPN flexible cross-connect, L2 circuits, EVPN-ELAN, EVPN MAC-VRF with IRB, BGP-VPLS and L3VPN VRFs (with IRB or eBGP to the CE), in the `minimum` form: the service construct only, on a device that already runs its prerequisites, which the assistant lists. The larger tiers that [`TIERS.md`](TIERS.md) lists (`self-contained`, `as-deployed`) are **not qualified and not selectable** for this JVD, so the assistant never offers or renders them. The [device configurations](../../conf/) are the as-captured reference. Known limitations of the published configurations are in the library README [Scope](../README.md#scope).

**Design mode** answers architecture questions from the [documentation corpus](../../../documentation/). It fetches the [datasheet](../../../documentation/datasheet.md) first, then the [design guide](../../../documentation/design-guide.md), [solution overview](../../../documentation/solution-overview.md) and [test report brief](../../../documentation/test-report-brief.md) on demand.

## Regenerate

After any change to the snip library:

```bash
cd service_provider/low_latency_queueing/configuration/snips
JVD_BUILDER=<git-jvd-builder checkout> ./byoai/regenerate-bundle.sh
```

The script regenerates `TIERS.md` from the service forms and dependency projection in [`_composition.json`](../_composition.json) and `MANIFEST.json` with the private builder, then assembles the bundle with each snip's Needs and Not included blocks and the tier-qualification note above. Then run `JVD_REPO=<checkout> node $JVD_BUILDER/engine/js/generate-snips.mjs` to update the portal mirror.
