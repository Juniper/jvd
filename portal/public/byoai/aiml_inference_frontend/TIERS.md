# Configuration form tiers

<!-- GENERATED FROM configuration/snips/_composition.json by the build tooling (generate-tiers). Do not edit by hand: run `JVD_REPO=<checkout> npm run tiers -- --jvd data_center/aidc/aiml_inference_frontend`. -->

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

## Frontend cluster VLAN with an IRB gateway

Family irb, form frontend-cluster-vlan-irb. OS mode EVO. Attachment: Access trunk unit carrying the VLAN toward the inference servers or client hosts, and the IRB unit that is the VLAN's Layer 3 gateway..

### leaf1_qfx5130-32cd (evo)

- `minimum`: `evo/vlans/vlan-description-vlan-id-l3-interface.conf`
- `self-contained`: the above — it names nothing further
- `as-deployed`: the self-contained set plus the other snippets validated on this device.

### leaf2_qfx5130-32cd (evo)

- `minimum`: `evo/vlans/vlan-description-vlan-id-l3-interface.conf`
- `self-contained`: the above — it names nothing further
- `as-deployed`: the self-contained set plus the other snippets validated on this device.

### leaf3_qfx5130-32cd (evo)

- `minimum`: `evo/vlans/vlan-description-vlan-id-l3-interface.conf`
- `self-contained`: the above — it names nothing further
- `as-deployed`: the self-contained set plus the other snippets validated on this device.

### leaf4_qfx5130-32cd (evo)

- `minimum`: `evo/vlans/vlan-description-vlan-id-l3-interface.conf`
- `self-contained`: the above — it names nothing further
- `as-deployed`: the self-contained set plus the other snippets validated on this device.

---
