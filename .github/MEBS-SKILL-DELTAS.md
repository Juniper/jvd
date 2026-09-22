# MEBS skill-delta manifest

Lessons accumulated while closing composition completeness for the Metro
Ethernet Business Services JVD. Each entry records the evidence that produced
it, the invariant it implies, whether it blocks, the reusable script or test,
and the skill stage that should own it.

This file is engineering documentation. It is deliberately not in the snip
library, which is product-facing, and it does not modify the skills repository.

Status vocabulary: **blocking** — a skill that ignores it will ship a wrong
result; **advisory** — it prevents wasted work; **future** — it applies to work
not yet built.

---

## jvd-extract-snips

| Lesson | Invariant | MEBS evidence | Status | Reusable |
|---|---|---|---|---|
| A compound snippet blocks every device that carries only part of it | Extract atomically when source proves partial carriage | `gr-lag-member` defines three groups; cr1/cr2 carry two. `50MB_filter` was trapped in the an1 compound | blocking | `object-ownership.mjs` |
| One construct with N source bodies is a variant group, never a Seen-on widening | Count distinct bodies before touching Seen-on | `GR-FATPW-LABEL` has 6 source bodies across 8 devices; `GR-ISIS-BCP` has 3 across 20 | blocking | `config-objects.mjs` canonicalizer |
| A snippet with no twin is a single representation, not an OS form | Never manufacture a twin for directory symmetry | 9 of 21 cross-OS-naming MEBS snips have no twin | advisory | — |

## jvd-materialize-snips (future)

| Lesson | Invariant | MEBS evidence | Status | Reusable |
|---|---|---|---|---|
| Containment is not equality | Check for a **superset** before widening Seen-on | `transport-class.conf` contains on mse1/mse2, but those two add a second anycast bronze end-point — its own header recorded the exclusion | blocking | variable-aware leaf comparison |
| Ownership must be proved by reconstruction | Literal-line coverage is screening, never proof | The firewall audit found an owner reconstructing exactly while line coverage looked fine elsewhere | blocking | `object-ownership.mjs` |
| Prior decisions are recorded in the target's own Highlights | Read the target header before editing its Seen-on | The transport-class role-variant note prevented a wrong widening | advisory | — |
| A reference and a definition may spell one construct two ways | Do not create a snippet before proving the construct is absent under every spelling | `community add $INSTANCE_NAME` is defined as `community METRO_L3VPN_$L3VPN_ID` | blocking | `config-references.mjs` |

## jvd-audit-snips

| Lesson | Invariant | MEBS evidence | Status | Reusable |
|---|---|---|---|---|
| **Closure membership, not device reachability, decides whether a defect blocks** | A dependency defect blocks only if it appears in some supported tuple's recursive closure | 22 defective edges: device reachability said 19 blocking, closure said **4**. `sc-2-priority-model`, `isis-srmpls-tilfa`, `transport-class`, `firewall/policers`, `core-isis-mpls` and `gr-lag-member` are in no supported closure | blocking | `composition-validate.mjs --audit` |
| Verify a rule is enforced in code before trusting it | Grep the validator, do not trust prose | `Pair with` closure was never enforced anywhere; `PAIR_WITH_UNRESOLVED` only checked path existence | blocking | `dependency-resolve.mjs` |
| Templated names split into two kinds | Correlated identity resolves by symbolic equality; a role parameter never does. Key by (kind, name) | `policy-statement:$INSTANCE_NAME` is an identity; `community:$INSTANCE_NAME` is a slot. `$EXPORT_POL` has 16 definers | blocking | `config-references.mjs`, `composition-validate.mjs` |
| Never infer entry points from a directory name | Require a declared denominator | The first closure measurement used `routing-instances/` and reported a wrong 77.4% | blocking | `_composition.json` |
| Truncated output is not evidence | Never report a table produced by `tail -N` | `GR-ISIS-BCP` was reported as having no source definitions; it is defined and applied on all 20 devices | blocking | — |
| A parser must be cross-checked against raw counts | Compare a structural result with a grep count before trusting it | A structural scan once reported an IRB-free device that had 150 | blocking | — |
| Equivalence for a whole-snippet dependency is whole-body equivalence | A twin agreeing on the referenced construct but emitting more is not a substitute | `dependency-resolve.mjs` initially substituted a superset twin; a test caught it | blocking | `dependency-resolve.test.mjs` |

## jvd-byoai

| Lesson | Invariant | MEBS evidence | Status | Reusable |
|---|---|---|---|---|
| Documentation dies silently during taxonomy migrations | Generate or validate TIERS from the composition matrix | 27 of 52 TIERS snippet references name `services/`, `transport/`, `apply-groups/`, `cos/`, `oam/` — categories that no longer exist | blocking | `composition-validate.mjs` |
| A pattern is not support | A pattern-only entry may never count as supported | `evpn-vpws-port-based` was advertised but reachable only through an interface glob | blocking | matrix validator test |
| A form cannot be supported and unable to close | Every supported tuple closes, or the form is explicitly incomplete and unadvertised | l3vpn was 0/30 while advertised | blocking | `composition-validate.mjs --audit` |
| A service parameter is an operator input, not a default | Offer the validated set and require a choice; never preselect | `$EXPORT_POL` encodes address family and CE-prefix count; `$COLOR_COMMUNITY` is a service tier with bronze validated on 5 devices | blocking | required-choice tests |

## jvd-byoai-test-author

| Lesson | Invariant | MEBS evidence | Status | Reusable |
|---|---|---|---|---|
| Use the composition matrix as the case denominator | Every supported tuple deserves a case; incomplete forms deserve a fail-closed case | 163 supported tuples across 16 forms | future | `_composition.json` |
| Required-choice slots need their own cases | A case must prove the assistant asks rather than assumes | `$EXPORT_POL`, `$COLOR_COMMUNITY` | future | — |

## jvd-byoai-validate / jvd-byoai-regression

Type-5 interaction defects observed and still to be covered:

- `MIXED` must remain an OS constraint until service selection determines valid devices, and must not silently select `ma3`.
- Service choice must resolve to a matrix-valid device pair.
- Assistant-presented examples must never become user-supplied inputs.
- Acknowledgements such as "go ahead" or "sounds fine" must never satisfy an ask-required field.
- AC parent, UNI parent and translated input VLAN remain required until supplied; a logical default must not satisfy a missing physical input.
- Required questions should be collected without needless repetition.
- Output must use the selected devices.
- Conflicting literal overlay addresses must be templated, reconciled, or fail closed rather than presented as deployment-ready.
- EVPN Type-5 must include its validated EVPN-ELAN/IRB half, which the matrix declares as a paired construct.
- BGP EVPN signalling resolves through the device-specific overlay variant; the composite overlay must not be described as a minimal EVPN-only requirement.
- `with-overlay` compatibility remains tested.

Status: **future** — none of these suites has been executed on this branch.

## Future hybrid extraction/convergence skills

| Lesson | Invariant | MEBS evidence | Status |
|---|---|---|---|
| Start from one templated whole-device secondary file per device | Preserve device identity before convergence | 6 distinct `GR-FATPW-LABEL` bodies would have been flattened by an eager merge | future |
| Merge only structurally proven equivalent objects | Compare canonical bodies, not names or paths | 94 identical twin pairs versus 15 differing pairs in MEBS | future |
| Retain device-specific objects when convergence is unsafe | Keep the split and record why | `gr-edge-intf` differs by one `lacp accept-data` statement | future |
| Escalate ambiguous boundaries to the forensic workflow | Do not guess a fragment boundary | `gr-lag-member` 2-of-3 on cr1/cr2 | future |
| Pass the same `jvd-audit-snips` correctness boundary | Hybrid output is not exempt | — | future |
| Benchmark the tradeoff | Record elapsed time, interventions, coverage, reconstruction failures, dependency completeness, false merges and false splits | — | future |

## Deferred findings, preserved

Out of closure and therefore not blocking, retained for forensic or hybrid work:

- 18 of the 22 defective direct edges, including `sc-2-priority-model`,
  `isis-srmpls-tilfa`, `transport-class` on mse1/mse2, `firewall/policers` and
  `core-isis-mpls`.
- `GR-CORE-INTF-LAG-MEMBER`: one body on all 20 devices, trapped inside the
  three-group `gr-lag-member` compound. cr1/cr2 are core routers that no
  supported service form reaches.
- `GR-FATPW-LABEL`: four of six source bodies are unmodelled and unreachable.
- `GR-ISIS-BCP`: the 19-line body on ag1-1/ag1-2 has no owner.
- Eight group names with no snippet definer and no snippet consumer, including
  `AE-INTERFACE-MTU`, `INTERFACE-MTU`, `RI_CLASSIFIER` and `MAX_LABELS`.
- `firewall family any filter any-port-mirror` on mse1/mse2: defined in source,
  bound to nothing.
- One PE-CE export policy instance on mse2 that no snippet reconstructs.
