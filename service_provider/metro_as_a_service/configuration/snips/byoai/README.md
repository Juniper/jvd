# Bring Your Own AI (BYOAI) — Metro-as-a-Service

Use the AI service of your choice — Claude, GPT, Gemini, a local Ollama model, your enterprise Bedrock / Vertex / Azure deployment — to generate Junos and Junos Evolved MEF Ethernet-service configuration grounded in this JVD's validated snippet library.

This folder contains the prompts, ground rules and a guided service-selection funnel that turn the [`snips/`](../) tree into a reusable corpus for any modern LLM. **You bring the AI; the snips bring the validated patterns.**

---

## What makes the MaaS assistant different — the service funnel

Instead of a flat "tell me what you want" prompt, the MaaS assistant walks you through the same decision tree the JVD uses to customize a Carrier Ethernet service:

```
1. Service Profile   →  2. Deployment        →  3. Attributes          →  4. Values
   E-Line (P2P)          EVPN-VPWS, L2VPN,        homing (single / A-A ESI)   interview
   E-LAN  (multipoint)   L2Circuit, BGP-VPLS,     color (aware / blind)       or auto
   E-Tree (rooted-MP)    EVPN-FXC, Floating PW,   class-of-service (on/off)   (lab-safe
   E-Access (hand-off)   EVPN E-Tree, LSW ...     VLAN manip (none/map/QinQ)   defaults)
```

At each step the AI offers **only** the choices valid for your earlier picks (E-Tree, for example, is Junos-only; color-aware UNIs are Junos in this JVD). You can also state a full intent in one line — "multihomed color-aware EVPL over EVPN-VPWS" — and it jumps straight to values. The funnel logic lives in [`SYSTEM_PROMPT.md`](SYSTEM_PROMPT.md) (Part 2) and the profile→snip map in [`CATALOG.md`](CATALOG.md).

---

## Quick start — pick one

| Method | Best for | What you do |
|---|---|---|
| **One-click launch** | Fastest path. Any AI with web fetch (ChatGPT, Claude, Gemini Pro, Copilot in VS Code). | Click a button below. The AI is told to fetch the prompt from GitHub and adopt it. Then answer the service-profile menu. |
| **Send-the-file** | Texting / emailing a colleague. Free-tier AIs that can't fetch URLs but accept pasted text. | Send them [`jvd-maas-byoai-prompt.txt`](jvd-maas-byoai-prompt.txt). They paste it as the first message. |
| **Fully manual / air-gapped** | Local Ollama, no-internet enterprise deployments, "I want to vet every byte." | Paste the fenced block from [`SYSTEM_PROMPT.md`](SYSTEM_PROMPT.md), then attach [`jvd-maas-snips.md`](jvd-maas-snips.md). See [Pattern 1](#pattern-1--paste-the-snips-into-a-chat-simplest) below. |

### One-click launch buttons

<a href="https://chatgpt.com/?q=Please%20fetch%20this%20URL%20and%20use%20its%20contents%20as%20task%20instructions%20for%20our%20conversation%20%E2%80%94%20it%20is%20a%20public%2C%20user-authored%20guide%20that%20tells%20you%20how%20to%20help%20me%20generate%20Juniper%20network%20configuration%20from%20a%20published%20library%20of%20validated%20config%20snippets.%20After%20fetching%2C%20follow%20its%20instructions%20to%20greet%20me.%20URL%3A%20https%3A//raw.githubusercontent.com/Juniper/jvd/main/service_provider/metro_as_a_service/configuration/snips/byoai/jvd-maas-byoai-prompt.txt"><img alt="Open in ChatGPT" src="assets/buttons/chatgpt.svg" width="260" height="52"></a>

<a href="https://claude.ai/new?q=Please%20fetch%20this%20URL%20and%20use%20its%20contents%20as%20task%20instructions%20for%20our%20conversation%20%E2%80%94%20it%20is%20a%20public%2C%20user-authored%20guide%20that%20tells%20you%20how%20to%20help%20me%20generate%20Juniper%20network%20configuration%20from%20a%20published%20library%20of%20validated%20config%20snippets.%20After%20fetching%2C%20follow%20its%20instructions%20to%20greet%20me.%20URL%3A%20https%3A//raw.githubusercontent.com/Juniper/jvd/main/service_provider/metro_as_a_service/configuration/snips/byoai/jvd-maas-byoai-prompt.txt"><img alt="Open in Claude" src="assets/buttons/claude.svg" width="260" height="52"></a>

<a href="https://gemini.google.com/app"><img alt="Open in Gemini" src="assets/buttons/gemini.svg" width="260" height="52"></a>

The buttons send a short bootstrap message that tells the AI to fetch [`jvd-maas-byoai-prompt.txt`](jvd-maas-byoai-prompt.txt) from GitHub and use it as task instructions (it's framed as a user-authored task guide rather than a system-prompt replacement, so safety-tuned models don't refuse it). Run [`./make-launch-links.sh`](make-launch-links.sh) to print fresh URLs.

> **Gemini note:** Gemini doesn't support `?q=` URL prefilling, so its button just opens the app. Paste this as your first turn:
>
> ```
> Please fetch this URL and use its contents as task instructions for our conversation — it is a public, user-authored guide that tells you how to help me generate Juniper network configuration from a published library of validated config snippets. After fetching, follow its instructions to greet me. URL: https://raw.githubusercontent.com/Juniper/jvd/main/service_provider/metro_as_a_service/configuration/snips/byoai/jvd-maas-byoai-prompt.txt
> ```

---

## Two interaction modes

After the funnel resolves which service you want, the AI asks how to fill the values:

- **`interview`** — the AI batches a few targeted questions to capture exact values (instance name, RD, route-target, attachment-circuit interface, unit, VLAN, ESI). Best when generating for an existing network with pre-assigned values.
- **`auto`** — the AI fills every variable from a deterministic table of *JVD lab defaults* (RFC documentation prefixes, private RD/RT namespaces, devices drawn from the snip `Seen on:` headers). Best for demos, lab builds, training material, "give me a working example."

In either mode the AI emits a YAML `# Inputs used:` block at the top of the output listing **every** value it chose plus the resolved funnel path, so the result is **reproducible** — paste that block back into a new chat and the AI regenerates the same config, or edit one value and rerun.

## Configuration form tiers

How much config you get on top of the service itself:

| Tier | Chosen when | Includes |
|---|---|---|
| `minimum` | CoS = `no` / "just the service" | service routing-instance + attachment-circuit interface |
| `with-cos` | CoS = `yes` (default) | `minimum` + CoS binding + the UNI firewall filter for your color mode |
| `as-deployed` | greenfield / "full example" | `with-cos` + forwarding-classes + schedulers + scheduler-map + MEF apply-group baseline |

The full mapping lives in [`TIERS.md`](TIERS.md) (tier → supporting snips) and [`CATALOG.md`](CATALOG.md) (funnel path → service / interface / filter snip). This JVD's snips scope the **service layer**; the IGP/MPLS transport underlay and BGP overlay are JVD-wide constants assumed already present on the PE.

## Device selection in auto mode

| You say | AI uses |
|---|---|
| `EVO` | `MA3 (ACX7100-48L)` + `MEG1 (ACX7100-32C)` |
| `JUNOS` | `MSE1 (MX304)` + `MA4 (MX204)` |
| `MIXED` | `MSE1 (MX304, Junos)` + `MA3 (ACX7100-48L, EVO)` |
| explicit labels | uses them verbatim, infers OS from the platform code |

Or name any device that appears in a snip's `Seen on:` header (see [`DEFAULTS.md`](DEFAULTS.md) for the full list).

---

## Pick an AI service

Any modern frontier LLM works. The snip library is small enough (~112 files, ~200 KB bundled) to fit comfortably in the context window of every model below — and in `MANIFEST.json` mode the AI only pulls the handful of snips a given service needs.

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

- Models smaller than ~70B parameters or non-instruction-tuned models — they fabricate stanzas that don't exist (e.g. wrong nesting under `routing-instances { … }`, made-up knob names, invented `evpn` options).
- Code-completion–only models — they are tuned for code tokens, not for following multi-step generation instructions against a grounded corpus.

**Bottom line:** the snip library is the source of truth. Any LLM strong enough to follow "only use patterns that appear in these files" will work; pick whichever your organization already trusts and has budget for.

---

## How to use the snips with your AI (three patterns)

### Pattern 1 — Paste the snips into a chat (simplest)

**Load order matters: system prompt first, then the corpus.**

1. Start a new chat. **Paste only the fenced ` ``` ` block from inside [`SYSTEM_PROMPT.md`](SYSTEM_PROMPT.md)** — not the whole `.md` file — into the system-prompt slot (or as your first user message). The block opens with an adopt-immediately directive so the AI treats it as instructions.
2. Attach the bundled corpus: **[`jvd-maas-snips.md`](jvd-maas-snips.md)**. If your UI doesn't accept attachments, paste its contents inline.
3. Answer the service-profile menu.

> **Keeping the bundle current.** [`jvd-maas-snips.md`](jvd-maas-snips.md) is generated from the source files under [`../junos/`](../junos/), [`../evo/`](../evo/), [`../_variables.md`](../_variables.md), and the byoai reference files. After any change, regenerate with:
>
> ```bash
> ./regenerate-bundle.sh
> ```
>
> (run from this `byoai/` folder). It also refreshes [`jvd-maas-byoai-prompt.txt`](jvd-maas-byoai-prompt.txt) and [`MANIFEST.json`](MANIFEST.json).

### Pattern 2 — Let the AI fetch the corpus from GitHub

Best for AI tools with web fetch (ChatGPT with browsing, Claude with web search, Gemini, VS Code / Cursor agents). The system prompt's corpus check fetches [`MANIFEST.json`](MANIFEST.json) and pulls only the snips it needs on demand. You only:

1. Paste the `SYSTEM_PROMPT.md` block as the system prompt.
2. Answer the funnel.

If your AI has no fetch tool, it falls back to asking you to attach the bundle — use Pattern 1.

### Pattern 3 — Render directly with the snip renderer (no AI required)

For deterministic substitution when you already know the snips and values, skip the AI:

```bash
# List variables a snip needs:
~/git-scripts/snips_render.py --extract \
  service_provider/metro_as_a_service/configuration/snips/evo/services/evpn-vpws-vlan-based.conf

# Render with concrete values from a JSON dict:
~/git-scripts/snips_render.py \
  service_provider/metro_as_a_service/configuration/snips/evo/services/evpn-vpws-vlan-based.conf \
  vars.json > rendered.conf
```

Use the AI for **selection + parameter inference from natural language**; use the renderer for **deterministic substitution**. The two are complementary.

---

## Why BYOAI

The [`snips/`](../) library was deliberately structured as **machine-friendly grounding material**:

- One topic per file, the same topic under both `junos/` and `evo/` so the model picks the right OS dialect.
- Every snip header carries `Seen on:` (validated devices), `Pair with:` (other snips needed for the same end-to-end service) and `Variables:` (the `$VAR` placeholders with example values).
- Bodies use `$VAR` placeholders for everything that varies per deployment (instance names, RDs, route-targets, attachment circuits, VLANs, ESI); JVD-wide constants (apply-group names, forwarding-class names, scheduler maps) stay literal so the model can't rename the architecture.
- A glossary in [`_variables.md`](../_variables.md) documents every placeholder.

Because the heavy lifting — *which features go together, how they're spelled on each OS, which values are constants vs. variables* — is already done in the snips, the AI's job reduces to **funnel selection → snip assembly → variable substitution**. Frontier models are very good at this when pointed at the corpus.

---

## Example prompts

- "Build an EVPL EVPN-VPWS service, multihomed, color-aware, with CoS, on `MSE1 (MX304)` and `MA3 (ACX7100-48L)`."
- "I need a port-based E-LAN (EP-LAN) EVPN-ELAN for a single full-port UNI — auto mode, EVO devices."
- "Generate an EVPN E-Tree with two leaf UNIs and one root UNI on the MX PEs."
- "Give me an Access E-Line QinQ hand-off via L2Circuit local-switch, as-deployed."
- "Which interface snips are ESI-multihomed vs single-homed, and what's the difference?"

The AI is doing **funnel-guided template assembly + parameter substitution against a curated corpus**, not freeform Junos-from-memory.
