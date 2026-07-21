#!/usr/bin/env python3
"""
Generate MANIFEST.json: a per-snip catalog the AI fetches first to
decide which snip files to pull on demand, instead of loading the whole
jvd-dci-ipodwdm-snips.md bundle.

Walks ../junos and ../evo, parses each .conf file's header (`Topic:`,
`Seen on:` Junos/Evo device lists in `LABEL (PLATFORM)` form), and emits
a JSON manifest with per-snip metadata + raw.githubusercontent.com URLs.

Run from the byoai/ folder.
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

REPO_ROOT_PARTS = (
    "optical",
    "dci_over_ipodwdm",
    "configuration",
    "snips",
)
RAW_BASE = (
    "https://raw.githubusercontent.com/Juniper/jvd/main/"
    + "/".join(REPO_ROOT_PARTS)
)

SNIPS_DIR = Path(__file__).resolve().parent.parent  # .../snips/

TOPIC_RE = re.compile(r"^\s*\*\s*Topic:\s*(.+?)\s*$", re.MULTILINE)
# JVD "Seen on:" block uses `Junos:` and `Evo:` (capital-E lowercase-vo)
# lines with device labels of the form `MSE1 (MX304), MA4 (MX204)`.
SEEN_JUNOS_RE = re.compile(r"^\s*\*\s*Junos:\s*(.+?)\s*$", re.MULTILINE)
SEEN_EVO_RE = re.compile(r"^\s*\*\s*Evo:\s*(.+?)\s*$", re.MULTILINE | re.IGNORECASE)
# `LABEL (PLATFORM)` — e.g. MSE1 (MX304), MA1.2 (ACX7024), AN3 (ACX7100-48L)
DEVICE_RE = re.compile(r"([A-Za-z0-9.\-]+)\s*\(([^)]+)\)")


def _devices(line: str) -> list[dict]:
    """Extract [{label, platform}] pairs from a 'Junos:' or 'Evo:' line."""
    return [
        {"label": m.group(1), "platform": m.group(2).strip()}
        for m in DEVICE_RE.finditer(line)
    ]


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
    rel = conf_path.relative_to(SNIPS_DIR).as_posix()  # e.g. junos/services/evpn-vpws-vlan-based.conf
    os_family, category, filename = rel.split("/", 2)
    header = parse_header(conf_path)
    return {
        "path": rel,
        "os": os_family,            # "junos" | "evo"
        "category": category,       # services | interfaces | firewall | cos | policy | apply-groups
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
            "path": "byoai/CATALOG.md",
            "kind": "reference",
            "topic": "Funnel map: service profile + deployment + attributes -> exact service / interface / filter snip per OS",
            "raw_url": f"{RAW_BASE}/byoai/CATALOG.md",
        },
        {
            "path": "byoai/TIERS.md",
            "kind": "reference",
            "topic": "Per-tier snip lists for `minimum` / `with-cos` / `as-deployed` configuration form",
            "raw_url": f"{RAW_BASE}/byoai/TIERS.md",
        },
        {
            "path": "byoai/DEFAULTS.md",
            "kind": "reference",
            "topic": "Auto-fill rules: lab-default instance names, RDs, RTs, VLAN/unit sequences, ESI shape, device selection",
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
            "selection rules and byoai/CATALOG.md for the funnel map."
        ),
        "raw_url_base": RAW_BASE,
        "snip_count": len(snips),
        "snips": snips,
        "reference_files": extras,
    }

    out = Path(__file__).resolve().parent / "MANIFEST.json"
    out.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    print(f"wrote {out} ({len(snips)} snips, {out.stat().st_size} bytes)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
