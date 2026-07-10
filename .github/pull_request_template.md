<!--
  Juniper/jvd PR template. Keep it BRIEF and externally-safe — every push
  notifies watchers and the squashed PR body becomes part of the public
  release notes. Delete any section that doesn't apply.
-->

## What's New
<!-- One-line headline matching the PR title, then 2-4 bullets of
     user-visible changes. Customer / watcher voice. -->

## Why
<!-- The problem this solves, briefly. Concrete numbers if perf/scale. -->

## Changes
<!-- Checklist of what this PR does, grouped by area. Tick as done. -->
- [x]

## Verified before merge
<!-- Tick what you actually checked; leave unchecked = not done / N/A. -->
- [ ] Portal builds — `bun run build`
- [ ] Markdown links pass — `lychee --offline --include-fragments './**/*.md'` → 0 errors
- [ ] Generated artifacts regenerated where source changed (e.g. byoai mirror via `generate-snips.mjs`)
- [ ] No internal-only content in public files (lab hostnames/IPs, Confidential material, scratch/TODO)
- [ ] Externally-safe wording (watcher/customer-appropriate)

<!--
## Notes — optional
Source-of-truth (generated vs hand-edited) · breaking changes / migration steps ·
follow-up work intentionally deferred.
-->
