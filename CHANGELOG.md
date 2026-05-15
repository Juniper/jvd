# JVD Repository Changelog

Release notes for the Juniper Validated Design (JVD) configuration repository.

---

## 2026-05-15

A new AI/ML Data Center JVD lands its first reusable configuration
template library — 23 Junos EVO templates covering the QFX5240 leaf
and PTX10008 spine roles for an EVPN-VXLAN multitenancy fabric. The
repository also gains automated checks on every pull request, and the
JVD Portal now picks up new template libraries automatically as soon
as they merge.

### New content

- **AI/ML Multitenancy Backend template library** — 23 reusable Junos
  EVO templates for the
  [`aiml_multitenancy_backend`](data_center/aidc/aiml_multitenancy_backend/)
  JVD, organized under
  [`configuration/snips/evo/`](data_center/aidc/aiml_multitenancy_backend/configuration/snips/)
  by function: `bootstrap/` (chassis buffer monitoring, gRPC
  certificates, NETCONF), `cos/` (RDMA RoCEv2 lossless queueing),
  `interfaces/` (400G fabric breakouts, IRB tenant gateways, leaf and
  spine loopbacks, GPU-server links), `oam/` (L2 telemetry, LLDP,
  RSTP), `policy/` (CLOS loop prevention, PFE load-balance, tenant
  community export, route redistribution), `services/` (EVPN VRF IP
  prefix routes), and `transport/` (eBGP underlay and EVPN overlay,
  ECMP DLB flowlet, FRR, router advertisement). Each template carries
  a five-section header (Topic / Variant / Seen on / Highlights /
  Pair-with / Variables) and the JVD's
  [`_variables.md`](data_center/aidc/aiml_multitenancy_backend/configuration/snips/_variables.md)
  glossary defines every parameter that appears across the set. A
  per-library
  [`README.md`](data_center/aidc/aiml_multitenancy_backend/configuration/snips/README.md)
  walks through the categories, the QFX5240 / PTX10008 device split,
  and how the templates fit into the broader fabric design.

### Repository improvements

- **Pull-request template** — A new
  [`.github/pull_request_template.md`](.github/pull_request_template.md)
  standardizes contributions with What's New / Why / Details /
  Testing sections, and a release-notes config keeps changelog drafts
  consistent.
- **Automated checks on every pull request** — Two new GitHub Actions
  workflows now gate merges into `main`. A
  [portal build check](.github/workflows/portal-build.yml)
  catches TypeScript, Vite, and import breakage before it can land
  and silently break the live portal deploy. A
  [markdown link checker](.github/workflows/link-check.yml) (lychee
  in offline mode) flags dangling relative links — easy to introduce
  when JVD folders or template libraries get reshuffled. The
  [portal deploy workflow](.github/workflows/portal-deploy.yml) was
  also widened so that any change under a JVD's
  `configuration/snips/` directory now triggers both the portal's
  template-bundle freshness check on PR and the live redeploy on
  merge to `main` — so new template libraries appear on the portal
  the same day they merge.

### What this means for you

- If you're building an AI/ML EVPN-VXLAN fabric on QFX5240 leaves and
  PTX10008 spines, start from the new
  [aiml_multitenancy_backend template library](data_center/aidc/aiml_multitenancy_backend/configuration/snips/).
  Each `evo/<category>/*.conf` is parameterized with `$VARIABLES`;
  the per-library `README.md` and `_variables.md` together give you a
  ready-to-fill template set.
- Browse the new templates online at the
  [JVD Portal Snip Library](https://juniper.github.io/jvd/portal/#snips),
  filtered to the AI/ML Multitenancy Backend JVD.
- Contributors: pull requests now run an automated portal build and
  link check. Use the new PR template, and the checks will tell you
  before merge whether your change breaks anything.

---

### By the numbers

<details>
<summary>Per-area changes</summary>

| Area / JVD | Added | Renamed | Removed | Modified | READMEs |
| --- | ---: | ---: | ---: | ---: | ---: |
| `data_center/aidc/aiml_multitenancy_backend` | 25 | 0 | 0 | 0 | 1 |
| `service_provider/metro_ethernet_business_services` | 0 | 0 | 0 | 1 | 1 |
| `portal/` (template bundle regen) | 0 | 0 | 0 | 1 | 0 |
| `.github/` (PR template + workflows) | 4 | 0 | 0 | 1 | 0 |
| **TOTAL** | **29** | **0** | **0** | **3** | **2** |

</details>

<details>
<summary>Net lines added/removed by area</summary>

| Area | Lines added | Lines removed | Net |
| --- | ---: | ---: | ---: |
| `data_center/` | 1,535 | 0 | +1,535 |
| `service_provider/` | 2 | 2 | 0 |
| `portal/` | 1,448 | 25 | +1,423 |
| `.github/` | 146 | 1 | +145 |
| **Total** | **3,131** | **28** | **+3,103** |

</details>

<details>
<summary>aiml_multitenancy_backend content breakdown</summary>

| Content | Files | Lines added |
| --- | ---: | ---: |
| EVO templates (`configuration/snips/evo/`) | 23 | ~1,300 |
| Variables glossary (`_variables.md`) | 1 | ~45 |
| Snip-library `README.md` | 1 | ~190 |
| **Total** | **25** | **1,535** |

</details>

---

## 2026-05-12

The JVD Portal — a public web catalog for browsing every Juniper
Validated Design in this repository — is live at
<https://juniper.github.io/jvd/portal/>. Same-day updates extended the
portal with a browsable Snip Library and a Bring-Your-Own-AI launcher
that pre-loads any of the published snip libraries into Claude or
ChatGPT.

### New content

- **JVD Portal** — A new public website at
  <https://juniper.github.io/jvd/portal/> that catalogs all the
  Juniper Validated Designs in this repository. Browse and filter by
  area (Data Center, Enterprise WAN, Optical, Security, Service
  Provider, Automation), platform family, and Junos vs Junos EVO. Each
  card links straight back to the JVD's folder on GitHub for the full
  README, reference diagrams, and per-device configurations. The
  portal is a static site sourced from
  [`portal/`](portal/) and republished automatically whenever that
  directory changes on `main`.
- **Catalog generator with Juniper API integration** — The portal's
  catalog is now produced by
  [`portal/scripts/generate-catalog.sh`](portal/scripts/generate-catalog.sh),
  which pulls each JVD's authoritative validated-platforms list
  directly from Juniper's documentation API
  (`getAllPlatformNReleaseDetails4JvdId`) where a JVD ID is mapped in
  [`portal/scripts/jvd-id-map.json`](portal/scripts/jvd-id-map.json),
  and falls back to scanning the JVD's README and per-device configs
  otherwise. Responses are cached locally in
  [`portal/scripts/jvd-platforms-cache.json`](portal/scripts/jvd-platforms-cache.json)
  so portal builds stay fully offline. Run with `--refresh` to pull
  the latest API data and `--check` to verify the catalog is up to
  date. Currently 19 of 20 JVDs are sourced from the API.
- **Snip Library browser** — A new top-level portal section
  (<https://juniper.github.io/jvd/portal/#snips>) that catalogs every
  reusable configuration snip from every JVD's snip library — 158
  snips across the Broadband Edge, Metro Ethernet Business Services,
  and SRv6 Core/Edge JVDs at launch, both Junos and Junos EVO. Browse
  by **JVD**, by **Technology** (Transport, Service Overlay,
  Subscriber & BNG, QoS, Firewall, Apply-groups, OAM, Chassis,
  Interfaces, Policy & Routing), or by **Use Case** (BNG, Metro,
  Subscriber Mgmt, Business Services, MEF, SRv6, Core/Edge, …). Each
  snip detail view shows source provenance, the devices it was seen
  on, highlights, the variable glossary, cross-linked "Pair with"
  references to related snips, and the full Junos config with syntax
  highlighting and a copy-to-clipboard button (which auto-prepends a
  `Source:` comment so the snip's origin travels with it). Catalog
  cards for snip-equipped JVDs gain a "Snips" badge that deep-links
  into the browser pre-filtered to that JVD. The library auto-grows:
  any new JVD that drops conformant snips under
  `configuration/snips/{junos,evo}/` is picked up on the next portal
  build.
- **Bring Your Own AI (BYOAI) — Config Generator** — A new section
  (<https://juniper.github.io/jvd/portal/#byoai>) that launches Claude
  or ChatGPT with the JVD's published BYOAI prompt pre-loaded as task
  instructions. Pick a BYOAI-equipped JVD from the dropdown, click
  the Claude or ChatGPT tile, and the assistant opens with a
  conversation-driven workflow that walks you through a templated
  config build against that JVD's validated snip library. Today's
  picker covers Metro Ethernet Business Services; the section grows
  automatically as more JVDs ship a `configuration/snips/byoai/`
  bundle. (Gemini is currently omitted because its web app does not
  accept pre-filled prompts via URL — the same BYOAI prompt works on
  Gemini if pasted manually.)

### What this means for you

- Visit <https://juniper.github.io/jvd/portal/> to browse the full JVD
  catalog in one place.
- Use the area / platform / OS filters to narrow down to designs
  relevant to your network. Platform and OS chips reflect the same
  validated platform lists published in each JVD's official Juniper
  documentation, so what you filter on is what was actually tested.
- Bookmark either the portal card or the linked GitHub folder — both
  stay in sync with this repository.
- Use the **Snip Library** at
  <https://juniper.github.io/jvd/portal/#snips> when you need a
  validated building block — a BGP overlay configuration, an EVPN-VPWS
  service definition, a CoS scheduler-map — without reading an entire
  JVD top-to-bottom. Search across topic / variable / body, switch
  browse modes (JVD / Technology / Use Case), and the "View on
  GitHub" link gets you to the source-of-truth file in one click.
- Use **BYOAI** at <https://juniper.github.io/jvd/portal/#byoai> to
  start a config-generation conversation with Claude or ChatGPT
  pre-loaded with a JVD's snip library and behavioral rules — pick
  the JVD, click your AI of choice, and walk through the build.
- If a JVD looks miscategorized or missing, open an issue or PR
  against [`portal/src/data/jvds.json`](portal/src/data/jvds.json).

<details>
<summary>By the numbers</summary>

| Area | Files added / changed |
| --- | ---: |
| `portal/` (web app, configs, assets) | 67 |
| `portal/scripts/` (catalog + snip generators, BYOAI map, API cache) | 7 |
| `portal/src/components/` (Snip Library + BYOAI sections) | 2 new |
| `portal/src/data/snips.json` (158-snip generated bundle) | 1 new |
| `.github/workflows/` (deploy pipeline + snip-library CI guard) | 1 |
| **Approximate total** | **~78** |

| Snip Library at launch | |
| --- | ---: |
| Reusable snips indexed | 158 |
| JVDs with snip libraries | 3 |
| Junos snips | 85 |
| Junos EVO snips | 73 |
| Technology families | 10 |
| Use-case tags | 8 |

</details>

---

## 2026-05-11

A new Service Provider JVD landed end-to-end this week, along with a
companion templated snip library.

### New content

- **SRv6 Core Edge JVD** — A new Service Provider JVD under
  [`service_provider/srv6_core_edge/`](service_provider/srv6_core_edge/)
  validating an SRv6 µSID core with Flex-Algo (FA-0 IGP / FA-128 delay /
  FA-129 TE), L3VPN-over-SRv6, EVPN-VPWS-over-SRv6, dual-CR route
  reflectors, inter-AS Option C between Border Routers, and end-to-end
  TI-LFA. Hardware mix: MX480 (edge / MSE), MX10004 + MX2010 (core RRs),
  MX304 + PTX10002-36QDD (border), MX240 (CPE). Includes the standard
  README + reference architecture diagrams + 13 sanitized per-device
  hierarchical configs under
  [`configuration/conf/`](service_provider/srv6_core_edge/configuration/conf/).
- **SRv6 Core Edge snip library** — A templated snip library for the
  new JVD at
  [`service_provider/srv6_core_edge/configuration/snips/`](service_provider/srv6_core_edge/configuration/snips/)
  covering 6 categories (apply-groups, transport, services, interfaces,
  policy, oam) — 19 snips with paired Junos and Junos Evolved coverage,
  plus a [`README.md`](service_provider/srv6_core_edge/configuration/snips/README.md)
  category index and a
  [`_variables.md`](service_provider/srv6_core_edge/configuration/snips/_variables.md)
  glossary listing every `$VARIABLE` placeholder with example values.
  Notable patterns include the wildcard `<GR-*>` apply-groups
  (`gr-isis-ipv6`, `gr-srv6`, `gr-bgp`, `gr-l3vpn`, `gr-core-intf-ipv6`),
  per-Flex-Algo IS-IS + SRv6 locator instantiation, multi-AFI BGP
  overlay (RR + RR-client + ASBR shapes), and inter-AS Option C with
  locator summarization.

### What this means for you

- Pull the latest `main` to pick up the new SRv6 Core Edge JVD and its
  snip library.
- If you're building a customer design with SRv6 µSID + Flex-Algo +
  L3VPN-SRv6 / EVPN-VPWS-SRv6, start from
  [`configuration/snips/`](service_provider/srv6_core_edge/configuration/snips/)
  rather than copying full per-device configs.
- All committed device configs are sanitized — encrypted credentials,
  SSH keys, AAA secrets, and lab-only management routes have been
  removed. Substitute your own values before deploying.

---

### By the numbers

<details>
<summary>Per-JVD / per-area changes</summary>

| JVD / Area | Added | Renamed | Removed | Modified | READMEs |
| --- | ---: | ---: | ---: | ---: | ---: |
| service_provider/srv6_core_edge | 64 | 0 | 0 | 0 | 1 |
| **TOTAL** | **64** | **0** | **0** | **0** | **1** |

</details>

<details>
<summary>Net lines added/removed by area</summary>

| Area | Lines added | Lines removed | Net |
| --- | ---: | ---: | ---: |
| service_provider | 1,176,770 | 0 | +1,176,770 |
| **Total** | **1,176,770** | **0** | **+1,176,770** |

</details>

<details>
<summary>SRv6 Core Edge content breakdown</summary>

| Area | Files | Lines added |
| --- | ---: | ---: |
| Sanitized device configs (`configuration/conf/`) | 13 | 1,173,097 |
| Snip library (`configuration/snips/`) | 48 | 3,511 |
| README + reference architecture diagrams | 3 | 162 |
| **Total** | **64** | **1,176,770** |

</details>

---

## 2026-05-01

A large round of repository-wide improvements landed this week, focused on
making JVDs easier to navigate, easier to consume per-device, and easier to
adapt into customer designs.

### New content

- **MEBS snip library** — A templated snip library for
  [`service_provider/metro_ethernet_business_services`](service_provider/metro_ethernet_business_services/configuration/snips/)
  covering 8 categories (interfaces, policy, services, firewall, cos,
  transport, oam, apply-groups), with paired Junos and Junos Evolved
  coverage. Each snip uses `$VARIABLE` placeholders so it can be dropped
  into a customer config with minimal editing.
- **Broadband Edge snip library** — A new templated snip library for
  [`service_provider/broadband_edge`](service_provider/broadband_edge/),
  same `$VARIABLE` convention, with cross-OS Junos / Junos Evolved pairing.
- **BYOAI ("Bring Your Own AI") guide for MEBS** *(experimental / work
  in progress)* — A manifest-based, snip-grounded workflow for
  generating MEBS configurations with the AI assistant of your choice
  (ChatGPT, Claude, Gemini), with one-click launch buttons. See the
  MEBS snip library `byoai/` folder. Behavior varies by AI provider and
  model version; feedback welcome.

### Standardized layout across all JVDs

Every JVD now follows a single, predictable folder structure:

```
<jvd>/
  README.md          # hardware table, diagram, per-config link table
  configuration/
    conf/            # hierarchical Junos configs
    set/             # display-set configs
    apstra/          # Apstra blueprints / JSON (where applicable)
  images/            # reference architecture diagrams (local copies)
```

Per-device config filenames now encode **role + device type** so they
match the reference architecture diagrams directly — for example
`dc1_spine1_qfx5220-32cd.conf` or `borderleaf1_qfx5130-32cd.conf`.

### READMEs rewritten

JVD READMEs across Data Center, Enterprise WAN, Service Provider,
Security, Optical, and Automation areas were rewritten against a common
template:

- Link back to the JVD landing page on juniper.net
- Reference architecture diagram (stored locally — no remote attachments)
- Hardware table (product / role / hostnames / software version)
- Per-config link table that resolves on disk

### Areas reorganized

- **Data Center / ADC** — `aidc`, `3stage_dc`, `3stage_dc_connected_security`,
  `collapsed_dc_fabric`, `collapsed_dc_fabric_with_access`,
  `5stage_evpn_vxlan`, `evpn_vxlan_sflow_apstra`, `evpn_vxlan_dci`
- **Enterprise WAN** — `ewan_adv_core_edge`, `ewan_finance`
- **Service Provider** — `metro_as_a_service`,
  `metro_ethernet_business_services`, `broadband_edge`
- **Security** — `scale_out_firewall_nat`, `scale_out_ipsec`
- **Optical** — `dci_over_ipodwdm`
- **Automation** — config naming standardized

### What this means for you

- Pull the latest `main` to pick up the new layout.
- Existing bookmarks to specific config files will need updating —
  files were renamed (not just moved) to encode role + hardware.
- If you're building a customer design against MEBS or Broadband Edge,
  start from the new snip libraries rather than copying full per-device
  configs.

---

### By the numbers

<details>
<summary>Per-JVD / per-area changes</summary>

| JVD / Area | Added | Renamed | Removed | Modified | READMEs |
| --- | ---: | ---: | ---: | ---: | ---: |
| .github (CI) | 1 | 0 | 0 | 0 | 0 |
| automation | 0 | 30 | 0 | 0 | 5 |
| data_center/adc/3stage_dc | 2 | 15 | 21 | 0 | 1 |
| data_center/adc/3stage_dc_connected_security | 2 | 11 | 1 | 0 | 1 |
| data_center/adc/5stage_evpn_vxlan | 1 | 17 | 2 | 0 | 1 |
| data_center/adc/collapsed_dc_fabric | 1 | 2 | 1 | 0 | 1 |
| data_center/adc/collapsed_dc_fabric_with_access | 1 | 4 | 1 | 0 | 1 |
| data_center/adc/evpn_vxlan_dci | 7 | 44 | 4 | 0 | 1 |
| data_center/adc/evpn_vxlan_sflow_apstra | 2 | 17 | 0 | 0 | 1 |
| data_center/aidc | 0 | 0 | 2 | 1 | 1 |
| data_center/aidc/aiml_multitenancy_backend | 2 | 8 | 2 | 0 | 1 |
| data_center/aidc/images | 1 | 0 | 0 | 0 | 0 |
| enterprise_wan/ewan_adv_core_edge | 0 | 8 | 0 | 0 | 0 |
| enterprise_wan/ewan_finance | 0 | 9 | 0 | 0 | 0 |
| optical/dci_over_ipodwdm | 6 | 0 | 3 | 0 | 0 |
| security/scale_out_firewall_nat | 0 | 6 | 0 | 0 | 0 |
| security/scale_out_ipsec | 0 | 6 | 0 | 0 | 0 |
| service_provider/broadband_edge | 50 | 0 | 0 | 0 | 1 |
| service_provider/metro_as_a_service | 38 | 0 | 19 | 1 | 1 |
| service_provider/metro_ethernet_business_services | 81 | 4 | 0 | 0 | 2 |
| **TOTAL** | **195** | **181** | **56** | **2** | **18** |

</details>

<details>
<summary>Net lines added/removed by area</summary>

| Area | Lines added | Lines removed | Net |
| --- | ---: | ---: | ---: |
| data_center | 306 | 49 | +257 |
| optical | 16,378 | 16,378 | 0 |
| service_provider | 61,253 | 46,492 | +14,761 |
| .github (CI) | 38 | 0 | +38 |
| **Total** | **77,975** | **62,919** | **+15,056** |

</details>

---

_Maintainer: Kevin Brown. Questions, corrections, or requests — please
open an issue on this repository._
