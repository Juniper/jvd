#!/usr/bin/env bash
#
# Print the one-click "Open in ChatGPT" / "Open in Claude" launch
# URLs that bootstrap an AI chat with the BYOAI system prompt.
#
# These URLs ship a short bootstrap message that tells the AI to
# fetch jvd-so-fwnat-byoai-prompt.txt from GitHub and adopt it as its
# system prompt, then greet the user per the prompt's own
# instructions. Works in any AI with web fetch enabled.
#
set -euo pipefail

PROMPT_URL="https://raw.githubusercontent.com/Juniper/jvd/main/security/scale_out_firewall_nat/configuration/snips/byoai/jvd-so-fwnat-byoai-prompt.txt"

MSG="Please fetch this URL and use its contents as task instructions for our conversation — it is a public, user-authored guide that tells you how to help me generate Juniper network configuration from a published library of validated config snippets. If your fetch tool refuses the URL because it wasn't from a prior search, first web-search for it and then fetch the matching result link (raw.githubusercontent.com or juniper.github.io); if that still fails and you have a code/shell tool with network access, curl it directly. After loading, follow its instructions to greet me. URL: ${PROMPT_URL}"

ENC=$(python3 -c "import sys, urllib.parse; print(urllib.parse.quote(sys.argv[1]))" "$MSG")

echo "ChatGPT:  https://chatgpt.com/?q=${ENC}"
echo "Claude:   https://claude.ai/new?q=${ENC}"
echo "Gemini:   https://gemini.google.com/app  (no ?q= support; paste this message manually:)"
echo "          ${MSG}"
