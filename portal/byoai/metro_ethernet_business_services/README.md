# Bring Your Own AI (BYOAI)

Use the AI service of your choice — Claude, GPT, Gemini, a local Ollama model, your enterprise Bedrock / Vertex / Azure deployment — to generate Junos and Junos Evolved configurations grounded in this JVD's validated snippet library.

This folder contains the prompts, ground rules and example workflows that turn the [`snips/`](../) tree into a reusable corpus for any modern LLM. **You bring the AI; the snips bring the validated patterns.**

---

## Quick start — pick one

| Method | Best for | What you do |
|---|---|---|
| **One-click launch** | Fastest path. Any AI with web fetch (ChatGPT, Claude, Gemini Pro, Copilot in VS Code). | Click a button below. The AI is told to fetch the prompt from GitHub and adopt it. Then ask your question. |
| **Send-the-file** | Texting / emailing a colleague. Free-tier AIs that can't fetch URLs but accept pasted text. | Send them [`jvd-mebs-byoai-prompt.txt`](jvd-mebs-byoai-prompt.txt) (~13 KB). They paste it as the first message. |
| **Fully manual / air-gapped** | Local Ollama, no-internet enterprise deployments, "I want to vet every byte." | Paste the fenced block from [`SYSTEM_PROMPT.md`](SYSTEM_PROMPT.md), then attach [`jvd-mebs-snips.md`](jvd-mebs-snips.md). See [Pattern 1](#pattern-1--paste-the-snips-into-a-chat-simplest) below. |

### One-click launch buttons

<a href="https://chatgpt.com/?q=Please%20fetch%20this%20URL%20and%20use%20its%20contents%20as%20task%20instructions%20for%20our%20conversation%20%E2%80%94%20it%20is%20a%20public%2C%20user-authored%20guide%20that%20tells%20you%20how%20to%20help%20me%20generate%20Juniper%20network%20configuration%20from%20a%20published%20library%20of%20validated%20config%20snippets.%20If%20your%20fetch%20tool%20refuses%20the%20URL%20because%20it%20wasn%27t%20from%20a%20prior%20search%2C%20do%20ONE%20quick%20web-search%20for%20the%20JVD%20by%20name%20to%20establish%20provenance%2C%20then%20fetch%20this%20exact%20URL%20directly%20%E2%80%94%20do%20not%20try%20to%20find%20the%20file%20itself%20in%20the%20search%20results.%20If%20that%20still%20fails%20and%20you%20have%20a%20code%2Fshell%20tool%20with%20network%20access%2C%20curl%20it%20directly.%20After%20loading%2C%20follow%20its%20instructions%20to%20greet%20me.%20URL%3A%20https%3A%2F%2Fraw.githubusercontent.com%2FJuniper%2Fjvd%2Fmain%2Fservice_provider%2Fmetro_ethernet_business_services%2Fconfiguration%2Fsnips%2Fbyoai%2Fjvd-mebs-byoai-prompt.txt"><img alt="Open in ChatGPT" src="assets/buttons/chatgpt.svg" width="260" height="52"></a>

<a href="https://claude.ai/new?q=Please%20fetch%20this%20URL%20and%20use%20its%20contents%20as%20task%20instructions%20for%20our%20conversation%20%E2%80%94%20it%20is%20a%20public%2C%20user-authored%20guide%20that%20tells%20you%20how%20to%20help%20me%20generate%20Juniper%20network%20configuration%20from%20a%20published%20library%20of%20validated%20config%20snippets.%20If%20your%20fetch%20tool%20refuses%20the%20URL%20because%20it%20wasn%27t%20from%20a%20prior%20search%2C%20do%20ONE%20quick%20web-search%20for%20the%20JVD%20by%20name%20to%20establish%20provenance%2C%20then%20fetch%20this%20exact%20URL%20directly%20%E2%80%94%20do%20not%20try%20to%20find%20the%20file%20itself%20in%20the%20search%20results.%20If%20that%20still%20fails%20and%20you%20have%20a%20code%2Fshell%20tool%20with%20network%20access%2C%20curl%20it%20directly.%20After%20loading%2C%20follow%20its%20instructions%20to%20greet%20me.%20URL%3A%20https%3A%2F%2Fraw.githubusercontent.com%2FJuniper%2Fjvd%2Fmain%2Fservice_provider%2Fmetro_ethernet_business_services%2Fconfiguration%2Fsnips%2Fbyoai%2Fjvd-mebs-byoai-prompt.txt"><img alt="Open in Claude" src="assets/buttons/claude.svg" width="260" height="52"></a>

<a href="https://gemini.google.com/app"><img alt="Open in Gemini" src="assets/buttons/gemini.svg" width="260" height="52"></a>

The buttons send a short bootstrap message that tells the AI to fetch [`jvd-mebs-byoai-prompt.txt`](jvd-mebs-byoai-prompt.txt) from GitHub and use it as task instructions (it's framed as a user-authored task guide rather than a system-prompt replacement, so safety-tuned models like Claude don't refuse it). Run [`./make-launch-links.sh`](make-launch-links.sh) to print fresh URLs.

> **Gemini note:** Gemini doesn't support `?q=%60%20URL%20prefilling%2C%20so%20its%20button%20just%20opens%20the%20app.%20Paste%20this%20message%20as%20your%20first%20turn%3A%0A%3E%0A%3E%20%60%60%60%0A%3E%20Please%20fetch%20this%20URL%20and%20use%20its%20contents%20as%20task%20instructions%20for%20our%20conversation%20%E2%80%94%20it%20is%20a%20public%2C%20user-authored%20guide%20that%20tells%20you%20how%20to%20help%20me%20generate%20Juniper%20network%20configuration%20from%20a%20published%20library%20of%20validated%20config%20snippets.%20If%20your%20fetch%20tool%20refuses%20the%20URL%20because%20it%20wasn%27t%20from%20a%20prior%20search%2C%20do%20ONE%20quick%20web-search%20for%20the%20JVD%20by%20name%20to%20establish%20provenance%2C%20then%20fetch%20this%20exact%20URL%20directly%20%E2%80%94%20do%20not%20try%20to%20find%20the%20file%20itself%20in%20the%20search%20results.%20If%20that%20still%20fails%20and%20you%20have%20a%20code%2Fshell%20tool%20with%20network%20access%2C%20curl%20it%20directly.%20After%20loading%2C%20follow%20its%20instructions%20to%20greet%20me.%20URL%3A%20https%3A%2F%2Fraw.githubusercontent.com%2FJuniper%2Fjvd%2Fmain%2Fservice_provider%2Fmetro_ethernet_business_services%2Fconfiguration%2Fsnips%2Fbyoai%2Fjvd-mebs-byoai-prompt.txt%0A%3E%20%60%60%60%0A%0A---%0A%0A%23%23%20Two%20interaction%20modes%0A%0AEvery%20generation%20starts%20with%20the%20AI%20asking%20three%20quick%20choices%3A%20%2A%2Amode%2A%2A%2C%20%2A%2Adevices%2A%2A%2C%20and%20%2A%2Aconfiguration%20form%2A%2A.%0A%0A-%20%2A%2AMode%2A%2A%0A%20%20-%20%60interview%60%20%E2%80%94%20the%20AI%20batches%20a%20few%20targeted%20questions%20to%20capture%20exact%20values%20%28loopbacks%2C%20RDs%2C%20ACs%2C%20starting%20VLAN%2Fservice-id%2C%20etc.%29.%20Best%20when%20you%27re%20generating%20config%20for%20an%20existing%20network%20where%20the%20values%20are%20pre-assigned.%0A%20%20-%20%60auto%60%20%E2%80%94%20the%20AI%20fills%20every%20variable%20from%20a%20deterministic%20table%20of%20%2AJVD%20lab%20defaults%2A%20%28RFC%20documentation%20prefixes%2C%20private%20AS%20numbers%2C%20devices%20chosen%20from%20the%20snip%20library%27s%20%60Seen%20on%3A%60%20headers%29.%20Best%20for%20demos%2C%20lab%20builds%2C%20training%20material%2C%20"give me a working example" workflows.

- **Devices** — `EVO`, `JUNOS`, `MIXED`, or your own hostnames (drawn from any snip's `Seen on:` header).

- **Configuration form** — controls how much config you get on top of the service itself
  - `minimum` — JUST the new service: routing-instance + AC interface unit + per-VRF policy (L3VPN). **Assumes the PE already has working IGP/SR underlay AND a BGP overlay with the right address-family activated.** Best for brownfield adds to a working PE.
  - `with-overlay` — `minimum` + the BGP overlay snip (so the `family evpn` / `family inet-vpn` / `family l2vpn` activation is re-asserted). Best when you're not sure the overlay activation is already there.
  - `as-deployed` — full JVD baseline: service + overlay + IGP/SR underlay + apply-group baselines + CoS + OAM + FAT-PW + BGP-CT. **Mirrors what the JVD actually ships.** Best for greenfield turn-up, lab build, or "give me a working example end-to-end."

> Greenfield / bootstrap requests (e.g. "build a new ACX7024 turn-up") are always treated as `as-deployed` regardless of what you pick.

In either mode the AI emits a YAML `# Inputs used:` block at the top of the output listing **every** value it chose, so the result is **reproducible** — paste that block back into a new chat and the AI regenerates the same config, or hand-edit one value and regenerate.

If the user's intent is a countable service ("Generate L3VPN VRFs", "Generate EVPN-VPWS services"):

- In `auto` mode the count defaults to **1** unless the intent stated otherwise (e.g., "Generate 3 EVPN-VPWS services" → count = 3).
- In `interview` mode the AI follows up with a single batched question covering count + per-service starting values (starting service-id, starting VLAN, starting AC unit) + per-PE starting values (loopbacks, RD/RT AS) + L3VPN-specific (PE-CE eBGP AS, customer prefix base). Reply with values, or `all defaults` / `skip` to accept everything.

Short-circuits: replying `all defaults`, `use defaults`, or `skip` at any point makes the AI fall back to auto-fill for everything still unanswered and generate immediately.

## What "auto" means — the lab-default rules

When you pick auto mode, the AI uses values from IETF documentation ranges and reserved private namespaces so the output is *visibly safe to share* and won't collide with anyone's real network:

| Domain | Pool / Value | Source |
|---|---|---|
| PE loopback v4 | `192.0.2.0/24` (TEST-NET-1) | RFC 5737 |
| PE loopback v6 | `2001:db8::/32` | RFC 3849 |
| PE-PE core links | `198.51.100.0/24` (TEST-NET-2), /31 per link | RFC 5737 |
| PE-CE links | `198.51.100.128/25` carved as /31s | RFC 5737 |
| Customer prefixes inside L3VPN | `203.0.113.0/24` (TEST-NET-3), /28 per VRF site | RFC 5737 |
| BGP AS (PE iBGP) | `65000` | RFC 6996 private 2-byte |
| RD / RT namespace AS | `64512` (deliberately distinct from BGP AS) | RFC 6996 private |
| CE eBGP AS | `65001` and up, per-VRF | RFC 6996 private |
| ESI | `00:11:22:33:44:55:66:NN:NN:NN` (last 3 bytes encode service-id) | clearly synthetic |
| Maintenance domain | `MD_64512` matching RD AS | matches snip examples |
| Apply-group / forwarding-class / scheduler-map names | kept literal | JVD-wide constants |

Full rule table — including how counts are seeded (VRF id from 2001, VPWS service-id from 4001, VLAN from 2001 skipping reserved IDs), how MEPs are numbered, and the device-selection logic — lives in [`SYSTEM_PROMPT.md`](SYSTEM_PROMPT.md) (Part 4).

## Device selection in auto mode

The AI needs to know which devices to target. Three shortcuts:

| You say | AI uses |
|---|---|
| `EVO` | `ma3_acx7100-48l` + `meg1_acx7100-32c` |
| `JUNOS` | `mse1_mx304` + `ma4_mx204` |
| `MIXED` | `mse1_mx304` (Junos) + `ma3_acx7100-48l` (EVO) |
| explicit hostnames | uses them verbatim, infers OS from the model code |

Or you can list any devices that appear in the snips' `Seen on:` headers.

---

## Why BYOAI

The [`snips/`](../) library was deliberately structured to be **machine-friendly grounding material**:

- One topic per file, the same topic file under both `junos/` and `evo/` so the model can pick the right OS dialect.
- Every snip header carries a `Seen on:` (which validated devices use this pattern), `Pair with:` (other snips needed for the same end-to-end service) and `Variables:` (the `$VAR` placeholders the snip uses, with example values).
- Bodies use `$VAR` placeholders for everything that varies per deployment (loopbacks, RDs, instance names, attachment-circuit interfaces, …); JVD-wide constants (apply-group names, forwarding-class names, scheduler maps, AS numbers) are kept literal so the model can't accidentally rename the architecture.
- A glossary in [`_variables.md`](../_variables.md) documents every placeholder used across the library.

Because the heavy lifting — *which features go together, how they're spelled on each OS, which values are constants vs. variables* — is already done in the snips, the AI's job reduces to **input → variable substitution + snip selection**. Frontier models are very good at this when you point them at the corpus.

---

## What you can ask an AI to generate

Practical examples:

- "Generate a complete EVPN-VPWS service config for `mse1_mx304` and `meg1_acx7100-32c` with VPWS service-id 4001, attachment-circuit `xe-0/1/4.4001` on the MX side and `et-0/0/0.4001` on the ACX side, both inside EVPN-VPWS instance `EVPN_VPWS_4001`."
- "I need 12 new L3VPN VRFs numbered METRO_BGPv4_L3VPN_3001…3012, each with RD `63536:3NNN` and route-target `target:63536:3NNN`. Produce the per-VRF policy, the VRF stanza, and the BGP overlay activation."
- "Take an1_mx204's existing edge LAG `ae0` and add three new ESI-multihomed customer units 510, 520, 530 in EVPN-ELAN MAC-VRFs 510/520/530."
- "Build an apply-group-driven baseline for a brand-new ACX7024 access node joining the metro: ISIS BCP, BGP BCP, edge interface template, FAT-PW, CoS classifiers, OAM CFM."
- "Diff the EVO and Junos versions of the schedulers snip and explain any meaningful behavioural difference."

The AI is doing **template assembly + parameter substitution against a curated corpus**, not freeform Junos-from-memory.

---

## Pick an AI service

Any modern frontier LLM works. The snip library is small enough (~62 files, ~150 KB) to fit comfortably in the context window of every model below.

### Tested baseline

| Model | Why |
|---|---|
| **Claude Opus 4.7** (Anthropic) | Strongest at long-context multi-file synthesis and at preserving Junos hierarchy exactly. Recommended when accuracy matters more than cost. |
| **Claude Sonnet 4.5** (Anthropic) | ~⅕ the cost of Opus, still excellent for snip-grounded generation. Recommended default for iterative work. |

### Other known-good frontier models

| Model | Notes |
|---|---|
| OpenAI GPT-5 / GPT-4.1 | Strong at structured output; ask it to return config in fenced code blocks. |
| Google Gemini 2.5 Pro | Very large context window — can ingest the entire `snips/` tree plus your existing device configs. |
| AWS Bedrock — any of the above | Use this if procurement / data-residency requires staying inside your AWS account. |
| Azure OpenAI | Same idea for Microsoft-aligned shops. |

### Local / on-prem (air-gapped)

| Model | Notes |
|---|---|
| Llama 3.1 70B Instruct (or newer) via Ollama / vLLM | Good results when the corpus fits in context. Below ~70B parameters the model starts hallucinating Junos hierarchy paths — verify carefully. |
| Mistral Large / Mixtral 8x22B | Comparable to Llama 3.1 70B. |

### What to avoid

- Models smaller than ~70B parameters or non-instruction-tuned models — they fabricate stanzas that don't exist (e.g., wrong nesting under `protocols { … }`, made-up knob names).
- Code-completion–only models (e.g., older Codex variants) — they are tuned for code tokens, not for following multi-step generation instructions against a grounded corpus.

**Bottom line:** the snip library is the source of truth. Any LLM strong enough to follow "only use patterns that appear in these files" will work; pick whichever your organization already trusts and has budget for.

---

## How to use the snips with your AI (three patterns)

### Pattern 1 — Paste the snips into a chat (simplest)

Best for one-off generation in a web chat UI (claude.ai, chatgpt.com, your enterprise portal).

**Load order matters: system prompt first, then the corpus.** The system prompt tells the AI how to behave (and how to detect a missing corpus); loading the corpus first will cause some models to start using it before they've seen the rules.

1. Start a new chat with your AI of choice. **Paste only the fenced ` ``` ` block from inside [`SYSTEM_PROMPT.md`](SYSTEM_PROMPT.md)** — not the whole `.md` file — into the system-prompt slot (or as your first user message in UIs that don't expose one). The block opens with an `ADOPT IMMEDIATELY` directive so the AI treats it as instructions rather than as a document to review.

2. Attach the bundled snip corpus: **[`jvd-mebs-snips.md`](jvd-mebs-snips.md)** (already in this folder). If your chat UI doesn't accept attachments, open the file and paste its contents inline.

3. Ask your generation question (see [Example prompts](#example-prompts) below). The system prompt includes a corpus-loaded check — if you forget step 2 the AI will tell you on its first reply.

> **Keeping the bundle current.** [`jvd-mebs-snips.md`](jvd-mebs-snips.md) is generated from the source files under [`../junos/`](../junos/), [`../evo/`](../evo/), and [`../_variables.md`](../_variables.md). After any change to those files, regenerate it with:
>
> ```bash
> ./regenerate-bundle.sh
> ```
>
> (run from this `byoai/` folder).

### Pattern 2 — Let the AI fetch the corpus from GitHub

Best for AI tools with web fetch enabled (ChatGPT with browsing, Claude with web search, Gemini, agents in VS Code / Cursor with the GitHub MCP server).

The system prompt has a corpus check that tries to fetch the bundled corpus directly from GitHub when no attachment is present. If your AI has a fetch tool, it will pull:

```
https://juniper.github.io/jvd/portal/byoai/metro_ethernet_business_services/jvd-mebs-snips.md
```

…on its own and proceed normally. You only need to:

1. Paste [`SYSTEM_PROMPT.md`](SYSTEM_PROMPT.md) as the system prompt.
2. Send your generation request.

The AI will acknowledge the fetch ("Loaded jvd-mebs-snips.md from the JVD repo on GitHub.") and continue.

If your AI has no fetch tool (free-tier ChatGPT, local Ollama, Claude without web search, API calls without tools), it will fall back to asking you to attach the file — in which case use Pattern 1.

### Pattern 3 — Render directly with the snip renderer (no AI required)

For deterministic substitution when you already know exactly which snips and which values, skip the AI entirely:

```bash
# List variables a snip needs:
~/git-scripts/snips_render.py --extract \
  service_provider/.../snips/junos/services/l3vpn-vrf.conf

# Render with concrete values from a JSON dict:
~/git-scripts/snips_render.py \
  service_provider/.../snips/junos/services/l3vpn-vrf.conf \
  vars.json > rendered.conf
```

Use the AI for **selection + parameter inference from natural language**; use the renderer for **deterministic substitution**. The two are complementary.

---

## Example prompts

### Auto mode — "give me a working example"

> Generate 3 EVPN-VPWS services and 2 L3VPN VRFs between an EVO and a Junos PE.

The AI's first reply asks for mode + device choice. You answer:

> auto, mixed

…and the AI generates the full config for both PEs, with an `Inputs used:` block at the top and a `Notes:` section at the end.

### Interview mode — brownfield change

> I have an existing JVD MEBS network. Add a new L3VPN service.

The AI's first reply asks mode + devices. You answer `interview, JUNOS`. It then batches:

> Need these to proceed (defaults shown — reply with values, or "all defaults" to accept):
> 1. Instance name (default: METRO_BGPv4_L3VPN_2001)
> 2. RD on mse1 / ma4 (default: 64512:2001 on both)
> 3. RT (default: target:64512:2001)
> 4. AC interface unit on each PE (default: 2001 on both)
> 5. PE-CE eBGP peer AS (default: 65001)
> 6. Customer prefix(es) inside the VRF (default: 203.0.113.0/28)

### Reproduce a previous generation

Paste back the `# Inputs used:` block from a prior output as your prompt. The AI regenerates byte-for-byte the same config.

### Audit / explain mode

> Read the snips under services/. Which services share an attachment-circuit pattern that uses vlan-ccc encapsulation, and which use vlan-bridge? Cite snip filenames.

---

## Limits & what the AI is *not* doing

- **No live device contact.** The AI is a config generator, not a deployment tool. Always review output before pushing to a router.
- **No state awareness.** The AI does not know what's already on your device. Provide existing device context if you want it to merge rather than overwrite.
- **No correctness proof.** Snippet provenance from the JVD gives high confidence that individual stanzas are valid, but the AI can still pick the wrong snip or supply an inconsistent value. Run `commit check` on a lab device.
- **Validate the variable substitution.** When an LLM is asked to fill `$VAR`s, check the rendered output for stray `$` signs or unsubstituted placeholders before committing.

---

## Files in this folder

| File | Purpose |
|---|---|
| `README.md` | This file. |
| `SYSTEM_PROMPT.md` | Drop-in system prompt that defines the AI's role, ground rules, auto-fill rules, and output format. Works with any LLM. |
| `jvd-mebs-snips.md` | Pre-bundled snip corpus — attach this to your AI chat after pasting the system prompt. |
| `regenerate-bundle.sh` | Re-creates `jvd-mebs-snips.md` from the current `../junos/`, `../evo/`, and `../_variables.md`. Run after any snip edit. |

---

## Roadmap

This folder is the documentation entry point. Future additions may include:

- A static "config generator" web UI hosted from this repo (form → API call to the user's chosen LLM → rendered config).
- A GitHub Actions workflow that takes inputs from an issue template and posts the generated config back as a PR comment.
- An MCP server exposing the snip library for native use inside Claude Desktop / VS Code Copilot / Cursor.

If you build something useful on top of this, contribute it back here.
