# Configuration Snippets (snips)

This `snips/` directory contains **focused, copy-pasteable configuration excerpts**
extracted from the full validated device configurations in [`../conf/`](../conf/).
Each file isolates a single CSDS ScaleOut building block (the TLB load balancer,
an IKE/IPsec gateway, MNHA, security zones, a scale-out BGP plane, …) so it can be
referenced, shared, or adapted without wading through a multi-hundred-line device
config.

## Topology

![CSDS ScaleOut topology](../../images/CSDS-general.png)

MX Series routers act as **stateless load balancers** (ECMP CHASH or RE-based TLB)
distributing encrypted tunnel traffic across a scaled-out farm of SRX/vSRX IPsec
Security Gateways in MNHA pairs. See [`../../documentation/`](../../documentation)
for the full design corpus (Enterprise and Mobile SP variants).

## Layout

```
snips/
  junos/        ← Junos OS examples (MX304 + SRX4600 — the whole JVD is Junos)
```

This JVD deploys only Junos devices, so there is no `evo/` tree. Categories:

| Sub-folder | What's in it |
|---|---|
| `load-balancing/` | RE-based Traffic Load Balancer (TLB, Direct Server Return) + network-monitoring health-check profiles |
| `ipsec/` | IKE/IPsec gateways — SRX auto-VPN responder, MX-based AMS initiator (service-set) |
| `high-availability/` | SRX Multinode High Availability (MNHA): chassis SRG config, HA-link-encryption, active/backup route-signalling policies |
| `security/` | SRX security zones and policies (scale-out planes, IPsec data, MNHA ICL) |
| `transport/` | Scale-out BGP planes (MX VRFs, SRX-to-MX per-zone eBGP, MNHA-VR ICL), forwarding instance, symmetric enhanced-hash-key |
| `policy/` | MX export policies and route-filter-lists (ARI, next-hop-self, per-packet LB) |
| `firewall/` | Filter-based forwarding steering IPsec traffic into the TLB tproxy instance |
| `interfaces/` | AE per-plane sub-units, anycast/health-check loopbacks, secure tunnels, MX AMS interfaces |

## Header schema

Every snip opens with a fixed 5-section header:

```
/*
 * Topic:   <one-line description>
 * Seen on:
 *   Junos: <device basenames>
 * Highlights:  <non-obvious knobs / interactions>
 * Pair with:   <same-device dependencies — junos/<cat>/<name>.conf>
 * JVD peer devices (observed interop):  <cross-device interop>
 * Variables:   <$VAR  e.g. value>
 */
<templated body>
```

## Variables

Identifiers that vary between deployments are templated as `$VAR`. See
[`_variables.md`](_variables.md) for the full glossary and the render command.
Secrets are replaced with `$*_PSK` placeholders — supply your own encrypted values.

## Device roles

| Device (basename) | Role |
|---|---|
| `mx1_mx304` | MX304 stateless load balancer / Traffic Orchestrator (TLB) |
| `ipsec_initiator_gateway_mx304` | MX304 IPsec initiator gateway (AMS service-set — test traffic source) |
| `srx1a` / `srx1b` / `srx2a` / `srx2b` (`srx4600`) | SRX4600 IPsec Security Gateways, two MNHA pairs |
