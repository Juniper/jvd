# BYOAI — Bring Your Own AI (3-Stage Data Center · EVPN-VXLAN)

Generate validated Junos / Junos Evolved configuration for the **3-Stage
Data Center (EVPN-VXLAN)** JVD using any AI you already have (Claude,
ChatGPT, Gemini, a local model). The AI is grounded in this JVD's published,
validated snippet library — it does not invent syntax. The fabric is a
classic Apstra-built Clos: EVO spines (QFX5220-32CD), Junos leaves
(QFX5120-48Y), and border-leaves validated on both Junos (QFX5120-32C) and
EVO (QFX5130-32CD).

Two modes:

- **Configuration mode** — a guided interview produces ready-to-deploy config
  from the 53-snip library: an L2 vlan-aware MAC-VRF (EVPN-VXLAN) and an L3
  EVPN Type-5 VRF, over an eBGP Clos underlay + eBGP EVPN overlay with ERB
  anycast IRB gateways.
- **Design mode** (currently limited) — explore the architecture, grounded in
  the snip library + repo README + general Junos knowledge. The formal JVD
  documentation corpus (design guide / solution overview / test report brief /
  datasheet) has not been published for this JVD yet; once it is, this bundle
  will be refreshed to fetch and cite it.

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
| `jvd-3stage-dc-byoai-prompt.txt` | Extracted fenced block, standalone |
| `jvd-3stage-dc-snips.md` | Full snip bundle (Config-mode corpus) |
| `MANIFEST.json` | Per-snip index for on-demand fetch |
| [`TIERS.md`](TIERS.md) | service kind → snip set per form tier |
| [`DEFAULTS.md`](DEFAULTS.md) | auto-fill lab defaults |
| [`OUTPUT_FORMAT.md`](OUTPUT_FORMAT.md) | required output shape |
| [`MENU.md`](MENU.md) | full catalog of generation asks |
| `regenerate-bundle.sh` | rebuild the bundle after snip changes |
| `make-manifest.py` | rebuild MANIFEST.json |
| `make-launch-links.sh` | print one-click launch URLs |

## Configuration mode vs Design mode

**Configuration mode** fetches the snip bundle (`jvd-3stage-dc-snips.md`)
and generates config. **Design mode** is currently limited: it answers
architecture questions from the snip library + repo README + general Junos
knowledge, and says so. There is no published `documentation/` corpus for
this JVD yet — when it lands (via jvd-documentation-ingest), Design mode
will be wired to fetch and cite:

- `../../../documentation/datasheet.md`
- `../../../documentation/design-guide.md`
- `../../../documentation/solution-overview.md`
- `../../../documentation/test-report-brief.md`

The snip bundle is not required for Design mode.

## Regenerating after snip changes

After editing any `.conf` in `../junos/` or `../evo/`, or any file in
this folder, re-run:

```bash
./regenerate-bundle.sh
```

This rebuilds `jvd-3stage-dc-snips.md`, extracts `jvd-3stage-dc-byoai-prompt.txt`,
and regenerates `MANIFEST.json`. Then regenerate the portal mirror from
the repo root:

```bash
node portal/scripts/generate-snips.mjs
```

and commit the refreshed `portal/public/byoai/3stage_dc/`.
