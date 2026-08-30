# Snip Header Contract

This is the normative specification for the header of a configuration **snip**
(`configuration/snips/{junos,evo}/<category>/<name>.conf`) in this repository.
It defines what published snip metadata **means** and what a valid snip **must**
contain. Correctness is enforced deterministically by
`portal/scripts/snip-validate.mjs`; this document is the human-readable source of
truth for that check.

The key words **MUST**, **MUST NOT**, **SHOULD**, and **MAY** are used as in
RFC 2119.

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
 *  - <snip path> (<optional reason>)
 * JVD service mapping:   (optional)
 * Variables:             (optional)
 *   $VAR   e.g. <example>
 */
<body>
```

Sections, when present, **MUST** appear in this order: `Topic`, `Seen on`,
`Highlights`, `Pair with`, `JVD service mapping`, `Variables`. `Variables` is
last, adjacent to the templated body it declares. Any other order is reported as
`INVALID_SECTION_ORDER`.

A formal field header **MUST** end its keyword with a colon, optionally after an
immediate `(…)` annotation — `Field:` or `Field (annotation):` (e.g. `Pair with
(same-device dependencies):`, `Variables (example values from mse1_mx304):`). A
colonless line is body prose, not metadata. A colonless **annotated** field
(e.g. `Variables (none — literal)`) is tolerated for backward compatibility but
is **deprecated**: it parses, yet is reported as `LEGACY_HEADER_SYNTAX` (a
warning on legacy snips, an error once the snip is changed). New fields **MUST**
use the colon form.

Junos and EVO forms of the same construct live in **separate** files under
`snips/junos/` and `snips/evo/`. They are **not** consolidated; the file's
directory is its OS identity. A cross-OS counterpart, when one exists, is
surfaced through the derived `otherOsFormId` field (see *Cross-OS navigation*).

## Fields

### Topic

- `Topic:` **MUST** be exactly **one physical line**. The parser captures only
  the first line; a wrapped continuation is silently lost. (`TOPIC_MULTILINE`)
- It **MUST** accurately describe the configuration in the body, and **SHOULD**
  distinguish a functionally distinct form where one exists.
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

### Fragment boundary

A snip may select multiple sibling stanzas under a context-only hierarchy. Every
selected stanza and included container-level statement **MUST** coexist under the
same concrete parent instance and match exactly using one consistent variable
binding. Additional unselected siblings are outside the snip's scope and are
permitted. Additional configuration inside a selected stanza is **not** permitted.

A named instance container **MAY** serve as context when the snip intentionally
selects repeated child instances rather than claiming the complete container. For
example, an interface may provide context for selected units, and a maintenance
domain may provide context for selected maintenance associations. The omitted
sibling instances are not part of the exactness claim.

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

- Each highlight begins with `-`; continuation lines are allowed.
- Highlights **MUST** describe behaviour actually present in the body and **MAY**
  explain a functional difference from another form.
- Highlights **MUST NOT** substitute for machine-readable applicability,
  dependency, or selection metadata.

### Pair with

`Pair with:` answers exactly one question:

> Which other snips are required **on the same device** for this snip to commit
> or function correctly?

- Each entry **MUST** identify a resolvable snip path relative to the JVD's
  `snips/` directory (e.g. `junos/policy/loopback-rib-leak.conf`). A short
  parenthetical reason **MAY** follow. (`PAIR_WITH_UNRESOLVED`)
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
- Each declared variable **SHOULD** carry a valid example.
- Repeated uses of the same value **MUST** use the same variable name, and
  values shared with a dependent snip **SHOULD** use the same name.
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

### Reserved / unsupported fields

Until their parser, schema, and portal behaviour exist, headers **MUST NOT**
author `Augments with:`, `Peers with:`, or `Variant group:`.

The free-form `Variant:` and `Role:` fields are **deprecated** legacy metadata:
they are recognised but not retained, and are reported as `LEGACY_HEADER_SECTION`
(a warning on legacy snips, an error once a snip is changed). Device role is
derived from `_roles.json`; the future construct is `Variant group:`.

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
`LEGACY_HEADER_SYNTAX`, `INVALID_SECTION_ORDER`.

Severity is applied on change:

- A **new or modified** snip **MUST** satisfy this contract in full; any finding
  is an error.
- A **legacy (unchanged)** snip is grandfathered while its JVD is `partial`
  (findings warn); once its JVD is `complete`, its Seen-on applicability findings
  (`MISSING_HEADER`, `SEEN_ON_*`, `MISSING_SEEN_ON_*`) are held strict.

Run locally:

```
npm --prefix portal run snips:validate    # enforce the contract
npm --prefix portal run snips:test        # contract unit tests
npm --prefix portal run snips:check       # snips.json is up to date
```
