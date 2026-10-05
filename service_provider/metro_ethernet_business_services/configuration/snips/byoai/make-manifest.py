#!/usr/bin/env python3
"""Generate the BYOAI manifest with the repository's canonical parser."""
from __future__ import annotations

import os
import subprocess
import sys
from pathlib import Path


def main() -> int:
    script = Path(__file__).resolve()
    builder = os.environ.get("JVD_BUILDER")
    if not builder:
        print("JVD_BUILDER must point at the git-jvd-builder checkout", file=sys.stderr)
        return 2
    generator = Path(builder) / "engine/js/generate-byoai-manifest.mjs"
    configuration = script.parents[2]
    env = {**os.environ, "JVD_REPO": str(script.parents[5])}
    return subprocess.run(
        ["node", str(generator), "--configuration", str(configuration), *sys.argv[1:]],
        check=False,
        env=env,
    ).returncode


if __name__ == "__main__":
    sys.exit(main())
