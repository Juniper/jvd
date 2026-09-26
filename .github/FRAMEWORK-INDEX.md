# JVD Framework Index

Artifact owners and reading paths for JVD ingestion, snippet authoring and
consumption. This index does not define header rules or configuration semantics.

| Information | Owner |
| --- | --- |
| Published designs and repository navigation | [Repository README](../README.md) |
| Authoritative device captures | Each JVD's `configuration/conf/` |
| Published design evidence | Each JVD's `documentation/` |
| Snippet header fields and their meaning | [SNIP-CONTRACT.md](SNIP-CONTRACT.md) |
| Global construct vocabulary | [snip-glossary.json](glossary/snip-glossary.json) |
| Global variable vocabulary | [var-glossary.json](glossary/var-glossary.json) |
| JVD variable dictionary | Each JVD's `configuration/snips/_variables.md` |
| Recovered source bindings and Counts | Each JVD's `configuration/snips/_bindings.json`; Markdown companion for reading |
| JVD service selections and tiers | JVD-local `_composition.json`, where implemented |
| Vocabulary inventory and review evidence | [vocabulary-inventory.mjs](../portal/scripts/vocabulary-inventory.mjs) |
| Header parsing and validation | [snip-parse.mjs](../portal/scripts/snip-parse.mjs), [snip-validate.mjs](../portal/scripts/snip-validate.mjs) |
| Catalog and assistant bundle generation | [generate-snips.mjs](../portal/scripts/generate-snips.mjs), each JVD's BYOAI scripts |
| Portal application | [Portal README](../portal/README.md) |
| Repository checks | [Workflows](workflows/) and [portal scripts](../portal/package.json) |
| Local extraction/audit procedures | Companion `git-skills` repository: organize, documentation-ingest, extract and audit skills |
| Vocabulary admission and scheduled rename review | Companion `git-skills`: `jvd-extract-snips/SKILL.md`, "Vocabulary review before templating" |
| Local dependency and compatibility graphs | Companion `git-jvd-builder` repository: `graphs/README.md` |
| Private planning, proposals and historical audit evidence | Companion `git-reports` repository/folder |
| MCP deployment-plan consumer | Companion `jvd-mcp-server` repository: its plan, code and tests |

Capability vocabulary placement and review are tracked separately; this index
does not create a capability registry or approve an additional header field.