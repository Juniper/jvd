# Configuration Form Tiers

This file is part of the [BYOAI](README.md) corpus. It tells the AI which snippet files to include for each device role at each verbosity tier. It is bundled into [`jvd-so-ipsec-snips.md`](jvd-so-ipsec-snips.md) by `regenerate-bundle.sh`.

For each role, the AI includes ONLY the snips listed for the chosen tier — and ONLY those — unless the user explicitly asks for more. Every device in this JVD is **Junos** (MX304 + SRX4600); there is no `evo/` tree.

---

## What the tiers mean

| Tier | Use when | What's included |
|---|---|---|
| **`minimum`** | Brownfield change. Device already has its scale-out BGP planes and interfaces. You just want the component. | The component's snips + its mandatory `Pair with:` snips. **No BGP/interfaces baseline.** |
| **`with-bgp`** | Brownfield-ish. Interfaces are up but you want to (re)assert the device's scale-out eBGP peering + export policies. | `minimum` + the role's scale-out BGP plane snip(s) + export policies + AE sub-units. |
| **`as-deployed`** | Greenfield turn-up, lab build, or "give me a working end-to-end example." Mirrors what the JVD validates. | Everything for the role: component + BGP planes + interfaces, plus (SRX) MNHA chassis + HA-link-encryption + signal policies, and (MX-LB) the FBF filter + symmetric enhanced-hash-key. |

> **Greenfield / bootstrap requests** are always treated as **`as-deployed`**.

---

## MX load balancer (`MX-LB`)

The MX304 stateless load balancer (`mx1_mx304`).

- **`minimum`**
  - `junos/load-balancing/tlb-ipsec-dsr.conf`
  - `junos/load-balancing/network-monitoring-profiles.conf`
  - `junos/transport/forwarding-instance-tproxy.conf`
  - `junos/firewall/fbf-ipsec-lb-redirect.conf`
  - `junos/interfaces/mx-ae-fbf-uni.conf`
- **`with-bgp`** — `minimum` +
  - `junos/transport/bgp-mx-vrf-scaleout.conf`
  - `junos/policy/mx-scaleout-export-policies.conf`
  - `junos/interfaces/mx-ae-scaleout-subunits.conf`
- **`as-deployed`** — `with-bgp` +
  - `junos/transport/enhanced-hash-key-symmetric.conf` (required for dual-MX)

## SRX IPsec Security Gateway (`SRX`)

An SRX4600 responder-only IPsec Security Gateway (`srx1a` … `srx2b`).

- **`minimum`**
  - `junos/ipsec/srx-ike-gateway-avpn-responder.conf`
  - `junos/ipsec/srx-ipsec-vpn-aes256gcm.conf`
  - `junos/interfaces/srx-lo0-ike-anycast.conf`
  - `junos/interfaces/srx-st0-tunnels.conf`
  - `junos/security/srx-zones-scaleout.conf`
  - `junos/security/srx-policies-ipsec-data.conf`
- **`with-bgp`** — `minimum` +
  - `junos/transport/bgp-srx-to-mx-scaleout.conf`
  - `junos/high-availability/mnha-signal-route-policies.conf`
  - `junos/interfaces/srx-ae-scaleout-subunits.conf`
- **`as-deployed`** — `with-bgp` + full MNHA:
  - `junos/high-availability/mnha-chassis-srg.conf`
  - `junos/high-availability/mnha-ha-link-encryption.conf`

## SRX Multinode High Availability (`srx-mnha` — add-on)

Add MNHA to an existing SRX gateway. Always emit all three together.

- **`minimum`** (== `as-deployed`)
  - `junos/high-availability/mnha-chassis-srg.conf`
  - `junos/high-availability/mnha-ha-link-encryption.conf`
  - `junos/high-availability/mnha-signal-route-policies.conf`

## MX IPsec initiator (`MX-INIT`)

The MX304 AMS-based IPsec initiator / test traffic source (`ipsec_initiator_gateway_mx304`).

- **`minimum`** (== `as-deployed`)
  - `junos/ipsec/mx-ike-ipsec-initiator.conf`
  - `junos/ipsec/mx-ams-service-set.conf`
  - `junos/interfaces/mx-initiator-ams-lo0-st0.conf`

## Add a feature

Single-purpose additions to an existing device.

- **Scale-out BGP plane** — MX: `junos/transport/bgp-mx-vrf-scaleout.conf` + `junos/policy/mx-scaleout-export-policies.conf`; SRX: `junos/transport/bgp-srx-to-mx-scaleout.conf` + `junos/high-availability/mnha-signal-route-policies.conf`
- **Filter-based forwarding redirect (MX)** — `junos/firewall/fbf-ipsec-lb-redirect.conf` + `junos/transport/forwarding-instance-tproxy.conf`
- **Symmetric hashing (dual-MX)** — `junos/transport/enhanced-hash-key-symmetric.conf`
- **TLB health-check profiles** — `junos/load-balancing/network-monitoring-profiles.conf`
