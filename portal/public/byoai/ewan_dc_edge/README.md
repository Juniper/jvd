# BYOAI — Enterprise Data Center Edge

**Bring Your Own AI** assistant bundle for the Enterprise Data Center Edge JVD. Works with any AI that has web-fetch capability (ChatGPT Plus, Claude Pro, Gemini Advanced, local models with browsing).

## Quick start

1. Open a fresh chat in your AI of choice.
2. Paste the fenced block from [`SYSTEM_PROMPT.md`](SYSTEM_PROMPT.md) as the system prompt (or as the first user message).
3. The AI will greet you with the mode menu. Pick **Configuration** or **Design**.

Or use the one-click launch links: `./make-launch-links.sh`

## Files

| File | Purpose |
|------|---------|
| `SYSTEM_PROMPT.md` | The prompt (fenced block = paste this into your AI) |
| `TIERS.md` | Service → snip-set per form tier, plus each device's validated baseline |
| `DEFAULTS.md` | Lab auto-fill values (device inventory, example service values, numbering conventions) |
| `OUTPUT_FORMAT.md` | Required output shape |
| `MENU.md` | Browser-facing catalog of generation asks |
| `jvd-ewan-dc-edge-snips.md` | Full snip bundle (Config-mode corpus) |
| `jvd-ewan-dc-edge-byoai-prompt.txt` | Extracted prompt (standalone, for launch URLs) |
| `MANIFEST.json` | Per-snip index for on-demand fetch |
| `regenerate-bundle.sh` | Rebuilds snips.md + prompt.txt + MANIFEST after changes |
| `make-manifest.py` | Generates MANIFEST.json |
| `make-launch-links.sh` | Prints ChatGPT/Claude/Gemini launch URLs |

## Configuration mode vs Design mode

**Configuration mode** generates validated configuration from the [snip library](../). The AI fetches `jvd-ewan-dc-edge-snips.md` once, then renders per your request. Services: the EVPN-VXLAN to EVPN-MPLS interconnect on the data center edge (VLAN-based with IRB, VLAN bundle), EVPN-VXLAN MAC-VRFs on the leaves, and EVPN-MPLS ELAN instances on the WAN edge. Constructs the library does not yet cover are listed in the library README [Scope](../README.md#scope).

**Design mode** answers architecture questions from the [documentation corpus](../../../documentation/). It fetches the [datasheet](../../../documentation/datasheet.md) first, then the [design guide](../../../documentation/design-guide.md), [solution overview](../../../documentation/solution-overview.md) and [test report brief](../../../documentation/test-report-brief.md) on demand.

## Regenerate

After any change to the snip library:

```bash
cd enterprise_wan/ewan_dc_edge/configuration/snips
JVD_BUILDER=<git-jvd-builder checkout> ./byoai/regenerate-bundle.sh
```

`TIERS.md` is maintained from the snippet headers and the dependency declarations in [`_composition.json`](../_composition.json); refresh it when they change. Then run `JVD_REPO=<checkout> node $JVD_BUILDER/engine/js/generate-snips.mjs` to update the portal mirror.
