# Configuration Form Tiers — Metro-as-a-Service

This file is part of the [BYOAI](README.md) corpus. Once
[`CATALOG.md`](CATALOG.md) has resolved the funnel to a service snip +
attachment-circuit interface snip + UNI firewall filter, this file
tells the AI which **additional** snips to add for the chosen verbosity
tier. Bundled into [`jvd-maas-snips.md`](jvd-maas-snips.md) by
`regenerate-bundle.sh`.

Use the OS-appropriate file under `junos/` or `evo/`. Include ONLY the
snips for the chosen tier — and ONLY those — unless the user asks for more.

---

## What the tiers mean

| Tier | Chosen when | What's included |
|---|---|---|
| **`minimum`** | User answered CoS = `no`, or asked for "just the service". | Service routing-instance (from CATALOG) + attachment-circuit interface (from CATALOG). **Nothing else.** |
| **`with-cos`** | User answered CoS = `yes` (default for most asks). | `minimum` + CoS binding + the UNI firewall filter for the chosen color mode (from CATALOG). |
| **`as-deployed`** | Greenfield turn-up, "full example", "as deployed". | `with-cos` + forwarding-classes + schedulers + scheduler-map + the MEF apply-group baseline. Mirrors what the JVD validates end-to-end. |

> The base service always assumes the PE already has a working IGP/MPLS
> transport underlay and BGP overlay (`family evpn` / `family l2vpn`
> signaling). This JVD's snip library scopes the SERVICE layer; transport
> and overlay are JVD-wide constants, not per-service snips. If you are
> unsure the overlay address-family is active on the PE, say so in Notes.

---

## `minimum`

- Service snip(s) — from CATALOG.md for the resolved deployment.
- Attachment-circuit interface snip — from CATALOG.md (apply the
  homing / vlan-manipulation variant rules).

That's it. No CoS, no firewall filter, no apply-groups.

---

## `with-cos` (= `minimum` +)

Add the CoS binding set for the target OS:

- `cos/classifiers.conf`
- `cos/cos-binding-ieee8021p.conf`
- `cos/rewrite-rules.conf`
- `cos/cos-binding-mpls.conf` — **E-Access / LSW services only** (label-
  based hand-off). Skip for E-Line / E-LAN / E-Tree unless the pair-with
  header of the chosen service snip lists it.

Add the UNI firewall filter for the chosen color mode (from CATALOG.md):

- color-blind → `firewall/filter-*-color-blind*.conf`
- color-aware → `firewall/filter-*-color-aware*.conf` (Junos)

Pick the `-l2cp` filter variant for port-based (EPL / EP-LAN) services
and the `-cf0` variant for the Junos bridge-domain E-Access hand-off,
matching the pair-with header of the chosen service snip.

---

## `as-deployed` (= `with-cos` +)

Add the full JVD CoS + apply-group baseline:

- `cos/forwarding-classes.conf`
- `cos/schedulers.conf`
  - Junos: use `cos/schedulers.conf`; the AN1 access-node variant is
    `cos/schedulers-an1.conf`; legacy ACX5xxx is `cos/schedulers-legacy-acx.conf`.
- `cos/scheduler-map.conf`
- Apply-group baseline:
  - Junos → `apply-groups/mef-testing.conf`
  - EVO → `apply-groups/mef-forwarding-profile.conf`
- Routing policy (L3 / Type-5 and RT-export-tagged services only):
  - `policy/policy-l3vpn-import-export.conf` (EVPN-ELAN Type-5 / IRB)
  - `policy/policy-vpn-rt-export-gold.conf` or `-bronze.conf` (color /
    priority-tagged RT export, when the service snip references
    `vrf-export $POLICY_NAME`)

> **Greenfield / bootstrap** requests ("build a new access node",
> "full working example") are always treated as **`as-deployed`**
> regardless of the CoS answer.

---

## Quick reference — snips added per tier

```
minimum      = service + AC interface
with-cos     = minimum
             + cos/classifiers + cos/cos-binding-ieee8021p + cos/rewrite-rules
             [+ cos/cos-binding-mpls   (E-Access/LSW only)]
             + firewall/filter-<fam>-<colormode>[-l2cp|-cf0]
as-deployed  = with-cos
             + cos/forwarding-classes + cos/schedulers + cos/scheduler-map
             + apply-groups/mef-testing (Junos) | mef-forwarding-profile (EVO)
             [+ policy/*                (Type-5 / RT-export services)]
```
