# Collapsed Data Center Fabric

Validated configurations for the Juniper Validated Design *"Collapsed Data Center Fabric with Juniper Apstra."* The collapsed-fabric (a.k.a. collapsed-spine) architecture is Juniper's recommended pattern for **small data centers** where a separate spine tier isn't justified — the leaf switches *are* the fabric, peering directly with each other over EVPN/VXLAN.

* JVD landing page: <https://www.juniper.net/documentation/us/en/software/jvd/jvd-collapsed-dc-fabric-with-apstra/index.html>

<img width="678" alt="Collapsed Data Center Fabric architecture" src="https://github.com/user-attachments/assets/52e20a5a-127e-4947-97ea-0f7ded3f5431" />

## Hardware

| Juniper Product | Role | Hostnames |
|---|---|---|
| **QFX5120-48Y** | Collapsed-fabric leaf pair | `dc3-rack-001-leaf1`, `dc3-rack-001-leaf2` |

## Configurations

| File | Role |
|---|---|
| [`leaf1_qfx5120-48y.conf`](configuration/conf/leaf1_qfx5120-48y.conf) | Collapsed leaf 1 |
| [`leaf2_qfx5120-48y.conf`](configuration/conf/leaf2_qfx5120-48y.conf) | Collapsed leaf 2 |
