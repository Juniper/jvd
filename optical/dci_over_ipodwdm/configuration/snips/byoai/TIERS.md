# Configuration form tiers

<!-- GENERATED FROM configuration/snips/_composition.json by the build tooling (generate-tiers). Do not edit by hand: run `JVD_REPO=<checkout> npm run tiers -- --jvd optical/dci_over_ipodwdm`. -->

This file tells the assistant which snippet files to include for each service
form at each tier. It is generated from the composition matrix, so every path
below resolves to a real snippet and every device listed is one the form is
validated on.

## What the tiers mean

| Tier | What it includes |
|---|---|
| `minimum` | Only the service construct. Assumes the device already runs the underlay and the overlay the service needs. |
| `self-contained` | Everything the emitted configuration names, resolved recursively for the target device. |
| `as-deployed` | The self-contained set plus the validated baselines this JVD runs on that device. |

A tier never implies that a larger closure is a minimal protocol requirement.
If a form's overlay, variant or dependency cannot be resolved for the target
device, the request fails closed: say so and generate nothing for it.

---

## L3VPN VRF with an eBGP session to the CE

Family l3vpn, form l3vpn-ebgp-vrf. OS mode MIXED. Attachment: VLAN-tagged IPv4 unit on the customer-facing port; one of the 100 VPNv4 instances carried over the DWDM core.

### dci1_ptx10001-36mr (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-l3vpn-ebgp-local-as-vrf-target.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL

### dci3_acx7100-48l (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-l3vpn-ebgp-local-as-vrf-target.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL

### dci2_mx304 (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-l3vpn-ebgp-local-as-vrf-target.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL

---
