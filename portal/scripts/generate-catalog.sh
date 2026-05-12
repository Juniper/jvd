#!/usr/bin/env bash
# generate-catalog.sh — regenerate portal/src/data/jvds.json.
#
# Three-tier extraction strategy for each JVD's `platforms` field:
#
#   Tier 0 (preferred): Juniper validated-platforms API.
#     - Folder→JVD-ID map: portal/scripts/jvd-id-map.json
#     - Cached response:   portal/scripts/jvd-platforms-cache.json
#     - Filters to helperDut == "DUT" (Device Under Test = actually validated;
#       Helper devices are stand-ins / supporting kit, equivalent to CE)
#
#   Tier 1: Scan README.md for Juniper model names.
#
#   Tier 2: Scan .conf filenames + contents under the JVD dir, applying the
#     CE-skip rule for QFX/EX models that only appear as ce<n> roles.
#
# OS field is always extracted from the README text.
# Manually-curated `name` and `description` are preserved on existing entries.
#
# Usage:
#   portal/scripts/generate-catalog.sh [--check] [--refresh]
#
#   --check     Exit non-zero if the catalog would change (CI guard); no write.
#   --refresh   Re-fetch all Tier-0 data from the Juniper API and update the
#               cache file before regenerating.
#
# Requires: python3, jq, curl (only when --refresh is used).

set -euo pipefail

CHECK_ONLY=0
REFRESH=0
for arg in "$@"; do
  case "$arg" in
    --check)   CHECK_ONLY=1 ;;
    --refresh) REFRESH=1 ;;
    *) echo "unknown arg: $arg" >&2; exit 2 ;;
  esac
done

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
CATALOG="$REPO_ROOT/portal/src/data/jvds.json"
ID_MAP="$REPO_ROOT/portal/scripts/jvd-id-map.json"
CACHE="$REPO_ROOT/portal/scripts/jvd-platforms-cache.json"
API_BASE="https://www.juniper.net/documentation/fetch/getAllPlatformNReleaseDetails4JvdId"

command -v python3 >/dev/null || { echo "python3 required" >&2; exit 1; }
command -v jq      >/dev/null || { echo "jq required"      >&2; exit 1; }

if [[ $REFRESH -eq 1 ]]; then
  command -v curl >/dev/null || { echo "curl required for --refresh" >&2; exit 1; }
  echo "Refreshing Tier-0 cache from Juniper API..." >&2
  TMP_CACHE="$(mktemp)"
  echo '{}' > "$TMP_CACHE"
  # Collect every JVD ID referenced from id-map (flatten arrays, dedupe).
  while IFS= read -r jvd_id; do
    [[ -z "$jvd_id" ]] && continue
    echo "  fetching $jvd_id" >&2
    resp="$(curl -sL -A 'Mozilla/5.0' "$API_BASE/$jvd_id" || echo '[]')"
    # Validate JSON; fall back to [] on error.
    if ! echo "$resp" | jq empty 2>/dev/null; then
      echo "    ! invalid response for $jvd_id, storing []" >&2
      resp='[]'
    fi
    jq --arg k "$jvd_id" --argjson v "$resp" '. + {($k): $v}' "$TMP_CACHE" > "$TMP_CACHE.new" \
      && mv "$TMP_CACHE.new" "$TMP_CACHE"
  done < <(jq -r 'to_entries[] | select(.key != "_comment") | .value[]' "$ID_MAP" | sort -u)
  jq -S . "$TMP_CACHE" > "$CACHE"
  rm -f "$TMP_CACHE"
  echo "Wrote $CACHE" >&2
fi

PY_SCRIPT="$(mktemp -t generate-catalog-py.XXXXXX)"
trap 'rm -f "$PY_SCRIPT"' EXIT
cat > "$PY_SCRIPT" <<'PY'
import json, os, re, sys
from pathlib import Path
from typing import Optional

REPO = Path(os.environ["REPO_ROOT"])
CATALOG = Path(os.environ["CATALOG"])
ID_MAP_PATH = Path(os.environ["ID_MAP"])
CACHE_PATH = Path(os.environ["CACHE"])

ID_MAP = {}
if ID_MAP_PATH.is_file():
    raw = json.loads(ID_MAP_PATH.read_text(encoding="utf-8"))
    ID_MAP = {k: v for k, v in raw.items() if not k.startswith("_")}

CACHE = {}
if CACHE_PATH.is_file():
    CACHE = json.loads(CACHE_PATH.read_text(encoding="utf-8"))

# Strip Juniper power-supply suffixes (-AC / -DC) that aren't part of the
# model designation. Keep real suffix variants like -32CD, -48S-4C, -64OD.
_PSU_SUFFIX_RE = re.compile(r"-(AC|DC)$", re.IGNORECASE)

# Map Juniper internal JNP* SKUs to their customer-facing model names.
# (The API occasionally returns the raw SKU, e.g. JNP10001-36MR for what
# customers know as PTX10001-36MR.)
JNP_TO_FAMILY = {
    "10001": "PTX",
    "10002": "PTX",
    "10003": "PTX",
    "10004": "PTX",
    "10008": "PTX",
    "10016": "PTX",
}

def normalize_api_model(model):
    """Normalize a model string from the Juniper API to our canonical form.

    Returns None if the value doesn't look like a Juniper switch/router model
    (e.g. third-party traffic generators).
    """
    if not model:
        return None
    m = model.strip()
    m = _PSU_SUFFIX_RE.sub("", m)  # strip trailing -ac/-dc power variant
    # Translate JNP<num> SKUs to their PTX customer-facing name.
    jnp = re.match(r"^JNP(\d{3,5})(?:-([A-Za-z0-9-]+))?$", m, re.IGNORECASE)
    if jnp:
        fam = JNP_TO_FAMILY.get(jnp.group(1))
        if fam:
            m = f"{fam}{jnp.group(1)}" + (f"-{jnp.group(2)}" if jnp.group(2) else "")
    mm = re.match(r"^(QFX|MX|PTX|ACX|SRX|EX)(\d{3,5})(?:-([A-Za-z0-9-]+))?$", m, re.IGNORECASE)
    if not mm:
        return None
    return _norm_model(mm.group(1), mm.group(2), mm.group(3))

def extract_platforms_from_api(folder_id: str):
    """Tier-0: union of DUT models across all API IDs mapped for this folder.

    Returns (platforms_list, ok_flag). ok_flag is True only if at least one
    mapped API ID returned a non-empty platformDetailsList — so an empty
    cache hit doesn't masquerade as a successful Tier-0 result.
    """
    ids = ID_MAP.get(folder_id) or []
    if not ids:
        return [], False
    found = set()
    saw_any_data = False
    for jid in ids:
        payload = CACHE.get(jid)
        if not payload:
            continue
        for entry in payload:
            details = entry.get("platformDetailsList") or []
            if details:
                saw_any_data = True
            for d in details:
                # Include both DUT and Helper devices: the entire validated
                # test topology is composed of Juniper kit a customer
                # planning to deploy this JVD might want to see.
                norm = normalize_api_model(d.get("model", ""))
                if norm:
                    found.add(norm)
    if not saw_any_data:
        return [], False
    return _dedupe_and_sort(found), True

# (relative-area-root, display-area-name)
AREAS = [
    ("data_center/adc",   "Data Center"),
    ("data_center/aidc",  "Data Center"),
    ("enterprise_wan",    "Enterprise WAN"),
    ("optical",           "Optical"),
    ("security",          "Security"),
    ("service_provider",  "Service Provider"),
]

# Subdirs that are not JVDs (shared assets, etc.)
NOT_A_JVD = {"images", "scripts", "automation"}

# Platform model regex — Juniper families with a numeric model suffix.
# Matches: QFX5220-32CD, MX480, MX10004, PTX10001-36MR, ACX7100-48L, etc.
# - Base model number must be 3-5 digits (rejects host-counter noise like "acx17")
# - Optional `-VARIANT` suffix must contain at least one letter (so unit numbers
#   like "acx7024-01" parse as ACX7024, not ACX7024-01)
MODEL_RE = re.compile(
    r"\b(QFX|MX|PTX|ACX|SRX|EX)(\d{3,5})(?:-([A-Z0-9]+))?\b",
    re.IGNORECASE,
)
# Bare family mention like "MX series" or "QFX series".
FAMILY_SERIES_RE = re.compile(r"\b(QFX|MX|PTX|ACX|SRX|EX)\s+series\b", re.IGNORECASE)

# Filename pattern for per-device .conf files: <role>_<model>.conf
# Captures the role prefix so we can apply the CE-skip rule.
FILENAME_RE = re.compile(
    r"^([a-z]+)\d*_(qfx|mx|ptx|acx|srx|ex)(\d{3,5})(?:-([a-z0-9]+))?\.conf$",
    re.IGNORECASE,
)
CE_ROLE_RE = re.compile(r"^ce\d*$", re.IGNORECASE)
# CE-skip rule applies only to these families (per design discussion):
# QFX/EX as CE = customer-edge stand-in, not a JVD-validated platform.
# MX/ACX/PTX/SRX as CE = still legitimately validated edge platforms.
CE_SKIPPABLE_FAMILIES = {"QFX", "EX"}

def _norm_model(family: str, num: str, variant: Optional[str]) -> str:
    family = family.upper()
    if variant:
        variant = variant.upper()
        if not re.search(r"[A-Z]", variant):
            # Pure-digit "variant" (e.g. "01", "10") is a unit number, not a model variant.
            variant = None
    return f"{family}{num}-{variant}" if variant else f"{family}{num}"

def _scan_text_models(text):
    found = set()
    for m in MODEL_RE.finditer(text):
        found.add(_norm_model(m.group(1), m.group(2), m.group(3)))
    for m in FAMILY_SERIES_RE.finditer(text):
        found.add(m.group(1).upper())
    return found

def _dedupe_and_sort(found):
    # Suppress bare family mentions (e.g. "MX") when a specific model of the
    # same family is already present (e.g. "MX480"). The specific model is
    # more informative; the family chip is implied via familyOf() in the UI.
    specific_families = {re.match(r"[A-Z]+", p).group(0)
                         for p in found if not re.fullmatch(r"[A-Z]+", p)}
    found = {p for p in found
             if not (re.fullmatch(r"[A-Z]+", p) and p in specific_families)}
    # Suppress bare model number (e.g. "ACX7100") when a `-VARIANT` of the same
    # base is present (e.g. "ACX7100-32C"). Bare-model hits typically come from
    # comment-style family shorthand inside .conf files.
    bases_with_variants = set()
    for p in found:
        m = re.match(r"^([A-Z]+\d+)-", p)
        if m:
            bases_with_variants.add(m.group(1))
    found = {p for p in found if p not in bases_with_variants}
    def key(p):
        return (1 if re.fullmatch(r"[A-Z]+", p) else 0, p)
    return sorted(found, key=key)

def extract_platforms_from_readme(text):
    return _dedupe_and_sort(_scan_text_models(text))

def extract_platforms_from_configs(jvd_dir):
    """Tier-2 fallback: scan .conf filenames + contents under the JVD dir.

    Applies the CE-skip rule: a QFX/EX model that appears only on filenames
    whose role-prefix matches `ce\\d*` is dropped (it's a customer-edge
    stand-in, not a validated JVD platform).
    """
    # Map model -> set of role prefixes seen (filename-derived only)
    model_roles = {}
    text_found = set()

    for conf in jvd_dir.rglob("*.conf"):
        # Filename-based extraction (with role context)
        fm = FILENAME_RE.match(conf.name)
        if fm:
            role, fam, num, variant = fm.group(1), fm.group(2), fm.group(3), fm.group(4)
            model = _norm_model(fam, num, variant)
            model_roles.setdefault(model, set()).add(role.lower())
        # Content-based extraction (no role context, no CE skip)
        try:
            text_found |= _scan_text_models(conf.read_text(encoding="utf-8", errors="replace"))
        except OSError:
            pass

    # Apply CE-skip: drop QFX/EX models whose only roles are CE-style prefixes.
    filename_models = set()
    for model, roles in model_roles.items():
        family = re.match(r"[A-Z]+", model).group(0)
        if family in CE_SKIPPABLE_FAMILIES and all(CE_ROLE_RE.match(r) for r in roles):
            continue
        filename_models.add(model)

    return _dedupe_and_sort(filename_models | text_found)

def extract_os(text):
    out = []
    if re.search(r"\bJunos\s*OS\s*Evolved\b", text, re.IGNORECASE) or \
       re.search(r"\bJunos\s*EVO\b", text, re.IGNORECASE):
        out.append("Junos EVO")
    # "Junos OS" without "Evolved" (or just "Junos" as a noun for the OS).
    # Look for "Junos OS" excluding "Junos OS Evolved".
    for m in re.finditer(r"\bJunos\s*OS\b(?!\s*Evolved)", text, re.IGNORECASE):
        out.append("Junos")
        break
    return out

def discover():
    entries = []
    for area_root, area_name in AREAS:
        root = REPO / area_root
        if not root.is_dir():
            continue
        for sub in sorted(root.iterdir()):
            if not sub.is_dir() or sub.name in NOT_A_JVD or sub.name.startswith("."):
                continue
            jvd_id = sub.name
            repo_path = f"{area_root}/{sub.name}"
            readme = sub / "README.md"
            text = readme.read_text(encoding="utf-8", errors="replace") if readme.is_file() else ""
            # Tier 0: Juniper validated-platforms API (cached).
            platforms, ok = extract_platforms_from_api(jvd_id)
            platform_source = "api" if ok else ""
            if not ok:
                # Tier 1: README scan.
                platforms = extract_platforms_from_readme(text)
                if platforms:
                    platform_source = "readme"
            if not platforms:
                # Tier 2: .conf scan (filenames + contents, with CE-skip).
                platforms = extract_platforms_from_configs(sub)
                if platforms:
                    platform_source = "configs"
            entries.append({
                "id": jvd_id,
                "area": area_name,
                "repoPath": repo_path,
                "platforms": platforms,
                "os": extract_os(text),
                "_has_readme": bool(text),
                "_platform_source": platform_source,
            })
    return entries

# Load existing catalog (preserve name + description).
existing = []
if CATALOG.is_file():
    existing = json.loads(CATALOG.read_text(encoding="utf-8"))
by_id = {e["id"]: e for e in existing}

discovered = discover()
disc_ids = {e["id"] for e in discovered}

# Warnings to stderr, summarized by source.
new_ids        = [e["id"] for e in discovered if e["id"] not in by_id]
removed_ids    = [e["id"] for e in existing   if e["id"] not in disc_ids]
no_platform    = [e["id"] for e in discovered if not e["platforms"]]
src_api        = [e["id"] for e in discovered if e["_platform_source"] == "api"]
src_readme     = [e["id"] for e in discovered if e["_platform_source"] == "readme"]
src_configs    = [e["id"] for e in discovered if e["_platform_source"] == "configs"]
mapped_no_data = [e["id"] for e in discovered
                  if e["id"] in ID_MAP and e["_platform_source"] != "api"]

for nid in new_ids:
    print(f"  + new JVD: {nid} (description left empty — please edit)", file=sys.stderr)
for rid in removed_ids:
    print(f"  - removed JVD: {rid}", file=sys.stderr)
print(f"  platform sources: API={len(src_api)} README={len(src_readme)} configs={len(src_configs)} none={len(no_platform)}",
      file=sys.stderr)
for nid in mapped_no_data:
    print(f"  ~ {nid}: id-map present but cache empty (run with --refresh)", file=sys.stderr)
for nid in src_configs:
    print(f"  ~ {nid}: platforms from .conf scan (no API/README hits)", file=sys.stderr)
for nid in no_platform:
    print(f"  ! {nid}: no platforms found (all tiers empty)", file=sys.stderr)

# Merge: preserve order of existing entries, then append new ones in discovery order.
out = []
seen = set()
for e in existing:
    if e["id"] not in disc_ids:
        continue
    d = next(x for x in discovered if x["id"] == e["id"])
    out.append({
        "id":          e["id"],
        "name":        e.get("name", e["id"]),
        "area":        d["area"],
        "description": e.get("description", ""),
        "platforms":   d["platforms"],
        "os":          d["os"],
        "repoPath":    d["repoPath"],
    })
    seen.add(e["id"])
for d in discovered:
    if d["id"] in seen:
        continue
    out.append({
        "id":          d["id"],
        "name":        d["id"],
        "area":        d["area"],
        "description": "",
        "platforms":   d["platforms"],
        "os":          d["os"],
        "repoPath":    d["repoPath"],
    })

print(json.dumps(out, indent=2, ensure_ascii=False))
PY

NEW_JSON="$(REPO_ROOT="$REPO_ROOT" CATALOG="$CATALOG" ID_MAP="$ID_MAP" CACHE="$CACHE" python3 "$PY_SCRIPT")"

# Pretty-print to a single line per object (matches existing catalog style),
# using jq for stable formatting.
FORMATTED="$(printf '%s\n' "$NEW_JSON" | jq -c '.[]' | awk 'BEGIN{print "["} {if(NR>1)print prev","; prev=$0} END{print prev"\n]"}')"

if [[ $CHECK_ONLY -eq 1 ]]; then
  if ! diff -q <(jq -S . "$CATALOG") <(jq -S . <(printf '%s\n' "$FORMATTED")) >/dev/null; then
    echo "Catalog out of date — run portal/scripts/generate-catalog.sh" >&2
    exit 1
  fi
  echo "Catalog up to date."
  exit 0
fi

printf '%s\n' "$FORMATTED" > "$CATALOG"
echo "Wrote $CATALOG ($(jq 'length' "$CATALOG") entries)."
