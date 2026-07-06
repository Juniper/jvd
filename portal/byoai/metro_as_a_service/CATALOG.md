# Service Catalog — Metro-as-a-Service

This file is part of the [BYOAI](README.md) corpus. It is the
authoritative **funnel map**: for each path through the interview
(Service Profile → Multiplexing → Deployment → Attributes) it names the
exact service snip, attachment-circuit interface snip, and UNI firewall
filter to use, per OS. The AI reads this together with [`TIERS.md`](TIERS.md)
(which adds the CoS / apply-group snips for each verbosity tier) and
[`_variables.md`](../_variables.md). Bundled into
[`jvd-maas-snips.md`](jvd-maas-snips.md) by `regenerate-bundle.sh`.

**How to read a row:** pick the OS column that matches the target
device. `—` means that combination is not validated in this JVD on that
OS; if the user asked for it, say so and offer the validated OS. The
`{esi}` suffix on an interface snip means "use the `-esi` variant when
the service is multihomed, the plain variant when single-homed."

Filenames below are relative to `snips/` (prepend `junos/` or `evo/`
per the OS column, unless already shown).

---

## 1. E-LINE (point-to-point)

### 1a. EVPL (vlan-based)

| Deployment | Junos service | Junos interface | EVO service | EVO interface |
|---|---|---|---|---|
| `evpn-vpws` | `services/evpn-vpws-vlan-based.conf` | `interfaces/vlan-ccc-vlan-map{-esi}.conf` | `services/evpn-vpws-vlan-based.conf` | `interfaces/vlan-ccc{-esi}.conf` |
| `l2vpn-kompella` | `services/l2vpn-kompella-vlan-based.conf` | `interfaces/vlan-ccc.conf` | `services/l2vpn-kompella-vlan-based.conf` | `interfaces/vlan-ccc.conf` |
| `bgp-vpls-p2p` | `services/bgp-vpls-p2p.conf` | `interfaces/vlan-bridge.conf` | `services/bgp-vpls-p2p.conf` | `interfaces/vlan-bridge.conf` |
| `l2circuit` (floating PW) | `services/l2circuit-floating-pw.conf` + `interfaces/pseudowire-subscriber.conf` | `interfaces/vlan-ccc.conf` | `services/l2circuit-floating-pw.conf` | `interfaces/vlan-ccc.conf` |
| `l2circuit` (hot-standby) | — | — | `services/l2circuit-hot-standby-primary.conf` + `services/l2circuit-hot-standby-backup.conf` | `interfaces/vlan-ccc-vlan-map.conf` |
| `evpn-fxc` (vlan-unaware) | `services/evpn-fxc-vlan-unaware.conf` | `interfaces/vlan-ccc-vlan-map{-esi}.conf` | `services/evpn-fxc-vlan-unaware.conf` | `interfaces/vlan-ccc-2-units.conf` |
| `evpn-fxc` (vlan-aware) | — | — | `services/evpn-fxc-vlan-aware.conf` | `interfaces/vlan-ccc-vlan-map-esi-2-units.conf` |
| `evpn-floating-pw` | `services/evpn-elan-vlan-based-floating-pw.conf` + `services/l2circuit-floating-pw.conf` + `interfaces/pseudowire-subscriber.conf` | `interfaces/vlan-bridge-esi.conf` | — | — |

UNI firewall filter (EVPL):
- color-blind → Junos `firewall/filter-ccc-color-blind.conf` · EVO `firewall/filter-ccc-color-blind.conf`
- color-aware → Junos `firewall/filter-ccc-color-aware.conf` · EVO `—` (color-aware UNIs are Junos in this JVD)

### 1b. EPL (port-based)

| Deployment | Junos service | Junos interface | EVO service | EVO interface |
|---|---|---|---|---|
| `evpn-vpws` | — | — | `services/evpn-vpws-port-based.conf` | `interfaces/ethernet-ccc.conf` + `interfaces/physical-mtu.conf` |
| `l2vpn-kompella` | `services/l2vpn-kompella-port-based.conf` | `interfaces/ethernet-ccc.conf` | `services/l2vpn-kompella-port-based.conf` | `interfaces/ethernet-ccc.conf` + `interfaces/physical-mtu.conf` |

UNI firewall filter (EPL):
- color-aware → Junos `firewall/filter-ccc-color-aware-l2cp.conf`
- color-blind → EVO `firewall/filter-ccc-color-blind-l2cp.conf`

---

## 2. E-LAN (multipoint)

### 2a. EVP-LAN (vlan-based)

| Deployment | Junos service | Junos interface | EVO service | EVO interface |
|---|---|---|---|---|
| `evpn-elan` | `services/evpn-elan-port-based.conf` | `interfaces/vlan-bridge-esi.conf` | `services/evpn-elan-port-based.conf` | `interfaces/vlan-bridge-esi.conf` |
| `evpn-elan` (vlan-bundle) | — | — | `services/evpn-elan-vlan-bundle.conf` | `interfaces/vlan-bridge-bundle.conf` + `interfaces/vlan-bridge-esi-bundle.conf` |
| `evpn-elan-irb` (Type-5 / L3) | `services/evpn-elan-type5.conf` | `interfaces/vlan-bridge.conf` + `interfaces/irb-l3.conf` | `services/evpn-elan-type5.conf` | `interfaces/vlan-bridge.conf` + `interfaces/irb-l3.conf` |
| `bgp-vpls` | — | — | `services/bgp-vpls.conf` | `interfaces/vlan-bridge-vlan-map.conf` + `interfaces/physical-mtu.conf` |

UNI firewall filter (EVP-LAN): `firewall/filter-eswitch-color-blind.conf` (both OS).

### 2b. EP-LAN (port-based)

| Deployment | Junos service | Junos interface | EVO service | EVO interface |
|---|---|---|---|---|
| `evpn-elan` | `services/evpn-elan.conf` | `interfaces/ethernet-bridge.conf` | `services/evpn-elan-bundle-port-based.conf` | `interfaces/ethernet-bridge.conf` + `interfaces/physical-mtu.conf` |

UNI firewall filter (EP-LAN):
- Junos → `firewall/filter-bridge-color-aware-l2cp.conf`
- EVO → `firewall/filter-eswitch-color-blind-l2cp.conf`

---

## 3. E-TREE (rooted-multipoint)

| Deployment | Junos service | Junos interface (root / leaf) | EVO |
|---|---|---|---|
| `evpn-etree` | `services/evpn-etree-vlan-based.conf` | root: `interfaces/vlan-bridge-esi-etree-root.conf` · leaf: `interfaces/vlan-bridge-etree-leaf.conf` | — (Junos only) |

UNI firewall filter: `firewall/filter-bridge-color-aware.conf`.

E-Tree needs **both** a root UNI and a leaf UNI. Generate the root
interface snip on root-facing PEs and the leaf interface snip on
leaf-facing PEs; the service snip is the same on all.

---

## 4. ACCESS E-LINE (E-Access hand-off)

| Deployment | Junos service | Junos interface | EVO service | EVO interface |
|---|---|---|---|---|
| `evpn-vpws-lsw` | — | — | `services/evpn-vpws-lsw.conf` | `interfaces/vlan-ccc-qinq-stacked-qinq-tpid.conf` + `interfaces/vlan-ccc-vlan-map-bundle-qinq-tpid.conf` |
| `l2circuit-lsw` | — | — | `services/l2circuit-lsw.conf` | `interfaces/vlan-ccc-qinq-stacked-qinq-tpid.conf` + `interfaces/vlan-ccc-vlan-map-bundle-qinq-tpid.conf` |
| `bridge-domain-lsw` | `services/bridge-domain-lsw.conf` | `interfaces/vlan-bridge-qinq-stacked.conf` | — | — |

UNI firewall filter (E-Access):
- Junos `bridge-domain-lsw` → `firewall/filter-bridge-color-aware-cf0.conf`
- EVO LSW → `firewall/filter-ccc-color-blind.conf`

E-Access is inherently QinQ (customer C-VLAN stacked under an operator
S-VLAN). The `qinq` VLAN-manipulation attribute is implied — use the
QinQ interface variants above regardless of the VLAN-manip answer.

---

## Attribute → snip-variant rules

These override / refine the base rows above once the user answers STEP 4:

- **Homing**
  - `single-homed` → use the plain interface snip (no `-esi`).
  - `multihomed` (all-active ESI) → use the `-esi` interface variant
    where a row shows `{esi}`; if no `-esi` variant exists for that
    row, keep the plain snip and note that multihoming is not validated
    for this deployment in the JVD. Multihomed services share one
    `$ESI_ID` across both PEs (see DEFAULTS.md).

- **Color mode** — selects the firewall filter, as listed per section
  above. Color-aware UNIs are Junos-only in this JVD; if the user asks
  for color-aware on an EVO ACX7xxx, generate color-blind and note it.

- **CoS** — `no` → `minimum` tier (skip CoS + filter). `yes` →
  `with-cos` tier (add CoS binding + the color-mode filter). See TIERS.md.

- **VLAN manipulation** *(vlan-based E-Line/E-LAN only)*
  - `none` → base interface snip.
  - `vlan-map` → use the `-vlan-map` interface variant if the row has
    one (e.g. `vlan-ccc-vlan-map.conf`, `vlan-bridge-vlan-map.conf`).
  - `qinq` → use a `qinq-stacked` interface variant (Junos
    `vlan-bridge-qinq-stacked.conf`, EVO `vlan-ccc-qinq-stacked-qinq-tpid.conf`).

## `-v2` / `-v3` interface variants

Several interface snips have `-v2` / `-v3` siblings — these are real
validated variants (e.g. no-control-word, extra family filter, second
AC unit). Default to the base snip; only pick a `-vN` variant when the
user asks for that specific behavior or when generating a second AC on
the same service (`-2-units`).

## Reconciliation — always do this last

The rows above name the PRIMARY service + interface + filter for each
funnel path. Before you emit, open the chosen **service snip's own
`Pair with:` header** (the ground truth for that exact snip) and add any
listed snip that is not already in your set for the chosen tier. In
particular:

- **`evo/interfaces/physical-mtu.conf`** — most EVO services list this
  in `Pair with:` (it sets the 9192-byte port MTU needed for MPLS
  overhead). Include it for EVO services whenever their `Pair with:`
  lists it. Junos MX PEs set MTU inline, so there is no Junos equivalent.
- If the service snip's `Pair with:` names a CoS or firewall snip that
  differs from the row above (e.g. a `-l2cp` or `-cf0` filter variant),
  prefer the one in the header and note the substitution.

If a `Pair with:` entry is intentionally omitted for the chosen tier
(e.g. CoS snips at `minimum`), that's fine — just don't drop a required
interface/physical snip.
