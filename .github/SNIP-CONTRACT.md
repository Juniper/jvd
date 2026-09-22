# Snip Header Contract

This is the normative specification for the header of a configuration **snip**
(`configuration/snips/{junos,evo}/<category>/<name>.conf`) in this repository.
It defines what published snip metadata **means** and what a valid snip **must**
contain.

Two different mechanisms establish the two different kinds of claim this
contract makes:

- **Structural and header rules** — section presence, order, syntax, token shape,
  path resolution, variable declaration — are enforced deterministically by
  `portal/scripts/snip-validate.mjs` and its committed tests. This document is
  the human-readable source of truth for that check.
- **Semantic reconstruction claims** — `Seen on` exactness and fragment-boundary
  applicability — require rendering a body against an authoritative source
  configuration. No committed script does that, so those claims are established
  by the authorized roundtrip verification described under *Fragment boundary*,
  **not** by CI.

The key words **MUST**, **MUST NOT**, **SHOULD**, and **MAY** are used as in
RFC 2119.

The canonical vocabulary this contract refers to — snip construct names and
template variable names — is recorded in `.github/glossary/snip-glossary.json`
and `.github/glossary/var-glossary.json`.

## Structure

A snip is a single `.conf` file: a C-style header comment block at the very top,
followed by the templated configuration body.

```
/*
 * Topic:   <one physical line>
 * Seen on:
 *   Junos: <device tokens | (none)>
 *   EVO:   <device tokens | (none)>
 * Highlights:            (optional)
 *  - <bullet>
 * Pair with:             (optional)
 *  - <snip path>
 * JVD service mapping:   (optional)
 * Variables:             (optional)
 *   $VAR   e.g. <example>
 */
<body>
```

Sections, when present, **MUST** appear in this order: `Topic`, `Seen on`,
`Variant group`, `Highlights`, `Pair with`, `JVD service mapping`, `Variables`.
`Variables` is last, adjacent to the templated body it declares. Any other order
is reported as `INVALID_SECTION_ORDER`.

A formal field header **MUST** end its keyword with a colon, optionally after an
immediate `(…)` annotation — `Field:` or `Field (annotation):` (e.g. `Pair with
(same-device dependencies):`, `Variables (example values from mse1_mx304):`). A
colonless line is body prose, not metadata. A colonless **annotated** field
(e.g. `Variables (none — literal)`) is tolerated for backward compatibility but
is **deprecated**: it parses, yet is reported as `LEGACY_HEADER_SYNTAX` (a
warning on legacy snips, an error once the snip is changed). New fields **MUST**
use the colon form.

Every non-blank header line **MUST** belong to a formal section. A header may
contain only: a recognized section header, a recognized subordinate row (a
`Junos:` / `EVO:` device row, a `Provides:` row, a variable declaration), a
bullet inside a section that takes bullets, a wrapped continuation of the bullet
or row immediately above it, and blank comment lines. A line that cannot be
attributed to the active section — prose between sections, a stray bullet before
the section that would own it, or a fragment left behind by an edit — is
reported as `ORPHAN_HEADER_CONTENT`. A bullet intended as a highlight **MUST**
appear under `Highlights:`.

Junos and EVO forms of the same construct live in **separate** files under
`snips/junos/` and `snips/evo/`. They are **not** consolidated; the file's
directory is its OS identity. A cross-OS counterpart, when one exists, is
surfaced through the derived `otherOsFormId` field (see *Cross-OS navigation*).

## Fields

### What a header is for

Header metadata describes what the snip **contains** and **means**. It does not
document the investigation that produced it.

Every statement in a header **MUST** be grounded in configuration present in the
snip body or in an explicit machine-readable relationship field. A header
**MUST NOT** explain:

- configuration or behaviour that is absent;
- rejected interpretations or rejected names;
- why some other form does not apply;
- audit findings or proof methodology;
- migration or rename history;
- unresolved doubt, or the reasoning used to reach the published interpretation.

If a body admits more than one interpretation, that ambiguity **MUST** be
adjudicated before the snip is published. The header records the accepted
result, not the debate.

A Junos statement that is *literally negative* but present in the body —
`no-normalization`, `no-control-word`, `do-not-advertise` — is present
configuration and **MAY** be described.

### Topic

- `Topic:` **MUST** be exactly **one physical line**. The parser captures only
  the first line; a wrapped continuation is silently lost. (`TOPIC_MULTILINE`)
  A trailing `\` continuation does **not** make a physically multiline Topic
  canonical: the continuation is still a second physical line and is flagged.
- It **MUST** be a short, positive description of what the snip **is**, derivable
  from configuration present in the body. Design documentation **MAY** resolve
  terminology, but **MUST NOT** introduce behaviour the body does not carry.
- Prefer the smallest description that identifies the construct. An
  implementation detail belongs in `Topic:` only when it is identity-bearing.
- It **MUST NOT**:
  - enumerate absent statements or features, or say what the body does not do;
  - explain why the snip is not some other construct;
  - carry audit conclusions, proof notes, or naming rationale;
  - compare against a sibling form;
  - repeat OS, platform, role, or device applicability already carried by the
    file's `junos/` or `evo/` directory or by `Seen on:`;
  - carry migration or rename history;
  - read as a sentence-length highlight rather than a name for the construct.
- It **MUST NOT** contain navigation instructions or file paths.
- `Apply-group:` / `Apply-groups:` remains an accepted alias of `Topic:` for
  apply-group snips (the group name is the topic). New non-apply-group snips
  **MUST** use `Topic:`.

### Seen on

`Seen on:` answers exactly one question:

> Which validated source devices reproduce this exact templated body?

- It **MUST** contain a `Junos:` row and an `EVO:` row. (`MISSING_SEEN_ON_BUCKET`)
- Each row contains only **exact device tokens** or the marker `(none)`.
- A device **MUST** be listed only when rendering the snip with that device's
  values reproduces each of the snip's selected stanzas byte-for-byte (see
  *Fragment boundary*). The exactness claim covers the selected stanzas, not the
  full visible wrapper block.
- A token **MUST** resolve to exactly one source configuration under the JVD's
  `configuration/conf/` tree (see *Device identity*). The file's `junos/` or
  `evo/` directory does **not** limit which devices may appear: if the same body
  roundtrips on a device of the other OS family, that device **MUST** still be
  listed in its bucket.
- `(none)` is the only valid empty value. (`SEEN_ON_APPROXIMATION`)
- It **MUST NOT** contain: `see`, snip or navigation paths, `.conf` filenames,
  `all`/`all PEs`/`other devices`, inferred applicability, prose notes, or
  cross-file navigation. Scenario-qualified **device** identities (see *Device
  identity*) are permitted. (`SEEN_ON_NON_DEVICE_TOKEN`, `SEEN_ON_APPROXIMATION`)

### Adjudicated exclusions

A construct present in a source configuration remains eligible for modelling
unless it is **explicitly excluded by human adjudication**. Tooling **MAY**
nominate configuration as stale, unused, or otherwise irrelevant, but **MUST
NOT** exclude it automatically.

Once a construct is adjudicated as excluded from the model, it is no longer
eligible for snip creation, for reuse matching, or for `Seen on` membership on
the devices that adjudication covers. The source configuration itself is never
modified by such a decision.

For constructs that remain in scope the `Seen on` rule above applies unchanged:
every validated source device on which the snip renders the selected
configuration exactly **MUST** be listed, regardless of OS directory.

### Fragment boundary

A snip may select multiple sibling stanzas under a context-only hierarchy. Every
selected stanza and included container-level statement **MUST** coexist under the
same concrete parent instance and match exactly using one consistent variable
binding. Additional unselected siblings are outside the snip's scope and are
permitted. Additional configuration inside a selected stanza is **not** permitted.

A named child instance **MAY** be selected independently when its parent serves
only as context for that child instance. Where that holds:

- configuration belonging to **sibling child instances** is outside the selected
  fragment;
- configuration at the **context parent itself** is outside the selected child
  fragment unless the snip explicitly selects it;
- configuration **inside** the selected child instance **MUST** match exactly;
- a **constituent** inside an already-selected stanza is **not** automatically an
  independently selectable child instance.

An interface therefore provides context for a selected unit, and a parent-level
`mtu` or `disable` does not invalidate that unit; `rib-groups` provides context
for a selected named rib-group, and a sibling rib-group does not invalidate it.
Conversely, a selected unit that carries an additional `esi` or `filter` on the
device does **not** match, and a selected `policy-statement` that carries an
additional `term` on the device does **not** match — a policy term is an ordered
constituent of the statement, not an independently selectable instance.

Which child kinds are independently selectable is **not** derivable from
hierarchy shape alone: a named rib-group and a policy `term` are structurally
identical. That distinction is grammar knowledge, held in the
**instance-recognition registry** at `portal/scripts/snip-instance-registry.json`.
The registry is the normative source for that vocabulary; it is parser and
validation knowledge only, **not** a service taxonomy, and carries no naming,
category, or relationship meaning.

The registry's *semantics* are consumed by the authorized roundtrip
verification, which runs outside this repository. No committed production script
applies them: `snip-parse.mjs`, `snip-validate.mjs` and `generate-snips.mjs`
parse and check headers and do not evaluate a body against a source
configuration, so they neither apply nor enforce this rule. The committed
contract test (`snip-validate.test.mjs`) does read the registry, but only to
check its shape and internal consistency. A `Seen on` claim is therefore
established by the roundtrip verification, not by CI.

The registry is versioned. Because a registry change can change which devices a
body reproduces on, any modification to it **MUST** trigger a full `Seen on`
re-audit and regeneration of `Count` and `_bindings` for every affected JVD.

The applicability claim is therefore that the **selected** stanzas reproduce
exactly on a device — not that the entire enclosing interface, maintenance
domain, or protocol process is byte-identical.

### Device identity

The valid device inventory for a JVD is built by walking its
`configuration/conf/` tree recursively. A `Seen on:` token is valid when it
resolves to **exactly one** source config:

- a unique file **basename** (without `.conf`), e.g. `mse1_mx304`; or
- a **scenario-qualified relative path** when basenames collide or the JVD
  already uses nested scenario directories, e.g. `dc1-dc2_ott/dc1_borderleaf1`.

An ambiguous basename or an unresolved token is invalid. (`SEEN_ON_UNKNOWN_DEVICE`)

### Highlights

`Highlights:` is optional. It carries concise, technically useful behaviour that
is **present in the body** and not already conveyed by `Topic:` or by structured
metadata.

- Each highlight begins with `-`; continuation lines are allowed.
- Each bullet **SHOULD** express one useful fact.
- A highlight **MAY** describe a positive distinguishing behaviour, provided that
  behaviour is actually in the body.
- Highlights **MUST NOT**:
  - describe absence as a distinguishing characteristic;
  - explain rejected alternatives, interpretations, or names;
  - record audit conclusions or proof methodology;
  - carry migration or rename history;
  - restate `Topic`, `Seen on`, `Variables`, or `Pair with` without adding
    semantic value.
- Highlights **MUST NOT** substitute for machine-readable applicability,
  dependency, or selection metadata.

A technically valuable highlight is not removed merely to shorten a header. A
fact that does not belong in `Topic:` but is present in the body and genuinely
explains behaviour belongs here.

### Pair with

`Pair with:` answers exactly one question:

> Which other snips are required **on the same device** for this snip to commit
> or function correctly?

- Each entry **MUST** identify a resolvable snip path relative to the JVD's
  `snips/` directory (e.g. `junos/policy/loopback-rib-leak.conf`), and a
  whole-snip dependency is the **path alone**. (`PAIR_WITH_UNRESOLVED`)
- A parenthetical **MAY** follow the path in exactly one case: to name the
  specific sub-part required from a compound snip that reconstructs several
  objects at once (e.g. which community, which policy term). It names that
  object; it is not an explanation.
- An entry **MUST NOT** carry explanatory prose, a reason, or a continuation
  line. Why a dependency exists belongs in `Highlights:` when it is behaviour
  present in the body, and nowhere otherwise.
- The relationship is **directed**: if A pairs with B, B does not automatically
  require A. Reciprocal entries **MUST NOT** be forced.
- It **MUST NOT** contain optional features, user-selectable service modes,
  alternatives, role variants, other-OS forms, or configuration on a different
  device.
- Use `Pair with: none` when there are no required same-device dependencies.

### Variables

- Every JVD template variable (uppercase-led `$VARIABLE`) that appears in the
  body **MUST** be declared, and declared variables **MUST** be used.
  (`VARIABLE_UNDECLARED`, `VARIABLE_UNUSED`)
- The bare `$VAR` and braced `${VAR}` spellings are the **same** logical
  variable; a declaration in either form satisfies a use in either form.
- Each declared variable **SHOULD** carry a valid example.
- Repeated uses of the same value **MUST** use the same variable name, and
  values shared with a dependent snip **SHOULD** use the same name.
- A configured object's own name — the name the body declares, and the name by
  which other configuration refers to it — is a value. Bodies that are identical
  apart from how that name is spelled are **one** construct, and the name
  **MUST** be declared as a whole-token variable; the body **MUST** still
  reproduce each source object exactly (see *Fragment boundary*).
- A configured object name is kept literal only where the configuration shows
  that the spelling itself selects or changes behaviour, or that the object is a
  single fixed identifier other configuration references by that exact literal.
- Native Junos runtime variables (lower-case, e.g. `$junos-interface-unit`) are
  not JVD template variables and are not declared here.
- Use `Variables: none` when there are none.
- The keyword **MAY** carry an immediate `(…)` annotation before its colon (e.g.
  `Variables (example values from mse1_mx304):`). The colonless annotated form
  (`Variables (none — literal)`) is deprecated (`LEGACY_HEADER_SYNTAX`).

### JVD service mapping (optional)

- The optional `JVD service mapping:` section **MAY** document how a snip maps to
  validated service instances or generator selections. Its intentional
  indentation is preserved.
- It **MUST NOT** replace `Seen on`, `Pair with`, or role metadata.

### Variant group (optional)

A **variant group** lets a dependent snip require a capability from whichever
as-deployed form actually fits a given device, instead of naming one fixed file.
A snip participates in one of two roles.

**Member** — a snip that publishes an as-deployed form declares its membership
directly after `Seen on:`:

```
 * Variant group: mebs-bgp-overlay
 *   Provides: evpn, l2vpn, inet-vpn, inet6-vpn, labeled-unicast
```

- The group name matches `[a-z0-9-]+`.
- `Provides:` is a **subordinate row** of `Variant group:`, not its own section.
- `Provides:` is nonempty and drawn from exactly one of two closed vocabularies.
  - **Bare families** — BGP address families: `evpn`, `l2vpn`, `inet-vpn`,
    `inet6-vpn`, `labeled-unicast`.
  - **Namespaced capabilities** — written `<namespace>:<capability>`, for
    selectable constructs that are not address families. The only namespace is
    `ifl` (a logical interface), and its only capability is `ifl:irb`.
- A member publishes one vocabulary. Mixing a bare family and a namespaced
  capability in one `Provides:` row is `VARIANT_MIXED_SELECTOR`, because an
  atomic all-of requirement must not span unrelated dimensions.
- An unknown namespace is `VARIANT_UNKNOWN_NAMESPACE`; a known namespace with an
  unknown capability is `VARIANT_UNKNOWN_CAPABILITY`. A token containing `:` is
  always judged as namespaced, so a namespace typo never falls back to the
  bare-family vocabulary.
- `route-target` is a scaling optimisation, **never** a selectable capability.
- The declared `Provides:` set **MUST** equal the selector capabilities
  structurally present in the member's body (`VARIANT_PROVIDES_MISMATCH`); an
  unknown declared capability is `VARIANT_PROVIDES_UNKNOWN_FAMILY`. Families are
  compared against the `protocols bgp` hierarchy; `ifl:irb` requires an active
  `interfaces { irb { unit … } }` hierarchy.
- Within one JVD and group, a target device **MUST** map to at most one distinct
  emitted body, evaluated across **both** storage directories
  (`VARIANT_DEVICE_OVERLAP`). Two members naming the same device are duplicate
  representations when their normalized bodies match and an overlap when they
  differ; `otherOsFormId` is never proof of equivalence.

**Consumer** — a snip that needs a capability expresses it as a requirement
bullet inside `Pair with:`:

```
 * Pair with:
 *  - variant:mebs-bgp-overlay families=inet-vpn,inet6-vpn
 *  - variant:mebs-irb-form capabilities=ifl:irb
```

- The keyword selects the vocabulary: `families=` carries bare families,
  `capabilities=` carries namespaced capabilities. Both are always plural and
  nonempty. A keyword that disagrees with the token kind is `VARIANT_MALFORMED`.
- A multi-token requirement is **atomic**: one member must provide **all** of
  the requested selectors.
- Resolution is deterministic and fail-closed. A candidate is **applicable** only
  when it is the **same JVD**, **same group**, provides every requested selector,
  and lists the **exact target device** in the target OS's `Seen on:` row.
  Applicability is established by that row alone: a snip's directory records the
  dialect its body is written in, never which devices it covers, and body
  equality, filename similarity and `otherOsFormId` are **never** substitutes
  for an explicit device token.
- Among applicable candidates, those emitting the **same normalized body** are
  one logical representation. Normalization is exhaustive and minimal: CRLF and
  lone CR become LF, trailing spaces and tabs are removed from each line, and
  trailing blank lines are removed. No statement is ignored and no variable is
  elided, so two candidates share an identity only when they emit the same
  configuration. Headers are not part of a body. Equivalence may **collapse**
  candidates that are already applicable; it **MUST NOT** make an inapplicable
  candidate applicable.
- If more than one distinct applicable body remains, the requirement is
  `VARIANT_AMBIGUOUS`, **regardless of directory** — directory preference can
  never hide a differing body. If exactly one distinct body remains, its
  same-directory representation is preferred; otherwise its opposite-directory
  representation is selected and reported as a **cross-directory selection**
  (`VARIANT_CROSS_DIRECTORY`, informational). Selection is independent of
  candidate order.
  Zero applicable candidates is `VARIANT_UNRESOLVED`; a referenced group with no
  members is `VARIANT_GROUP_EMPTY`. The first arbitrary member is never chosen,
  and selection never crosses device or JVD.
- A bullet beginning `variant:` that is malformed is `VARIANT_MALFORMED` and
  **never** falls through to an ordinary path prerequisite.

For a JVD whose `_snip-library.json` `seenOnValidation` value is `complete`,
every variant finding is an error regardless of whether the file itself changed.

### Reserved / unsupported fields

Until their parser, schema, and portal behaviour exist, headers **MUST NOT**
author `Augments with:` or `Peers with:`.

The free-form `Variant:` and `Role:` fields are **deprecated** legacy metadata:
they are recognised but not retained, and are reported as `LEGACY_HEADER_SECTION`
(a warning on legacy snips, an error once a snip is changed).

## Cross-OS navigation

When a snip of the same `jvd` + `category` + `name` exists under the other OS
directory, the build derives `otherOsFormId` on each record for navigation. It
is **not** an assertion that the two bodies are byte-identical, and it is **not**
expressed through `Pair with:`.

## Library validation state

Each JVD **MAY** carry `configuration/snips/_snip-library.json`:

```json
{ "schemaVersion": 1, "seenOnValidation": "partial" }
```

- `seenOnValidation: "partial"` — the JVD is still being audited; legacy
  approximations warn.
- `seenOnValidation: "complete"` — every published snip in the JVD has verified
  applicability; any approximate or unresolved `Seen on:` becomes an error.
- Absence of the file defaults to `"partial"`.

This describes `Seen on:` **applicability** integrity only. It is independent of
whether every source configuration form has been extracted (extraction coverage)
and independent of role support (`_roles.json`).

## Enforcement

`snip-validate.mjs` reports stable error codes: `MISSING_HEADER`,
`MISSING_TOPIC`, `TOPIC_MULTILINE`, `MISSING_SEEN_ON_SECTION`,
`MISSING_SEEN_ON_BUCKET`, `SEEN_ON_NON_DEVICE_TOKEN`, `SEEN_ON_UNKNOWN_DEVICE`,
`SEEN_ON_APPROXIMATION`, `PAIR_WITH_UNRESOLVED`, `VARIABLE_UNDECLARED`,
`VARIABLE_UNUSED`, `UNKNOWN_HEADER_SECTION`, `LEGACY_HEADER_SECTION`,
`LEGACY_HEADER_SYNTAX`, `INVALID_SECTION_ORDER`, `ORPHAN_HEADER_CONTENT`,
`VARIANT_MALFORMED`,
`VARIANT_PROVIDES_UNKNOWN_FAMILY`, `VARIANT_PROVIDES_MISMATCH`,
`VARIANT_UNRESOLVED`, `VARIANT_AMBIGUOUS`, `VARIANT_DEVICE_OVERLAP`,
`VARIANT_GROUP_EMPTY`.

Severity is applied on change:

- A **new or modified** snip **MUST** satisfy this contract in full; any finding
  is an error.
- A **legacy (unchanged)** snip is grandfathered while its JVD is `partial`
  (findings warn); once its JVD is `complete`, its Seen-on applicability findings
  (`MISSING_HEADER`, `SEEN_ON_*`, `MISSING_SEEN_ON_*`) and all variant-integrity
  findings (`VARIANT_*`) are held strict.

Run locally:

```
npm --prefix portal run snips:validate    # enforce the contract
npm --prefix portal run snips:test        # contract unit tests
npm --prefix portal run snips:check       # snips.json is up to date
```
