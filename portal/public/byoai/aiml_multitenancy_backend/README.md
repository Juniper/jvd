# BYOAI — Bring Your Own AI (AI/ML Multi-Tenancy Backend · EVPN-VXLAN GPU fabric)

Generate validated Junos Evolved configuration for the **AI/ML Multi-Tenancy
Backend (EVPN-VXLAN GPU fabric)** JVD using any AI you already have (Claude,
ChatGPT, Gemini, a local model). The AI is grounded in this JVD's published,
validated snippet library — it does not invent syntax. The fabric is a pure-L3
eBGP Clos of eight **QFX5240-64OD** nodes (4 spines, 4 leaves), all Junos
Evolved, tuned for AI/RoCE workloads: RoCEv2 lossless CoS (PFC/ECN), ECMP DLB
flowlet load-balancing, 400G breakouts, and per-tenant VRFs.

Two modes:

- **Configuration mode** — a guided interview produces ready-to-deploy config
  from the 23-snip library: per-tenant EVPN Type-5 VRFs, RoCEv2 lossless CoS,
  DLB/ECMP, and the eBGP Clos underlay + EVPN overlay.
- **Design mode** — explore the architecture, grounded in the JVD documentation
  corpus ([`../../../documentation/`](../../../documentation/)): datasheet,
  design guide, solution overview, and test report brief. Answers are cited to
  the docs.

## Quick start

1. Open a fresh chat in your AI.
2. Paste the fenced block from [`SYSTEM_PROMPT.md`](SYSTEM_PROMPT.md)
   into the system-prompt slot (or as your first message).
3. The assistant shows a **mode menu**. Pick Configuration or Design.
4. It fetches the corpus it needs from GitHub and proceeds.

One-click launch URLs (AIs with web fetch):

```bash
./make-launch-links.sh
```

For detailed usage + the tested-and-working AI compatibility list, see
[Using BYOAI](https://github.com/Juniper/jvd/blob/main/portal/public/USING-BYOAI.md).

## Files in this folder

| File | Purpose |
|------|---------|
| [`SYSTEM_PROMPT.md`](SYSTEM_PROMPT.md) | The system prompt (paste the fenced block) |
| `jvd-aiml-mtb-byoai-prompt.txt` | Extracted fenced block, standalone |
| `jvd-aiml-mtb-snips.md` | Full snip bundle (Config-mode corpus) |
| `MANIFEST.json` | Per-snip index for on-demand fetch |
| [`TIERS.md`](TIERS.md) | service → snip set per form tier |
| [`DEFAULTS.md`](DEFAULTS.md) | auto-fill lab defaults |
| [`OUTPUT_FORMAT.md`](OUTPUT_FORMAT.md) | required output shape |
| [`MENU.md`](MENU.md) | full catalog of generation asks |
| `regenerate-bundle.sh` | rebuild the bundle after snip changes |
| `make-manifest.py` | rebuild MANIFEST.json |
| `make-launch-links.sh` | print one-click launch URLs |

## Configuration mode vs Design mode

**Configuration mode** fetches the snip bundle (`jvd-aiml-mtb-snips.md`)
and generates config. **Design mode** fetches the design corpus and answers
architecture questions, grounded and cited:

- [`../../../documentation/datasheet.md`](../../../documentation/datasheet.md) (fetched first)
- [`../../../documentation/design-guide.md`](../../../documentation/design-guide.md)
- [`../../../documentation/solution-overview.md`](../../../documentation/solution-overview.md)
- [`../../../documentation/test-report-brief.md`](../../../documentation/test-report-brief.md)

The snip bundle is not required for Design mode.

## Regenerating after snip changes

After editing any `.conf` in `../evo/`, or any file in this folder, re-run:

```bash
./regenerate-bundle.sh
```

This rebuilds `jvd-aiml-mtb-snips.md`, extracts `jvd-aiml-mtb-byoai-prompt.txt`,
and regenerates `MANIFEST.json`. Then regenerate the portal mirror from
the repo root:

```bash
node portal/scripts/generate-snips.mjs
```

and commit the refreshed `portal/public/byoai/aiml_multitenancy_backend/`.
