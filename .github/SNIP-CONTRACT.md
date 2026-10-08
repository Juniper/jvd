# Snip Header Contract

This is the normative specification for the header of a configuration **snip**
(`configuration/snips/{junos,evo}/<category>/<name>.conf`) in this repository.
It defines what published snip header metadata **means** and what a valid snip
**must** contain.

Published header claims **MUST** accurately describe the snip body and the
validated JVD semantics it carries. Source-backed claims — applicability,
occurrence counts and cross-device relationships — **MUST** be validated against
the authoritative JVD device configurations before publication; freshness or
self-agreement of the tooling that produced a claim is not validation of it.
This document defines validity; the build tooling that generates and checks
snips decides when and how a violation blocks publication.

The key words **MUST**, **MUST NOT**, **SHOULD**, and **MAY** are used as in
RFC 2119. Identifiers in parentheses such as `(TOPIC_MULTILINE)` name the stable
finding reported for a violation of the adjacent rule.

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
 * Count:                 (optional, generated)
 *   <device token> <positive integer>
 *   total <nonnegative integer>
 * Highlights:            (optional)
 *  - <bullet>
 * Pair with:             (optional)
 *  - <snip path>
 * Peers with:            (optional, generated)
 *   [<device token>] <-> [<device token>]
 * JVD service mapping:   (optional)
 * Variables:             (optional)
 *   $VAR   e.g. <example>
 */
<body>
```

Sections, when present, **MUST** appear in this order: `Topic`, `Seen on`,
`Count`, `Variant group`, `Highlights`, `Pair with`, `Peers with`,
`JVD service mapping`, `Variables`.
`Variables` is last, adjacent to the templated body it declares. Any other order
is reported as `INVALID_SECTION_ORDER`.

A formal field header **MUST** end its keyword with a colon, optionally after an
immediate `(…)` annotation — `Field:` or `Field (annotation):` (e.g. `Pair with
(same-device dependencies):`, `Variables (example values from mse1_mx304):`). A
colonless line is body prose, not metadata. A colonless **annotated** field
(e.g. `Variables (none — literal)`) is tolerated for backward compatibility but
is **deprecated**: it parses, yet is reported as `LEGACY_HEADER_SYNTAX`. New
fields **MUST** use the colon form.

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
  roundtrips on a device of the other OS family, that evidence may appear in its
  bucket, but it never substitutes for a full-body mirror in that OS directory.
  A cross-row without an exact native representation is invalid
  (`SEEN_ON_MISSING_OS_MIRROR`).
- A JVD **MAY** register **OS-scoped mirror pairs** in its library metadata
  (`configuration/snips/_snip-library.json`, `osScopedMirrors`) for
  byte-identical Junos/EVO representations of one body. A pair names exactly one
  existing file per directory and partitions the shared source population:
  matches on opposite-OS devices belong to the registered counterpart, not to
  the scoped file's `Seen on` or `Count`. Every source device is still measured
  and its OS identity must be unambiguous, except a device whose entire source
  configuration is covered by valid, current, approved exclusions (see
  *Adjudicated exclusions*): it cannot contribute an instance, so it needs no OS
  identity and belongs to neither mirror population, but it remains in the
  source and exclusion inventory. Unregistered files retain the full
  population; no source match may be silently discarded.
- `(none)` is the only valid empty value. (`SEEN_ON_APPROXIMATION`)
- It **MUST NOT** contain: `see`, snip or navigation paths, `.conf` filenames,
  `all`/`all PEs`/`other devices`, inferred applicability, prose notes, or
  cross-file navigation. Scenario-qualified **device** identities (see *Device
  identity*) are permitted. (`SEEN_ON_NON_DEVICE_TOKEN`, `SEEN_ON_APPROXIMATION`)
- `Seen on` is a claim about validated source evidence. It **MUST** be backed by
  exact matching against the authoritative device configurations, under the
  *Fragment boundary* and *Adjudicated exclusions* rules, and it **MUST** be
  re-established whenever the body, the source configurations or the matching
  rules change.

### Count (optional, generated)

`Count:` records distinct consumed source-node instances of this exact template
on each device, followed by their `total`. Alternative variable assignments that
consume the same source nodes do not increase `Count`.

- Rows are `<exact device token> <positive integer>`; omit zero device rows.
  The final row is `total <nonnegative integer>`. Integers and their sum MUST be
  safe integers. Duplicate sections, devices or totals are invalid.
- The total MUST equal the sum of device rows. Nonzero device membership MUST
  equal `Seen on` in both directions. Tokens use the same device inventory.
- `Count` MUST be derived from the same complete validated source population
  that underlies the `Seen on` claim: exact matching with consistent variable
  bindings, literal constraints, activity, order and fragment boundaries, with
  adjudicated exclusions applied. A truncated or partial enumeration is not a
  measurement.
- A missing field is unknown, not zero. A measured zero requires a complete
  source population. Totals belong to one template, not to a unique-service
  census; Junos/EVO mirror totals MUST NOT be added as unique deployments.

### Peers with (optional, generated)

`Peers with:` summarizes source-corroborated configured cross-device relationships,
not live session establishment or forwarding. Same-device prerequisites remain
`Pair with`. The counterpart MAY use a different snippet or OS.

The field contains exactly one of:

- One or more `[device_a] <-> [device_b, device_c]` rows. Each bracket contains
  a nonempty comma-separated list of exact device tokens. Each row asserts every
  left/right pair, but no within-side edges. Compression MUST preserve exactly
  the corroborated pair set; connected components do not imply a clique.
- `(none)`: an applicable, supported search completed without a validated
  counterpart. Absence requires adjudication before publication.
- `n/a`: supported construct classification establishes that a cross-device
  relationship is not applicable.

Duplicates, self edges, mixed states and unknown devices are invalid. At least
one endpoint of each pair MUST be in this snippet's `Seen on`. Generated rows
and device lists SHOULD be sorted deterministically.

What corroborates a relationship:

- Concrete source values and relation-specific semantics MUST corroborate each
  pair. Local names, co-occurrence, shared `Count` and shared route-targets
  alone never establish a peer relationship.
- Service participation, directed conditional route-distribution eligibility,
  Ethernet-segment membership, service-scoped redundancy groups, role-constrained
  multipoint services, service endpoints and configured protocol sessions are
  distinct kinds of relationship. One kind MUST NOT be promoted into another:
  shared membership does not create a service edge, a redundancy group or a
  protocol session; an E-Tree role model forbids leaf-to-leaf service edges; a
  grouped service endpoint does not erase an independently configured BGP
  session between its members.
- A row summarizes the existence of proven relationships, not that every
  instance on those devices belongs to one common service. Group identity is
  preserved in the underlying evidence; consumers MUST NOT flatten a group into
  a clique. Directional relationships MUST NOT be silently converted into
  symmetric `<->` claims.
- Missing, ambiguous, unsupported or partially examined evidence is neither
  `(none)` nor `n/a`: leave the field absent until every applicable instance is
  classified. A peer claim whose evidence no longer supports it is withdrawn,
  leaving the field absent rather than asserting `(none)` or `n/a`.

Generated-field syntax and inventory findings are always errors. These
structural checks do not certify semantic peer correctness. Retain
`JVD service mapping` until all useful information has a verified replacement in
structured fields or an appropriate existing home.

### Adjudicated exclusions

A construct present in a source configuration remains eligible for modelling
unless it is **explicitly excluded by human adjudication**. Tooling **MAY**
nominate configuration as stale, unused, or otherwise irrelevant, but **MUST
NOT** exclude it automatically.

Once a source fragment is adjudicated as excluded, it is no longer eligible for
snip creation, for reuse matching, or as evidence for `Seen on` and `Count` on
the devices that adjudication covers. The source configuration itself is never
modified by such a decision.

An adjudication is scoped precisely: **only the explicitly adjudicated source
fragment(s) are ineligible as evidence for the claims that adjudication
covers.** Other configuration on the same device — including neighbouring
statements and the enclosing hierarchy — remains eligible under the normal
matching rules. Matching omits the excluded subtrees from its in-scope view
while retaining the original source-node identities, so an excluded diagnostic
child neither creates a new service form nor prevents an otherwise exact
in-scope match. Each exclusion records the exact source fragment, its reason and
its approval.

For constructs that remain in scope the `Seen on` rule above applies unchanged:
every validated source device on which the snip renders the selected
configuration exactly **MUST** be accounted for, either in the file's evidence
or its registered OS-scoped mirror. Cross-OS evidence alone never replaces the
native mirror.

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
identical. The distinction is grammar knowledge: this contract defines the
normative fragment-selection semantics, and parser and validation
implementations apply the grammar knowledge needed to enforce them
(**instance-recognition vocabulary, version 4**). The
vocabulary is parser and validation knowledge only — not a service taxonomy —
and carries no naming, category or relationship meaning:

- **Instance keywords.** A child block is an independently selectable instance
  of its container when its header begins with one of these grammar keywords
  followed by a name or index (e.g. `unit 0`, `neighbor 10.0.0.1`): `area`,
  `bridge-domain`, `community`, `filter`, `forwarding-class`, `group`,
  `instance`, `interface`, `maintenance-association`, `maintenance-domain`,
  `neighbor`, `policy-statement`, `prefix-list`, `unit`, `vlan`.
- **Bare-name containers.** Inside these containers a child block named solely
  by an identifier, with no leading grammar keyword (e.g.
  `rib-groups { RG-REMOTE-LOOPBACKS { … } }`), is an instance: `bridge-domains`,
  `classifiers`, `drop-profiles`, `forwarding-classes`, `groups`,
  `interface-switch`, `interfaces`, `policy-options`, `rewrite-rules`,
  `rib-groups`, `routing-instances`, `scheduler-maps`, `vlans`.
- **Context-only ancestors.** Where the grammar permits that fragment boundary,
  a statement or block may be selected beneath ancestors that serve only as
  context for it. The selected statement or block **MUST** match exactly;
  unselected siblings beneath those context-only ancestors are outside the
  selected fragment.
- **Not selectable.** A policy-statement `term` is an ordered constituent of the
  enclosing statement: its neighbours change the meaning of the selection, so an
  unselected sibling term invalidates the claim.

Every implementation that measures `Seen on` or `Count` **MUST** apply exactly
this vocabulary. Because a change to it can change which devices a body
reproduces on, any change **MUST** be published as a new vocabulary version here
and **MUST** be followed by re-establishing `Seen on` and `Count` for every
affected JVD.

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

Every literal target MUST be in the same OS directory as the declaring snip.
Cross-OS Seen-on evidence and equivalent bodies do not waive this rule
(`PAIR_WITH_CROSS_OS`). Create the required native mirror rather than deleting
the dependency.

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

`Pair with` publishes exactly two kinds of entry: **fixed** same-device targets
(paths, optionally with the compound-object qualifier above) and **variant
selectors** (`variant:` bullets, see *Variant group*). Occurrence-specific typed
dependency requirements — which named object, interface parent, member or
context a particular occurrence of the body needs — are **not** header
metadata and **MUST NOT** be serialized into `Pair with` or any other header
field. Where a JVD maintains an approved machine-readable dependency
declaration, `Pair with` **MUST** agree with that declaration's fixed and
variant entries, and consumers that need the occurrence-specific requirements
receive them through generated product projections (the catalog and the BYOAI
manifest), never by parsing headers. A missing dependency is never rescued by
searching undeclared candidates.

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
after `Seen on:` and optional `Count:`:

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
    selectable constructs that are not address families. These include
    `ifl:irb` (a logical interface), `transport:colour-classes`,
    `transport:mpls-admin-groups`, `firewall:policers`, and `cos:schedulers`.
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
- The `transport`, `firewall` and `cos` selectors use JVD-local requirements in
  `configuration/snips/_composition.json`, under
  `capabilityRequirements[group-name][selector]`. These declarations are scoped
  to that JVD and variant group; no names, colour numbers or administrative-group
  values are implied globally. Their closed value shapes are:
  - `transport:colour-classes`: `{ "colours": ["<decimal colour>", ...] }`.
    Each required colour must have one active named definition under global
    `routing-options/transport-class`, with one literal `color` leaf. Duplicate
    class names or ambiguous required colours do not establish the capability.
  - `transport:mpls-admin-groups`: `{ "adminGroups": { "<name>": "<decimal value>", ... } }`.
    Each required name must have one active leaf with the declared value under
    global `protocols/mpls/admin-groups`.
  - `firewall:policers`: `{ "policers": ["<policer name>", ...] }`.
    Each required name must have one active global `firewall/policer` definition.
  - `cos:schedulers`: `{ "schedulers": ["<scheduler name>", ...] }`.
    Each required name must have exactly one active global
    `class-of-service/schedulers` definition containing active configuration.
    In JVDs declaring this selector, active global scheduler-map references must
    be supplied by applicable fixed or variant prerequisites, or by the
    consumer's own body. Internal occurrence bindings do not replace the
    exported prerequisite declaration.
- Requirement collections are nonempty; list members are unique. Unknown
  selectors, extra fields and invalid value shapes are rejected. JVDs not using
  these selectors do not need a composition file. Consumers and members using
  them require a valid local declaration; missing declarations do not receive
  defaults from another JVD.
- Comments, quoted prose, inactive subtrees and unapplied group definitions do
  not establish these capabilities. Concrete consumer references must be covered
  by the declaration. Declarations are requirements, not source evidence:
  providers must still reconstruct on the exact target device, and the rendered
  consumer and provider MUST satisfy the declaration on that device. The
  selected member supplies its complete body and declared prerequisites.
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
  representation in the target device's OS directory is preferred. If only a
  foreign-directory representation remains, the requirement resolves but the
  library lacks the native mirror it owes (`VARIANT_CROSS_DIRECTORY`); this is
  never permission to omit that mirror. Selection is independent of candidate
  order. Zero applicable candidates is `VARIANT_UNRESOLVED`; a referenced group
  with no members is `VARIANT_GROUP_EMPTY`. The first arbitrary member is never
  chosen, and selection never crosses device or JVD.
- A bullet beginning `variant:` that is malformed is `VARIANT_MALFORMED` and
  **never** falls through to an ordinary path prerequisite.

### Reserved / unsupported fields

Until their parser, schema, and portal behaviour exist, headers **MUST NOT**
author `Augments with:`.

The free-form `Variant:` and `Role:` fields are **deprecated** legacy metadata:
they are recognised but not retained, and are reported as `LEGACY_HEADER_SECTION`.
Headers **MUST NOT** carry them.

## Cross-OS navigation

When a snip of the same `jvd` + `category` + `name` exists under the other OS
directory, the build derives `otherOsFormId` on each record for navigation. It
is **not** an assertion that the two bodies are byte-identical, and it is **not**
expressed through `Pair with:`.

## Validity and enforcement

This contract defines what a valid header is. A snip that violates any rule in
this document is invalid. Whether and when a violation blocks a change or a
publication, how libraries are enrolled for source-evidence verification, and
how claims are measured, qualified and accepted are decided by the build tooling
and documented with it; those policies never widen what this contract permits.
