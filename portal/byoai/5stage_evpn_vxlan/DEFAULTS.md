# DEFAULTS — 5-Stage EVPN-VXLAN Data Center

Lab auto-fill values for the 5-Stage EVPN-VXLAN Data Center JVD. Every value is measured from the published device configurations under [`configuration/conf/`](../../conf/). Use them when the user picks a device and service and asks for lab values; otherwise ask for the deployment values.

## Device inventory

| Role | Device | Platform | OS | Loopback / router-id | `$ASN` |
|------|--------|----------|----|----------------------|--------|
| Super spine pair | superspine1_qfx5230-64cd | QFX5230-64CD | EVO | 192.168.252.0 | 64700 |
| Super spine pair | superspine2_qfx5230-64cd | QFX5230-64CD | EVO | 192.168.252.1 | 64700 |
| Compute POD spine | compute-spine1_qfx5210-64c | QFX5210-64C | Junos | 192.168.252.2 | 64701 |
| Compute POD spine | compute-spine2_qfx5210-64c | QFX5210-64C | Junos | 192.168.252.3 | 64701 |
| Compute POD leaf | compute-leaf1_qfx5120-48ym | QFX5120-48YM | Junos | 192.168.252.8 | 64704 |
| Compute POD leaf | compute-leaf2_qfx5120-48ym | QFX5120-48YM | Junos | 192.168.252.9 | 64705 |
| Storage POD spine | storage-spine1_qfx5220-32cd | QFX5220-32CD | EVO | 192.168.252.4 | 64702 |
| Storage POD spine | storage-spine2_qfx5220-32cd | QFX5220-32CD | EVO | 192.168.252.5 | 64702 |
| Storage POD leaf | storage-leaf1_qfx5130-32cd | QFX5130-32CD | EVO | 192.168.252.10 | 64706 |
| Storage POD leaf | storage-leaf2_qfx5130-32cd | QFX5130-32CD | EVO | 192.168.252.11 | 64707 |
| Services POD spine | services-spine1_qfx5210-64c | QFX5210-64C | Junos | 192.168.252.6 | 64703 |
| Services POD spine | services-spine2_qfx5210-64c | QFX5210-64C | Junos | 192.168.252.7 | 64703 |
| Services POD leaf (border) | services-leaf1_qfx5130-48c | QFX5130-48C | EVO | 192.168.252.12 | 64708 |
| Services POD leaf (border) | services-leaf2_qfx5130-48c | QFX5130-48C | EVO | 192.168.252.13 | 64709 |
| External gateway | external-gw_mx | MX | Junos | — | 65000 |

## Service examples (first measured instance per leaf)

| Service form | Device | Example values |
|--------------|--------|----------------|
| evpn-mac-vrf-51-vlans-igmp-snooping | compute-leaf1_qfx5120-48ym | `$AC_IFL_1` xe-0/0/0.0, `$AC_IFL_2` et-0/0/50.0, `$AC_IFL_3` ae1.0, `$BD_NAME_1` vn1400, `$BD_NAME_10` vn1409, `$BD_NAME_11` vn1410 |
| evpn-mac-vrf-51-vlans-igmp-snooping | compute-leaf2_qfx5120-48ym | `$AC_IFL_1` xe-0/0/1.0, `$AC_IFL_2` ae1.0, `$BD_NAME_1` vn1400, `$BD_NAME_10` vn1409, `$BD_NAME_11` vn1410, `$BD_NAME_12` vn1411 |
| evpn-mac-vrf-51-vlans-igmp-snooping-oism | storage-leaf1_qfx5130-32cd | `$AC_IFL_1` et-0/0/2.0, `$AC_IFL_2` et-0/0/8:0.0, `$AC_IFL_3` ae1.0, `$BD_NAME_1` vn1400, `$BD_NAME_10` vn1409, `$BD_NAME_11` vn1420 |
| evpn-mac-vrf-51-vlans-igmp-snooping-oism | storage-leaf2_qfx5130-32cd | `$AC_IFL_1` et-0/0/8:1.0, `$AC_IFL_2` ae1.0, `$BD_NAME_1` vn1400, `$BD_NAME_10` vn1409, `$BD_NAME_11` vn1420, `$BD_NAME_12` vn1421 |
| evpn-mac-vrf-51-vlans-igmp-snooping-oism | services-leaf1_qfx5130-48c | `$AC_IFL_1` et-0/0/5.0, `$AC_IFL_2` ae1.0, `$BD_NAME_1` vn1400, `$BD_NAME_10` vn1409, `$BD_NAME_11` vn1430, `$BD_NAME_12` vn1431 |
| evpn-mac-vrf-51-vlans-igmp-snooping-oism | services-leaf2_qfx5130-48c | `$AC_IFL_1` et-0/0/6.0, `$AC_IFL_2` ae1.0, `$BD_NAME_1` vn1400, `$BD_NAME_10` vn1409, `$BD_NAME_11` vn1430, `$BD_NAME_12` vn1431 |
| evpn-type5-vrf-10-irb | storage-leaf1_qfx5130-32cd | `$INSTANCE_NAME` purple, `$IP_PREFIX_EXPORT_POL` BGP-AOS-Policy-purple, `$IRB_IFL_1` irb.2800, `$IRB_IFL_10` irb.2809, `$IRB_IFL_2` irb.2801, `$IRB_IFL_3` irb.2802 |
| evpn-type5-vrf-10-irb | storage-leaf2_qfx5130-32cd | `$INSTANCE_NAME` purple, `$IP_PREFIX_EXPORT_POL` BGP-AOS-Policy-purple, `$IRB_IFL_1` irb.2800, `$IRB_IFL_10` irb.2809, `$IRB_IFL_2` irb.2801, `$IRB_IFL_3` irb.2802 |
| evpn-type5-vrf-dhcp-relay-10-irb | compute-leaf1_qfx5120-48ym | `$DHCP_RELAY_GROUP` green, `$INSTANCE_NAME` green, `$IP_PREFIX_EXPORT_POL` BGP-AOS-Policy-green, `$IRB_IFL_1` irb.2500, `$IRB_IFL_10` irb.2509, `$IRB_IFL_2` irb.2501 |
| evpn-type5-vrf-dhcp-relay-10-irb | compute-leaf2_qfx5120-48ym | `$DHCP_RELAY_GROUP` green, `$INSTANCE_NAME` green, `$IP_PREFIX_EXPORT_POL` BGP-AOS-Policy-green, `$IRB_IFL_1` irb.2500, `$IRB_IFL_10` irb.2509, `$IRB_IFL_2` irb.2501 |
| evpn-type5-vrf-dhcp-relay-20-irb | compute-leaf1_qfx5120-48ym | `$DHCP_RELAY_GROUP` red, `$INSTANCE_NAME` red, `$IP_PREFIX_EXPORT_POL` BGP-AOS-Policy-red, `$IRB_IFL_1` irb.400, `$IRB_IFL_10` irb.409, `$IRB_IFL_11` irb.410 |
| evpn-type5-vrf-dhcp-relay-20-irb | compute-leaf2_qfx5120-48ym | `$DHCP_RELAY_GROUP` red, `$INSTANCE_NAME` red, `$IP_PREFIX_EXPORT_POL` BGP-AOS-Policy-red, `$IRB_IFL_1` irb.400, `$IRB_IFL_10` irb.409, `$IRB_IFL_11` irb.410 |
| evpn-type5-vrf-dhcp-relay-20-irb | storage-leaf1_qfx5130-32cd | `$DHCP_RELAY_GROUP` red, `$INSTANCE_NAME` red, `$IP_PREFIX_EXPORT_POL` BGP-AOS-Policy-red, `$IRB_IFL_1` irb.400, `$IRB_IFL_10` irb.409, `$IRB_IFL_11` irb.420 |
| evpn-type5-vrf-dhcp-relay-20-irb | storage-leaf2_qfx5130-32cd | `$DHCP_RELAY_GROUP` red, `$INSTANCE_NAME` red, `$IP_PREFIX_EXPORT_POL` BGP-AOS-Policy-red, `$IRB_IFL_1` irb.400, `$IRB_IFL_10` irb.409, `$IRB_IFL_11` irb.420 |
| evpn-type5-vrf-ospf-pim-oism | compute-leaf1_qfx5120-48ym | `$DHCP_RELAY_GROUP` blue, `$INSTANCE_NAME` blue, `$IP_PREFIX_EXPORT_POL` BGP-AOS-Policy-blue, `$IRB_IFL_1` irb.3500, `$IRB_IFL_10` irb.1408, `$IRB_IFL_11` irb.1409 |
| evpn-type5-vrf-ospf-pim-oism | compute-leaf2_qfx5120-48ym | `$DHCP_RELAY_GROUP` blue, `$INSTANCE_NAME` blue, `$IP_PREFIX_EXPORT_POL` BGP-AOS-Policy-blue, `$IRB_IFL_1` irb.3500, `$IRB_IFL_10` irb.1408, `$IRB_IFL_11` irb.1409 |
| evpn-type5-vrf-ospf-pim-oism | storage-leaf1_qfx5130-32cd | `$DHCP_RELAY_GROUP` blue, `$INSTANCE_NAME` blue, `$IP_PREFIX_EXPORT_POL` BGP-AOS-Policy-blue, `$IRB_IFL_1` irb.3500, `$IRB_IFL_10` irb.1408, `$IRB_IFL_11` irb.1409 |
| evpn-type5-vrf-ospf-pim-oism | storage-leaf2_qfx5130-32cd | `$DHCP_RELAY_GROUP` blue, `$INSTANCE_NAME` blue, `$IP_PREFIX_EXPORT_POL` BGP-AOS-Policy-blue, `$IRB_IFL_1` irb.3500, `$IRB_IFL_10` irb.1408, `$IRB_IFL_11` irb.1409 |
| border-evpn-type5-vrf-ebgp | services-leaf1_qfx5130-48c | `$AC_IFL` et-0/0/7.599, `$ASN_CUSTOMER` 65000, `$BGP_EXPORT_POL` RoutesToExt-purple-external_router, `$BGP_GROUP` l3rtr, `$BGP_IMPORT_POL` RoutesFromExt-purple-external_router, `$CE_PEER_V4` 10.204.0.17 |
| border-evpn-type5-vrf-ebgp | services-leaf2_qfx5130-48c | `$AC_IFL` et-0/0/7.599, `$ASN_CUSTOMER` 65000, `$BGP_EXPORT_POL` RoutesToExt-purple-external_router, `$BGP_GROUP` l3rtr, `$BGP_IMPORT_POL` RoutesFromExt-purple-external_router, `$CE_PEER_V4` 10.204.0.19 |
| border-evpn-type5-vrf-ebgp-10-irb | services-leaf1_qfx5130-48c | `$AC_IFL` et-0/0/7.399, `$ASN_CUSTOMER` 65000, `$BGP_EXPORT_POL` RoutesToExt-yellow-external_router, `$BGP_GROUP` l3rtr, `$BGP_IMPORT_POL` RoutesFromExt-yellow-external_router, `$CE_PEER_V4` 10.204.0.1 |
| border-evpn-type5-vrf-ebgp-10-irb | services-leaf2_qfx5130-48c | `$AC_IFL` et-0/0/7.399, `$ASN_CUSTOMER` 65000, `$BGP_EXPORT_POL` RoutesToExt-yellow-external_router, `$BGP_GROUP` l3rtr, `$BGP_IMPORT_POL` RoutesFromExt-yellow-external_router, `$CE_PEER_V4` 10.204.0.3 |
| border-evpn-type5-vrf-ebgp-dhcp-relay | services-leaf1_qfx5130-48c | `$AC_IFL` et-0/0/7.499, `$ASN_CUSTOMER` 65000, `$BGP_EXPORT_POL` RoutesToExt-green-external_router, `$BGP_GROUP` l3rtr, `$BGP_IMPORT_POL` RoutesFromExt-green-external_router, `$CE_PEER_V4` 10.204.0.13 |
| border-evpn-type5-vrf-ebgp-dhcp-relay | services-leaf2_qfx5130-48c | `$AC_IFL` et-0/0/7.499, `$ASN_CUSTOMER` 65000, `$BGP_EXPORT_POL` RoutesToExt-green-external_router, `$BGP_GROUP` l3rtr, `$BGP_IMPORT_POL` RoutesFromExt-green-external_router, `$CE_PEER_V4` 10.204.0.15 |
| border-evpn-type5-vrf-ebgp-dhcp-relay-20-irb | services-leaf1_qfx5130-48c | `$AC_IFL` et-0/0/7.199, `$ASN_CUSTOMER` 65000, `$BGP_EXPORT_POL` RoutesToExt-red-external_router, `$BGP_GROUP` l3rtr, `$BGP_IMPORT_POL` RoutesFromExt-red-external_router, `$CE_PEER_V4` 10.204.0.5 |
| border-evpn-type5-vrf-ebgp-dhcp-relay-20-irb | services-leaf2_qfx5130-48c | `$AC_IFL` et-0/0/7.199, `$ASN_CUSTOMER` 65000, `$BGP_EXPORT_POL` RoutesToExt-red-external_router, `$BGP_GROUP` l3rtr, `$BGP_IMPORT_POL` RoutesFromExt-red-external_router, `$CE_PEER_V4` 10.204.0.7 |
| border-evpn-type5-vrf-ebgp-ospf-pim-oism | services-leaf1_qfx5130-48c | `$AC_ADDR_V4` 100.100.100.100, `$AC_IFL` et-0/0/7.299, `$ASN_CUSTOMER` 65000, `$BGP_EXPORT_POL` RoutesToExt-blue-external_router, `$BGP_GROUP` l3rtr, `$BGP_IMPORT_POL` RoutesFromExt-blue-external_router |
| border-evpn-type5-vrf-ebgp-ospf-pim-oism | services-leaf2_qfx5130-48c | `$AC_ADDR_V4` 100.100.100.100, `$AC_IFL` et-0/0/7.299, `$ASN_CUSTOMER` 65000, `$BGP_EXPORT_POL` RoutesToExt-blue-external_router, `$BGP_GROUP` l3rtr, `$BGP_IMPORT_POL` RoutesFromExt-blue-external_router |

A MAC-VRF or Type 5 VRF uses the same instance name, VNIs and route targets on every leaf that carries it; the route distinguisher starts with each leaf's own loopback.
