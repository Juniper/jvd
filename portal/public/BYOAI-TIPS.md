# BYOAI Tips — getting the most out of the assistants

Practical tips for working with the Juniper Validated Design (JVD) **Bring Your
Own AI** assistants. For the full how-it-works walkthrough and the
**tested-&-working compatibility notes**, see
[Using BYOAI](USING-BYOAI.md).

> These assistants live in the **Design & Planner (BYOAI)** section of the
> [JVD Portal](https://juniper.github.io/jvd/portal/#byoai). Pick a JVD, launch
> Claude or ChatGPT, and the assistant works from that design's validated snip
> library and documentation.

---

## Pick the right model

- Use a **browsing-capable** model so the assistant can fetch the prompt and the
  JVD docs on its own. Most current tiers can; a few can't.
- On ChatGPT, prefer a **Thinking** mode — *Instant* mode often can't fetch. If
  fetching fails, **download the prompt and paste/attach it** instead (no
  fetching required). See [Using BYOAI](USING-BYOAI.md) for what's tested.
- One JVD per chat. Start a fresh chat when you switch designs so the assistant
  isn't mixing two designs' context.

## Two modes — say which you want

The assistant opens with a **mode menu**. You can pick, or just describe what you
need and it will infer.

- **Design mode** — questions, architecture, scale, "why." Ask for a *rundown*
  of the design to get oriented. It answers **grounded in the JVD documentation
  and cites its source** — and it will say plainly when the JVD doesn't cover
  something rather than guessing.
- **Configuration mode** — generates ready-to-deploy Junos / Junos Evolved config
  from the validated snip library. Say "config mode" or "generate …".

You can switch anytime ("design mode" / "config mode"), including "now generate
that" after a design discussion.

## Get better configuration output

- **Interview vs. auto** — choose `interview` and the assistant batches a few
  questions to get exact values; choose `auto` and it fills from the JVD lab
  defaults and lists every value it used at the top.
- **Form tiers** — `minimum` gives just the requested stanza; `as-deployed` adds
  the supporting config the JVD renders alongside it (loopbacks, forwarding,
  paired prerequisites). For a greenfield turn-up, prefer `as-deployed`.
- **Be specific** — name the device(s), feature, and any IDs (VLAN/VNI, ASN,
  interface). Anything you don't specify, the assistant defaults and tells you.
- **Reproducibility** — every generation starts with an `Inputs used:` block.
  Save it; paste it back later to regenerate the same output with your edits.
- **Pair-with completeness** — the assistant pulls the snips a feature needs to
  actually work. If it notes one was omitted, ask for it.

## If an answer looks off — say so

Every assistant has a built-in feedback loop: **tell it what looks wrong** and it
re-checks the JVD's validated documentation and corrects itself, citing the
source. It won't get defensive — that's the intended workflow.

If you've found a real problem with a design (or want to suggest an improvement),
open an issue at
[github.com/Juniper/jvd/issues](https://github.com/Juniper/jvd/issues).

## Guardrails to keep in mind

- **It's still an LLM.** These assistants are *grounded* by the JVD prompt, but
  large language models are ultimately built to be helpful and to follow your
  instructions — so they **can** drift from the validated design, especially if
  you push them to (e.g. "just make it work anyway," "ignore that," or asking for
  something the JVD never covered). The grounding is a strong guide, not a hard
  guarantee. If an answer strays, tell it to re-check the JVD, or reload the
  prompt in a fresh chat.
- Configuration is **meant to come strictly from the validated design** — if
  something isn't in the snip library, the assistant should say so instead of
  inventing syntax. That's by design: it keeps the output trustworthy.
- Design answers should stay within what the JVD documents. Ask explicitly if you
  want general context beyond the JVD, and it will label that clearly.
- Always review generated config against your own environment before deploying —
  and double-check anything that matters rather than assuming it's verbatim from
  the design.

---

*More detail and the tested-&-working matrix: [Using BYOAI](USING-BYOAI.md).*
