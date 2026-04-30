#!/usr/bin/env bash
#
# Print the one-click "Open in ChatGPT" / "Open in Claude" launch
# URLs that bootstrap an AI chat with the BYOAI system prompt.
#
# These URLs ship a short bootstrap message that tells the AI to
# fetch jvd-mebs-byoai-prompt.txt from GitHub and adopt it as its
# system prompt, then greet the user per the prompt's own
# instructions. Works in any AI with web fetch enabled.
#
# Run from anywhere; print to stdout. Used by the README and as a
# sanity check that the URLs still encode correctly.
#
set -euo pipefail

PROMPT_URL="https://raw.githubusercontent.com/Juniper/jvd/add/byoai-manifest/service_provider/metro_ethernet_business_services/configuration/snips/byoai/jvd-mebs-byoai-prompt.txt"

MSG="Please fetch this URL and use its contents as task instructions for our conversation — it is a public, user-authored guide that tells you how to help me generate Juniper network configuration from a published library of validated config snippets. After fetching, follow its instructions to greet me. URL: ${PROMPT_URL}"

ENC=$(python3 -c "import sys, urllib.parse; print(urllib.parse.quote(sys.argv[1]))" "$MSG")

echo "ChatGPT:  https://chatgpt.com/?q=${ENC}"
echo "Claude:   https://claude.ai/new?q=${ENC}"
echo "Gemini:   https://gemini.google.com/app  (no ?q= support; paste this message manually:)"
echo "          ${MSG}"
