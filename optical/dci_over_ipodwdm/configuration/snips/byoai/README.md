# BYOAI — Data Center Interconnect over IPoDWDM (dci-ipodwdm)

**Bring Your Own AI.** This folder turns any capable LLM (Claude, ChatGPT, Gemini,
a local model) into an assistant for the Juniper **Data Center Interconnect over
IPoDWDM** Validated Design (JVD-OPTICS-BASE-01-01) — Converged Optical Routing
Architecture (CORA), where Juniper 400G Coherent Optics plug directly into the
router and connect to the DWDM line system with no external transponder.

The assistant has **two modes**:

- **Configuration mode** — generates validated Junos / Junos Evolved config from
  this JVD's snippet library (9 snips). Strict and hallucination-free.
- **Design mode** — explains the architecture, grounded in the JVD documentation
  corpus, with citations.

This JVD spans **two operating systems**: PTX10001-36MR and ACX7100-48L run Junos
OS Evolved (`evo/`); MX304 runs Junos OS (`junos/`).

---

## Quick start

1. Open `SYSTEM_PROMPT.md`. Copy **only the fenced block** into your AI's
   system-prompt slot (or paste it as your first message in a fresh chat).
2. The assistant greets you with a **mode menu**. Pick Configuration or Design
   (or just describe what you need).
3. **Configuration mode:** it fetches the snip bundle (`jvd-dci-ipodwdm-snips.md`)
   and runs a short interview (feature / devices / form), then emits
   ready-to-deploy config.
4. **Design mode:** it fetches the documentation datasheet first, then the fuller
   docs as needed, and answers with citations.

No web access on your AI account? See **Offline / no-fetch** below.

## What's in this folder

| File | Purpose |
|------|---------|
| `SYSTEM_PROMPT.md` | The system prompt. Paste the fenced block into your AI. |
| `TIERS.md` | Feature → snip-set mapping for `minimum` / `as-deployed`. |
| `DEFAULTS.md` | Deterministic JVD lab values for `auto` mode. |
| `OUTPUT_FORMAT.md` | Exact output shape (Inputs Used + per-device blocks + Notes). |
| `MENU.md` | Browser-facing catalog of what the assistant can do. |
| `README.md` | This file. |
| `regenerate-bundle.sh` | Rebuilds `jvd-dci-ipodwdm-snips.md` from the corpus. |
| `make-manifest.py` | Emits `MANIFEST.json` (snip inventory + fetch URLs). |
| `make-launch-links.sh` | Prints ready-to-click launch URLs for hosted AIs. |
| `jvd-dci-ipodwdm-snips.md` | Generated single-file bundle (all snip bodies + refs). |
| `jvd-dci-ipodwdm-byoai-prompt.txt` | Generated plain-text system prompt. |

## Offline / no-fetch

If your AI can't browse the web:

- **Configuration mode:** paste the contents of `jvd-dci-ipodwdm-snips.md` (run
  `regenerate-bundle.sh` to build it) after the system prompt. Or use the portal
  [Config Generator](https://juniper.github.io/jvd/portal/#generator).
- **Design mode:** paste `../../../documentation/datasheet.md` (it's short) — the
  assistant will tell you it's running from a pasted corpus, not a fetched one.

## Regenerating the bundle

```sh
./regenerate-bundle.sh      # rebuilds jvd-dci-ipodwdm-snips.md + prompt txt
python3 make-manifest.py    # rebuilds MANIFEST.json
./make-launch-links.sh      # prints launch URLs
```

## Scope

This library covers the **IPoDWDM transport layer**: coherent 400G optics, DWDM
aggregated-ethernet core links, chassis enablement (aggregated-devices, MX
channelization), and the loopback. The routing/underlay (BGP, MPLS/RSVP, VRF)
used in the validation test bed is deployment-specific scaffolding and is out of
scope; see the full device configs under [../../conf/](../../conf/).
