# JVD Documentation (markdown corpus)

This folder holds the **markdown conversion of the Juniper Validated Design
guides** — the design narrative behind each JVD: topology, platform matrix,
scale ceilings, service catalog, design rationale, and validation results.

## Why it exists

The portal's **Design & Planner** (the BYOAI surface) answers design and
planning questions — *"which JVD fits my requirements," "will it scale," "how do
I adapt design X."* Those answers must be **grounded in the validated designs**,
not improvised. This corpus is that ground truth: the AI is pointed at the
markdown here (plus the per-JVD snip libraries) and cites it.

Source of truth remains the published guides on
[juniper.net](https://www.juniper.net/documentation/validated-designs/); the
markdown here is a faithful, diffable, machine-readable mirror.

## Layout

Mirrors the repository's JVD paths so a JVD's docs sit next to its configs and
snips conceptually:

```
Documentation/
  <area>/<jvd>/
    overview.md         # what the design is + when to use it
    topology.md         # roles, platforms, physical/logical topology
    services.md         # the service catalog the design validates
    scale.md            # tested scale ceilings + caveats
    validation.md       # what was tested and the results
```

Example: `Documentation/service_provider/metro_as_a_service/overview.md`.

## Status — pilot first

Converting the whole JVD library is a sustained content effort, so it is being
proven on **one JVD before scaling**:

1. **Pilot — Metro-as-a-Service (MaaS):** convert the guide, wire the Design &
   Planner to read it, validate the design-QA value.
2. **Scale:** Metro Ethernet Business Services (MEBS) next, then the rest.

## Notes

- Public repo: the source guides are already public on juniper.net, so this
  content is not sensitive. It is simply not linked from the portal nav
  (unlisted) to keep the site focused on the four tool surfaces.
- Keep entries faithful to the published guide — do not invent scale numbers or
  design claims. When unsure, link back to the source guide instead.
