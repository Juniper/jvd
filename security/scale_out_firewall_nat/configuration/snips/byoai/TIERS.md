# Configuration Form Tiers

This file is part of the [BYOAI](README.md) corpus. It tells the AI which snippet files to include for each device role at each verbosity tier. It is bundled into [`jvd-so-fwnat-snips.md`](jvd-so-fwnat-snips.md) by `regenerate-bundle.sh`.

For each role, the AI includes ONLY the snips listed for the chosen tier — and ONLY those — unless the user explicitly asks for more. Every device in this JVD is **Junos** (MX304 + SRX4600); there is no `evo/` tree.

---

## What the tiers mean

| Tier | Use when | What's included |
|---|---|---|
| **`minimum`** | Brownfield change. Device already has its scale-out BGP planes and interfaces. You just want the component. | The component's snips + its mandatory `Pair with:` snips. **No BGP/interfaces baseline.** |
| **`with-bgp`** | Brownfield-ish. Interfaces are up but you want to (re)assert the device's scale-out eBGP peering + export policies. | `minimum` + the role's scale-out BGP plane snip(s) + export policies + AE sub-units. |
| **`as-deployed`** | Greenfield turn-up, lab build, or "give me a working end-to-end example." Mirrors what the JVD validates. | Everything for the role: component + BGP planes + interfaces, plus (SRX) MNHA chassis + signal policies + management bootstrap, and (MX-LB) the symmetric enhanced-hash-key. |

> **Greenfield / bootstrap requests** are always treated as **`as-deployed`**.

> **NAT scope:** the tested feature is source-NAT **NAPT44** (RFC6598 100.64/10, address-pooling paired). NAT64 is present in the lab configs but is a **non-goal** in the published design — it is NOT included in any default tier. Add it only via the explicit "Add NAT64" feature (see below), and flag it as off-design in Notes.

---

## MX load balancer (`MX-LB`)

The MX304 stateless load balancer (`mx1_mx304`) — RE-based Traffic Load Balancer in Direct Server Return mode.

- **`minimum`**
  - `junos/load-balancing/tlb-sfw-dsr.conf`
  - `junos/load-balancing/network-monitoring-profiles.conf`
  - `junos/transport/mx-forwarding-instance-tlb.conf`
  - `junos/firewall/mx-fbf-tlb-redirect.conf`
  - `junos/interfaces/mx-ae-uni-flexible.conf`
- **`with-bgp`** — `minimum` +
  - `junos/transport/mx-bgp-vrf-scaleout.conf`
  - `junos/transport/mx-scaleout-export-policies.conf`
  - `junos/nat/mx-napt44-route-advertise.conf`
  - `junos/interfaces/mx-ae-scaleout-subunits.conf`
- **`as-deployed`** — `with-bgp` +
  - `junos/transport/enhanced-hash-key-symmetric.conf` (required for dual-MX)

## SRX Stateful Firewall / NAT gateway (`SRX`)

An SRX4600 SFW + source-NAT (NAPT44) security gateway (`srx1a` … `srx2b`).

- **`minimum`**
  - `junos/nat/srx-source-nat-napt44.conf`
  - `junos/security/srx-zones-scaleout.conf`
  - `junos/security/srx-policies-sfw.conf`
  - `junos/interfaces/srx-lo0-hc-loopbacks.conf`
- **`with-bgp`** — `minimum` +
  - `junos/transport/srx-bgp-to-mx-scaleout.conf`
  - `junos/high-availability/srx-signal-route-export-policies.conf`
  - `junos/interfaces/srx-ae-scaleout-subunits.conf`
- **`as-deployed`** — `with-bgp` + full MNHA + management:
  - `junos/high-availability/srx-mnha-chassis-srg.conf`
  - `junos/bootstrap/srx-system-services.conf`

## SRX Multinode High Availability (`srx-mnha` — add-on)

Add MNHA to an existing SRX gateway. Always emit both together.

- **`minimum`** (== `as-deployed`)
  - `junos/high-availability/srx-mnha-chassis-srg.conf`
  - `junos/high-availability/srx-signal-route-export-policies.conf`

## Gateway emulator (`GW` — test harness)

The `gateway_emulator_mx304` north-side test router that originates the client/server prefixes and default route.

- **`minimum`** (== `as-deployed`)
  - `junos/transport/gw-emulator-bgp.conf`

## Add a feature

Single-purpose additions to an existing device.

- **Scale-out BGP plane** — MX: `junos/transport/mx-bgp-vrf-scaleout.conf` + `junos/transport/mx-scaleout-export-policies.conf` + `junos/nat/mx-napt44-route-advertise.conf`; SRX: `junos/transport/srx-bgp-to-mx-scaleout.conf` + `junos/high-availability/srx-signal-route-export-policies.conf`
- **Filter-based forwarding redirect (MX)** — `junos/firewall/mx-fbf-tlb-redirect.conf` + `junos/transport/mx-forwarding-instance-tlb.conf`
- **Symmetric hashing (dual-MX)** — `junos/transport/enhanced-hash-key-symmetric.conf`
- **TLB health-check profiles** — `junos/load-balancing/network-monitoring-profiles.conf`
- **NAPT44 pool advertisement (MX)** — `junos/nat/mx-napt44-route-advertise.conf`
- **SRX management bootstrap** — `junos/bootstrap/srx-system-services.conf` (web-management port 8088 answers the TLB TCP health-check)
- **NAT64 (off-design / non-goal)** — `junos/nat/srx-nat64.conf` (present in lab configs; NOT part of the validated NAPT44 design — flag in Notes)
