# DEFAULTS — AI/ML Multitenancy Backend

Lab auto-fill values for the AI/ML Multitenancy Backend JVD. Every value is measured from the published device configurations under [`configuration/conf/`](../../conf/). Use them when the user picks a device and service and asks for lab values; otherwise ask for the deployment values.

## Device inventory

| Role | Device | Platform | OS | Loopback / router-id | `$ASN` |
|------|--------|----------|----|----------------------|--------|
| Leaf | leaf1_qfx5240-64od | QFX5240-64OD | EVO | 10.0.1.9 | 208 |
| Leaf | leaf2_qfx5240-64od | QFX5240-64OD | EVO | 10.0.1.8 | 209 |
| Leaf | leaf3_qfx5240-64od | QFX5240-64OD | EVO | 10.0.1.10 | 210 |
| Leaf | leaf4_qfx5240-64od | QFX5240-64OD | EVO | 10.0.1.11 | 211 |
| Spine | spine1_qfx5240-64od | QFX5240-64OD | EVO | 10.0.0.8 | 108 |
| Spine | spine2_qfx5240-64od | QFX5240-64OD | EVO | 10.0.0.9 | 109 |
| Spine | spine3_qfx5240-64od | QFX5240-64OD | EVO | 10.0.0.10 | 110 |
| Spine | spine4_qfx5240-64od | QFX5240-64OD | EVO | 10.0.0.11 | 111 |

## Service examples (first measured instance per leaf)

| Service form | Device | Example values |
|--------------|--------|----------------|
| tenant-vrf-evpn-type5-2-links | leaf1_qfx5240-64od | `$AC_IFL_1` et-0/0/12:1.0, `$AC_IFL_2` et-0/0/16:1.0, `$INSTANCE_NAME` tenant-2, `$IP_PREFIX_EXPORT_POL` BGP-AOS-Policy-tenant-2, `$LOOPBACK_IFL` lo0.3, `$LOOPBACK_V4` 10.0.1.9 |
| tenant-vrf-evpn-type5-2-links | leaf2_qfx5240-64od | `$AC_IFL_1` et-0/0/12:1.0, `$AC_IFL_2` et-0/0/16:1.0, `$INSTANCE_NAME` tenant-6, `$IP_PREFIX_EXPORT_POL` BGP-AOS-Policy-tenant-6, `$LOOPBACK_IFL` lo0.7, `$LOOPBACK_V4` 10.0.1.8 |
| tenant-vrf-evpn-type5-2-links | leaf3_qfx5240-64od | `$AC_IFL_1` et-0/0/12:1.0, `$AC_IFL_2` et-0/0/16:1.0, `$INSTANCE_NAME` tenant-2, `$IP_PREFIX_EXPORT_POL` BGP-AOS-Policy-tenant-2, `$LOOPBACK_IFL` lo0.3, `$LOOPBACK_V4` 10.0.1.10 |
| tenant-vrf-evpn-type5-2-links | leaf4_qfx5240-64od | `$AC_IFL_1` et-0/0/12:1.0, `$AC_IFL_2` et-0/0/16:1.0, `$INSTANCE_NAME` tenant-6, `$IP_PREFIX_EXPORT_POL` BGP-AOS-Policy-tenant-6, `$LOOPBACK_IFL` lo0.7, `$LOOPBACK_V4` 10.0.1.11 |
| tenant-vrf-evpn-type5-4-links | leaf1_qfx5240-64od | `$AC_IFL_1` et-0/0/12:0.0, `$AC_IFL_2` et-0/0/16:0.0, `$AC_IFL_3` et-0/0/41:0.0, `$AC_IFL_4` et-0/0/41:1.0, `$INSTANCE_NAME` tenant-1, `$IP_PREFIX_EXPORT_POL` BGP-AOS-Policy-tenant-1 |
| tenant-vrf-evpn-type5-4-links | leaf2_qfx5240-64od | `$AC_IFL_1` et-0/0/12:0.0, `$AC_IFL_2` et-0/0/16:0.0, `$AC_IFL_3` et-0/0/41:0.0, `$AC_IFL_4` et-0/0/41:1.0, `$INSTANCE_NAME` tenant-5, `$IP_PREFIX_EXPORT_POL` BGP-AOS-Policy-tenant-5 |
| tenant-vrf-evpn-type5-4-links | leaf3_qfx5240-64od | `$AC_IFL_1` et-0/0/12:0.0, `$AC_IFL_2` et-0/0/16:0.0, `$AC_IFL_3` et-0/0/41:0.0, `$AC_IFL_4` et-0/0/41:1.0, `$INSTANCE_NAME` tenant-1, `$IP_PREFIX_EXPORT_POL` BGP-AOS-Policy-tenant-1 |
| tenant-vrf-evpn-type5-4-links | leaf4_qfx5240-64od | `$AC_IFL_1` et-0/0/12:0.0, `$AC_IFL_2` et-0/0/16:0.0, `$AC_IFL_3` et-0/0/41:0.0, `$AC_IFL_4` et-0/0/41:1.0, `$INSTANCE_NAME` tenant-5, `$IP_PREFIX_EXPORT_POL` BGP-AOS-Policy-tenant-5 |

A tenant VRF uses the same instance name, VNI and route target on every leaf; the route distinguisher starts with each leaf's own loopback.
