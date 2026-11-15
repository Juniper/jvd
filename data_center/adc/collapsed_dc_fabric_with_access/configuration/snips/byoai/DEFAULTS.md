# DEFAULTS — Collapsed Data Center Fabric with Access Switches

Lab auto-fill values for the Collapsed Data Center Fabric with Access Switches JVD. Every value is measured from the published device configurations under [`configuration/conf/`](../../conf/). Use them when the user picks a device and service and asks for lab values; otherwise ask for the deployment values.

## Device inventory

| Role | Device | Platform | OS | Loopback / router-id | `$ASN` |
|------|--------|----------|----|----------------------|--------|
| Collapsed-spine leaf | leaf1_qfx5120-48y | QFX5120-48Y | Junos | 192.168.253.0 | 64800 |
| Collapsed-spine leaf | leaf2_qfx5120-48y | QFX5120-48Y | Junos | 192.168.253.1 | 64801 |
| Access switch | access1_ex4400-48mp | EX4400-48MP | Junos | 192.168.253.2 | 64802 |
| Access switch | access2_ex4400-48mp | EX4400-48MP | Junos | 192.168.253.3 | 64803 |

## Service examples (first measured instance per switch)

| Service form | Device | Example values |
|--------------|--------|----------------|
| evpn-mac-vrf-40-vlans | leaf1_qfx5120-48y | `$AC_IFL_1` ae1.0, `$BD_NAME_1` vn1000, `$BD_NAME_10` vn1009, `$BD_NAME_11` vn1400, `$BD_NAME_12` vn1401, `$BD_NAME_13` vn1402 |
| evpn-mac-vrf-40-vlans | leaf2_qfx5120-48y | `$AC_IFL_1` xe-0/0/5.0, `$AC_IFL_2` ae1.0, `$BD_NAME_1` vn1000, `$BD_NAME_10` vn1009, `$BD_NAME_11` vn1400, `$BD_NAME_12` vn1401 |
| evpn-mac-vrf-40-vlans-bridging | access1_ex4400-48mp | `$AC_IFL_1` mge-0/0/46.0, `$AC_IFL_2` ae1.0, `$AC_IFL_3` ae2.0, `$BD_NAME_1` vn1000, `$BD_NAME_10` vn1009, `$BD_NAME_11` vn1400 |
| evpn-mac-vrf-40-vlans-bridging | access2_ex4400-48mp | `$AC_IFL_1` ae1.0, `$AC_IFL_2` ae2.0, `$BD_NAME_1` vn1000, `$BD_NAME_10` vn1009, `$BD_NAME_11` vn1400, `$BD_NAME_12` vn1401 |
| evpn-type5-vrf-ebgp | leaf1_qfx5120-48y | `$AC_IFL` xe-0/0/10.199, `$ASN_CUSTOMER` 65000, `$BGP_EXPORT_POL` RoutesToExt-red-external_router, `$BGP_GROUP` l3rtr, `$BGP_IMPORT_POL` RoutesFromExt-red-external_router, `$CE_PEER_V4` 10.200.2.1 |
| evpn-type5-vrf-ebgp | leaf2_qfx5120-48y | `$AC_IFL` xe-0/0/10.199, `$ASN_CUSTOMER` 65000, `$BGP_EXPORT_POL` RoutesToExt-red-external_router, `$BGP_GROUP` l3rtr, `$BGP_IMPORT_POL` RoutesFromExt-red-external_router, `$CE_PEER_V4` 10.200.2.3 |

The MAC-VRF uses the same instance name, VNIs and route targets on all four switches, and each Type 5 VRF the same on both leaves; the route distinguisher starts with each switch's own loopback.
