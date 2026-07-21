# Collapsed Data Center Fabric with Access Switches

> Extends the collapsed fabric with EX-series access switches for high-density mGig server connectivity.

Validated configurations for the Juniper Validated Design *"Collapsed Data Center Fabric with Juniper Apstra and Access Switches."* This JVD extends the [base collapsed fabric](../collapsed_dc_fabric/) with a pair of EX-series access switches, adding ~48 mGig high-availability access ports per access pair (and supporting as many access pairs as the collapsed-leaf high-availability ports allow).

* JVD landing page: <https://www.juniper.net/documentation/us/en/software/jvd/jvd-collapsed-dc-fabric-juniper-apstra-access-switches/index.html>

## Highlights

- Extends collapsed fabric with EX4400 access tier
- ~48 mGig high-availability ports per access pair
- Scalable — supports multiple access pairs per collapsed-leaf HA port
- Apstra-managed end-to-end (fabric + access)

<img width="900" alt="Collapsed Data Center Fabric with Access Switches" src="https://github.com/user-attachments/assets/47a0a73e-5510-42ad-b40d-0b8082dbeaac" />

## Documentation

In-repo design corpus — faithful markdown conversions of the published JVD PDFs:

| Doc | Contents |
|---|---|
| [Datasheet](documentation/datasheet.md) | One-page quick reference |
| [Solution overview](documentation/solution-overview.md) | Executive summary, port-expansion use case, platforms |
| [Design guide](documentation/design-guide.md) | Architecture, two-tier EVPN fabrics, EX4400 access VTEP, ESI-LAG interconnect |
| [Test report brief](documentation/test-report-brief.md) | Platforms, convergence, scale |

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
