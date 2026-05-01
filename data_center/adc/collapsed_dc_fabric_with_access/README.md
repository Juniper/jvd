# Collapsed Data Center Fabric with Access Switches

Validated configurations for the Juniper Validated Design *"Collapsed Data Center Fabric with Juniper Apstra and Access Switches."* This JVD extends the [base collapsed fabric](../collapsed_dc_fabric/) with a pair of EX-series access switches, adding ~48 mGig high-availability access ports per access pair (and supporting as many access pairs as the collapsed-leaf high-availability ports allow).

* JVD landing page: <https://www.juniper.net/documentation/us/en/software/jvd/jvd-collapsed-dc-fabric-juniper-apstra-access-switches/index.html>

<img width="900" alt="Collapsed Data Center Fabric with Access Switches" src="https://github.com/user-attachments/assets/47a0a73e-5510-42ad-b40d-0b8082dbeaac" />

## Hardware

| Juniper Product | Role | Hostnames |
|---|---|---|
| **QFX5120-48Y** | Collapsed-fabric leaf pair | `dc3-rack-001-leaf1`, `dc3-rack-001-leaf2` |
| **EX4400-48MP** | Access switch pair | `dc3-rack-001-access1`, `dc3-rack-001-access2` |

## Configurations

| File | Role |
|---|---|
| [`leaf1_qfx5120-48y.conf`](configuration/conf/leaf1_qfx5120-48y.conf) | Collapsed leaf 1 |
| [`leaf2_qfx5120-48y.conf`](configuration/conf/leaf2_qfx5120-48y.conf) | Collapsed leaf 2 |
| [`access1_ex4400-48mp.conf`](configuration/conf/access1_ex4400-48mp.conf) | Access switch 1 |
| [`access2_ex4400-48mp.conf`](configuration/conf/access2_ex4400-48mp.conf) | Access switch 2 |
