# BYOAI — Bring Your Own AI (Scale-Out Stateful Firewall & NAT / CSDS ScaleOut)

Generate validated Junos configuration for the **Scale-Out Stateful
Firewall & NAT** (Connected Security Distributed Services — CSDS
ScaleOut) JVD using any AI you already have (Claude, ChatGPT, Gemini, a
local model). The AI is grounded in this JVD's published, validated
snippet library — it does not invent syntax.

Two modes:

- **Configuration mode** — a guided interview produces ready-to-deploy
  config from the 21-snip library (the MX RE-based TLB load balancer,
  the SRX stateful-firewall + source-NAT (NAPT44) gateway, SRX MNHA,
  the scale-out BGP planes, and the gateway emulator).
- **Design mode** — explore the architecture, grounded in the JVD
  documentation corpus (`../../../documentation/`). This JVD ships in
  **two deployment focuses** — Enterprise (Source NAT) and Service
  Provider (CGNAT) — and Design mode frames answers for whichever you
  pick.

> **NAT scope:** the validated feature is source-NAT **NAPT44**
> (RFC6598 100.64/10, address-pooling paired). NAT64, DetNAT, PBA and
> DS-Lite are non-goals of this design.

## Quick start

1. Open a fresh chat in your AI.
2. Paste the fenced block from [`SYSTEM_PROMPT.md`](SYSTEM_PROMPT.md)
   into the system-prompt slot (or as your first message).
3. The assistant shows a **mode menu**. Pick Configuration or Design.
4. It fetches the corpus it needs from GitHub and proceeds. In Design
   mode it fetches the shared datasheet first, then asks whether to
   frame for Enterprise or Service Provider.

One-click launch URLs (AIs with web fetch):

```bash
./make-launch-links.sh
```

## Files in this folder

| File | Purpose |
|------|---------|
| [`SYSTEM_PROMPT.md`](SYSTEM_PROMPT.md) | The system prompt (paste the fenced block) |
| `jvd-so-fwnat-byoai-prompt.txt` | Extracted fenced block, standalone |
| `jvd-so-fwnat-snips.md` | Full snip bundle (Config-mode corpus) |
| `MANIFEST.json` | Per-snip index for on-demand fetch |
| [`TIERS.md`](TIERS.md) | device role → snip set per form tier |
| [`DEFAULTS.md`](DEFAULTS.md) | auto-fill lab defaults |
| [`OUTPUT_FORMAT.md`](OUTPUT_FORMAT.md) | required output shape |
| [`MENU.md`](MENU.md) | full catalog of generation asks |
| `regenerate-bundle.sh` | rebuild the bundle after snip changes |
| `make-manifest.py` | rebuild MANIFEST.json |
| `make-launch-links.sh` | print one-click launch URLs |

## Configuration mode vs Design mode

**Configuration mode** fetches the snip bundle (`jvd-so-fwnat-snips.md`)
and generates config. **Design mode** fetches the design corpus and
answers architecture questions, grounded and cited. Because this JVD is
published for two audiences, Design mode fetches the shared datasheet,
then the variant docs for the chosen focus:

- Shared: [`../../../documentation/datasheet.md`](../../../documentation/datasheet.md)
- Enterprise (Source NAT): [`design-guide-enterprise.md`](../../../documentation/design-guide-enterprise.md) · [`solution-overview-enterprise.md`](../../../documentation/solution-overview-enterprise.md) · [`test-report-brief-enterprise.md`](../../../documentation/test-report-brief-enterprise.md)
- Service Provider (CGNAT): [`design-guide-service-provider.md`](../../../documentation/design-guide-service-provider.md) · [`solution-overview-service-provider.md`](../../../documentation/solution-overview-service-provider.md) · [`test-report-brief-service-provider.md`](../../../documentation/test-report-brief-service-provider.md)

The snip bundle is not required for Design mode.

## Regenerating after snip changes

```bash
./regenerate-bundle.sh   # rebuilds jvd-so-fwnat-snips.md + prompt.txt + MANIFEST.json
```

Then refresh the portal mirror from the repo root:

```bash
node portal/scripts/generate-snips.mjs
```
