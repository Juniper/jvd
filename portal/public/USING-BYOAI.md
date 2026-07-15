# Using BYOAI (Bring Your Own AI)

BYOAI lets you drive a Juniper Validated Design (JVD) with an AI you already
use — Claude, ChatGPT, or Gemini — grounded in that JVD's published, validated
config snippet library and design documentation. There are **two modes**
(Configuration and Design) and **two ways to load the prompt** (fetch or attach).

> This page is the detailed companion to the **Design & Planner (BYOAI)** section
> of the [JVD Portal](https://juniper.github.io/jvd/portal/#byoai).

---

## How it works

1. On the portal, pick a JVD and click **Launch in Claude / ChatGPT**.
2. The launch opens a fresh chat pre-filled with a short bootstrap message that
   points the AI at that JVD's public **prompt file** and asks it to adopt the
   prompt as task instructions.
3. The AI fetches the prompt and greets you with a **mode menu**:
   - **Configuration mode** — a guided interview generates ready-to-deploy Junos /
     Junos Evolved config from the validated snip library. Strict: no invented syntax.
   - **Design mode** — explore the architecture, scale, and design decisions,
     grounded in the JVD documentation and cited.

**If the assistant replies with the mode menu, the fetch worked.** If it says it
cannot open the link, that AI/tier can't browse the web — use *attach or paste*
instead (below).

---

## Requirement: the AI must be able to fetch a URL — or you attach the prompt

Loading the prompt by URL requires an AI with **web access**. Not every tier can
do this (some free "fast" modes cannot browse). Two paths:

- **Fetch (default):** browsing-capable modes fetch the prompt automatically at
  launch.
- **Attach / paste (always works):** **download the prompt file** and attach it
  to your chat, or paste its contents as your first message. No web access needed.
  The portal's BYOAI section has a **Download prompt** link for the selected JVD.

> **Having trouble?** Download the prompt and attach it. If you only need config
> (not design Q&A), the portal's **Config Generator** (Stage 4 · Build) renders the
> same validated snips with no AI required.

---

## Tested & confirmed working

Model behavior changes over time, so this table is **date-stamped** and reflects
hands-on testing. "Launch-fetch" = the AI fetched the prompt from the URL at
launch. "Attach/paste" = the prompt was downloaded and attached or pasted.

_Last updated: 2026-07-15_

| AI | Tier | Model / mode | Launch-fetch | Attach / paste | Last tested | Notes |
|----|------|--------------|:------------:|:--------------:|-------------|-------|
| ChatGPT | Plus | GPT‑5 Thinking (Medium) | ✅ | — | 2026-07-15 | Confirmed working. |
| ChatGPT | Plus | Instant | ❓ | — | — | To test. |
| ChatGPT | Free | (model not disclosed) | ❓ | ❓ | — | Free tier often doesn't show which model is active. |
| Claude | Pro | (browsing-capable) | ❓ | — | — | To test; record exact model. |
| Claude | Free | (default) | ❓ | ❓ | — | To test. |
| Gemini | — | — | n/a | ❓ | — | No URL pre-fill; paste the prompt manually. |

Legend: ✅ works · ❌ does not work · ❓ untested · — not applicable.

> When you test a cell, **record the exact model/mode** you used. On tiers that
> don't disclose the model (some free tiers), note that explicitly.

---

## How to verify / re-test

The fastest end-to-end check is the launch itself: if the assistant answers with
the mode menu, fetch works on that account.

To isolate **whether the account can fetch a URL at all** (independent of the JVD
prompt), use the tiny probe files and a fixed question:

1. In a fresh chat, paste: **`Fetch this URL and follow the instruction inside it: <URL>`**
2. Use a probe URL (raw, `text/plain`):
   - `https://raw.githubusercontent.com/Juniper/jvd/main/portal/public/_fetch-probe/probe.txt`
3. A working fetch replies **exactly**:
   `PROBE-OK format=TXT line2=Banana lastfruit=Carrot`
   - The `format=` / `line2=` tokens come from *inside* the file, so a correct
     reply proves the AI actually read it (not guessed).
   - "I can't access that link" → that account can't browse; use attach/paste.

To also compare hosting/format (only matters for the one `.md` corpus file), test
the same probe as `.md` and from the GitHub Pages copy — see the probe folder.

---

## Can this be automated?

Partially. The public web chat UIs of the **free tiers** — which are the whole
point of BYOAI — have no official API and automating them violates provider terms,
so the compatibility matrix is verified **manually** with the probe above (fast:
one paste per cell).

What *can* be scripted:
- **URL liveness** — confirm every prompt/corpus/probe URL returns `200` with the
  expected `Content-Type` (a `curl` loop; this repo already does this in checks).
- **API-model fetch checks** — for models exposed via API with a web/fetch tool,
  a script can confirm fetch behavior. This does **not** cover the free web UIs.

---

## Fallback summary

| Situation | Do this |
|-----------|---------|
| AI fetched the prompt (mode menu shown) | Proceed — pick Configuration or Design. |
| AI can't open the link | Download the prompt, **attach or paste** it. |
| You only need config, no design Q&A | Use the portal **Config Generator** (Stage 4 · Build). |
| Gemini | Paste the prompt manually (no URL pre-fill). |
