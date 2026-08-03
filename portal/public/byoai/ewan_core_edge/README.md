# BYOAI — Enterprise WAN Core & Edge

**Bring Your Own AI** assistant bundle for the Enterprise WAN Core & Edge JVD. Works with any AI that has web-fetch capability (ChatGPT Plus, Claude Pro, Gemini Advanced, local models with browsing).

## Quick start

1. Open a fresh chat in your AI of choice.
2. Paste the fenced block from [`SYSTEM_PROMPT.md`](SYSTEM_PROMPT.md) as the system prompt (or as the first user message).
3. The AI will greet you with the mode menu. Pick **Configuration** or **Design**.

Or use the one-click launch links: `./make-launch-links.sh`

## Files

| File | Purpose |
|------|---------|
| `SYSTEM_PROMPT.md` | The prompt (fenced block = paste this into your AI) |
| `TIERS.md` | Service → snip-set per form tier |
| `DEFAULTS.md` | Lab auto-fill values (device inventory, addressing, conventions) |
| `OUTPUT_FORMAT.md` | Required output shape |
| `MENU.md` | Browser-facing catalog of generation asks |
| `jvd-ewan-core-edge-snips.md` | Full snip bundle (Config-mode corpus) |
| `jvd-ewan-core-edge-byoai-prompt.txt` | Extracted prompt (standalone, for launch URLs) |
| `MANIFEST.json` | Per-snip index for on-demand fetch |
| `regenerate-bundle.sh` | Rebuilds snips.md + prompt.txt + MANIFEST after changes |
| `make-manifest.py` | Generates MANIFEST.json |
| `make-launch-links.sh` | Prints ChatGPT/Claude/Gemini launch URLs |

## Configuration mode vs Design mode

**Configuration mode** generates validated config from the [snip library](../). The AI fetches `jvd-ewan-core-edge-snips.md` once, then renders per your request. Services: L3VPN (VRRP, Hub-and-Spoke), VPLS, L2CKT, NGMVPN.

**Design mode** answers architecture questions from the [documentation corpus](../../../documentation/). It fetches the datasheet first, then full docs on demand. Topics: LFA convergence, hub-and-spoke NGMVPN, hot-standby pseudowire failover, VPLS FAT PW ECMP.

## Regenerate

After any change to the snip library:

```bash
cd enterprise_wan/ewan_core_edge/configuration/snips
./byoai/regenerate-bundle.sh
```

Then also run `node portal/scripts/generate-snips.mjs` to update the portal mirror.
