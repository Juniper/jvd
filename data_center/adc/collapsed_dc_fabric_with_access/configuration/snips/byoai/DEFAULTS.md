# Auto-fill defaults — Collapsed Fabric with Access Switches

Deterministic JVD lab values for `auto` mode and short-circuits. Every
value below is taken from the validated `configuration/conf/*.conf`
device configs — do NOT invent alternatives. Always echo the values you
used in the output `Inputs used:` block so the user can rerun with edits.

---

## Devices (`Seen on:` names)

| Shortcut      | Devices                                                   |
| ------------- | --------------------------------------------------------- |
| `ACCESS-PAIR` | `access1_ex4400-48mp`, `access2_ex4400-48mp`              |
| `LEAF-PAIR`   | `leaf1_qfx5120-48y`, `leaf2_qfx5120-48y`                  |

Single device: any one name above (or a user-supplied hostname).
Default device selection when unspecified: `ACCESS-PAIR` (this library is
the access-layer extension).

## Per-device loopback + eBGP AS (direct fabric, from configs)

| Device                | lo0 (`lo0.0`)     | local AS |
| --------------------- | ----------------- | -------- |
| `leaf1_qfx5120-48y`   | `192.168.253.0/32`| `64800`  |
| `leaf2_qfx5120-48y`   | `192.168.253.1/32`| `64801`  |
| `access1_ex4400-48mp` | `192.168.253.2/32`| `64802`  |
| `access2_ex4400-48mp` | `192.168.253.3/32`| `64803`  |

Direct underlay peering (access tier): each access switch peers with the
other over its loopback —
- `access1` → neighbor `192.168.253.3`, `local-address 192.168.253.2`, `peer-as 64803`
- `access2` → neighbor `192.168.253.2`, `local-address 192.168.253.3`, `peer-as 64802`

The collapsed leaves peer the same way (l3clos-l): `leaf1` ↔ `leaf2`,
peer-as 64801 / 64800.

## EVPN-VXLAN forwarding

- `vtep-source-interface`: `lo0.0`
- `forwarding-options evpn-vxlan` + `vxlan-routing` (from
  `evpn-vxlan-forwarding.conf`)

## MAC-VRF / EVI (`evpn-1`)

- Instance: `evpn-1` (mac-vrf, `vlan-aware`)
- First VLAN/VNI: VLAN name `vn400`, `vni 10400`
- Per-VNI route target: `target:10400:1` (pattern `target:<vni>:1`)
- Route-distinguisher: `<lo0>:65534` (e.g. `192.168.253.2:65534` on access1)

When the user wants N VLANs, increment: `vn400 → vn401 → …`,
`vni 10400 → 10401 → …`, `target:10400:1 → target:10401:1 → …`.
If N is unspecified, default to **1** and note it in Inputs Used.

## All-active ESI-LAG (identical across the two bundle members)

- Uplink (access → collapsed-leaf pair), `ae1`:
  - `esi`: `00:02:00:00:00:00:02:00:00:02`  (`all-active`)
  - LACP `system-id`: `02:00:00:00:00:02`
- Server downlink (server → access pair), `ae2`:
  - `esi`: `00:02:00:00:00:00:03:00:00:03`  (`all-active`)
  - LACP `system-id`: `02:00:00:00:00:03`
- `mtu 9216`; unit 0 `family ethernet-switching interface-mode trunk`,
  VLAN members the `vn###` set.

> Both the `esi` value and the LACP `system-id` MUST be identical on both
> members of a given bundle. Use different values per distinct Ethernet
> segment (uplink vs downlink use different ESI/system-id, as above).

## Fallbacks

- Unspecified VLAN/VNI count → 1.
- Unspecified device → `ACCESS-PAIR`.
- Unspecified form → `as-deployed` for a turn-up request, `minimum` for a
  single-feature request.
- Every auto-filled value MUST be listed in `Inputs used:`.
