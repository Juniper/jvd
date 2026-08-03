#!/usr/bin/env python3
"""
Generate MANIFEST.json: a per-snip catalog the AI fetches first
to decide which snip files to pull on demand, instead of loading
the whole jvd-ewan-core-edge-snips.md bundle.

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
    "enterprise_wan",
    "ewan_core_edge",
    "configuration",
    "snips",
)
RAW_BASE = (
    "https://raw.githubusercontent.com/Juniper/jvd/main/"
    + "/".join(REPO_ROOT_PARTS)
)

SNIPS_DIR = Path(__file__).resolve().parent.parent  # .../snips/

TOPIC_RE = re.compile(r"^\s*\*\s*Topic:\s*(.+?)\s*$", re.MULTILINE)
SEEN_JUNOS_RE = re.compile(r"^\s*\*\s*Junos:\s*(.+?)\s*$", re.MULTILINE)
SEEN_EVO_RE = re.compile(r"^\s*\*\s*(?:EVO|Evo):\s*(.+?)\s*$", re.MULTILINE)


def _devices(line: str) -> list[str]:
    """Extract device hostnames from a 'Junos:' or 'EVO:' line."""
    line = re.sub(r"\([^)]*\)", "", line)
    return [tok for tok in line.split() if "_" in tok]


def parse_header(path: Path) -> dict:
    text = path.read_text(encoding="utf-8", errors="replace")
    head = text.split("*/", 1)[0]
    topic_m = TOPIC_RE.search(head)
    junos_m = SEEN_JUNOS_RE.search(head)
    evo_m = SEEN_EVO_RE.search(head)

    seen_on = []
    if junos_m:
        seen_on += _devices(junos_m.group(1))
    if evo_m:
        seen_on += _devices(evo_m.group(1))

    return {
        "topic": topic_m.group(1).strip() if topic_m else "(no topic)",
        "seen_on": seen_on,
    }


def main() -> None:
    entries = []
    for conf in sorted(SNIPS_DIR.rglob("*.conf")):
        rel = conf.relative_to(SNIPS_DIR)
        if "byoai" in rel.parts:
            continue
        meta = parse_header(conf)
        entries.append({
            "path": str(rel),
            "url": f"{RAW_BASE}/{rel}",
            "topic": meta["topic"],
            "seen_on": meta["seen_on"],
        })

    manifest = {
        "jvd": "ewan_core_edge",
        "snip_count": len(entries),
        "base_url": RAW_BASE,
        "snips": entries,
    }

    out = Path(__file__).resolve().parent / "MANIFEST.json"
    out.write_text(json.dumps(manifest, indent=2) + "\n")
    print(f"wrote {out} ({len(entries)} snips)")


if __name__ == "__main__":
    main()
