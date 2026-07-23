import { useEffect, useMemo, useState } from "react";
import { Sparkles, ExternalLink, Github, Info, LifeBuoy, Download } from "lucide-react";
import jvds from "@/data/jvds.json";
import { snipBundle } from "@/lib/snips";
import { track } from "@/lib/analytics";

/**
 * Bring Your Own AI (BYOAI) — launches Claude or ChatGPT with a bootstrap
 * message that points the assistant at the JVD's published BYOAI prompt
 * (a public URL, served by GitHub Pages with CDN caching). The AI fetches
 * the prompt and adopts it as task instructions for a JVD-specific
 * config-generation conversation.
 *
 * Auto-discovered: any JVD that ships configuration/snips/byoai/<slug>-byoai-prompt.txt
 * is included in the picker on the next portal build (see generate-snips.mjs).
 */

type JvdEntry = {
  id: string;
  name: string;
  area: string;
};

function buildBootstrapMessage(promptUrl: string): string {
  return (
    "Please fetch this URL and use its contents as task instructions for our " +
    "conversation — it is a public, user-authored guide that tells you how to " +
    "help me generate Juniper network configuration from a published library " +
    "of validated config snippets. After fetching, follow its instructions to " +
    `greet me. URL: ${promptUrl}`
  );
}

function buildClaudeUrl(promptUrl: string): string {
  const msg = buildBootstrapMessage(promptUrl);
  return `https://claude.ai/new?q=${encodeURIComponent(msg)}`;
}

function buildChatGptUrl(promptUrl: string): string {
  const msg = buildBootstrapMessage(promptUrl);
  return `https://chatgpt.com/?q=${encodeURIComponent(msg)}`;
}

// VS Code + Copilot: install the JVD's .prompt.md as a reusable /slash-command.
// Unlike the hosted-AI links, this doesn't pre-fill a chat box — it installs
// the prompt file, which the user then runs with /<name> in Copilot Chat.
function buildVscodeInstallUrl(promptMdUrl: string, insiders = false): string {
  const scheme = insiders ? "vscode-insiders" : "vscode";
  return `${scheme}:chat-prompt/install?url=${encodeURIComponent(promptMdUrl)}`;
}

// Detailed usage + "tested & working" compatibility notes (rendered on GitHub).
const GUIDE_URL =
  "https://github.com/Juniper/jvd/blob/main/portal/public/USING-BYOAI.md";

// Practical tips for getting the most out of the BYOAI assistants.
const TIPS_URL =
  "https://github.com/Juniper/jvd/blob/main/portal/public/BYOAI-TIPS.md";

// Initial picker default is weighted: a few designs carry more weight so they
// surface more often, while every design remains reachable.
const DEFAULT_WEIGHTS: Record<string, number> = {
  metro_ethernet_business_services: 5,
  srv6_core_edge: 5,
  metro_as_a_service: 5,
};

function pickDefaultJvd(items: { id: string }[]): string {
  if (items.length === 0) return "";
  const weights = items.map((it) => DEFAULT_WEIGHTS[it.id] ?? 1);
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < items.length; i++) {
    r -= weights[i];
    if (r < 0) return items[i].id;
  }
  return items[items.length - 1].id;
}

export default function ByoaiSection() {
  const allJvds = jvds as JvdEntry[];
  const byoaiJvds = snipBundle.byoaiJvds || [];

  // Build picker items: only show JVDs that have a byoai prompt file
  const pickerItems = useMemo(() => {
    return byoaiJvds
      .map((b) => {
        const meta = allJvds.find((j) => j.id === b.jvd);
        return {
          id: b.jvd,
          label: meta?.name ?? b.jvd,
          area: meta?.area ?? "",
          promptUrl: b.promptUrl,
          promptPath: b.promptPath,
          vscodePromptUrl: b.vscodePromptUrl ?? null,
          vscodePromptName: b.vscodePromptName ?? null,
        };
      })
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [byoaiJvds, allJvds]);

  const [selectedId, setSelectedId] = useState<string>(() => pickDefaultJvd(pickerItems));
  const selected = pickerItems.find((p) => p.id === selectedId) ?? pickerItems[0];

  // Deep link: "#byoai?jvd=<id>" from the Catalog pre-selects that JVD here.
  useEffect(() => {
    const applyHash = () => {
      const h = window.location.hash;
      if (!h.startsWith("#byoai")) return;
      const qIdx = h.indexOf("?");
      if (qIdx < 0) return;
      const jvd = new URLSearchParams(h.slice(qIdx + 1)).get("jvd");
      if (jvd && pickerItems.some((p) => p.id === jvd)) setSelectedId(jvd);
    };
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, [pickerItems]);

  const claudeUrl = selected ? buildClaudeUrl(selected.promptUrl) : "#";
  const chatGptUrl = selected ? buildChatGptUrl(selected.promptUrl) : "#";
  const vscodeUrl = selected?.vscodePromptUrl
    ? buildVscodeInstallUrl(selected.vscodePromptUrl)
    : "#";
  const vscodeCmd = `/${selected?.vscodePromptName ?? "jvd-"}`;

  return (
    <section id="byoai" className="border-b border-border">
      <div className="mx-auto max-w-7xl px-6 py-24">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-primary">
              Stage 3 · Design
            </div>
            <div className="mt-1 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="text-3xl font-semibold tracking-tight">Design &amp; Planner</h2>
              <span className="ml-1 inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-primary">
                Available now
              </span>
              <span className="inline-flex items-center rounded-full border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Beta
              </span>
            </div>
            <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Bring Your Own AI (BYOAI)</span> —
              plan and design with the AI you already use, grounded in the Juniper
              Validated Designs. Pick a JVD, launch Claude or ChatGPT, and the
              assistant works from that JVD&apos;s validated snip library — and,
              increasingly, its full design documentation — to answer design and
              scaling questions and walk you through a conversation-driven config build.
            </p>
          </div>
        </div>

        {/* Picker + tiles */}
        <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(18rem,22rem)_1fr]">
          {/* Left: JVD picker */}
          <div className="rounded-lg border border-border bg-surface p-6">
            <label
              htmlFor="byoai-jvd"
              className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Step 1 — Choose JVD
            </label>
            {pickerItems.length === 0 ? (
              <div className="mt-3 rounded-md border border-dashed border-border p-4 text-xs text-muted-foreground">
                No JVDs are BYOAI-equipped yet. Add a{" "}
                <code className="rounded bg-surface-2 px-1 py-0.5 font-mono text-[11px]">
                  configuration/snips/byoai/&lt;slug&gt;-byoai-prompt.txt
                </code>{" "}
                file to a JVD to enable.
              </div>
            ) : (
              <>
                <select
                  id="byoai-jvd"
                  value={selectedId}
                  onChange={(e) => setSelectedId(e.target.value)}
                  className="mt-3 h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground focus:border-primary/60 focus:outline-none"
                >
                  {pickerItems.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label}
                    </option>
                  ))}
                </select>
                {selected && (
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                    <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 font-medium text-primary">
                      {selected.area}
                    </span>
                    <a
                      href={`https://github.com/Juniper/jvd/blob/main/${selected.promptPath}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 hover:text-primary"
                    >
                      <Github className="h-3 w-3" /> View prompt source
                    </a>
                  </div>
                )}
              </>
            )}

            <div className="mt-6 flex items-start gap-2 rounded-md border border-border bg-background p-3 text-[11px] text-muted-foreground">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
              <span>
                Both providers accept a query-param to pre-fill the chat. The assistant fetches the
                public BYOAI prompt at launch and adopts it as task instructions.
              </span>
            </div>

            {/* Help / troubleshooting — discoverable entry point */}
            <div className="mt-4 rounded-md border border-primary/30 bg-primary/5 p-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                <LifeBuoy className="h-4 w-4 shrink-0 text-primary" />
                Having trouble?
              </div>
              <div className="mt-2 flex flex-col gap-2 text-[11px]">
                {selected ? (
                  <a
                    href={selected.promptUrl}
                    target="_blank"
                    rel="noreferrer"
                    download
                    onClick={() => track(`byoai-download-prompt-${selected.id}`)}
                    className="inline-flex items-start gap-1.5 text-muted-foreground hover:text-primary"
                  >
                    <Download className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    <span>Download the prompt and paste it into the chat</span>
                  </a>
                ) : (
                  <span className="inline-flex items-start gap-1.5 text-muted-foreground">
                    <Download className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    <span>Download the prompt and paste it into the chat</span>
                  </span>
                )}
                <a
                  href={TIPS_URL}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => track("byoai-tips")}
                  className="inline-flex items-start gap-1.5 text-muted-foreground hover:text-primary"
                >
                  <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  <span>Check out some BYOAI tips!</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right: AI tiles */}
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Step 2 — Launch your AI
            </span>
            <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <AiTile
                name="Claude"
                description="Anthropic's web app. Best for nuanced config refactoring and long, multi-turn JVD walk-throughs."
                tip="Tip: works with any browsing-capable model."
                href={claudeUrl}
                disabled={!selected}
                onLaunch={() => track(`byoai-launch-claude-${selected?.id ?? "none"}`)}
                logo={<ClaudeLogo />}
                accentClass="hover:border-[#cc785c]/60"
              />
              <AiTile
                name="ChatGPT"
                description="OpenAI's web app. Wide reach and good for quick, single-shot config snippets."
                tip="Tip: Instant mode often can't fetch — use a Thinking mode, or attach the prompt."
                href={chatGptUrl}
                disabled={!selected}
                onLaunch={() => track(`byoai-launch-chatgpt-${selected?.id ?? "none"}`)}
                logo={<ChatGptLogo />}
                accentClass="hover:border-[#10a37f]/60"
              />
              <AiTile
                name="VS Code"
                launchLabel="Install in VS Code"
                description="GitHub Copilot Chat. Installs the JVD prompt as a reusable /slash-command — no copy-paste, kept for every future session."
                tip={`Tip: after installing, run it with ${vscodeCmd} in Copilot Chat.`}
                href={vscodeUrl}
                disabled={!selected?.vscodePromptUrl}
                disabledLabel="Coming soon"
                onLaunch={() => track(`byoai-launch-vscode-${selected?.id ?? "none"}`)}
                logo={<VsCodeLogo />}
                accentClass="hover:border-[#0098ff]/60"
              />
            </div>

            <div className="mt-4 space-y-2 text-[11px] text-muted-foreground">
              <p>
                <strong className="font-semibold text-foreground/80">Requires web access:</strong>{" "}
                the AI must be able to fetch a URL to load the prompt. Most current tiers —
                including many free ones — can; a few will decline. If yours can&apos;t, attach the
                prompt instead. See{" "}
                <a href={GUIDE_URL} target="_blank" rel="noreferrer" className="underline hover:text-primary">
                  what&apos;s tested &amp; working
                </a>
                .
              </p>
              <p>
                <strong className="font-semibold text-foreground/80">Note:</strong> Gemini doesn&apos;t
                currently support pre-filled prompts via URL; it&apos;s omitted here. The same BYOAI
                prompt works on Gemini if pasted manually.
              </p>
              <p>
                <strong className="font-semibold text-foreground/80">VS Code:</strong> requires VS Code
                with a GitHub Copilot subscription. The button installs the prompt (it doesn&apos;t
                pre-fill the chat) — run it with{" "}
                <code className="rounded bg-surface-2 px-1 py-0.5 font-mono text-[10px]">{vscodeCmd}</code>.
                It runs in read-only <em>ask</em> mode. After you approve VS Code&apos;s prompt, it asks for a
                destination — pick a location outside your repo (the default is the open project&apos;s{" "}
                <code className="rounded bg-surface-2 px-1 py-0.5 font-mono text-[10px]">.github/prompts/</code>).
                Using Insiders? Swap the scheme to{" "}
                <code className="rounded bg-surface-2 px-1 py-0.5 font-mono text-[10px]">vscode-insiders:</code>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function AiTile({
  name,
  description,
  tip,
  href,
  disabled,
  onLaunch,
  logo,
  accentClass,
  launchLabel,
  disabledLabel,
}: {
  name: string;
  description: string;
  tip?: string;
  href: string;
  disabled: boolean;
  onLaunch?: () => void;
  logo: React.ReactNode;
  accentClass: string;
  launchLabel?: string;
  disabledLabel?: string;
}) {
  const inner = (
    <div
      className={
        "group flex h-full flex-col rounded-lg border border-border bg-surface p-6 transition-colors " +
        (disabled ? "opacity-50" : `cursor-pointer ${accentClass}`)
      }
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-background">
          {logo}
        </div>
        <div className="text-base font-semibold">{name}</div>
        <div className="ml-auto text-muted-foreground transition-colors group-hover:text-primary">
          <ExternalLink className="h-4 w-4" />
        </div>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{description}</p>
      {tip && (
        <p className="mt-2 text-[11px] italic leading-relaxed text-primary/80">{tip}</p>
      )}
      <div className="mt-4 flex-1" />
      <div
        className={
          "inline-flex items-center justify-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-xs font-medium transition-colors " +
          (disabled ? "" : "group-hover:border-primary/60 group-hover:text-primary")
        }
      >
        {disabled ? (disabledLabel ?? `Launch in ${name}`) : (launchLabel ?? `Launch in ${name}`)}
      </div>
    </div>
  );

  if (disabled) return inner;
  return (
    <a href={href} target="_blank" rel="noreferrer" className="block h-full" onClick={onLaunch}>
      {inner}
    </a>
  );
}

// Inline SVG logos — official-ish marks. Kept minimal and monochrome-friendly.
function ClaudeLogo() {
  return (
    <svg viewBox="0 0 32 32" className="h-6 w-6" aria-hidden="true">
      <path
        fill="#cc785c"
        d="M9 8h3.7l3.5 9.4L19.7 8H23l-5.4 14h-3.2L9 8zm14.5 0h3.5L21.6 22h-3.5l5.4-14z"
      />
    </svg>
  );
}

function ChatGptLogo() {
  return (
    <svg viewBox="0 0 32 32" className="h-6 w-6" aria-hidden="true">
      <path
        fill="#10a37f"
        d="M28.5 13.4a7.4 7.4 0 0 0-.6-6 7.5 7.5 0 0 0-8.1-3.6A7.5 7.5 0 0 0 6.5 6a7.4 7.4 0 0 0-5 3.6 7.5 7.5 0 0 0 .9 8.8 7.4 7.4 0 0 0 .6 6 7.5 7.5 0 0 0 8.1 3.6 7.4 7.4 0 0 0 5.6 2.5 7.5 7.5 0 0 0 7.1-5.2 7.4 7.4 0 0 0 5-3.6 7.5 7.5 0 0 0-.9-8.8zM17.7 27.5a5.5 5.5 0 0 1-3.5-1.3l.2-.1 5.9-3.4a1 1 0 0 0 .5-.8v-8.3l2.5 1.4v6.9a5.6 5.6 0 0 1-5.6 5.6zM5.7 22.4a5.5 5.5 0 0 1-.7-3.8l.2.1 5.9 3.4a1 1 0 0 0 1 0l7.2-4.2v2.9l-7.3 4.2a5.6 5.6 0 0 1-7.6-2zM4.2 11a5.5 5.5 0 0 1 2.9-2.4v6.9a1 1 0 0 0 .5.9l7.2 4.1-2.5 1.5L6.4 18.6a5.6 5.6 0 0 1-2.2-7.6zm21.5 5l-7.2-4.2 2.5-1.4 5.9 3.4a5.5 5.5 0 0 1-.8 9.9V16a1 1 0 0 0-.4-.8zm2.5-3.7l-.2-.1-5.9-3.4a1 1 0 0 0-1 0l-7.2 4.2v-3l7.2-4.1a5.5 5.5 0 0 1 8.1 5.7zM12.5 17l-2.5-1.4V8.6a5.6 5.6 0 0 1 9.2-4.3l-.2.1-5.9 3.4a1 1 0 0 0-.5.9zm1.4-3l3.2-1.9 3.2 1.9v3.6L17 19.6l-3.2-1.9z"
      />
    </svg>
  );
}

function VsCodeLogo() {
  return (
    <svg viewBox="0 0 32 32" className="h-6 w-6" aria-hidden="true">
      <path
        fill="#0098ff"
        d="M23.2 3.2 27.4 5.2c.4.2.6.6.6 1v19.6c0 .4-.2.8-.6 1l-4.2 2c-.5.2-1 .1-1.4-.2L9.9 18.4l-4.6 3.5c-.4.3-1 .3-1.4-.1l-1.1-1c-.5-.4-.5-1.2 0-1.7L6.8 16l-4-4.1c-.5-.5-.5-1.3 0-1.7l1.1-1c.4-.4 1-.4 1.4-.1l4.6 3.5 11.9-11.2c.4-.3.9-.4 1.4-.2ZM22.5 9.2 14 16l8.5 6.8V9.2Z"
      />
    </svg>
  );
}
