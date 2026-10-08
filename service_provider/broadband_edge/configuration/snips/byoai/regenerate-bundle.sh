#!/usr/bin/env bash
#
# Regenerate jvd-bbe-snips.md from the current contents of
# snips/junos/, snips/evo/, and snips/_variables.md.
#
# Run after any change to the snip library so the BYOAI bundle
# stays in sync with the source files. TIERS.md and MANIFEST.json are produced by the
# private builder (git-jvd-builder): set JVD_BUILDER to its checkout to regenerate them.
#
# Modes:
#   (default)       full regeneration; requires JVD_BUILDER, exits 3 without it
#   --public-only   bundle assembly consistency using committed public artifacts
#                   (TIERS.md/MANIFEST.json as committed); not regeneration,
#                   freshness verification or qualification
#
set -euo pipefail

cd "$(dirname "$0")/.."   # cd into snips/

PUBLIC_ONLY=0
for arg in "$@"; do
  case "$arg" in
    --public-only) PUBLIC_ONLY=1 ;;
    *) echo "unknown argument: $arg" >&2; exit 2 ;;
  esac
done

if [ "$PUBLIC_ONLY" -eq 1 ]; then
  echo "public-only: bundle assembly consistency using committed public artifacts (TIERS.md/MANIFEST.json as committed); not regeneration, freshness verification or qualification" >&2
elif [ -z "${JVD_BUILDER:-}" ]; then
  echo "ERROR: regeneration requires the private builder (set JVD_BUILDER=<git-jvd-builder checkout>); TIERS.md and MANIFEST.json were NOT regenerated. Use --public-only to assemble from committed artifacts." >&2
  exit 3
else
  JVD_REPO="$(cd ../../../.. && pwd -P)" node "$JVD_BUILDER/engine/js/generate-tiers.mjs" --jvd service_provider/broadband_edge
fi

OUT="byoai/jvd-bbe-snips.md"

{
  echo "# JVD Broadband Edge snippet library"
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
PROMPT_OUT="byoai/jvd-bbe-byoai-prompt.txt"
awk '/^```$/{f=!f; next} f' byoai/SYSTEM_PROMPT.md > "$PROMPT_OUT"
plines=$(wc -l < "$PROMPT_OUT")
psize=$(du -h "$PROMPT_OUT" | cut -f1)
echo "regenerated: $PROMPT_OUT ($plines lines, $psize)"

# Regenerate the MANIFEST.json (used by AIs with web fetch to pull
# only the snips they need on demand); --public-only keeps the committed file.
if [ "$PUBLIC_ONLY" -eq 0 ]; then byoai/make-manifest.py; fi
