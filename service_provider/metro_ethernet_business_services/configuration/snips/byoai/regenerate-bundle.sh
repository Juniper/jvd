#!/usr/bin/env bash
#
# Regenerate jvd-mebs-snips.md from the current contents of
# snips/junos/, snips/evo/, and snips/_variables.md.
#
# Run after any change to the snip library so the BYOAI bundle
# stays in sync with the source files.
#
set -euo pipefail

cd "$(dirname "$0")/.."   # cd into snips/

OUT="byoai/jvd-mebs-snips.md"

{
  echo "# JVD MEBS snippet library"
  echo
  for f in $(find junos evo -name '*.conf' | sort); do
    echo "## $f"
    echo
    echo '```'
    cat "$f"
    echo '```'
    echo
  done
  echo "## _variables.md"
  echo
  cat _variables.md
  echo
  echo "## byoai/TIERS.md"
  echo
  cat byoai/TIERS.md
  echo
  echo "## byoai/DEFAULTS.md"
  echo
  cat byoai/DEFAULTS.md
  echo
  echo "## byoai/OUTPUT_FORMAT.md"
  echo
  cat byoai/OUTPUT_FORMAT.md
} > "$OUT"

lines=$(wc -l < "$OUT")
size=$(du -h "$OUT" | cut -f1)
echo "regenerated: $OUT ($lines lines, $size)"

# Also extract the fenced system-prompt block to a standalone shareable file.
PROMPT_OUT="byoai/jvd-mebs-byoai-prompt.txt"
awk '/^```$/{f=!f; next} f' byoai/SYSTEM_PROMPT.md > "$PROMPT_OUT"
plines=$(wc -l < "$PROMPT_OUT")
psize=$(du -h "$PROMPT_OUT" | cut -f1)
echo "regenerated: $PROMPT_OUT ($plines lines, $psize)"

# Regenerate the MANIFEST.json (used by AIs with web fetch to pull
# only the snips they need on demand).
byoai/make-manifest.py
