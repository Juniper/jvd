# Collapsed Data Center Fabric with Access Switches — BYOAI menu

Browser-facing catalog of what this JVDE assistant can generate and
explain. This is the human-readable companion to the machine bundle
(`jvd-collapsed-access-snips.md`) the AI actually loads.

This is a **Junos-only JVDE** that EXTENDS the two-switch Collapsed Data
Center Fabric with an **EX4400-48MP access-switch layer** for port
expansion. Both tiers are direct 2-node EVPN-VXLAN fabrics built with
Juniper Apstra. This snip library covers the **access-layer extension**;
for the base collapsed leaf config see the base Collapsed Data Center
Fabric JVD.

---

## Two modes

- **Configuration mode** — generate validated Junos config from the 6
  snips below. Strict: only validated patterns, no invented syntax.
- **Design mode** — explore the architecture, grounded in the JVD
  documentation corpus (datasheet / design guide / solution overview /
  test report brief), with citations.

## Configuration catalog (6 snips, junos-only)

| Feature                    | Snip                                          | Seen on            |
| -------------------------- | --------------------------------------------- | ------------------ |
| Access-tier eBGP underlay  | `junos/transport/access-underlay-ebgp.conf`   | access1, access2   |
| Access-tier EVPN overlay   | `junos/transport/access-evpn-overlay.conf`    | access1, access2   |
| EVPN-VXLAN forwarding      | `junos/transport/evpn-vxlan-forwarding.conf`  | all 4 devices      |
| VLAN-aware MAC-VRF (EVI)   | `junos/services/mac-vrf-evpn-vxlan.conf`      | all 4 devices      |
| All-active ESI-LAG         | `junos/interfaces/esi-lag.conf`               | all 4 devices      |
| Loopback (lo0 VTEP)        | `junos/interfaces/loopback.conf`              | all 4 devices      |

### Common tasks

- **Bring up an EX4400 access switch as a VTEP** → `access-turnup`
  (as-deployed: loopback + access underlay + access overlay + EVPN-VXLAN
  forwarding + MAC-VRF + ESI-LAG).
- **Add a VLAN/VNI to the MAC-VRF** → `mac-vrf`.
- **Multihome a server to the access pair** → `esi-lag`.
- **Stand up the access-tier direct EVPN fabric** → `access-underlay` +
  `access-overlay`.

### Devices

- `ACCESS-PAIR` = `access1_ex4400-48mp` + `access2_ex4400-48mp`
- `LEAF-PAIR` = `leaf1_qfx5120-48y` + `leaf2_qfx5120-48y`

## Design catalog (ask me about…)

- The two-tier **direct EVPN-VXLAN** design (collapsed leaves l3clos-l,
  access pair l3clos-a) and why there's no dedicated spine.
- The **EX4400-48MP as an EVPN-VXLAN VTEP** and what it adds.
- **ESI-LAG multihoming** — access→leaf uplink and server→access downlink,
  both all-active.
- **Port expansion** with an access tier vs moving to a 3-stage design.
- Platforms, convergence, and scale from the **test report brief**.

---

*Not sure where to start? Ask for a "rundown of this JVD" and I'll
summarise from the datasheet.*
