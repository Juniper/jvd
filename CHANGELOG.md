# JVD Repository Changelog

Release notes for the Juniper Validated Design (JVD) configuration repository.

---

## 2026-07-21

Six more validated designs join the library — spanning AI/ML data center
fabrics, collapsed and multi-stage EVPN-VXLAN, data center interconnect, and
coherent optical transport — each with full documentation, validated
configuration building blocks, and an AI assistant. The portal's AI assistants
also gain a built-in feedback loop.

### New designs

- **AI/ML Inference Frontend** — the frontend EVPN-VXLAN fabric for an AI/ML
  inference cluster (built with Juniper Apstra): documentation corpus, validated
  configuration building blocks, and an AI-assistant bundle.
- **EVPN-VXLAN Data Center Interconnect (DCI)** — the DCI extension that stitches
  data center fabrics together over an EVPN-VXLAN core, across both Junos and
  Junos Evolved platforms.
- **5-Stage EVPN-VXLAN Fabric** — the five-stage Clos data center design, scaled
  beyond a single pod.
- **Collapsed Data Center Fabric** — the two-switch collapsed-spine EVPN-VXLAN
  design for smaller sites.
- **Collapsed Data Center Fabric with Access Switches** — the collapsed design
  extended with an EX4400 access-switch layer for port expansion.
- **Data Center Interconnect over IPoDWDM** — high-capacity DCI using Converged
  Optical Routing Architecture (CORA): Juniper 400G Coherent Optics plugged
  directly into PTX, MX, and ACX routers, with no external transponder.

Each new design ships with a solution overview, design guide, test-report brief,
datasheet quick-reference, a library of templated Junos / Junos Evolved
configuration building blocks, and a bring-your-own-AI (BYOAI) assistant bundle
that can both generate grounded configuration and answer design questions.

### Portal

- **Bigger library** — the portal now indexes **17 validated designs** and
  **638 configuration building blocks**.
- **Service Configuration Generator** is now clearly marked **Under
  Construction** while more services and designs are wired in.

### AI assistant (BYOAI)

- **Built-in feedback loop** — every design's AI assistant now invites you to
  flag anything that looks off, re-checks the validated documentation, and
  corrects itself — and points you to the project's GitHub Issues to report a
  problem with a design.

---

## 2026-07-20

A new Scale-Out security design joins the library — complete with full
documentation, validated configuration building blocks, and an AI assistant —
alongside a library-wide quality pass that makes every configuration building
block provably faithful to the design it was validated on.

### New design: Scale-Out Stateful Firewall & NAT

- **Full design corpus** — the Connected Security Distributed Services (CSDS)
  ScaleOut stateful-firewall-and-NAT design is now documented end to end:
  solution overviews, design guides, and test-report briefs for **both**
  deployment focuses — Enterprise (Source NAT) and Service Provider (CGNAT) —
  plus a one-page datasheet quick-reference and a figure catalog.
- **Validated configuration building blocks** — 21 templated Junos
  configuration snippets covering the MX304 stateless load balancer (ECMP
  consistent-hashing and Traffic Load Balancer), the SRX stateful firewall and
  NAPT44 source/carrier-grade NAT, SRX Multinode High Availability, the
  eBGP/BFD transport, and the supporting interfaces, zones, and policies.
- **AI assistant (BYOAI)** — a bring-your-own-AI bundle for this design that can
  generate grounded configuration and answer design questions, automatically
  framing its answers for an Enterprise (Source NAT) or Service Provider (CGNAT)
  audience.

### Configuration library quality

- **Provable fidelity** — every configuration building block across the library
  was validated by rebuilding its configuration from the template and confirming
  that every resulting statement exists, exactly, in the design's validated
  source configuration. Six designs were corrected or verified so their building
  blocks now round-trip cleanly.
- **Clearer variables** — previously undocumented template variables were added
  to the glossaries for several designs (Metro Ethernet Business Services,
  3-Stage Data Center, and Enterprise WAN Advanced Core/Edge), and instance-name
  templating was made consistent — so the building blocks are easier to reuse
  correctly.
- **Cleaner source configuration** — a stray command-capture line that had
  leaked into 14 source device configurations (Broadband Edge and Low-Latency
  Queueing) was removed, so every configuration file now begins with real Junos
  configuration.

### Portal

- **Bigger library** — the portal now indexes **11 validated designs** and
  **578 configuration building blocks**, including the new Scale-Out Stateful
  Firewall & NAT design and its AI-assistant bundle.

### AI assistant (BYOAI)

- **More faithful design answers** — the AI-assistant bundle for every design
  now answers design questions grounded strictly in that design's validated
  documentation: it explains only what the design documents, says plainly when
  the documentation doesn't cover a point (instead of guessing), and attributes
  each explanation to its source document and section.

### What this means for you

- A complete, ready-to-use Scale-Out security design — documentation, validated
  configuration, and an AI assistant — for both enterprise and service-provider
  NAT use cases.
- Greater confidence that every configuration building block in the library
  faithfully reflects the design it was validated on, with clearer, better-
  documented variables when you adapt one to your network.
- When you ask a design assistant *why* something is configured a certain way,
  it answers from the validated design — or tells you the design doesn't say —
  rather than inventing a plausible-sounding rationale.

### By the numbers

| Item | Count |
|---|---|
| New design published (docs + configs + AI assistant) | 1 |
| New design documents (overviews, design guides, test briefs, datasheet) | 7 |
| New configuration building blocks | 21 |
| Designs with configuration-fidelity corrections/verification | 6 |
| Designs with hardened AI-assistant grounding | 11 |
| Source configuration files cleaned | 14 |
| Designs in the portal library | 11 |
| Configuration building blocks in the portal library | 578 |

---

## 2026-07-17

The JVD Portal gains a powerful global search and more accurate hardware
details, making it far easier to find the right design — and the exact
configuration — for what you need.

### Portal

- **Global search** — a new search bar on the home page (also opened with ⌘K or
  the `/` key) searches everything at once: validated designs, the full library
  of configuration building blocks, technologies, and use cases. Results are
  grouped and ranked, and jump you straight to the right place.
- **Search that understands the designs** — searching a technology, platform, or
  feature (for example `EVPN-VXLAN`, `SRX4700`, `pseudowire`, or `flex-algo`)
  now returns every design that actually uses it — matched against each design's
  documentation and validated configuration, not just its title.
- **Typo tolerance** — if a search finds nothing, the portal suggests close
  matches (`bpg` → `bgp`), so a small slip still gets you there.
- **More accurate hardware** — each design's platform list was reconciled
  against its documentation and configuration files, so the hardware shown
  reflects what the design actually validates.

### What this means for you

- Find the right JVD — or the exact config snippet — in seconds, from anywhere
  on the page.
- Trust that a search for a platform or technology surfaces every design that
  truly uses it.

---

## 2026-07-16

The JVD Portal gets a usability, discoverability, and shareability refresh —
making it faster to find the right design, clearer why the portal exists
alongside the published JVDs, and better looking when shared or indexed.

### Portal

- **Find a design faster** — a new catalog search bar filters the full JVD
  library by name, description, area, platform, or OS, and every design card now
  links straight to both its GitHub configuration and its documentation on
  juniper.net.
- **"Why this portal" at a glance** — a new home-page band explains the portal
  in five seconds: the full designs are published on juniper.net, and the portal
  is where you act on them — find the right design, learn how it's built, plan
  it, and generate validated configuration.
- **Better link previews** — shared portal links now render a branded preview
  card with a title, summary, and image on Slack, Teams, LinkedIn, and X.
- **Easier to discover** — the portal now exposes structured catalog data and a
  no-JavaScript fallback, so search engines and AI assistants can index every
  validated design in the library.
- **Curated platform tags** — each design's platform tags were tidied so they
  reflect the switches and routers actually validated in that design (for
  example, EX-series access switches now appear on the collapsed-fabric-with-
  access design).

### What this means for you

- Jump to the right JVD in seconds, then go straight to its configuration or its
  full documentation.
- Share portal links that look intentional and on-brand in chat and social.
- Find validated designs more easily through search engines and AI assistants.

---

## 2026-07-15

Four more Juniper Validated Designs gain the full treatment — an AI-assisted
design assistant plus a complete documentation corpus — and the Data Center
track joins the program for the first time. SP Core & Edge SRv6 and Enterprise
WAN for Finance & Stock Exchange are joined by the first two Data Center
designs: the 3-Stage EVPN-VXLAN fabric and the AI Data Center Multitenancy GPU
backend. The Bring Your Own AI experience also gains a usage guide and clearer
launch guidance.

### New content

- **SP Core & Edge SRv6 — design assistant and documentation** — the SRv6 JVD
  gains an AI-assisted design assistant and a full documentation corpus in
  [`service_provider/srv6_core_edge/`](service_provider/srv6_core_edge/):
  design guide, solution overview, test report brief, datasheet, and topology
  figures. Covers SRv6 micro-SID transport with IS-IS Flex-Algo, TI-LFA fast
  reroute, inter-AS Option C, and GRT / L3VPN / EVPN E-Line services, validated
  on Junos OS / Junos OS Evolved 24.4R2.
- **Enterprise WAN for Finance & Stock Exchange — design assistant and
  documentation** — a full corpus in
  [`enterprise_wan/ewan_finance/`](enterprise_wan/ewan_finance/): an
  ultra-low-latency, multicast-centric MPLS/RSVP-TE WAN delivering NG-MVPN
  (SPT-only, RSVP-TE P2MP), EVPN virtual-switch Active/Standby ESI multihoming,
  L3VPN VRFs, and a core-router virtual-router context with TWAMP SLA
  monitoring, across MX304/MX10004, ACX7100, and PTX10001/10003.
- **3-Stage Data Center (EVPN-VXLAN) — first Data Center design with the full
  treatment** — [`data_center/adc/3stage_dc/`](data_center/adc/3stage_dc/) gains
  a design assistant and documentation for the EVPN-VXLAN edge-routed-bridging
  fabric built with Juniper Apstra: a VLAN-aware MAC-VRF and EVPN Type-5 VRFs
  over an eBGP Clos underlay + EVPN overlay, across QFX5220 spines, QFX5120
  server leaves, and QFX5130/QFX5120 border leaves. Includes companion
  documentation for the VMware NSX-T integration and IPv6-underlay variants.
- **AI Data Center Multitenancy with EVPN/VXLAN — first AI design with the full
  treatment** —
  [`data_center/aidc/aiml_multitenancy_backend/`](data_center/aidc/aiml_multitenancy_backend/)
  gains a design assistant and documentation for the GPU backend fabric that
  delivers GPU as a Service (GPUaaS): per-tenant EVPN Type-5 IP-VRFs on a
  rail-optimized stripe of QFX5240 switches, with RoCEv2 lossless transport,
  DCQCN congestion management, and Dynamic Load Balancing.

### Portal

- **Bring Your Own AI — usage guide and launch clarity** — a new Using BYOAI
  guide documents which AI models and tiers are tested and working, how to
  verify your AI can fetch the design content, and how to attach or paste the
  assistant prompt when your AI can't browse the web. Launch guidance is
  corrected to make clear the assistant needs an AI with web access.

### What this means for you

- Explore SRv6, Enterprise WAN Finance, and the first two Data Center designs
  (3-Stage EVPN-VXLAN and AI Multitenancy) in the portal's Design & Planner —
  ask architecture and scaling questions and get answers cited to the validated
  design.
- Generate ready-to-deploy configuration for any of these designs with your own
  AI assistant or the portal Config Generator.
- Before launching the assistant, check the Using BYOAI guide to pick an AI
  model/tier that can fetch the design content — or use the attach / paste
  fallback.

---

### By the numbers

<details>
<summary>Per-JVD / per-area changes</summary>

| JVD / Area | Added | Renamed | Removed | Modified | READMEs |
| --- | ---: | ---: | ---: | ---: | ---: |
| service_provider/srv6_core_edge | 23 | 0 | 0 | 0 | 3 |
| enterprise_wan/ewan_finance | 33 | 0 | 0 | 0 | 3 |
| data_center/adc/3stage_dc | 25 | 0 | 0 | 0 | 3 |
| data_center/aidc/aiml_multitenancy_backend | 19 | 0 | 0 | 0 | 3 |
| portal | 39 | 0 | 0 | 2 | 0 |
| **TOTAL** | **139** | **0** | **0** | **2** | **12** |

</details>

<details>
<summary>Net lines added/removed by area</summary>

| Area | Lines added | Lines removed | Net |
| --- | ---: | ---: | ---: |
| service_provider/srv6_core_edge | 6,710 | 0 | +6,710 |
| enterprise_wan/ewan_finance | 5,230 | 0 | +5,230 |
| data_center/adc/3stage_dc | 6,128 | 0 | +6,128 |
| data_center/aidc/aiml_multitenancy_backend | 3,723 | 0 | +3,723 |
| portal | 19,018 | 6 | +19,012 |
| **Total** | **40,809** | **6** | **+40,803** |

</details>

## 2026-07-14

Two more JVDs — Metro Ethernet Business Services and Enterprise WAN
Advanced Core and Edge Services — gain full design documentation, a
concise datasheet, and an AI-assisted design assistant. Enterprise WAN
is the first non-Metro design to get the complete treatment. The portal's
Config Generator and Design & Planner are hardened for reliability.

### New content

- **Metro Ethernet Business Services documentation** — the Metro EBS JVD
  gains a full design corpus in
  [`service_provider/metro_ethernet_business_services/documentation/`](service_provider/metro_ethernet_business_services/documentation/):
  a design guide, solution overviews and test report briefs for both the
  `03-01` foundation and the `03-03` platform refresh, a one-page
  datasheet, and topology diagrams. Covers the Cloud Metro fabric +
  multi-ring architecture across ACX7024/ACX7100/ACX7348/ACX7509 (EVO),
  MX204/MX304/MX10004 (Junos), and PTX10001-36MR, with EVPN-VPWS, EVPN-FXC,
  EVPN-ELAN, EVPN Type-5, and SR-MPLS transport.
- **Enterprise WAN Advanced Core and Edge Services — design assistant and
  documentation** — the Enterprise WAN JVD gains its first AI-assisted
  design assistant plus a full documentation corpus in
  [`enterprise_wan/ewan_adv_core_edge/`](enterprise_wan/ewan_adv_core_edge/):
  a design guide, solution overview, test report brief, datasheet, and
  topology diagrams. This MPLS-backbone design delivers EVPN-VPWS,
  EVPN-ELAN, and EVPN Type-5 services over mixed Segment Routing + LDP
  transport, with MACsec encryption and BGP FlowSpec DDoS protection,
  validated across MX304/MX10004, ACX7509/ACX7100-48L, and
  PTX10003-80C/PTX10001-36MR.
- **Per-JVD datasheets** — Metro-as-a-Service, Metro EBS, and Enterprise
  WAN each now ship a concise one-page datasheet summarizing device roles,
  featured platforms, protocols, services, and use cases — a fast reference
  before diving into the full design guide.

### Portal

- **Config Generator reliability** — the EVPN-FXC builder now
  auto-increments VLAN IDs across bundled UNIs (so multi-UNI services no
  longer collapse into one), flags overlaps inline, and offers a
  downloadable `$VAR` template alongside the rendered config.
- **Design & Planner (Bring Your Own AI)** — the assistant now starts
  reliably on any account and adds a **Design mode** grounded in each JVD's
  published documentation, so you can ask architecture and scaling
  questions and get answers cited to the validated design. Metro EBS and
  Enterprise WAN join Metro-as-a-Service as AI-equipped designs.

### Repository

- **Licensing clarity** — a `NOTICE` file and README statement clarify that
  this is an official Juniper resource under Apache 2.0, with guidance on
  derived works and trademarks.

### What this means for you

- Pull the latest `main` to get the Metro EBS and Enterprise WAN
  documentation, the three new datasheets, and the updated portal.
- Start from a JVD's **datasheet** for a one-minute overview, then follow
  it into the design guide for depth.
- Launch **Design & Planner** and pick Design mode to explore an
  architecture with answers grounded in the published JVD documentation.

---

### By the numbers

<details>
<summary>Per-JVD / per-area changes</summary>

| JVD / Area | Added | Modified |
| --- | ---: | ---: |
| `enterprise_wan/ewan_adv_core_edge` | 22 | 0 |
| `service_provider/metro_ethernet_business_services` | 22 | 2 |
| `service_provider/metro_as_a_service` | 1 | 3 |
| `portal` | 9 | 13 |
| `.github` + repo root | 3 | 5 |
| **TOTAL** | **57** | **23** |

</details>

<details>
<summary>Net lines added/removed by area</summary>

| Area | Lines added | Lines removed | Net |
| --- | ---: | ---: | ---: |
| Enterprise WAN (docs + assistant) | 5,708 | 0 | +5,708 |
| Metro EBS (docs + assistant) | 1,277 | 287 | +990 |
| Metro-as-a-Service (datasheet) | 308 | 127 | +181 |
| Portal (generator, assistant, bundles) | 6,903 | 526 | +6,377 |
| Automation + repo root | 200 | 54 | +146 |
| **Total** | **14,379** | **968** | **+13,411** |

</details>

---

## 2026-07-08

The Metro-as-a-Service (MaaS) JVD gains a validated configuration snip
library, and the JVD portal adds two ways to turn those designs into
config: a deterministic Config Generator and an AI-assisted design
workflow. The portal is reorganized into a four-step path — Discover,
Learn, Design, Build.

### New content

- **Metro-as-a-Service snip library** — a validated library of Junos and
  Junos EVO configuration snippets in
  [`service_provider/metro_as_a_service/configuration/snips/`](service_provider/metro_as_a_service/configuration/snips/).
  Covers the MEF Carrier Ethernet service families: E-Line (EVPN-VPWS,
  L2VPN, BGP-VPLS, EVPN-FXC), E-LAN (EVPN-ELAN VLAN-based, VLAN-bundle and
  port-based, BGP-VPLS), E-Tree (EVPN E-Tree), and Pseudowire Headend
  Termination. Validated across ACX7024/ACX7100/ACX7509 (EVO), MX204/MX304
  (Junos), and PTX10001-36MR. Each snip carries source provenance, a
  variable glossary, and pair-with references.

### Portal

- **Config Generator** — a deterministic builder that renders
  download-ready Junos / Junos EVO service configuration from the validated
  snip library. Metro-as-a-Service E-Line, E-LAN, E-Tree, EVPN-FXC, and
  PWHT are available, with per-service options for homing, VLAN handling,
  route-target export, and class-of-service.
- **Design & Planner (Bring Your Own AI)** — a conversation-driven workflow
  that pairs the AI you already use with a JVD's validated snip library to
  plan a design and build configuration.
- **New layout** — the portal is organized as Discover (JVD Catalog), Learn
  (Config Explorer), Design (Design & Planner), and Build (Service
  Configuration Generator), with links between each step.

### What this means for you

- Pull the latest `main` to get the Metro-as-a-Service snip library and the
  updated portal.
- If you are building a Metro Carrier Ethernet service, start from the
  Config Generator or the snip library instead of writing configuration
  from scratch.
- Use the Design & Planner when you want design and scaling guidance
  grounded in a validated design.

---

### By the numbers

<details>
<summary>Per-area changes</summary>

| Area | Added | Modified | Files | Lines added |
| --- | ---: | ---: | ---: | ---: |
| `service_provider/metro_as_a_service` (snip library) | 35 | 12 | 47 | 13,224 |
| `portal` (Config Generator, Design & Planner, layout) | 13 | 5 | 18 | 17,842 |
| `Documentation` | 1 | 0 | 1 | 51 |
| **Total** | **49** | **17** | **66** | **31,117** |

</details>

<details>
<summary>Net lines added/removed by area</summary>

| Area | Lines added | Lines removed | Net |
| --- | ---: | ---: | ---: |
| service_provider/metro_as_a_service | 13,224 | 75 | +13,149 |
| portal | 17,842 | 597 | +17,245 |
| Documentation | 51 | 0 | +51 |
| **Total** | **31,117** | **672** | **+30,445** |

</details>

---

## 2026-06-26

README standardization across all 20 JVDs, plus the new AI Data Center
Frontend Fabric for Inference JVD organized and onboarded.

### New content

- **AI Inference Frontend Fabric** — new JVD in
  [`data_center/aidc/aiml_inference_frontend/`](data_center/aidc/aiml_inference_frontend/).
  Validated configurations for a leaf-spine frontend fabric supporting
  AI inference workloads with AMD Instinct MI300X GPUs, Apstra-managed
  QFX5130-32CD leafs and QFX5220-32CD spines (additional validated
  platforms: QFX5140-24CD8O, QFX5230-64CD, QFX5240-64OD). Includes
  topology diagram extracted from the JVD document.

### Improvements

- **README standardization** — all 20 JVD READMEs updated to a
  consistent format: one-line summary blockquotes, highlights sections,
  validated hardware tables with direct config file links, and
  corrected JVD documentation URLs. 14 of 20 JVDs now meet all
  required README criteria.

### What this means for you

- If you're building an AI inference frontend network, the new JVD
  provides validated leaf-spine configs with Apstra automation ready
  to adapt to your GPU cluster topology.
- Every JVD README now links directly to each device config file
  and its Juniper docs page — easier to navigate whether you're
  browsing on GitHub or cloning the repo.

---

## 2026-06-01

New 70-snip library for the 5G xHaul Low-Latency Queueing JVD, plus two
Enterprise WAN snip libraries audited and enriched — EWAN Advanced
Core & Edge and EWAN Finance. The repository now also carries an
explicit Apache-2.0 license.

### New content

- **Low-Latency Queueing snip library** — 70 new configuration
  snippets (39 EVO, 31 Junos) in
  [`service_provider/low_latency_queueing/configuration/snips/`](service_provider/low_latency_queueing/configuration/snips/).
  Covers 5G fronthaul, midhaul, and backhaul QoS across
  ACX7509/ACX7100/ACX7024 (EVO), PTX10001-36MR (EVO), and
  MX480/MX204/MX304 (Junos). Includes 8-class CoS model aligned to
  O-RAN multi-priority requirements, EVPN-ELAN/VPWS/FXC services,
  BGP-VPLS, L3VPN-IRB, per-hop behavior classifiers (DSCP, EXP,
  802.1p), and SR-ISIS/MPLS transport.

- **EWAN Advanced Core & Edge snip library audit** — headers enriched
  across all 48 snips in
  [`enterprise_wan/ewan_adv_core_edge/configuration/snips/`](enterprise_wan/ewan_adv_core_edge/configuration/snips/).
  Pair-with cross-references corrected, Seen-on device lists validated
  against source configs (MX304, MX204, ACX7100-48L running Junos),
  and service-mapping metadata injected for EVPN-VPWS, L3VPN, and
  SR-MPLS transport services.

- **EWAN Finance snip library audit** — headers enriched across all
  38 snips in
  [`enterprise_wan/ewan_finance/configuration/snips/`](enterprise_wan/ewan_finance/configuration/snips/).
  Topology-derived use-case map added covering MPLS RSVP-TE transport,
  multicast (P2MP LSPs), L3VPN, EVPN Virtual Switch, and Virtual
  Router services across MX304 and ACX7100-48L devices running
  Junos EVO.

- **Apache-2.0 license** — the repository now includes an explicit
  [`LICENSE`](LICENSE) file (Apache License, Version 2.0), clarifying
  reuse terms for all configurations and snippets.

- **Portal snip data** regenerated — the
  [Snip Library browser](https://juniper.github.io/jvd/portal/#snips)
  reflects the new LLQ library and updated header metadata for both
  EWAN libraries (515 snips across 9 JVDs).

### What this means for you

- If you're deploying 5G xHaul with low-latency QoS, start from the
  LLQ snips — they provide a validated 8-class CoS model with
  per-hop classifiers ready to adapt to your DSCP/EXP marking scheme.
- Pull the latest `main` to get corrected cross-references in both
  EWAN snip libraries — `Pair with:` and `Seen on:` sections now
  accurately reflect validated device pairings.
- If you're building an MPLS/RSVP-TE or multicast design, start from
  the EWAN Finance snips — they cover P2MP LSPs and MVPN patterns
  not found in other JVDs.
- Reuse of any content is now governed by the Apache-2.0 license at
  the repo root.

---

### By the numbers

<details>
<summary>Per-JVD / per-area changes</summary>

| JVD / Area | Added | Modified | Lines added | Lines removed |
| --- | ---: | ---: | ---: | ---: |
| `service_provider/low_latency_queueing` | 72 | 0 | 3,376 | 0 |
| `enterprise_wan/ewan_adv_core_edge` | 0 | 34 | 107 | 9 |
| `enterprise_wan/ewan_finance` | 0 | 20 | 80 | 15 |
| `portal/` | 0 | 2 | 5,542 | 635 |
| `LICENSE` | 1 | 0 | 190 | 0 |
| **TOTAL** | **73** | **56** | **9,295** | **659** |

</details>

<details>
<summary>Net lines added/removed by area</summary>

| Area | Lines added | Lines removed | Net |
| --- | ---: | ---: | ---: |
| Service Provider (LLQ) | 3,376 | 0 | +3,376 |
| Enterprise WAN | 187 | 24 | +163 |
| Portal | 5,542 | 635 | +4,907 |
| License | 190 | 0 | +190 |
| **Total** | **9,295** | **659** | **+8,636** |

</details>

---

## 2026-05-30

Quality sweep across three snip libraries — SRv6, Broadband Edge
(BBE), and 3-Stage Data Center (Apstra). Every library now carries
audited headers, corrected cross-references, and topology-derived
service-mapping metadata.

### New content

- **SRv6 snip library audit** — headers standardized across all 36
  snips, taxonomy corrected (new `bootstrap` category for chassis /
  system / gRPC stanzas), 7 new snips added (forwarding-options,
  class-of-service, SRv6 locator summarization), one spurious EVO
  snip removed, and a `vrf-target` variable mismatch fixed.

- **BBE snip library audit** — service-mapping headers injected into
  all 3 service snips with topology-derived instance counts and
  device distribution, cross-OS pair-with references cleaned up,
  and pair-with reciprocity completed across 30+ snips.

- **3-Stage DC (Apstra) snip library audit** — service-mapping
  headers added to all 3 service snips (4 instances across
  blue/green/red VRFs + evpn-1 MAC-VRF), cross-OS pair-with
  violations removed, 23 missing reciprocal pair-with links
  added across 15 snips, and missing EVO variables corrected.

- **Portal snip data** regenerated — the
  [Snip Library browser](https://juniper.github.io/jvd/portal/#snips)
  now reflects the corrected headers and service-mapping metadata
  for all three audited libraries (442 snips across 8 JVDs).

### What this means for you

- Every snip's `Pair with:` section is now reciprocal — if snip A
  says "pair with B", snip B says "pair with A". This makes it
  safe to navigate the dependency graph in either direction.
- Service snips now include a `JVD service mapping` block that
  shows exactly how many instances of the service exist in the
  reference design, which devices host them, and what VRF /
  MAC-VRF names are used. This gives you a quick inventory
  before you start templating.
- Cross-OS pair-with references (Junos ↔ EVO) that violated
  platform compatibility rules have been removed, so the
  portal's "Related snips" panel no longer suggests impossible
  pairings.

### By the numbers

| Area | Files changed |
| --- | --- |
| SRv6 snips | 43 files (7 new, 36 refreshed, 1 removed) |
| BBE snips | 32 files (headers + pair-with fixes) |
| 3-Stage DC snips | 17 files (headers + pair-with fixes) |
| Portal snip data | 442 snips indexed across 8 JVDs |

---

## 2026-05-29

The Metro Ethernet Business Services (MEBS) snip library gets a
refresh: eight new service templates fill out the L2VPN / L3VPN
catalog, the generic `l3vpn-vrf` snip is split into two
protocol-specific templates so that VRFs are now categorized
by their PE-CE protocol, and the BYOAI assistant's
"what can I generate" menu has been rewritten to match the
library's actual coverage.

### New content

- **New MEBS service templates** under
  [`service_provider/metro_ethernet_business_services/configuration/snips/`](service_provider/metro_ethernet_business_services/configuration/snips/):
  - **EVPN-FXC** (Flexible Cross-Connect) for both
    [Junos](service_provider/metro_ethernet_business_services/configuration/snips/junos/services/evpn-fxc.conf)
    and
    [EVO](service_provider/metro_ethernet_business_services/configuration/snips/evo/services/evpn-fxc.conf)
    — bundle multiple UNIs under one `evpn-vpws` instance with
    an FXC collector group.
  - **EVPN E-Tree** for
    [Junos](service_provider/metro_ethernet_business_services/configuration/snips/junos/services/evpn-etree.conf)
    — MEF E-Tree (root / leaf) on a Junos mac-vrf with
    `etree-ac-role` on each UNI.
  - **Slim L3VPN IRB-anchor VRF** for
    [Junos](service_provider/metro_ethernet_business_services/configuration/snips/junos/services/evpn-type5-anchor.conf)
    and
    [EVO](service_provider/metro_ethernet_business_services/configuration/snips/evo/services/evpn-type5-anchor.conf)
    — a Type-5 anchor VRF that pairs with an EVPN-ELAN MAC-VRF
    for L2+L3 IRB services (host /32s ride RT-2, no
    `ip-prefix-routes` block).
  - **L2Circuit floating pseudowires** for
    [Junos](service_provider/metro_ethernet_business_services/configuration/snips/junos/services/l2circuit-floating-pw.conf)
    and EVO
    — static-label PW landing on a `ps<N>` pseudowire-subscriber
    anchor.
  - **L2Circuit local-switching** for
    [EVO](service_provider/metro_ethernet_business_services/configuration/snips/evo/services/l2circuit-lsw.conf)
    — port-to-port hairpin on one PE via
    `end-interface`.
  - **EVO BGP-VPLS** at
    [`evo/services/bgp-vpls.conf`](service_provider/metro_ethernet_business_services/configuration/snips/evo/services/bgp-vpls.conf)
    — completes the BGP-VPLS cross-OS pair (the Junos template
    already shipped).
  - **Junos EVPN-ELAN virtual-switch IRB** at
    [`junos/services/evpn-elan-virtual-switch-irb.conf`](service_provider/metro_ethernet_business_services/configuration/snips/junos/services/evpn-elan-virtual-switch-irb.conf)
    — the legacy `virtual-switch` shape with IRB, alongside the
    existing mac-vrf variant.

- **L3VPN split by PE-CE protocol** — the generic `l3vpn-vrf`
  template is replaced by two protocol-specific templates,
  shipped for both Junos and EVO:
  - [`l3vpn-bgp.conf`](service_provider/metro_ethernet_business_services/configuration/snips/junos/services/l3vpn-bgp.conf)
    — L3VPN VRF with PE-CE eBGP (`as-override`,
    BGP routing-options).
  - [`l3vpn-ospf.conf`](service_provider/metro_ethernet_business_services/configuration/snips/junos/services/l3vpn-ospf.conf)
    — L3VPN VRF with PE-CE OSPF (area 0,
    `interface-type p2p`).

- **Two new MEBS interface templates**:
  - [`junos/interfaces/pseudowire-subscriber.conf`](service_provider/metro_ethernet_business_services/configuration/snips/junos/interfaces/pseudowire-subscriber.conf)
    — the `ps<N>` anchor used by floating-pw services.
  - [`junos/interfaces/ethernet-bridge.conf`](service_provider/metro_ethernet_business_services/configuration/snips/junos/interfaces/ethernet-bridge.conf)
    — `encapsulation ethernet-bridge` UNI shape.

- **BYOAI menu refreshed** — the
  [MEBS BYOAI](service_provider/metro_ethernet_business_services/configuration/snips/byoai/)
  assistant's
  [`MENU.md`](service_provider/metro_ethernet_business_services/configuration/snips/byoai/MENU.md)
  and system-prompt greeting are reorganized into four
  groups — **L2VPN / E-Line**, **L2VPN / E-LAN + E-Tree**,
  **L2 + L3 IRB**, and **L3VPN** — listing exactly the
  services the new template set can build (17 generation
  flows in total). The downloadable snip bundle
  (`jvd-mebs-snips.md`) and assistant prompt
  (`jvd-mebs-byoai-prompt.txt`) have been regenerated to match.

- **Pair-with cross-references updated** across roughly fifteen
  existing MEBS snips so the same-device dependency graph stays
  consistent with the new and renamed service templates
  (e.g. `apply-group` GR-EDGE-INTF parents for FXC and BGP-VPLS;
  ethernet-bridge UNI for EVPN E-Tree; the bgp / ospf split
  picked up by every snip that previously referenced
  `l3vpn-vrf`).

- **JVD Portal Snip Library** rebuilt to surface the refreshed
  MEBS catalog —
  [Snip Library browser](https://juniper.github.io/jvd/portal/#snips)
  now lists 446 snips across the eight published JVDs, with
  the new MEBS templates browsable by JVD, technology, and
  MEF use case.

### What this means for you

- If you're building a Metro Ethernet service against MEBS,
  the [services tree](service_provider/metro_ethernet_business_services/configuration/snips/junos/services/)
  is now a one-snip-per-shape catalog: pick `evpn-vpws` /
  `evpn-fxc` / `evpn-etree` / `l3vpn-bgp` / `l3vpn-ospf` /
  `l2circuit-floating-pw` etc. directly, instead of forking
  a generic VRF or VPWS template and rewriting it.
- Every new template carries the same five-section header
  (`Topic`, `Seen on`, `Highlights`, `Pair with`,
  `JVD service mapping`, `Variables`), so the deployment
  workflow is unchanged — `Pair with` still tells you which
  `interfaces/`, `apply-groups/`, `firewall/`, `cos/`, and
  `policy/` snips must coexist on the same device.
- The MEBS BYOAI assistant now offers exactly the generation
  flows the library can actually produce — no more asking
  the assistant for a service shape only to find the
  underlying template doesn't exist.

### By the numbers

| Area | Files changed |
| --- | --- |
| MEBS service snips (Junos + EVO) | +15 new, ~10 refreshed, 2 removed |
| MEBS interface snips (Junos) | +2 new |
| MEBS apply-group / cos / firewall / policy / transport snips | ~25 Pair-with header touch-ups |
| BYOAI bundle (MENU + system prompt + snip bundle + manifest) | 5 files refreshed |
| Portal snip data | 446 snips indexed across 8 JVDs |

---

## 2026-05-28

The Metro-as-a-Service (MaaS) JVD gains its first reusable
configuration-snippet library — 112 templates covering the full
MEF service portfolio (E-Line, E-LAN, E-Tree, E-Access) across
both Junos (MX, ACX5448, ACX710) and Junos EVO (ACX7024,
ACX7100, ACX7509) platforms, organized into a parallel
`junos/` and `evo/` tree by category. A small set of source
configurations under [`metro_as_a_service/configuration/conf/`](service_provider/metro_as_a_service/configuration/conf/)
was also refreshed for accuracy.

### New content

- **MaaS Configuration Snip Library** — 112 reusable templates for the
  [`metro_as_a_service`](service_provider/metro_as_a_service/) JVD,
  organized under
  [`configuration/snips/`](service_provider/metro_as_a_service/configuration/snips/)
  with dual Junos and EVO trees across 6 categories:
  `services/` (EVPN E-LAN incl. port-based / vlan-bundle / type-5,
  EVPN E-Tree, EVPN VPWS incl. LSW and port-based, EVPN FXC
  vlan-aware / vlan-unaware, BGP-VPLS, L2VPN Kompella,
  static l2circuit incl. floating-pw / hot-standby, bridge-domain),
  `interfaces/` (vlan-bridge incl. ESI / QinQ / E-Tree leaf/root,
  vlan-ccc with vlan-map ESI, ethernet-bridge, ethernet-ccc,
  IRB L3, pseudowire subscriber, physical-mtu),
  `firewall/` (color-aware and color-blind filters for families
  ccc, bridge, and ethernet-switching, with L2CP and per-CoS
  variants),
  `cos/` (forwarding-classes, ieee-802.1p / MPLS-EXP classifiers,
  rewrite-rules, schedulers and scheduler-map, CoS-binding
  templates for both ieee-802.1p and MPLS encaps),
  `policy/` (L3VPN RT, VPN RT export), and
  `apply-groups/` (MEF forwarding-profile).
  Every template carries the standard five-section header
  (`Topic`, `Seen on`, `Highlights`, `Pair with`, `JVD service
  mapping`, `Variables`) and a
  [`_variables.md`](service_provider/metro_as_a_service/configuration/snips/_variables.md)
  glossary defines all 49 `$VARIABLE` placeholders. A
  [`README.md`](service_provider/metro_as_a_service/configuration/snips/README.md)
  documents the OS / category layout, deployment workflow, and
  the same-device `Pair with` dependency model.

- **Source configuration updates** — ten files under
  [`configuration/conf/`](service_provider/metro_as_a_service/configuration/conf/)
  were updated for accuracy: a CoS code-point value was
  corrected on `FC-HIGH` in eight service captures, a `family
  ccc` wrapper was restored on one firewall filter, a missing
  CoS `scheduler-map` binding was added to one VPWS edge
  config, and a missing closing brace on one class-of-service
  block was repaired.

- **JVD Portal snip browser** — the new MaaS library is wired
  into the [Snip Library browser](https://juniper.github.io/jvd/portal/#snips)
  on the JVD Portal. Browse by JVD, technology, or use case
  (Service Provider / Metro / Business Services / MEF); each
  snip page renders the body with syntax highlighting and
  resolves `Pair with` links to other MaaS snips.

### What this means for you

- If you're deploying Metro Ethernet services on Juniper MX or
  ACX platforms, start from the new
  [MaaS snip library](service_provider/metro_as_a_service/configuration/snips/).
  Each `services/` template lists exactly which `interfaces/`,
  `firewall/`, and `cos/` snips must coexist on the same device,
  so you can assemble a working configuration without
  cross-referencing the full source captures.
- Junos and EVO templates live in sibling paths under
  `junos/` and `evo/`, making it easy to compare the two OSes
  for the same service shape (e.g. EVPN-FXC, l2circuit, EVPN
  E-LAN) and pick the right one for your platform.
- The library covers six MEF service families end-to-end —
  E-Line (EPL, EVPL), E-LAN (EP-LAN, EVP-LAN), E-Tree
  (EP-Tree, EVP-Tree), and E-Access — including less-common
  patterns like EVPN E-LAN Type-5, EVPN E-Tree, L2VPN
  Kompella, and pseudowire-headend-termination via
  `l2circuit-floating-pw`.

---

### By the numbers

<details>
<summary>Per-area changes</summary>

| Area / JVD | Added | Modified |
| --- | ---: | ---: |
| `service_provider/metro_as_a_service/configuration/snips` | 114 | 0 |
| `service_provider/metro_as_a_service/configuration/conf` | 0 | 10 |
| `portal` (snip browser wiring) | 0 | 4 |
| **TOTAL** | **114** | **14** |

</details>

<details>
<summary>Net lines added</summary>

| Area | Lines added |
| --- | ---: |
| Junos templates (`junos/`) | 3,132 |
| EVO templates (`evo/`) | 3,417 |
| Documentation (`_variables.md` + `README.md`) | 282 |
| **Total** | **6,831** |

</details>

<details>
<summary>MaaS snip-library content breakdown</summary>

| Content | Files | Lines |
| --- | ---: | ---: |
| Junos templates (6 categories) | 50 | 3,132 |
| EVO templates (6 categories) | 62 | 3,417 |
| Variables glossary (`_variables.md`) | 1 | 59 |
| Snip-library `README.md` | 1 | 223 |
| **Total** | **114** | **6,831** |

</details>

<details>
<summary>MaaS snips by OS and category</summary>

| Category | Junos | EVO |
| --- | ---: | ---: |
| `services` | 12 | 20 |
| `interfaces` | 16 | 25 |
| `firewall` | 10 | 6 |
| `cos` | 9 | 7 |
| `policy` | 2 | 3 |
| `apply-groups` | 1 | 1 |
| **Total** | **50** | **62** |

</details>

---

## 2026-05-21

Three JVDs gain full config-snippet libraries this week: the 3-Stage
EVPN/VXLAN Data Center design (53 templates) covering Apstra-generated
eBGP CLOS underlay/overlay, ERB multi-tenancy, ESI LAG, and MAC-VRF;
the Enterprise WAN Finance & Stock Exchange design (38 templates)
covering NG-MVPN, EVPN active/standby, and TWAMP monitoring; and the
Advanced Core & Edge design (50 templates) covering Segment Routing,
LDP/SR coexistence, EVPN VPWS/ELAN/VRF services, CFM SLA monitoring,
and DDoS flowspec.

### New content

- **Enterprise WAN Finance template library** — 38 reusable templates
  for the [`ewan_finance`](enterprise_wan/ewan_finance/) JVD,
  organized under
  [`configuration/snips/`](enterprise_wan/ewan_finance/configuration/snips/)
  with dual Junos and EVO trees across 9 categories:
  `bootstrap/` (chassis, aggregated-devices, tunnel-services),
  `interfaces/` (ESI LAG, IRB gateway, flexible-vlan, loopback,
  VLAN bridge-domain),
  `transport/` (iBGP inet-mvpn mesh, MPLS P2MP LSP, OSPF-TE
  node-protection, RSVP signaling),
  `policy/` (protocol redistribution, route-filter MED),
  `cos/` (4-class EXP with strict-high LLQ for stock-exchange traffic),
  `firewall/` (multicast forwarding-cache filter with CoS marking),
  `oam/` (LLDP, TWAMP server, TWAMP client),
  `services/` (NG-MVPN SPT-only with hot-root-standby, EVPN
  virtual-switch ESI, L3VPN VRF, virtual-router with PIM),
  and `multicast/` (forwarding-options resolve/mismatch rate tuning).
  Each template carries the standard five-section header and a
  [`_variables.md`](enterprise_wan/ewan_finance/configuration/snips/_variables.md)
  glossary defines all ~80 parameters. A
  [`README.md`](enterprise_wan/ewan_finance/configuration/snips/README.md)
  documents the MX/ACX/PTX platform split, sibling pairs, and key
  design patterns.

- **Enterprise WAN Advanced Core & Edge template library** — 50 reusable
  templates for the
  [`ewan_adv_core_edge`](enterprise_wan/ewan_adv_core_edge/) JVD,
  organized under
  [`configuration/snips/`](enterprise_wan/ewan_adv_core_edge/configuration/snips/)
  with dual Junos and EVO trees across 9 categories:
  `bootstrap/` (chassis network-services enhanced-ip),
  `interfaces/` (LAG flexible-services, CCC VPWS mux, IRB gateway,
  physical-uplink MPLS, loopback),
  `transport/` (iBGP EVPN, OSPF SR+LFA, MPLS LSP, RSVP-TE,
  LDP/SR coexistence, SR Mapping Server, forwarding-options hash),
  `policy/` (per-packet load-balance),
  `cos/` (DSCP/EXP/802.1p classifiers, forwarding-class map,
  EXP rewrite rules),
  `firewall/` (IPv4 stateless filter),
  `oam/` (CFM maintenance-domain, CFM SLA iterator),
  `services/` (EVPN VPWS simple + FXC, EVPN ELAN simple + bridged,
  EVPN VRF IP-prefix, MAC-VRF ELAN),
  and `ddos-mitigation/` (BGP flowspec routes).
  A [`_variables.md`](enterprise_wan/ewan_adv_core_edge/configuration/snips/_variables.md)
  glossary and
  [`README.md`](enterprise_wan/ewan_adv_core_edge/configuration/snips/README.md)
  document the platform split and sibling pairs.

- **3-Stage EVPN/VXLAN Data Center template library** — 53 reusable
  templates for the
  [`3stage_dc`](data_center/adc/3stage_dc/) JVD,
  organized under
  [`configuration/snips/`](data_center/adc/3stage_dc/configuration/snips/)
  with dual Junos and EVO trees across 6 categories:
  `bootstrap/` (chassis port-speed, Apstra gRPC certificate),
  `interfaces/` (fabric uplinks, loopback, IRB anycast gateway,
  ESI LAG, trunk access ports, VLAN-VXLAN domain, external VLAN),
  `transport/` (eBGP underlay, eBGP EVPN overlay, ECMP/CCN,
  EVPN-VXLAN shared-tunnels),
  `policy/` (AOS export, loop-prevention filters, community
  definitions, route-filter-lists, external import/export),
  `services/` (VRF with EVPN ip-prefix-routes + DHCP relay,
  MAC-VRF vlan-aware),
  and `oam/` (LLDP, sFlow, RSTP, L2-learning telemetry, RA).
  All configs are Juniper Apstra-generated. A
  [`_variables.md`](data_center/adc/3stage_dc/configuration/snips/_variables.md)
  glossary and
  [`README.md`](data_center/adc/3stage_dc/configuration/snips/README.md)
  document the QFX5120/QFX5220/QFX5130 platform split, OS differences,
  and deployment ordering.

- **New snip categories: `multicast/` and `ddos-mitigation/`** —
  `multicast/` covers forwarding-options tuning (resolve-rate,
  mismatch-rate); `ddos-mitigation/` covers BGP flowspec route
  injection for volumetric attack mitigation.

### What this means for you

- If you're deploying NG-MVPN for finance or stock-exchange multicast
  on MX/PTX/ACX platforms, start from the new
  [ewan_finance template library](enterprise_wan/ewan_finance/configuration/snips/).
  The 13 Junos↔EVO sibling pairs let you reference whichever OS you're
  running without cross-tree lookups.
- For advanced MPLS/SR WAN designs with EVPN services (VPWS, ELAN,
  VRF), the [ewan_adv_core_edge template library](enterprise_wan/ewan_adv_core_edge/configuration/snips/)
  gives you 24 Junos↔EVO sibling pairs plus CFM SLA monitoring and
  DDoS flowspec patterns.
- The MVPN instance template
  (`junos/services/mvpn-instance.conf`) captures the full hot-root-standby
  SPT-only pattern — a complex config that's easy to get wrong from scratch.
- For EVPN/VXLAN data center fabrics managed by Apstra, the
  [3stage_dc template library](data_center/adc/3stage_dc/configuration/snips/)
  documents all generated patterns across 5 QFX platforms — useful as
  quick-reference or for understanding what Apstra produces.
- Browse the new templates at the
  [JVD Portal Snip Library](https://juniper.github.io/jvd/portal/#snips),
  filtered by Data Center or Enterprise WAN.

---

### By the numbers

<details>
<summary>Per-area changes</summary>

| Area / JVD | Added | Modified | READMEs |
| --- | ---: | ---: | ---: |
| `data_center/adc/3stage_dc` | 55 | 0 | 1 |
| `enterprise_wan/ewan_finance` | 40 | 0 | 1 |
| `enterprise_wan/ewan_adv_core_edge` | 50 | 0 | 1 |
| `portal/src/data` | 0 | 1 | 0 |
| **TOTAL** | **145** | **1** | **3** |

</details>

<details>
<summary>Net lines added by area</summary>

| Area | Lines added | Net |
| --- | ---: | ---: |
| Junos templates (`junos/`) | 3,637 | +3,637 |
| EVO templates (`evo/`) | 2,859 | +2,859 |
| Documentation (`_variables.md` + `README.md`) | 675 | +675 |
| **Total** | **7,171** | **+7,171** |

</details>

<details>
<summary>ewan_finance content breakdown</summary>

| Content | Files | Lines |
| --- | ---: | ---: |
| Junos templates (9 categories) | 22 | ~1,147 |
| EVO templates (7 categories) | 16 | ~765 |
| Variables glossary (`_variables.md`) | 1 | ~180 |
| Snip-library `README.md` | 1 | ~167 |
| **Total** | **40** | **2,259** |

</details>

<details>
<summary>ewan_adv_core_edge content breakdown</summary>

| Content | Files | Lines |
| --- | ---: | ---: |
| Junos templates (9 categories) | 25 | ~1,204 |
| EVO templates (9 categories) | 24 | ~1,063 |
| Variables glossary (`_variables.md`) | 1 | ~160 |
| Snip-library `README.md` | 1 | ~160 |
| **Total** | **50** | **2,427** |

</details>

<details>
<summary>3stage_dc content breakdown</summary>

| Content | Files | Lines |
| --- | ---: | ---: |
| Junos templates (6 categories) | 29 | ~1,286 |
| EVO templates (6 categories) | 24 | ~1,031 |
| Variables glossary (`_variables.md`) | 1 | ~100 |
| Snip-library `README.md` | 1 | ~68 |
| **Total** | **55** | **2,485** |

</details>

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
