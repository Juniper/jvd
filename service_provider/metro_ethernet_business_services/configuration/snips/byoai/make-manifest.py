#!/usr/bin/env python3
"""
Generate MANIFEST.json: a per-snip catalog the AI fetches first
to decide which snip files to pull on demand, instead of loading
the whole 196 KB jvd-mebs-snips.md bundle.

Walks ../junos and ../evo, parses each .conf file's header
(`Topic:`, `Seen on:` Junos/EVO device lists), and emits a JSON
manifest with per-snip metadata + raw.githubusercontent.com URLs.

Run from the byoai/ folder.
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

REPO_ROOT_PARTS = (
    "service_provider",
    "metro_ethernet_business_services",
    "configuration",
    "snips",
)
RAW_BASE = (
    "https://raw.githubusercontent.com/Juniper/jvd/add/byoai-manifest/"
    + "/".join(REPO_ROOT_PARTS)
)

SNIPS_DIR = Path(__file__).resolve().parent.parent  # .../snips/

TOPIC_RE = re.compile(r"^\s*\*\s*Topic:\s*(.+?)\s*$", re.MULTILINE)
SEEN_JUNOS_RE = re.compile(r"^\s*\*\s*Junos:\s*(.+?)\s*$", re.MULTILINE)
SEEN_EVO_RE = re.compile(r"^\s*\*\s*EVO:\s*(.+?)\s*$", re.MULTILINE)


def _devices(line: str) -> list[str]:
    """Extract device hostnames from a 'Junos:' or 'EVO:' line.

    Device names always contain an underscore (e.g. an1_mx204,
    ma1-1_acx7024). Strip parenthetical phrases like
    '(and other Junos PEs)'.
    """
    line = re.sub(r"\([^)]*\)", "", line)
    return [tok for tok in line.split() if "_" in tok]


def parse_header(path: Path) -> dict:
    text = path.read_text(encoding="utf-8", errors="replace")
    head = text.split("*/", 1)[0]  # only look inside the leading C comment
    topic_m = TOPIC_RE.search(head)
    junos_m = SEEN_JUNOS_RE.search(head)
    evo_m = SEEN_EVO_RE.search(head)

    seen_on = []
    if junos_m:
        seen_on += _devices(junos_m.group(1))
    if evo_m:
        seen_on += _devices(evo_m.group(1))

    return {
        "topic": (topic_m.group(1).strip() if topic_m else ""),
        "seen_on": seen_on,
        "size_bytes": path.stat().st_size,
    }


def build_entry(conf_path: Path) -> dict:
    rel = conf_path.relative_to(SNIPS_DIR).as_posix()  # e.g. junos/services/l3vpn-vrf.conf
    os_family, category, filename = rel.split("/", 2)
    header = parse_header(conf_path)
    return {
        "path": rel,
        "os": os_family,            # "junos" | "evo"
        "category": category,       # apply-groups | cos | firewall | interfaces | oam | policy | services | transport
        "name": filename.removesuffix(".conf"),
        "topic": header["topic"],
        "seen_on": header["seen_on"],
        "size_bytes": header["size_bytes"],
        "raw_url": f"{RAW_BASE}/{rel}",
    }


def main() -> int:
    snips = []
    for conf in sorted(SNIPS_DIR.glob("**/*.conf")):
        if conf.relative_to(SNIPS_DIR).parts[0] not in ("junos", "evo"):
            continue
        snips.append(build_entry(conf))

    # Sibling reference files the AI also needs.
    extras = [
        {
            "path": "_variables.md",
            "kind": "glossary",
            "topic": "Glossary of $VAR placeholders used across all snips",
            "raw_url": f"{RAW_BASE}/_variables.md",
        },
        {
            "path": "byoai/TIERS.md",
            "kind": "reference",
            "topic": "Per-service snip lists for `minimum` vs `as-deployed` configuration form",
            "raw_url": f"{RAW_BASE}/byoai/TIERS.md",
        },
        {
            "path": "byoai/DEFAULTS.md",
            "kind": "reference",
            "topic": "Auto-fill rules: lab-default addresses, AS numbers, instance names, ESI shape",
            "raw_url": f"{RAW_BASE}/byoai/DEFAULTS.md",
        },
        {
            "path": "byoai/OUTPUT_FORMAT.md",
            "kind": "reference",
            "topic": "Required output format: YAML Inputs block, per-device fenced blocks, Notes section",
            "raw_url": f"{RAW_BASE}/byoai/OUTPUT_FORMAT.md",
        },
    ]

    manifest = {
        "schema_version": 1,
        "description": (
            "BYOAI snip manifest. Fetch the entries you need from raw_url; "
            "do NOT fetch every snip. See byoai/SYSTEM_PROMPT.md for the "
            "selection rules."
        ),
        "raw_url_base": RAW_BASE,
        "snip_count": len(snips),
        "snips": snips,
        "reference_files": extras,
    }

    out = SNIPS_DIR / "byoai" / "MANIFEST.json"
    out.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    print(f"wrote: {out.relative_to(SNIPS_DIR.parent.parent.parent.parent)} ({len(snips)} snips, {out.stat().st_size} bytes)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
