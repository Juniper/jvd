# JVD Portal

Web portal for browsing Juniper Validated Designs.

Live: <https://juniper.github.io/jvd/portal/>

## Stack

- **Framework:** Vite + React 19 + TypeScript
- **Styling:** Tailwind CSS 4 + shadcn/ui (Radix)
- **Hosting:** GitHub Pages (gh-pages branch, `/portal/` subpath)
- **Build:** Bun

## Local development

```bash
cd portal
bun install
bun run dev
```

Then open <http://localhost:8080>.

## Build

```bash
bun run build
```

Outputs to `portal/dist/` with `base: '/jvd/portal/'`.

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

## Iteration workflow

Source-of-truth iteration happens in [Lovable](https://lovable.dev/) on the
project synced to <https://github.com/KB-x/jvd-portal>. To promote changes
into this repo:

1. Pull the latest `main` from `KB-x/jvd-portal`.
2. Sync the source files (everything except `node_modules`, `dist`,
   `.lovable`) into `portal/` here.
3. Re-apply the `base: '/jvd/portal/'` setting in `vite.config.ts` if it
   was overwritten.
4. Open a PR against `Juniper/jvd:main`.

## Data

JVD catalog content lives in [`src/data/jvds.json`](src/data/jvds.json).
Each entry: `id`, `name`, `area`, `description`, `platforms`, `os`,
`repoPath`. The catalog and area-badge counts derive from this file.
