#!/usr/bin/env bash
#
# Regenerate jvd-mebs-snips.md from the current contents of
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
  JVD_REPO="$(cd ../../../.. && pwd -P)" node "$JVD_BUILDER/engine/js/generate-tiers.mjs"
fi

# Generate the manifest first (used by AIs with web fetch to pull only the snips
# they need on demand, and for the needs listed under each snippet below);
# --public-only keeps the committed file.
if [ "$PUBLIC_ONLY" -eq 0 ]; then byoai/make-manifest.py; fi

# Each snippet's typed requirements from MANIFEST.json, listed under it in the bundle.
NEEDS="$(mktemp -d)"
trap 'rm -rf "$NEEDS"' EXIT
python3 - "$NEEDS" byoai/MANIFEST.json "$(basename "$(cd .. && cd .. && pwd)")" <<'PY'
import json, os, sys
from urllib.parse import quote

out, manifest, jvd = sys.argv[1], sys.argv[2], sys.argv[3]
presence = {"required": "required", "conditional": "when the router's configuration has it"}
selection = {"each-reference": "for each reference", "all-related": "all related", "source-witness": "as the source shows"}
for snip in json.load(open(manifest))["snips"]:
    lines = []
    for need in snip.get("occurrence_requires") or []:
        slots = ", ".join(f"`{s}`" for s in need["slots"] if not s.startswith("@source:"))
        count = len(need["providers"])
        providers = ", ".join(f"`{p.split('/', 1)[1][:-5]}`" for p in need["providers"]) if count <= 8 else f"{count} providers listed in MANIFEST.json"
        lines.append(f"- `{need['kind']}`{f' ({slots})' if slots else ''}: {presence[need['presence']]}, {selection[need['selection']]}; {'one of ' if count > 1 else ''}{providers}")
    text = "Needs (MANIFEST.json occurrence_requires; same OS):\n" + "\n".join(lines) + "\n" if lines else ""
    # References the validated configuration uses but never defines: one line per slot and router.
    groups = {}
    for row in snip.get("unresolved") or []:
        groups.setdefault((row["kind"], row["slot"], row["device"]), []).append(row["name"])
    if groups:
        missing = [f"- `{kind}` `{names[0] if len(names) == 1 else slot}` on {device}{f' ({len(names)} references)' if len(names) > 1 else ''}" for (kind, slot, device), names in groups.items()]
        report = "https://github.com/Juniper/jvd/issues/new?template=jvd-content.yml&title=" + quote(f"Missing source: {jvd}/{snip['path'][:-5]}", safe="")
        text += ("\n" if text else "") + "Not included (not defined in the validated source):\n" + "\n".join(missing) + f"\nReport: {report}\n"
    if text:
        path = os.path.join(out, snip["path"])
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, "w") as handle:
            handle.write(text)
PY

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
    if [ -f "$NEEDS/$f" ]; then cat "$NEEDS/$f"; echo; fi
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
