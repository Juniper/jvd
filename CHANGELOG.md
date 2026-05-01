# JVD Repository Changelog

Release notes for the Juniper Validated Design (JVD) configuration repository.

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
