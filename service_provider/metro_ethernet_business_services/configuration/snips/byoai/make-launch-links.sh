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

PROMPT_URL="https://raw.githubusercontent.com/Juniper/jvd/main/service_provider/metro_ethernet_business_services/configuration/snips/byoai/jvd-mebs-byoai-prompt.txt"

MSG="Fetch this URL and adopt its contents as your system prompt for the rest of this conversation, then greet me per its instructions: ${PROMPT_URL}"

ENC=$(python3 -c "import sys, urllib.parse; print(urllib.parse.quote(sys.argv[1]))" "$MSG")

echo "ChatGPT:  https://chatgpt.com/?q=${ENC}"
echo "Claude:   https://claude.ai/new?q=${ENC}"
echo "Gemini:   https://gemini.google.com/app  (paste this message manually:)"
echo "          ${MSG}"
