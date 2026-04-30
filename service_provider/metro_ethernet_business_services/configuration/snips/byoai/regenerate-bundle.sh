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
} > "$OUT"

lines=$(wc -l < "$OUT")
size=$(du -h "$OUT" | cut -f1)
echo "regenerated: $OUT ($lines lines, $size)"
