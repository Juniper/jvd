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
| ChatGPT | Pro | GPT‑5.5 · Instant | ✅ | — | 2026-07-15 | Fetched cleanly. |
| ChatGPT | Pro | GPT‑5.5 · Medium | ✅ | — | 2026-07-15 | Fetched cleanly. |
| ChatGPT | Free | Instant (model not disclosed) | ✅ | — | 2026-07-15 | Fetched cleanly. Free tier often doesn't show the active model. |
| Claude | Pro | Sonnet 5 (app) | ✅ | ✅ | 2026-07-15 | Real BYOAI prompt + portal launch work. See injection note below. |
| Claude | Pro | Haiku 4.5 (app) | ✅ | ✅ | 2026-07-15 | Real BYOAI prompt + portal launch work. See injection note below. |
| Gemini | — | — | n/a | ❓ | — | No URL pre-fill; paste/attach the prompt manually. |

Legend: ✅ works · ❌ does not work · ❓ untested · — not applicable.

> **Injection note.** Some assistants (notably Claude) will **decline to obey an
> instruction that lives inside a fetched file** — that's correct prompt-injection
> resistance, not a fetch failure. The real BYOAI prompt is unaffected: it's framed
> as a user-authored task guide that explicitly does **not** override the model's
> safety rules, and it launches fine (confirmed on Claude Haiku 4.5 via the portal).
> Because of this, the verification probe below is **pure data** — you ask the
> question yourself rather than letting the file instruct the model.

> When you test a cell, **record the exact model/mode** you used. On tiers that
> don't disclose the model (some free tiers), note that explicitly.

---

## How to verify / re-test

The fastest end-to-end check is the launch itself: if the assistant answers with
the mode menu, fetch works on that account.

To isolate **whether the account can fetch a URL at all**, use the tiny **data-only**
probe. Ask the question **yourself** — don't rely on an instruction inside the file
(see the injection note above):

1. In a fresh chat, paste this (the request comes from *you*; the file is just data):
   **`Fetch this URL and tell me the second line, the last fruit, and the value of the format line: <URL>`**
2. Probe URL (raw, `text/plain`):
   - `https://raw.githubusercontent.com/Juniper/jvd/main/portal/public/_fetch-probe/probe.txt`
   - (`.md` variant: `.../probe.md`)
3. A working fetch answers: **second line = Banana, last fruit = Carrot, format = txt**
   (`md` for the `.md` file). If it says it can't open the link, that account can't
   browse — use attach/paste.

Do **not** put "reply with exactly …" style instructions inside the probe file — that
looks like prompt injection and some models will (correctly) refuse, giving a false
negative even though the fetch worked.

> **Caching note.** Prompt and probe URLs are CDN-cached (`raw` ~5 min, GitHub Pages
> ~10 min). Right after you *change* a file, an AI may briefly fetch the previous
> version — this only affects testing immediately after an edit, never a stable
> published prompt. To force-refresh while testing, append a throwaway query string
> (e.g. `…/probe.txt?cb=123`) or just wait out the TTL.

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
