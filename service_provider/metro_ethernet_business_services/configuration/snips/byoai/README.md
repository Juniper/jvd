# Bring Your Own AI (BYOAI)

Use the AI service of your choice — Claude, GPT, Gemini, a local Ollama model, your enterprise Bedrock / Vertex / Azure deployment — to generate Junos and Junos Evolved configurations grounded in this JVD's validated snippet library.

This folder contains the prompts, ground rules and example workflows that turn the [`snips/`](../) tree into a reusable corpus for any modern LLM. **You bring the AI; the snips bring the validated patterns.**

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

- "Generate a complete EVPN-VPWS service config for `mse1_mx304` and `meg1_acx7100-32c` with VPWS service-id 4001, attachment-circuit `xe-0/1/4.4001` on the MX side and `et-0/0/0.4001` on the ACX side, both inside MAC-VRF instance `EVPN_VPWS_4001`."
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

1. From the repo root, bundle the snip library into a single text file:

   ```bash
   cd service_provider/metro_ethernet_business_services/configuration/snips
   { echo "# JVD MEBS snippet library"; \
     echo; \
     for f in $(find junos evo -name '*.conf' | sort); do \
       echo "## $f"; echo; echo '```'; cat "$f"; echo '```'; echo; \
     done; \
     echo "## _variables.md"; echo; cat _variables.md; \
   } > /tmp/jvd-mebs-snips.md
   ```

2. Start a new chat with your AI of choice. Paste the contents of [`SYSTEM_PROMPT.md`](SYSTEM_PROMPT.md) as the system prompt (or first user message in UIs that don't expose a system prompt).

3. Attach `/tmp/jvd-mebs-snips.md` (or paste it inline if the UI doesn't accept attachments).

4. Ask your generation question (see [Example prompts](#example-prompts) below).

### Pattern 2 — Point the AI at the GitHub repo

Best for AI tools with web/file fetch (Claude with web search, ChatGPT, agents in VS Code / Cursor with the GitHub MCP server).

Tell the model:

> Use only the files under
> `https://github.com/Juniper/jvd/tree/main/service_provider/metro_ethernet_business_services/configuration/snips`
> as your source of truth for Junos / EVO syntax. Read `_variables.md` first for the variable-naming convention, then load topic files as needed. Do not invent Junos hierarchy that doesn't appear in those files.

Then provide the [system prompt](SYSTEM_PROMPT.md) and your input.

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

### Generate a new L3VPN service end-to-end

> I have an existing JVD MEBS network. Add a new L3VPN service with these inputs:
>
> - Instance name: `METRO_BGPv4_L3VPN_3007`
> - PEs: `mse1_mx304` (Junos) and `ma3_acx7100-48l` (EVO)
> - Route distinguisher: `63536:3007` on each PE
> - Route target: `target:63536:3007`
> - Customer prefixes (public): `10.30.7.0/24`, `10.30.8.0/24`
> - PE-CE attachment: `xe-0/1/4.3007` (mse1) and `et-0/0/2.3007` (ma3)
> - PE-CE eBGP peer AS: `64537`
>
> Produce, per PE:
> 1. The community + per-VRF export/import policies (`policy/communities.conf` + `policy/l3vpn-export-import.conf`).
> 2. The VRF (`services/l3vpn-vrf.conf`) including PE-CE eBGP.
> 3. The attachment-circuit unit (`interfaces/edge-vlan-normalization.conf`).
> 4. Any apply-group references that should be added.
>
> Use only patterns that appear in the snips. Output one fenced block per file, labelled with the device name.

### Add CoS to a brownfield device

> Take the EVO 6-class CoS pattern from `evo/cos/forwarding-classes.conf` + `evo/cos/schedulers.conf` and produce the configuration to attach `5G_SCHEDULER` to `ae0`, `ae1`, `ae2` on a new ACX7100-48L access node, plus the matching DSCP/EXP/802.1p classifiers.

### Audit / explain mode

> Read the snips under `services/`. Which services share an attachment-circuit pattern that uses `vlan-ccc` encapsulation, and which use `vlan-bridge`? Cite the exact snip filenames.

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
| `SYSTEM_PROMPT.md` | Drop-in system prompt that defines the AI's role, ground rules, and output format. Works with any LLM. |

---

## Roadmap

This folder is the documentation entry point. Future additions may include:

- A static "config generator" web UI hosted from this repo (form → API call to the user's chosen LLM → rendered config).
- A GitHub Actions workflow that takes inputs from an issue template and posts the generated config back as a PR comment.
- An MCP server exposing the snip library for native use inside Claude Desktop / VS Code Copilot / Cursor.

If you build something useful on top of this, contribute it back here.
