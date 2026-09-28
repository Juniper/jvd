# JVD Portal

Web portal for browsing Juniper Validated Designs.

Live: <https://juniper.github.io/jvd/portal/>

## Stack

- **Framework:** Vite + React 19 + TypeScript
- **Styling:** Tailwind CSS 4 + shadcn/ui (Radix)
- **Hosting:** GitHub Pages (gh-pages branch, `/portal/` subpath)
- **Build:** Bun

## Deploy

Deployment is automatic. On every push to `main` that touches `portal/**`,
the `.github/workflows/portal-deploy.yml` workflow:

1. Builds the static site with Bun.
2. Copies `dist/index.html` to `dist/404.html` for SPA-style fallback.
3. Publishes the contents of `dist/` to `gh-pages/portal/` via
   `peaceiris/actions-gh-pages@v4` with `keep_files: true` so other
   subdirectories on `gh-pages` are preserved.

Pull requests run the build (without deploying) so PR checks catch
broken builds before merge.

## Snippet validation

From the repository root, run all tests with:

```sh
npm --prefix portal run snips:test
```

To select affected source-reconstruction cases against a Git base:

```sh
SNIP_VALIDATION_BASE=origin/main npm --prefix portal run snips:test
```

Without `SNIP_VALIDATION_BASE`, every case runs. Selection currently applies to
the MEBS reconstruction cases and, in CI, its JVD-specific audit commands.
General tests, header validation and catalog freshness checks remain enabled.

The selector includes possible consumers, alternative providers and dependencies
from both the base and current snippet metadata. A selected case retains all its
source occurrences, devices and assertions. Source configuration, JVD metadata,
shared-code changes or incomplete dependency information select the full relevant
corpus. A missing Git base fails validation. Catalog updates accompanying source
changes do not by themselves broaden reconstruction to unrelated JVDs.

Inspect the selection without running reconstruction:

```sh
npm --prefix portal run snips:scope -- --base origin/main --jvd service_provider/metro_ethernet_business_services
```

## Data

JVD catalog content lives in [`src/data/jvds.json`](src/data/jvds.json).
Each entry: `id`, `name`, `area`, `description`, `platforms`, `os`,
`repoPath`. The catalog and area-badge counts derive from this file.
