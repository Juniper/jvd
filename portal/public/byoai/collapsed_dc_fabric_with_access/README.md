# BYOAI — Collapsed Data Center Fabric with Access Switches (collapsed-access)

**Bring Your Own AI.** This folder turns any capable LLM (Claude, ChatGPT,
Gemini, a local model) into an assistant for the Juniper **Collapsed Data
Center Fabric with Access Switches** Validated Design Extension (JVDE) —
a two-switch EVPN-VXLAN collapsed-spine fabric extended with an
EX4400-48MP access-switch layer for port expansion, built with Apstra.

The assistant has **two modes**:

- **Configuration mode** — generates validated Junos config from this
  JVD's snippet library (6 snips). Strict and hallucination-free: it only
  emits patterns that appear in the validated snips.
- **Design mode** — explains the architecture, grounded in the JVD
  documentation corpus, with citations.

Both tiers run **Junos OS** — this is a junos-only library.

---

## Quick start

1. Open `SYSTEM_PROMPT.md`. Copy **only the fenced block** into your AI's
   system-prompt slot (or paste it as your first message in a fresh chat).
2. The assistant greets you with a **mode menu**. Pick Configuration or
   Design (or just describe what you need).
3. **Configuration mode:** it fetches the snip bundle
   (`jvd-collapsed-access-snips.md`) and runs a short interview
   (feature / devices / form), then emits ready-to-deploy config.
4. **Design mode:** it fetches the documentation datasheet first, then
   the fuller docs as needed, and answers with citations.

No web access on your AI account? See **Offline / no-fetch** below.

## What's in this folder

| File                 | Purpose                                                        |
| -------------------- | ------------------------------------------------------------- |
| `SYSTEM_PROMPT.md`   | The system prompt. Paste the fenced block into your AI.        |
| `TIERS.md`           | Feature → snip-set mapping for `minimum` / `as-deployed`.      |
| `DEFAULTS.md`        | Deterministic JVD lab values for `auto` mode.                 |
| `OUTPUT_FORMAT.md`   | Exact output shape (Inputs Used + per-device blocks + Notes). |
| `MENU.md`            | Browser-facing catalog of what the assistant can do.          |
| `README.md`          | This file.                                                    |
| `regenerate-bundle.sh` | Rebuilds `jvd-collapsed-access-snips.md` from the corpus.    |
| `make-manifest.py`   | Emits `MANIFEST.json` (snip inventory + fetch URLs).          |
| `make-launch-links.sh` | Prints ready-to-click launch URLs for hosted AIs.           |
| `jvd-collapsed-access-snips.md` | Generated single-file bundle (all snip bodies + refs). |
| `jvd-collapsed-access-byoai-prompt.txt` | Generated plain-text system prompt.          |

## Offline / no-fetch

If your AI can't browse the web:

- **Configuration mode:** paste the contents of
  `jvd-collapsed-access-snips.md` (run `regenerate-bundle.sh` to build it)
  after the system prompt. Or use the portal
  [Config Generator](https://juniper.github.io/jvd/portal/#generator).
- **Design mode:** paste `../../../documentation/datasheet.md` (it's
  short) — the assistant will tell you it's running from a pasted corpus,
  not a fetched one.

## Regenerating the bundle

```sh
./regenerate-bundle.sh      # rebuilds jvd-collapsed-access-snips.md + prompt txt
python3 make-manifest.py    # rebuilds MANIFEST.json
./make-launch-links.sh      # prints launch URLs
```

## Scope

This library is the **access-layer extension**: the access-tier direct
EVPN fabric (l3clos-a / l3clos-a-evpn), the EX4400 VTEP config, EVPN-VXLAN
forwarding, the VLAN-aware MAC-VRF, and the all-active ESI-LAGs (access→leaf
uplink and server→access downlink). For the **base collapsed leaf** config
(direct l3clos-l underlay/overlay, anycast IRB, server ESI-LAG on the
leaves) see the base **Collapsed Data Center Fabric** JVD.
