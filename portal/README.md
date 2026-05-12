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

## Data

JVD catalog content lives in [`src/data/jvds.json`](src/data/jvds.json).
Each entry: `id`, `name`, `area`, `description`, `platforms`, `os`,
`repoPath`. The catalog and area-badge counts derive from this file.
