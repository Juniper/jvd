# Collapsed Data Center Fabric

> Simplified DC fabric for small data centers where leaf switches peer directly over EVPN/VXLAN — no separate spine tier needed.

Validated configurations for the Juniper Validated Design *"Collapsed Data Center Fabric with Juniper Apstra."* The collapsed-fabric (a.k.a. collapsed-spine) architecture is Juniper’s recommended pattern for **small data centers** where a separate spine tier isn’t justified — the leaf switches *are* the fabric, peering directly with each other over EVPN/VXLAN.

* JVD landing page: <https://www.juniper.net/documentation/us/en/software/jvd/jvd-collapsed-dc-fabric-with-apstra/index.html>

## Highlights

- Simplest EVPN/VXLAN fabric — 2 switches, no spines
- ERB overlay with direct leaf-to-leaf peering
- ESI-LAG multihoming for server redundancy
- Apstra-managed with full lifecycle automation
- Ideal for branch offices, edge sites, and small colos

<img width="678" alt="Collapsed Data Center Fabric architecture" src="https://github.com/user-attachments/assets/52e20a5a-127e-4947-97ea-0f7ded3f5431" />

## Documentation

In-repo design corpus — faithful markdown conversions of the published JVD PDFs:

| Doc | Contents |
|---|---|
| [Datasheet](documentation/datasheet.md) | One-page quick reference |
| [Solution overview](documentation/solution-overview.md) | Executive summary, use cases, platforms |
| [Design guide](documentation/design-guide.md) | Architecture, direct leaf-to-leaf peering, config walkthrough |
| [Test report brief](documentation/test-report-brief.md) | Platforms, features, convergence, scale |

## Hardware

| Juniper Product | Role | Hostnames |
|---|---|---|
| **QFX5120-48Y** | Collapsed-fabric leaf pair | `dc3-rack-001-leaf1`, `dc3-rack-001-leaf2` |

## Configurations

| File | Role |
|---|---|
| [`leaf1_qfx5120-48y.conf`](configuration/conf/leaf1_qfx5120-48y.conf) | Collapsed leaf 1 |
| [`leaf2_qfx5120-48y.conf`](configuration/conf/leaf2_qfx5120-48y.conf) | Collapsed leaf 2 |
