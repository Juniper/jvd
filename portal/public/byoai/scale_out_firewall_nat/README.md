# BYOAI — Scale-Out Firewall and NAT

**Bring Your Own AI** assistant bundle for the Scale-Out Firewall and NAT JVD. Works with any AI that has web-fetch capability (ChatGPT Plus, Claude Pro, Gemini Advanced, local models with browsing).

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
| `DEFAULTS.md` | Lab auto-fill values (device inventory, NAT pools and the first measured instance of each service on each device) |
| `OUTPUT_FORMAT.md` | Required output shape |
| `MENU.md` | Browser-facing catalog of generation asks |
| `jvd-so-fwnat-snips.md` | Full snip bundle (Config-mode corpus); each snip lists its Needs and, where the validated configuration lacks a referenced object, what is Not included |
| `jvd-so-fwnat-byoai-prompt.txt` | Extracted prompt (standalone, for launch URLs) |
| `MANIFEST.json` | Per-snip fetch manifest with each snip's same-device requirements and the references it cannot include |
| `regenerate-bundle.sh` | Rebuilds TIERS.md, MANIFEST.json, snips.md and prompt.txt after changes |
| `make-manifest.py` | Generates `MANIFEST.json` with the private builder |
| `make-launch-links.sh` | Prints ChatGPT/Claude/Gemini launch URLs |

## Configuration mode vs Design mode

**Configuration mode** generates source-backed building blocks from the [snip library](../). The AI fetches `jvd-so-fwnat-snips.md` once, then renders per your request. Services: on the SRX nodes, source NAT, the trust-to-untrust security policies, Multinode High Availability with SRG 0, MNHA-VR inter-chassis link routing and VR-1 scale-out routing; on the MX, the four TLB instances, the gateway-facing units with TLB filter-based forwarding, and TRUST_VR, UNTRUST_VR and MNHA-VR routing. Only the `minimum` form (the service construct only) is selectable: the larger tiers in `TIERS.md` are not yet qualified for this JVD, so the assistant names a service's prerequisites instead of rendering them.

**Design mode** answers architecture questions from the [documentation corpus](../../../documentation/). It fetches the [datasheet](../../../documentation/datasheet.md) first, then the Enterprise ([design guide](../../../documentation/design-guide-enterprise.md), [solution overview](../../../documentation/solution-overview-enterprise.md), [test report brief](../../../documentation/test-report-brief-enterprise.md)) or Service Provider ([design guide](../../../documentation/design-guide-service-provider.md), [solution overview](../../../documentation/solution-overview-service-provider.md), [test report brief](../../../documentation/test-report-brief-service-provider.md)) documents for the variant you ask about, and cites them.

## Regenerate

After any change to the snip library:

```bash
cd security/scale_out_firewall_nat/configuration/snips
JVD_BUILDER=<git-jvd-builder checkout> ./byoai/regenerate-bundle.sh
```

The script regenerates `TIERS.md` from the service forms and dependency projection in [`_composition.json`](../_composition.json) and `MANIFEST.json` with the private builder, then assembles the bundle with each snip's Needs and Not included blocks and the tier-qualification note above. Then run `JVD_REPO=<jvd checkout> node $JVD_BUILDER/engine/js/generate-snips.mjs` to refresh the portal mirror.
