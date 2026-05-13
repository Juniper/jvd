#!/usr/bin/env bash
# Sync the JVD Portal source from the Lovable-managed repo (KB-x/jvd-portal)
# into this repo's portal/ subdirectory, on a fresh feature branch.
#
# Usage:
#   portal/scripts/sync-from-lovable.sh [--force] [lovable-repo-url] [lovable-branch]
#
# Defaults:
#   lovable-repo-url = https://github.com/KB-x/jvd-portal.git
#   lovable-branch   = main
#
# Options:
#   --force   Skip the "must be on up-to-date main" preflight check.
#             Use only if you know what you're doing.
#
# The script:
#   1. Verifies the working tree is clean and we're on an up-to-date main.
#   2. Clones the Lovable repo into a temp dir.
#   3. Rsyncs source into portal/, excluding:
#        - .git, node_modules, dist (build artifacts)
#        - .lovable (Lovable-specific metadata)
#        - portal/README.md      (ours, not Lovable's)
#        - portal/scripts/       (ours)
#        - portal/vite.config.ts (handled separately to preserve `base`)
#        - portal/src/components/SnipLibrary.tsx, portal/src/components/snips/ (ours)
#        - portal/src/components/ByoaiSection.tsx (ours)
#        - portal/src/lib/snips.ts (ours)
#        - portal/src/data/snips.json (build-generated, ours)
#   4. Patches vite.config.ts to ensure `base: '/jvd/portal/'` is present.
#   5. Verifies the build still succeeds.
#   6. Creates branch update/portal-YYYYMMDD-HHMM, commits, and prints next steps.

set -euo pipefail

FORCE=0
if [[ "${1:-}" == "--force" ]]; then
  FORCE=1
  shift
fi

LOVABLE_REPO="${1:-https://github.com/KB-x/jvd-portal.git}"
LOVABLE_BRANCH="${2:-main}"

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
PORTAL_DIR="$REPO_ROOT/portal"
BASE_PATH="/jvd/portal/"

cd "$REPO_ROOT"

# ---------------------------------------------------------------------------
# 1. Preflight
# ---------------------------------------------------------------------------
echo "==> Preflight checks"

if [[ -n "$(git status --porcelain)" ]]; then
  echo "ERROR: working tree is dirty. Commit or stash first." >&2
  git status --short
  exit 1
fi

CURRENT_BRANCH="$(git rev-parse --abbrev-ref HEAD)"
if [[ "$CURRENT_BRANCH" != "main" && "$FORCE" -ne 1 ]]; then
  echo "ERROR: not on main (current: $CURRENT_BRANCH)." >&2
  echo "       Run 'git checkout main && git pull' first, or pass --force." >&2
  exit 1
fi

echo "==> Fetching latest from origin"
git fetch origin main --quiet
if [[ "$CURRENT_BRANCH" == "main" ]]; then
  LOCAL_MAIN="$(git rev-parse main)"
  REMOTE_MAIN="$(git rev-parse origin/main)"
  if [[ "$LOCAL_MAIN" != "$REMOTE_MAIN" && "$FORCE" -ne 1 ]]; then
    echo "ERROR: local main is behind origin/main." >&2
    echo "       Run 'git pull origin main' first, or pass --force." >&2
    exit 1
  fi
fi

# ---------------------------------------------------------------------------
# 2. Clone Lovable repo to temp dir
# ---------------------------------------------------------------------------
TMP_DIR="$(mktemp -d -t jvd-portal-sync-XXXXXX)"
trap 'rm -rf "$TMP_DIR"' EXIT

echo "==> Cloning $LOVABLE_REPO (branch: $LOVABLE_BRANCH)"
git clone --depth 1 --branch "$LOVABLE_BRANCH" --quiet "$LOVABLE_REPO" "$TMP_DIR/source"

LOVABLE_SHA="$(cd "$TMP_DIR/source" && git rev-parse HEAD)"
LOVABLE_SHORT="${LOVABLE_SHA:0:7}"
echo "    Source HEAD: $LOVABLE_SHORT"

# ---------------------------------------------------------------------------
# 3. Rsync source into portal/, excluding files we own
# ---------------------------------------------------------------------------
echo "==> Syncing into $PORTAL_DIR"

rsync -a --delete \
  --exclude='.git' \
  --exclude='node_modules' \
  --exclude='dist' \
  --exclude='.lovable' \
  --exclude='README.md' \
  --exclude='scripts' \
  --exclude='vite.config.ts' \
  --exclude='src/components/SnipLibrary.tsx' \
  --exclude='src/components/ByoaiSection.tsx' \
  --exclude='src/components/snips' \
  --exclude='src/lib/snips.ts' \
  --exclude='src/data/snips.json' \
  "$TMP_DIR/source/" "$PORTAL_DIR/"

# ---------------------------------------------------------------------------
# 4. Handle vite.config.ts: copy if missing, else patch base path
# ---------------------------------------------------------------------------
echo "==> Reconciling vite.config.ts (base path)"

cp "$TMP_DIR/source/vite.config.ts" "$PORTAL_DIR/vite.config.ts.new"

if grep -q "base:" "$PORTAL_DIR/vite.config.ts.new"; then
  # Replace whatever base is set to with ours.
  sed -i.bak "s|base: *\"[^\"]*\"|base: \"$BASE_PATH\"|" "$PORTAL_DIR/vite.config.ts.new"
  rm -f "$PORTAL_DIR/vite.config.ts.new.bak"
else
  # Inject base right after `defineConfig({`.
  awk -v base="  base: \"$BASE_PATH\"," '
    /defineConfig\(\{/ && !done { print; print base; done=1; next } { print }
  ' "$PORTAL_DIR/vite.config.ts.new" > "$PORTAL_DIR/vite.config.ts.tmp"
  mv "$PORTAL_DIR/vite.config.ts.tmp" "$PORTAL_DIR/vite.config.ts.new"
fi

mv "$PORTAL_DIR/vite.config.ts.new" "$PORTAL_DIR/vite.config.ts"

# Verify the patch
if ! grep -q "base: \"$BASE_PATH\"" "$PORTAL_DIR/vite.config.ts"; then
  echo "ERROR: failed to apply base path to vite.config.ts" >&2
  exit 1
fi

# ---------------------------------------------------------------------------
# 5. Smoke-test the build
# ---------------------------------------------------------------------------
echo "==> Build smoke test"

if ! command -v bun >/dev/null 2>&1; then
  echo "WARNING: bun not installed — skipping build verification."
  echo "         Install with: brew install oven-sh/bun/bun"
else
  (
    cd "$PORTAL_DIR"
    bun install --silent
    bun run build >/dev/null
  )
  echo "    Build OK."
fi

# ---------------------------------------------------------------------------
# 6. Check whether anything changed
# ---------------------------------------------------------------------------
if [[ -z "$(git status --porcelain portal)" ]]; then
  echo "==> No changes — portal/ is already in sync with $LOVABLE_SHORT."
  exit 0
fi

# ---------------------------------------------------------------------------
# 7. Create branch + commit
# ---------------------------------------------------------------------------
TIMESTAMP="$(date +%Y%m%d-%H%M)"
BRANCH="update/portal-$TIMESTAMP"

echo "==> Creating branch $BRANCH"
git checkout -b "$BRANCH"

git add portal
git commit -m "Sync portal/ from KB-x/jvd-portal@$LOVABLE_SHORT

Synced from $LOVABLE_REPO (branch: $LOVABLE_BRANCH).
Preserved: portal/README.md, portal/scripts/, base path in vite.config.ts."

echo ""
echo "==> Done. Next steps:"
echo ""
echo "    git push -u origin $BRANCH"
echo "    open https://github.com/Juniper/jvd/pull/new/$BRANCH"
echo ""
