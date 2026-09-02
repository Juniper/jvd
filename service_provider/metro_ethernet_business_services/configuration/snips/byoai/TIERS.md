# Configuration Form Tiers

This file is part of the [BYOAI](README.md) corpus. It tells the AI which snippet files to include for each service kind at each verbosity tier. It is bundled into [`jvd-mebs-snips.md`](jvd-mebs-snips.md) by `regenerate-bundle.sh`.

For each service kind, the AI includes ONLY the snips listed for the chosen tier — and ONLY those — unless the user explicitly asks for more. Use the OS-appropriate file under `junos/` or `evo/`.

---

## What the tiers mean

| Tier | Use when | What's included |
|---|---|---|
| **`minimum`** | Brownfield change. PE already has working IGP/SR underlay AND the BGP overlay signalling the service needs. You just want the new service. | Service routing-instance + AC interface unit + per-VRF policy (L3VPN only). **Nothing else.** |
| **`with-overlay`** | Brownfield-ish. PE has working IGP/SR underlay but you also want to (re)assert the deployed BGP overlay. | `minimum` + the OS-native `transport/bgp-overlay.conf`, **subject to the coverage gate below**. |
| **`as-deployed`** | Greenfield turn-up, lab build, or "give me a working example end-to-end." Mirrors what the JVD validates. | Everything: service + AC + policy + BGP overlay + IGP/SR underlay + apply-group baselines + CoS + OAM + FAT-PW + BGP-CT — **subject to the coverage gate below**. |

> **Greenfield / bootstrap requests** (e.g. "build a new ACX7024 turn-up", "bootstrap a new MX304 PE end-to-end") are always treated as **`as-deployed`** regardless of the user's tier choice.

If the user picks `minimum` and the AI cannot tell whether the overlay activation for the needed address-family is already on the PE, it should call that out in the `Notes:` section ("assumed `family evpn signaling` already configured under `protocols bgp group …`").

### BGP-overlay coverage gate (canonical — every service section refers here)

`transport/bgp-overlay.conf` is **not** a universal per-service prerequisite. Each deployed
iBGP overlay is captured as an OS-native **member of the `mebs-bgp-overlay` variant group**:
the shared `transport/bgp-overlay.conf` still serves the devices listed in its own `Seen on:`,
while device- or role-specific forms use qualified filenames. Every overlay member declares,
via its `Provides:` line, exactly the overlay address-families that device's role runs
(`evpn`, `l2vpn`, `inet-vpn`, `inet6-vpn`, `labeled-unicast`).

Every service section states only its **required signalling family** and points here. Each
service consumer carries a single directed requirement `variant:mebs-bgp-overlay
families=<family>` in its `Pair with:`. The overlay form is **resolved deterministically per
device** — never enumerated by name:

> **Resolve** the overlay for a (target device, target OS, service family) as the **unique**
> member of `mebs-bgp-overlay` such that (a) the member is **native to the target OS**, (b) the
> target device is in that member's exact `Seen on:`, and (c) the member's `Provides:`
> **includes the service family** (all requested families, atomically).

Rules (a service section states only its signalling classification and points here):

1. **`with-overlay`** attaches the resolved overlay member **only when ALL of these hold**:
   (a) the **selected service applies to the target device** — the target is in that service
   snip's exact `Seen on:`; and (b) **exactly one** overlay member resolves per the rule above.
   **Fail closed:** if **zero** members resolve (no deployed overlay form for that device +
   family) or **more than one** resolves, the requested `with-overlay` (or `as-deployed`)
   overlay is **unavailable** — so **generate nothing for it**. You may then offer `minimum` as
   a **separate alternative the user must explicitly confirm**, making clear that `minimum` is
   local-service configuration only and does **not** provide the unavailable remote BGP
   signalling. An **inapplicable** service/device selection (target not in the service's
   `Seen on:`) is **rejected**, not downgraded. **Never** synthesize, generalise, substitute,
   or borrow the other OS form.
2. **The resolved member is always the target device's own role form.** Because the family is
   matched against each member's `Provides:`, a device is never given another role's overlay —
   a mismatched family simply yields zero resolutions and fails closed.
3. **LDP-signalled services never add a BGP overlay** (L2Circuit floating-pw / hot-standby /
   local-switching, LDP-VPLS) — they carry no `variant:` requirement and rely on targeted LDP.
4. **`as-deployed`** includes the BGP overlay under the **same resolution and fail-closed rule**
   as `with-overlay`. For a **BGP-signalled service** (one carrying a `variant:mebs-bgp-overlay`
   requirement), **zero** overlay resolutions means the requested `with-overlay` / `as-deployed`
   form is **unavailable** and **fails closed** — **generate nothing for it** (exactly as rule 1);
   do **not** silently omit the overlay and emit the rest of the baseline. Devices with **no
   top-level deployed BGP group in source** (e.g. **ag1-1_acx7100-32c, ag1-2_acx7100-32c,
   ma2_mx204**) have **no overlay member**, so any BGP-signalled service targeting them fails
   closed on this rule. For any device, do **not** claim a complete `as-deployed` form unless
   every other required form is also validated.

---

## EVPN-VPWS

**minimum** (just the service)
- `services/evpn-vpws.conf`
- `interfaces/lag-esi-multihoming.conf` (multi-homed) **OR** `interfaces/edge-vlan-normalization.conf` (single-homed)

**with-overlay** — Signalling: **EVPN** (`family evpn signaling`). BGP overlay **applies** — attach the OS-native `transport/bgp-overlay.conf` per the **BGP-overlay coverage gate** above. If no exact same-OS overlay form applies to the target, this mode is **unavailable** (fail closed) — see the gate.

**as-deployed** (= with-overlay +)
- `transport/isis-srmpls-tilfa.conf`
- `transport/mpls-segment-routing.conf`
- `apply-groups/gr-edge-intf-mh.conf` (or `gr-edge-intf.conf` if SH)
- `apply-groups/gr-core-intf.conf`
- `apply-groups/gr-isis-bcp.conf`
- `apply-groups/gr-bgp-bcp.conf`
- `apply-groups/gr-isis-bfd.conf` (EVO only — MX PEs configure BFD inline under `protocols isis interface`)
- `apply-groups/gr-lag-member.conf`
- `apply-groups/gr-fatpw-lb.conf`
- `apply-groups/gr-fatpw-label.conf`
- `policy/communities.conf` (BGP-CT color communities)
- `cos/forwarding-classes.conf`
- `cos/schedulers.conf`
- `oam/oam-cfm-perf-mon.conf`
- `firewall/policers.conf`

---

## L3VPN (PE-CE eBGP or PE-CE OSPF)

Two PE-CE protocol variants — pick the snip that matches what the
user asked for (default to eBGP if unspecified):

- **L3VPN with PE-CE eBGP** (`as-override`):
  - `services/l3vpn-bgp.conf` (Junos and EVO)
- **L3VPN with PE-CE OSPF** (area 0, `interface-type p2p`):
  - `services/l3vpn-ospf.conf` (Junos and EVO)

**minimum** (just the service + per-VRF policy)
- `services/l3vpn-bgp.conf` **or** `services/l3vpn-ospf.conf`
- `policy/l3vpn-export-import.conf`
- `policy/communities.conf` (only the per-VRF target community — NOT topology tags or BGP-CT colors)
- `interfaces/edge-vlan-normalization.conf` (PE-CE AC unit)

**with-overlay** — Signalling: **inet-vpn** (`family inet-vpn unicast`). BGP overlay **applies** — attach the OS-native `transport/bgp-overlay.conf` per the **BGP-overlay coverage gate** above. If no exact same-OS overlay form applies to the target, this mode is **unavailable** (fail closed) — see the gate.

**as-deployed** (= with-overlay +)
- `transport/isis-srmpls-tilfa.conf`
- `transport/mpls-segment-routing.conf`
- `apply-groups/gr-l3vpn.conf`
- `apply-groups/gr-edge-intf.conf` (or `-mh.conf` if multi-homed CE)
- `apply-groups/gr-core-intf.conf`
- `apply-groups/gr-isis-bcp.conf`
- `apply-groups/gr-bgp-bcp.conf`
- `apply-groups/gr-isis-bfd.conf` (EVO only — MX PEs configure BFD inline under `protocols isis interface`)
- `apply-groups/gr-lag-member.conf`
- `cos/forwarding-classes.conf`
- `cos/schedulers.conf`
- `firewall/policers.conf`
- `policy/communities.conf` (full set incl. BGP-CT colors)

---

## EVPN-ELAN (mac-vrf, mac-vrf-irb, vlan-based, or port-based)

**minimum** (just the service)
- `evo/services/evpn-elan-mac-vrf.conf` (EVO) **or**
  `junos/services/evpn-elan-vlan-based.conf` (Junos MX) — or the
  `-irb.conf` / `evpn-elan-vlan-based-gold.conf` variant, whichever flavor was requested
- `interfaces/lag-esi-multihoming.conf` (multi-homed) **OR** `interfaces/edge-vlan-normalization.conf` (single-homed)

**with-overlay** — Signalling: **EVPN** (`family evpn signaling`). BGP overlay **applies** — attach the OS-native `transport/bgp-overlay.conf` per the **BGP-overlay coverage gate** above. If no exact same-OS overlay form applies to the target, this mode is **unavailable** (fail closed) — see the gate.

**as-deployed** (= with-overlay +)
- `transport/isis-srmpls-tilfa.conf`
- `transport/mpls-segment-routing.conf`
- `apply-groups/gr-edge-intf-mh.conf`
- `apply-groups/gr-core-intf.conf`
- `apply-groups/gr-isis-bcp.conf`
- `apply-groups/gr-bgp-bcp.conf`
- `apply-groups/gr-isis-bfd.conf` (EVO only — MX PEs configure BFD inline under `protocols isis interface`)
- `apply-groups/gr-lag-member.conf`
- `apply-groups/gr-fatpw-lb.conf`
- `apply-groups/gr-fatpw-label.conf`
- `policy/communities.conf`
- `cos/forwarding-classes.conf`
- `cos/schedulers.conf`
- `oam/oam-cfm-perf-mon.conf`
- `firewall/policers.conf`

---

## EVPN Type-5 / IP-prefix VRFs

In this JVD, EVPN Type-5 is ALWAYS deployed paired with an EVPN-ELAN-IRB on the same `irb.<N>`: the MAC-VRF advertises RT-2 (MAC+IP from learned hosts), and the VRF with `protocols evpn ip-prefix-routes` advertises RT-5 (the IRB subnet, silent-host /32s, and any VRF static/learned prefixes). "Pure" RT-5 (VRF only, no MAC-VRF) is not a deployed pattern here. Therefore EVERY tier below includes BOTH the L2 (ELAN-IRB) and L3 (Type-5 VRF) snips. The two instances must reference the same `irb.<N>`.

**minimum** (both halves of the service + per-VRF policy)
- L2 / RT-2 half (one of):
    - `evo/services/evpn-elan-mac-vrf-irb.conf` (EVO — MAC-VRF with `l3-interface irb.<N>`)
    - `junos/services/evpn-elan-virtual-switch-irb.conf` (Junos MX — virtual-switch with `routing-interface irb.<N>`)
- `services/evpn-type5.conf`              (the L3 / RT-5 half — VRF with `interface irb.<N>` and `protocols evpn ip-prefix-routes`)
- `policy/l3vpn-export-import.conf`
- `policy/communities.conf` (only the per-VRF target community)
- `interfaces/edge-vlan-normalization.conf` (the AC interface that lands in the MAC-VRF's bridge-domain)

**with-overlay** — Signalling: **EVPN** (`family evpn signaling`). BGP overlay **applies** — attach the OS-native `transport/bgp-overlay.conf` per the **BGP-overlay coverage gate** above. If no exact same-OS overlay form applies to the target, this mode is **unavailable** (fail closed) — see the gate.

**as-deployed** (= with-overlay +)
- `transport/isis-srmpls-tilfa.conf`
- `transport/mpls-segment-routing.conf`
- `apply-groups/gr-l3vpn.conf`
- `apply-groups/gr-edge-intf-mh.conf`
- `apply-groups/gr-core-intf.conf`
- `apply-groups/gr-isis-bcp.conf`
- `apply-groups/gr-bgp-bcp.conf`
- `apply-groups/gr-isis-bfd.conf` (EVO only — MX PEs configure BFD inline under `protocols isis interface`)
- `apply-groups/gr-lag-member.conf`
- `cos/forwarding-classes.conf`
- `cos/schedulers.conf`
- `firewall/policers.conf`
- `policy/communities.conf` (full set)

---

## L2CIRCUIT (including hot-standby)

> **OS scope:** L2Circuit hot-standby with `backup-neighbor` is
> deployed only on EVO ACX PEs in this JVD. Junos MX PEs carry
> static L2Circuit pseudowires via `services/l2circuit-floating-pw.conf`
> instead — do NOT offer hot-standby as a Junos option here.

**minimum** (just the service)
- `evo/services/l2circuit-hsb-hub.conf` (Hub — EVO only)
- `evo/services/l2circuit-hsb-pe.conf` (Primary/Backup PE — EVO only)
- `evo/interfaces/edge-vlan-normalization.conf`

**with-overlay** — Signalling: **LDP** (targeted pseudowire, incl. hot-standby `backup-neighbor`). **No BGP overlay** — L2Circuit relies on targeted LDP, not BGP (see the **BGP-overlay coverage gate** above, rule 3).

**as-deployed** (= with-overlay +)
- `transport/isis-srmpls-tilfa.conf`
- `transport/mpls-segment-routing.conf`
- `apply-groups/gr-edge-intf.conf`
- `apply-groups/gr-core-intf.conf`
- `apply-groups/gr-isis-bcp.conf`
- `apply-groups/gr-bgp-bcp.conf`
- `apply-groups/gr-isis-bfd.conf` (EVO only — MX PEs configure BFD inline under `protocols isis interface`)
- `apply-groups/gr-l2ckt-hs.conf` (EVO only)
- `apply-groups/gr-fatpw-lb.conf`
- `apply-groups/gr-fatpw-label.conf`
- `policy/communities.conf`
- `cos/forwarding-classes.conf`
- `cos/schedulers.conf`
- `oam/oam-cfm-perf-mon.conf`
- `firewall/policers.conf`

---

## L2VPN family (Kompella L2VPN, BGP-VPLS, LDP-VPLS)

Three distinct services, all using the BGP `family l2vpn signaling`
overlay (Kompella L2VPN and BGP-VPLS) or LDP targeted sessions
(LDP-VPLS). Pick the right snip:

- **Kompella L2VPN** (point-to-point pseudowire, RFC 4761):
  - `services/l2vpn-kompella.conf` (Junos and EVO).
  - Identifier: `instance-type l2vpn` + `protocols l2vpn { site … }`
    with both `site-identifier` and `remote-site-id`.
- **BGP-VPLS** (multipoint VPLS via BGP NLRI, RFC 4761):
  - `junos/services/bgp-vpls.conf` (Junos PEs only in this JVD).
  - Identifier: `instance-type virtual-switch` + `protocols vpls`
    with `site $NAME { site-identifier $ID; }` (no `vpls-id`).
- **LDP-VPLS** (multipoint VPLS via LDP targeted sessions, RFC 4762):
  - `evo/services/ldp-vpls.conf` (EVO PEs only in this JVD).
  - Identifier: `instance-type virtual-switch` + `protocols vpls`
    with `vpls-id $ID` + `neighbor $REMOTE_PE` (no `site` block).
  - Note: LDP-VPLS-with-BGP-auto-discovery (`l2vpn-id` form) is
    NOT deployed in this JVD.

Tiers (apply to whichever of the three the user asked for):

- **minimum** = `services/<topic>.conf` + AC interface snip
- **with-overlay** — Signalling: **L2VPN** (`family l2vpn signaling`) for Kompella L2VPN and BGP-VPLS; **LDP** targeted sessions for LDP-VPLS. BGP overlay **applies to Kompella L2VPN and BGP-VPLS only** (LDP-VPLS adds none); attach it per the **BGP-overlay coverage gate** above.
- **as-deployed** = + transport underlay + full apply-group baseline
  + CoS + OAM + BGP-CT

---

## EVPN-FXC (Flexible Cross-Connect)

EVPN-FXC bundles multiple VLAN-tagged UNIs under a single
`evpn-vpws` routing-instance via an FXC collector group. Use this
when the customer hands off many service-delimited VLANs on the
same port and you want one PW per VLAN without one routing-instance
per VLAN.

**minimum** (just the service)
- `services/evpn-fxc.conf` (Junos and EVO — `instance-type evpn-vpws` with `flexible-cross-connect`)
- `junos/interfaces/edge-vlan-normalization.conf` (the per-VLAN AC units that join the FXC group)

**with-overlay** — Signalling: **EVPN** (`family evpn signaling`). BGP overlay **applies** — attach the OS-native `transport/bgp-overlay.conf` per the **BGP-overlay coverage gate** above. If no exact same-OS overlay form applies to the target, this mode is **unavailable** (fail closed) — see the gate.

**as-deployed** (= with-overlay +)
- same baseline as EVPN-VPWS above (transport + apply-groups + CoS + OAM + FAT-PW)

---

## EVPN E-Tree

MEF E-Tree (root / leaf isolation) on a Junos `mac-vrf` with
`etree-ac-role` on each UNI. Junos-only in this JVD.

**minimum** (just the service)
- `junos/services/evpn-etree.conf`
- `junos/interfaces/ethernet-bridge.conf` (E-Tree leaf/root UNI)

**with-overlay** — Signalling: **EVPN** (`family evpn signaling`). BGP overlay **applies** — attach the OS-native `transport/bgp-overlay.conf` per the **BGP-overlay coverage gate** above. If no exact same-OS overlay form applies to the target, this mode is **unavailable** (fail closed) — see the gate.

**as-deployed** (= with-overlay +)
- same baseline as EVPN-ELAN above

---

## L2Circuit floating pseudowire

Static-label L2Circuit pseudowire landing on a `ps<N>`
pseudowire-subscriber anchor (decouples the PW from a physical AC).

**minimum** (just the service)
- **L2Circuit floating pseudowire** (Junos MX `ps<N>` head; EVO ACX vlan-ccc tail):
  - `junos/services/l2circuit-floating-pw.conf` (Junos PEs)
  - `evo/interfaces/edge-vlan-normalization.conf` (EVO ACX tail — customer-facing AC unit)
- `junos/interfaces/pseudowire-subscriber.conf` (the `ps<N>` anchor)

**with-overlay** — Signalling: **LDP** (static-label pseudowire). **No BGP overlay** — L2Circuit floating pseudowires ride targeted LDP, not BGP (see the **BGP-overlay coverage gate** above, rule 3).

**as-deployed** (= with-overlay +)
- same baseline as L2CIRCUIT above

---

## L2Circuit local-switching (cross-connect on one PE)

Port-to-port hairpin on a single PE via `end-interface`. EVO-only
in this JVD.

**minimum** (just the service)
- `evo/services/l2circuit-lsw.conf`
- `interfaces/edge-vlan-normalization.conf` (both AC units that get cross-connected)

**with-overlay** — Signalling: **none** (single-PE local cross-connect). **No BGP overlay** — not applicable (see the **BGP-overlay coverage gate** above, rule 3).

**as-deployed** (= minimum +)
- transport underlay + edge apply-groups + CoS + OAM + firewall policers

---

## Slim L3VPN IRB-anchor VRF (host /32s ride RT-2)

A Type-5 anchor VRF that pairs with an EVPN-ELAN MAC-VRF for
L2 + L3 IRB services. No explicit `ip-prefix-routes` block —
host /32s are advertised via the MAC-VRF's RT-2. Use this instead
of `services/evpn-type5.conf` when you do not need the VRF to
originate RT-5 prefix routes (only the IRB subnet matters and it
is carried by RT-2).

**minimum** (both halves of the service + per-VRF policy)
- L2 / RT-2 half (one of):
    - `evo/services/evpn-elan-mac-vrf-irb.conf` (EVO)
    - `junos/services/evpn-elan-virtual-switch-irb.conf` (Junos MX)
- `services/evpn-type5-anchor.conf` (the slim anchor VRF — Junos and EVO)
- `policy/l3vpn-export-import.conf`
- `policy/communities.conf` (only the per-VRF target community)
- `interfaces/edge-vlan-normalization.conf`

**with-overlay** — Signalling: **EVPN** (`family evpn signaling`). BGP overlay **applies** — attach the OS-native `transport/bgp-overlay.conf` per the **BGP-overlay coverage gate** above. If no exact same-OS overlay form applies to the target, this mode is **unavailable** (fail closed) — see the gate.

**as-deployed** (= with-overlay +)
- same baseline as EVPN Type-5 above

---

## Bootstrap / greenfield turn-up

Treat as **`as-deployed`** regardless of the user's tier choice — a greenfield turn-up is by definition the full baseline.

---

Always acknowledge the chosen tier in the `Inputs Used` block (`form: minimum` / `form: with-overlay` / `form: as-deployed`).
