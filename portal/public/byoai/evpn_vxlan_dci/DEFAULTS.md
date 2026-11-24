# DEFAULTS — EVPN-VXLAN Data Center Interconnect

Lab auto-fill values for the EVPN-VXLAN Data Center Interconnect JVD. Every value is measured from the published device configurations under [`configuration/conf/`](../../conf/). Use them when the user picks a scenario, device and service and asks for lab values; otherwise ask for the deployment values. The DC1 hosts are captured once per scenario that uses them; their values do not change between scenarios, but a DC1 leaf's hostname does.

## Device inventory

| Scenario | Role | Device | Platform | OS | Loopback / router-id | `$ASN` |
|----------|------|--------|----------|----|----------------------|--------|
| OTT | DC1/DC2 border leaf (DCI gateway) | dc1-dc2_ott/dc1_borderleaf1_qfx5130-32cd | QFX5130-32CD | EVO | 192.168.255.2 | 64514 |
| OTT | DC1/DC2 border leaf (DCI gateway) | dc1-dc2_ott/dc1_borderleaf2_qfx5130-32cd | QFX5130-32CD | EVO | 192.168.255.3 | 64515 |
| OTT | ESI leaf | dc1-dc2_ott/dc1_esi-leaf1_qfx5120-48y | QFX5120-48Y | Junos | 192.168.255.4 | 64516 |
| OTT | ESI leaf | dc1-dc2_ott/dc1_esi-leaf2_qfx5120-48y | QFX5120-48Y | Junos | 192.168.255.5 | 64517 |
| OTT | Server leaf | dc1-dc2_ott/dc1_server-leaf1_qfx5120-48y | QFX5120-48Y | Junos | 192.168.255.6 | 64518 |
| OTT | DC1/DC2 spine | dc1-dc2_ott/dc1_spine1_qfx5220-32cd | QFX5220-32CD | EVO | 192.168.255.0 | 64512 |
| OTT | DC1/DC2 spine | dc1-dc2_ott/dc1_spine2_qfx5220-32cd | QFX5220-32CD | EVO | 192.168.255.1 | 64513 |
| OTT | DC1/DC2 border leaf (DCI gateway) | dc1-dc2_ott/dc2_borderleaf1_qfx5700 | QFX5700 | EVO | 192.168.254.2 | 65105 |
| OTT | DC1/DC2 border leaf (DCI gateway) | dc1-dc2_ott/dc2_borderleaf2_qfx5700 | QFX5700 | EVO | 192.168.254.3 | 65106 |
| OTT | ESI leaf | dc1-dc2_ott/dc2_esi-leaf1_qfx5120-48y | QFX5120-48Y | Junos | 192.168.254.4 | 65103 |
| OTT | ESI leaf | dc1-dc2_ott/dc2_esi-leaf2_qfx5120-48y | QFX5120-48Y | Junos | 192.168.254.5 | 65104 |
| OTT | Server leaf | dc1-dc2_ott/dc2_server-leaf1_qfx5120-48y | QFX5120-48Y | Junos | 192.168.254.6 | 65102 |
| OTT | DC1/DC2 spine | dc1-dc2_ott/dc2_spine1_qfx5120-48y-8c | QFX5120-48Y-8C | Junos | 192.168.254.0 | 65100 |
| OTT | DC1/DC2 spine | dc1-dc2_ott/dc2_spine2_qfx5120-48y-8c | QFX5120-48Y-8C | Junos | 192.168.254.1 | 65101 |
| Type 2 | DC1/DC2 border leaf (DCI gateway) | dc1-dc3_type2_seamless/dc1_borderleaf1_qfx5130-32cd | QFX5130-32CD | EVO | 192.168.255.2 | 64514 |
| Type 2 | DC1/DC2 border leaf (DCI gateway) | dc1-dc3_type2_seamless/dc1_borderleaf2_qfx5130-32cd | QFX5130-32CD | EVO | 192.168.255.3 | 64515 |
| Type 2 | DC1/DC3 leaf | dc1-dc3_type2_seamless/dc1_leaf1_qfx5120-48y | QFX5120-48Y | Junos | 192.168.255.6 | 64518 |
| Type 2 | DC1/DC3 leaf | dc1-dc3_type2_seamless/dc1_leaf2_qfx5120-48y | QFX5120-48Y | Junos | 192.168.255.4 | 64516 |
| Type 2 | DC1/DC3 leaf | dc1-dc3_type2_seamless/dc1_leaf3_qfx5120-48y | QFX5120-48Y | Junos | 192.168.255.5 | 64517 |
| Type 2 | DC1/DC2 spine | dc1-dc3_type2_seamless/dc1_spine1_qfx5220-32cd | QFX5220-32CD | EVO | 192.168.255.0 | 64512 |
| Type 2 | DC1/DC2 spine | dc1-dc3_type2_seamless/dc1_spine2_qfx5220-32cd | QFX5220-32CD | EVO | 192.168.255.1 | 64513 |
| Type 2 | DC1/DC3 leaf | dc1-dc3_type2_seamless/dc3_leaf1_qfx5120-48y | QFX5120-48Y | Junos | 192.168.253.0 | 64800 |
| Type 2 | DC1/DC3 leaf | dc1-dc3_type2_seamless/dc3_leaf2_qfx5120-48y | QFX5120-48Y | Junos | 192.168.253.1 | 64801 |
| Type 2 + Type 5 | DC1/DC2 border leaf (DCI gateway) | dc1-dc4_type2_type5_seamless/dc1_borderleaf1_qfx5130-32cd | QFX5130-32CD | EVO | 192.168.255.2 | 64514 |
| Type 2 + Type 5 | DC1/DC2 border leaf (DCI gateway) | dc1-dc4_type2_type5_seamless/dc1_borderleaf2_qfx5130-32cd | QFX5130-32CD | EVO | 192.168.255.3 | 64515 |
| Type 2 + Type 5 | DC1/DC3 leaf | dc1-dc4_type2_type5_seamless/dc1_leaf1_qfx5120-48y | QFX5120-48Y | Junos | 192.168.255.6 | 64518 |
| Type 2 + Type 5 | DC1/DC3 leaf | dc1-dc4_type2_type5_seamless/dc1_leaf2_qfx5120-48y | QFX5120-48Y | Junos | 192.168.255.4 | 64516 |
| Type 2 + Type 5 | DC1/DC3 leaf | dc1-dc4_type2_type5_seamless/dc1_leaf3_qfx5120-48y | QFX5120-48Y | Junos | 192.168.255.5 | 64517 |
| Type 2 + Type 5 | DC1/DC2 spine | dc1-dc4_type2_type5_seamless/dc1_spine1_qfx5220-32cd | QFX5220-32CD | EVO | 192.168.255.0 | 64512 |
| Type 2 + Type 5 | DC1/DC2 spine | dc1-dc4_type2_type5_seamless/dc1_spine2_qfx5220-32cd | QFX5220-32CD | EVO | 192.168.255.1 | 64513 |
| Type 2 + Type 5 | DC4 compute POD leaf | dc1-dc4_type2_type5_seamless/dc4_compute-leaf1_qfx5120-48ym | QFX5120-48YM | Junos | 192.168.252.6 | 64704 |
| Type 2 + Type 5 | DC4 compute POD leaf | dc1-dc4_type2_type5_seamless/dc4_compute-leaf2_qfx5120-48ym | QFX5120-48YM | Junos | 192.168.252.7 | 64705 |
| Type 2 + Type 5 | DC4 compute POD spine | dc1-dc4_type2_type5_seamless/dc4_compute-spine1_qfx5210-64c | QFX5210-64C | Junos | 192.168.252.0 | 64702 |
| Type 2 + Type 5 | DC4 compute POD spine | dc1-dc4_type2_type5_seamless/dc4_compute-spine2_qfx5210-64c | QFX5210-64C | Junos | 192.168.252.1 | 64702 |
| Type 2 + Type 5 | DC4 services POD leaf (DCI gateway) | dc1-dc4_type2_type5_seamless/dc4_services-leaf1_qfx5130-48c | QFX5130-48C | EVO | 192.168.252.8 | 64708 |
| Type 2 + Type 5 | DC4 services POD leaf (DCI gateway) | dc1-dc4_type2_type5_seamless/dc4_services-leaf2_qfx5130-48c | QFX5130-48C | EVO | 192.168.252.9 | 64709 |
| Type 2 + Type 5 | DC4 services POD spine | dc1-dc4_type2_type5_seamless/dc4_services-spine1_qfx5210-64c | QFX5210-64C | Junos | 192.168.252.2 | 64706 |
| Type 2 + Type 5 | DC4 services POD spine | dc1-dc4_type2_type5_seamless/dc4_services-spine2_qfx5210-64c | QFX5210-64C | Junos | 192.168.252.3 | 64706 |
| Type 2 + Type 5 | DC4 storage POD leaf | dc1-dc4_type2_type5_seamless/dc4_storage-leaf1_qfx5130-32cd | QFX5130-32CD | EVO | 192.168.252.10 | 64712 |
| Type 2 + Type 5 | DC4 storage POD leaf | dc1-dc4_type2_type5_seamless/dc4_storage-leaf2_qfx5130-32cd | QFX5130-32CD | EVO | 192.168.252.11 | 64713 |
| Type 2 + Type 5 | DC4 storage POD spine | dc1-dc4_type2_type5_seamless/dc4_storage-spine1_qfx5220-32cd | QFX5220-32CD | EVO | 192.168.252.4 | 64710 |
| Type 2 + Type 5 | DC4 storage POD spine | dc1-dc4_type2_type5_seamless/dc4_storage-spine2_qfx5220-32cd | QFX5220-32CD | EVO | 192.168.252.5 | 64710 |
| Type 2 + Type 5 | DC4 super spine | dc1-dc4_type2_type5_seamless/dc4_superspine1_qfx5230-64cd | QFX5230-64CD | EVO | 192.168.252.12 | 64701 |
| Type 2 + Type 5 | DC4 super spine | dc1-dc4_type2_type5_seamless/dc4_superspine2_qfx5230-64cd | QFX5230-64CD | EVO | 192.168.252.13 | 64701 |

## Service examples (first measured instance per device)

| Service form | Device | Example values |
|--------------|--------|----------------|
| evpn-mac-vrf-10-vlans | dc1-dc4_type2_type5_seamless/dc4_storage-leaf1_qfx5130-32cd | `$AC_IFL_1` et-0/0/8:0.0, `$AC_IFL_2` ae1.0, `$BD_NAME_1` vn2500, `$BD_NAME_10` vn2509, `$BD_NAME_2` vn2501, `$BD_NAME_3` vn2502 |
| evpn-mac-vrf-10-vlans | dc1-dc4_type2_type5_seamless/dc4_storage-leaf2_qfx5130-32cd | `$AC_IFL_1` et-0/0/8:1.0, `$AC_IFL_2` ae1.0, `$BD_NAME_1` vn2500, `$BD_NAME_10` vn2509, `$BD_NAME_2` vn2501, `$BD_NAME_3` vn2502 |
| evpn-mac-vrf-20-vlans | dc1-dc3_type2_seamless/dc1_leaf2_qfx5120-48y | `$AC_IFL_1` xe-0/0/0.0, `$AC_IFL_2` ae1.0, `$AC_IFL_3` ae2.0, `$BD_NAME_1` vn1400, `$BD_NAME_10` vn1409, `$BD_NAME_11` vn400 |
| evpn-mac-vrf-20-vlans | dc1-dc3_type2_seamless/dc1_leaf3_qfx5120-48y | `$AC_IFL_1` xe-0/0/0.0, `$AC_IFL_2` ae1.0, `$AC_IFL_3` ae2.0, `$BD_NAME_1` vn1400, `$BD_NAME_10` vn1409, `$BD_NAME_11` vn400 |
| evpn-mac-vrf-30-vlans | dc1-dc3_type2_seamless/dc1_leaf1_qfx5120-48y | `$AC_IFL` xe-0/0/0.0, `$BD_NAME_1` vn1400, `$BD_NAME_10` vn1409, `$BD_NAME_11` vn2700, `$BD_NAME_12` vn2701, `$BD_NAME_13` vn2702 |
| evpn-mac-vrf-40-vlans | dc1-dc2_ott/dc1_esi-leaf1_qfx5120-48y | `$AC_IFL_1` xe-0/0/0.0, `$AC_IFL_2` ae1.0, `$AC_IFL_3` ae2.0, `$BD_NAME_1` vn1400, `$BD_NAME_10` vn1409, `$BD_NAME_11` vn1600 |
| evpn-mac-vrf-40-vlans | dc1-dc2_ott/dc1_esi-leaf2_qfx5120-48y | `$AC_IFL_1` xe-0/0/0.0, `$AC_IFL_2` ae1.0, `$AC_IFL_3` ae2.0, `$BD_NAME_1` vn1400, `$BD_NAME_10` vn1409, `$BD_NAME_11` vn1600 |
| evpn-mac-vrf-40-vlans | dc1-dc2_ott/dc1_server-leaf1_qfx5120-48y | `$AC_IFL` xe-0/0/0.0, `$BD_NAME_1` vn1400, `$BD_NAME_10` vn1409, `$BD_NAME_11` vn1600, `$BD_NAME_12` vn1601, `$BD_NAME_13` vn1602 |
| evpn-mac-vrf-40-vlans | dc1-dc2_ott/dc2_esi-leaf1_qfx5120-48y | `$AC_IFL_1` xe-0/0/2.0, `$AC_IFL_2` ae1.0, `$AC_IFL_3` ae2.0, `$BD_NAME_1` vn1400, `$BD_NAME_10` vn1409, `$BD_NAME_11` vn1800 |
| evpn-mac-vrf-40-vlans | dc1-dc2_ott/dc2_esi-leaf2_qfx5120-48y | `$AC_IFL_1` xe-0/0/2.0, `$AC_IFL_2` ae1.0, `$AC_IFL_3` ae2.0, `$BD_NAME_1` vn1400, `$BD_NAME_10` vn1409, `$BD_NAME_11` vn1800 |
| evpn-mac-vrf-40-vlans | dc1-dc2_ott/dc2_server-leaf1_qfx5120-48y | `$AC_IFL` xe-0/0/0.0, `$BD_NAME_1` vn1400, `$BD_NAME_10` vn1409, `$BD_NAME_11` vn1800, `$BD_NAME_12` vn1801, `$BD_NAME_13` vn1802 |
| evpn-mac-vrf-40-vlans | dc1-dc4_type2_type5_seamless/dc1_leaf2_qfx5120-48y | `$AC_IFL_1` xe-0/0/0.0, `$AC_IFL_2` ae1.0, `$AC_IFL_3` ae2.0, `$BD_NAME_1` vn1400, `$BD_NAME_10` vn1409, `$BD_NAME_11` vn1600 |
| evpn-mac-vrf-40-vlans | dc1-dc4_type2_type5_seamless/dc1_leaf3_qfx5120-48y | `$AC_IFL_1` xe-0/0/0.0, `$AC_IFL_2` ae1.0, `$AC_IFL_3` ae2.0, `$BD_NAME_1` vn1400, `$BD_NAME_10` vn1409, `$BD_NAME_11` vn1600 |
| evpn-mac-vrf-40-vlans | dc1-dc4_type2_type5_seamless/dc4_compute-leaf1_qfx5120-48ym | `$AC_IFL_1` xe-0/0/0.0, `$AC_IFL_2` ae1.0, `$BD_NAME_1` vn1200, `$BD_NAME_10` vn1209, `$BD_NAME_11` vn1400, `$BD_NAME_12` vn1401 |
| evpn-mac-vrf-40-vlans | dc1-dc4_type2_type5_seamless/dc4_compute-leaf2_qfx5120-48ym | `$AC_IFL_1` xe-0/0/1.0, `$AC_IFL_2` ae1.0, `$BD_NAME_1` vn1200, `$BD_NAME_10` vn1209, `$BD_NAME_11` vn1400, `$BD_NAME_12` vn1401 |
| evpn-mac-vrf-50-vlans | dc1-dc4_type2_type5_seamless/dc1_leaf1_qfx5120-48y | `$AC_IFL` xe-0/0/0.0, `$BD_NAME_1` vn1400, `$BD_NAME_10` vn1409, `$BD_NAME_11` vn1600, `$BD_NAME_12` vn1601, `$BD_NAME_13` vn1602 |
| evpn-mac-vrf-interconnect-20-vlans | dc1-dc3_type2_seamless/dc1_borderleaf1_qfx5130-32cd | `$BD_NAME_1` vn1400, `$BD_NAME_10` vn1409, `$BD_NAME_11` vn400, `$BD_NAME_12` vn401, `$BD_NAME_13` vn402, `$BD_NAME_14` vn403 |
| evpn-mac-vrf-interconnect-20-vlans | dc1-dc3_type2_seamless/dc1_borderleaf2_qfx5130-32cd | `$BD_NAME_1` vn1400, `$BD_NAME_10` vn1409, `$BD_NAME_11` vn400, `$BD_NAME_12` vn401, `$BD_NAME_13` vn402, `$BD_NAME_14` vn403 |
| evpn-mac-vrf-interconnect-20-vlans | dc1-dc3_type2_seamless/dc3_leaf1_qfx5120-48y | `$AC_IFL_1` xe-0/0/0.0, `$AC_IFL_2` ae1.0, `$BD_NAME_1` vn1400, `$BD_NAME_10` vn1409, `$BD_NAME_11` vn400, `$BD_NAME_12` vn401 |
| evpn-mac-vrf-interconnect-20-vlans | dc1-dc3_type2_seamless/dc3_leaf2_qfx5120-48y | `$AC_IFL_1` xe-0/0/5.0, `$AC_IFL_2` ae1.0, `$BD_NAME_1` vn1400, `$BD_NAME_10` vn1409, `$BD_NAME_11` vn400, `$BD_NAME_12` vn401 |
| evpn-mac-vrf-interconnect-50-vlans | dc1-dc4_type2_type5_seamless/dc1_borderleaf1_qfx5130-32cd | `$BD_NAME_1` vn1400, `$BD_NAME_10` vn1409, `$BD_NAME_11` vn1600, `$BD_NAME_12` vn1601, `$BD_NAME_13` vn1602, `$BD_NAME_14` vn1603 |
| evpn-mac-vrf-interconnect-50-vlans | dc1-dc4_type2_type5_seamless/dc1_borderleaf2_qfx5130-32cd | `$BD_NAME_1` vn1400, `$BD_NAME_10` vn1409, `$BD_NAME_11` vn1600, `$BD_NAME_12` vn1601, `$BD_NAME_13` vn1602, `$BD_NAME_14` vn1603 |
| evpn-mac-vrf-interconnect-50-vlans | dc1-dc4_type2_type5_seamless/dc4_services-leaf1_qfx5130-48c | `$BD_NAME_1` vn1200, `$BD_NAME_10` vn1209, `$BD_NAME_11` vn1400, `$BD_NAME_12` vn1401, `$BD_NAME_13` vn1402, `$BD_NAME_14` vn1403 |
| evpn-mac-vrf-interconnect-50-vlans | dc1-dc4_type2_type5_seamless/dc4_services-leaf2_qfx5130-48c | `$BD_NAME_1` vn1200, `$BD_NAME_10` vn1209, `$BD_NAME_11` vn1400, `$BD_NAME_12` vn1401, `$BD_NAME_13` vn1402, `$BD_NAME_14` vn1403 |
| evpn-type5-vrf-10-irb | dc1-dc3_type2_seamless/dc1_leaf1_qfx5120-48y | `$INSTANCE_NAME` green, `$IP_PREFIX_EXPORT_POL` BGP-AOS-Policy-green, `$IRB_IFL_1` irb.2700, `$IRB_IFL_10` irb.2709, `$IRB_IFL_2` irb.2701, `$IRB_IFL_3` irb.2702 |
| evpn-type5-vrf-10-irb | dc1-dc4_type2_type5_seamless/dc1_leaf1_qfx5120-48y | `$INSTANCE_NAME` green, `$IP_PREFIX_EXPORT_POL` BGP-AOS-Policy-green, `$IRB_IFL_1` irb.2700, `$IRB_IFL_10` irb.2709, `$IRB_IFL_2` irb.2701, `$IRB_IFL_3` irb.2702 |
| evpn-type5-vrf-10-irb | dc1-dc4_type2_type5_seamless/dc4_storage-leaf1_qfx5130-32cd | `$INSTANCE_NAME` green, `$IP_PREFIX_EXPORT_POL` BGP-AOS-Policy-green, `$IRB_IFL_1` irb.2500, `$IRB_IFL_10` irb.2509, `$IRB_IFL_2` irb.2501, `$IRB_IFL_3` irb.2502 |
| evpn-type5-vrf-10-irb | dc1-dc4_type2_type5_seamless/dc4_storage-leaf2_qfx5130-32cd | `$INSTANCE_NAME` green, `$IP_PREFIX_EXPORT_POL` BGP-AOS-Policy-green, `$IRB_IFL_1` irb.2500, `$IRB_IFL_10` irb.2509, `$IRB_IFL_2` irb.2501, `$IRB_IFL_3` irb.2502 |
| evpn-type5-vrf-dhcp-relay-20-irb-blue | dc1-dc2_ott/dc1_esi-leaf1_qfx5120-48y | `$DHCP_RELAY_GROUP` blue, `$INSTANCE_NAME` blue, `$IP_PREFIX_EXPORT_POL` BGP-AOS-Policy-blue, `$IRB_IFL_1` irb.1400, `$IRB_IFL_10` irb.1409, `$IRB_IFL_11` irb.1600 |
| evpn-type5-vrf-dhcp-relay-20-irb-blue | dc1-dc2_ott/dc1_esi-leaf2_qfx5120-48y | `$DHCP_RELAY_GROUP` blue, `$INSTANCE_NAME` blue, `$IP_PREFIX_EXPORT_POL` BGP-AOS-Policy-blue, `$IRB_IFL_1` irb.1400, `$IRB_IFL_10` irb.1409, `$IRB_IFL_11` irb.1600 |
| evpn-type5-vrf-dhcp-relay-20-irb-blue | dc1-dc2_ott/dc1_server-leaf1_qfx5120-48y | `$DHCP_RELAY_GROUP` blue, `$INSTANCE_NAME` blue, `$IP_PREFIX_EXPORT_POL` BGP-AOS-Policy-blue, `$IRB_IFL_1` irb.1400, `$IRB_IFL_10` irb.1409, `$IRB_IFL_11` irb.1600 |
| evpn-type5-vrf-dhcp-relay-20-irb-blue | dc1-dc4_type2_type5_seamless/dc1_leaf1_qfx5120-48y | `$DHCP_RELAY_GROUP` blue, `$INSTANCE_NAME` blue, `$IP_PREFIX_EXPORT_POL` BGP-AOS-Policy-blue, `$IRB_IFL_1` irb.1400, `$IRB_IFL_10` irb.1409, `$IRB_IFL_11` irb.1600 |
| evpn-type5-vrf-dhcp-relay-20-irb-blue | dc1-dc4_type2_type5_seamless/dc1_leaf2_qfx5120-48y | `$DHCP_RELAY_GROUP` blue, `$INSTANCE_NAME` blue, `$IP_PREFIX_EXPORT_POL` BGP-AOS-Policy-blue, `$IRB_IFL_1` irb.1400, `$IRB_IFL_10` irb.1409, `$IRB_IFL_11` irb.1600 |
| evpn-type5-vrf-dhcp-relay-20-irb-blue | dc1-dc4_type2_type5_seamless/dc1_leaf3_qfx5120-48y | `$DHCP_RELAY_GROUP` blue, `$INSTANCE_NAME` blue, `$IP_PREFIX_EXPORT_POL` BGP-AOS-Policy-blue, `$IRB_IFL_1` irb.1400, `$IRB_IFL_10` irb.1409, `$IRB_IFL_11` irb.1600 |
| evpn-type5-vrf-dhcp-relay-20-irb-blue | dc1-dc4_type2_type5_seamless/dc4_compute-leaf1_qfx5120-48ym | `$DHCP_RELAY_GROUP` blue, `$INSTANCE_NAME` blue, `$IP_PREFIX_EXPORT_POL` BGP-AOS-Policy-blue, `$IRB_IFL_1` irb.1400, `$IRB_IFL_10` irb.1409, `$IRB_IFL_11` irb.2200 |
| evpn-type5-vrf-dhcp-relay-20-irb-blue | dc1-dc4_type2_type5_seamless/dc4_compute-leaf2_qfx5120-48ym | `$DHCP_RELAY_GROUP` blue, `$INSTANCE_NAME` blue, `$IP_PREFIX_EXPORT_POL` BGP-AOS-Policy-blue, `$IRB_IFL_1` irb.1400, `$IRB_IFL_10` irb.1409, `$IRB_IFL_11` irb.2200 |
| evpn-type5-vrf-dhcp-relay-20-irb-red | dc1-dc2_ott/dc1_esi-leaf1_qfx5120-48y | `$DHCP_RELAY_GROUP` red, `$DHCP_SERVER_V4` 192.168.36.100, `$INSTANCE_NAME` red, `$IP_PREFIX_EXPORT_POL` BGP-AOS-Policy-red, `$IRB_IFL_1` irb.400, `$IRB_IFL_10` irb.409 |
| evpn-type5-vrf-dhcp-relay-20-irb-red | dc1-dc2_ott/dc1_esi-leaf2_qfx5120-48y | `$DHCP_RELAY_GROUP` red, `$DHCP_SERVER_V4` 192.168.36.100, `$INSTANCE_NAME` red, `$IP_PREFIX_EXPORT_POL` BGP-AOS-Policy-red, `$IRB_IFL_1` irb.400, `$IRB_IFL_10` irb.409 |
| evpn-type5-vrf-dhcp-relay-20-irb-red | dc1-dc2_ott/dc1_server-leaf1_qfx5120-48y | `$DHCP_RELAY_GROUP` red, `$DHCP_SERVER_V4` 192.168.36.100, `$INSTANCE_NAME` red, `$IP_PREFIX_EXPORT_POL` BGP-AOS-Policy-red, `$IRB_IFL_1` irb.400, `$IRB_IFL_10` irb.409 |
| evpn-type5-vrf-dhcp-relay-20-irb-red | dc1-dc4_type2_type5_seamless/dc1_leaf1_qfx5120-48y | `$DHCP_RELAY_GROUP` red, `$DHCP_SERVER_V4` 192.168.36.100, `$INSTANCE_NAME` red, `$IP_PREFIX_EXPORT_POL` BGP-AOS-Policy-red, `$IRB_IFL_1` irb.400, `$IRB_IFL_10` irb.409 |
| evpn-type5-vrf-dhcp-relay-20-irb-red | dc1-dc4_type2_type5_seamless/dc1_leaf2_qfx5120-48y | `$DHCP_RELAY_GROUP` red, `$DHCP_SERVER_V4` 192.168.36.100, `$INSTANCE_NAME` red, `$IP_PREFIX_EXPORT_POL` BGP-AOS-Policy-red, `$IRB_IFL_1` irb.400, `$IRB_IFL_10` irb.409 |
| evpn-type5-vrf-dhcp-relay-20-irb-red | dc1-dc4_type2_type5_seamless/dc1_leaf3_qfx5120-48y | `$DHCP_RELAY_GROUP` red, `$DHCP_SERVER_V4` 192.168.36.100, `$INSTANCE_NAME` red, `$IP_PREFIX_EXPORT_POL` BGP-AOS-Policy-red, `$IRB_IFL_1` irb.400, `$IRB_IFL_10` irb.409 |
| evpn-type5-vrf-dhcp-relay-20-irb-red | dc1-dc4_type2_type5_seamless/dc4_compute-leaf1_qfx5120-48ym | `$DHCP_RELAY_GROUP` red, `$DHCP_SERVER_V4` 192.168.37.100, `$INSTANCE_NAME` red, `$IP_PREFIX_EXPORT_POL` BGP-AOS-Policy-red, `$IRB_IFL_1` irb.400, `$IRB_IFL_10` irb.409 |
| evpn-type5-vrf-dhcp-relay-20-irb-red | dc1-dc4_type2_type5_seamless/dc4_compute-leaf2_qfx5120-48ym | `$DHCP_RELAY_GROUP` red, `$DHCP_SERVER_V4` 192.168.37.100, `$INSTANCE_NAME` red, `$IP_PREFIX_EXPORT_POL` BGP-AOS-Policy-red, `$IRB_IFL_1` irb.400, `$IRB_IFL_10` irb.409 |
| evpn-type5-vrf-dhcp-relay-overrides-10-irb-blue | dc1-dc3_type2_seamless/dc1_leaf1_qfx5120-48y | `$DHCP_RELAY_GROUP` blue, `$INSTANCE_NAME` blue, `$IP_PREFIX_EXPORT_POL` BGP-AOS-Policy-blue, `$IRB_IFL_1` irb.1400, `$IRB_IFL_10` irb.1409, `$IRB_IFL_2` irb.1401 |
| evpn-type5-vrf-dhcp-relay-overrides-10-irb-blue | dc1-dc3_type2_seamless/dc1_leaf2_qfx5120-48y | `$DHCP_RELAY_GROUP` blue, `$INSTANCE_NAME` blue, `$IP_PREFIX_EXPORT_POL` BGP-AOS-Policy-blue, `$IRB_IFL_1` irb.1400, `$IRB_IFL_10` irb.1409, `$IRB_IFL_2` irb.1401 |
| evpn-type5-vrf-dhcp-relay-overrides-10-irb-blue | dc1-dc3_type2_seamless/dc1_leaf3_qfx5120-48y | `$DHCP_RELAY_GROUP` blue, `$INSTANCE_NAME` blue, `$IP_PREFIX_EXPORT_POL` BGP-AOS-Policy-blue, `$IRB_IFL_1` irb.1400, `$IRB_IFL_10` irb.1409, `$IRB_IFL_2` irb.1401 |
| evpn-type5-vrf-dhcp-relay-overrides-10-irb-red | dc1-dc3_type2_seamless/dc1_leaf1_qfx5120-48y | `$DHCP_RELAY_GROUP` red, `$INSTANCE_NAME` red, `$IP_PREFIX_EXPORT_POL` BGP-AOS-Policy-red, `$IRB_IFL_1` irb.400, `$IRB_IFL_10` irb.409, `$IRB_IFL_2` irb.401 |
| evpn-type5-vrf-dhcp-relay-overrides-10-irb-red | dc1-dc3_type2_seamless/dc1_leaf2_qfx5120-48y | `$DHCP_RELAY_GROUP` red, `$INSTANCE_NAME` red, `$IP_PREFIX_EXPORT_POL` BGP-AOS-Policy-red, `$IRB_IFL_1` irb.400, `$IRB_IFL_10` irb.409, `$IRB_IFL_2` irb.401 |
| evpn-type5-vrf-dhcp-relay-overrides-10-irb-red | dc1-dc3_type2_seamless/dc1_leaf3_qfx5120-48y | `$DHCP_RELAY_GROUP` red, `$INSTANCE_NAME` red, `$IP_PREFIX_EXPORT_POL` BGP-AOS-Policy-red, `$IRB_IFL_1` irb.400, `$IRB_IFL_10` irb.409, `$IRB_IFL_2` irb.401 |
| evpn-type5-vrf-dhcp-relay-overrides-20-irb-blue | dc1-dc2_ott/dc2_esi-leaf1_qfx5120-48y | `$DHCP_RELAY_GROUP` blue, `$INSTANCE_NAME` blue, `$IP_PREFIX_EXPORT_POL` BGP-AOS-Policy-blue, `$IRB_IFL_1` irb.1400, `$IRB_IFL_10` irb.1409, `$IRB_IFL_11` irb.1800 |
| evpn-type5-vrf-dhcp-relay-overrides-20-irb-blue | dc1-dc2_ott/dc2_esi-leaf2_qfx5120-48y | `$DHCP_RELAY_GROUP` blue, `$INSTANCE_NAME` blue, `$IP_PREFIX_EXPORT_POL` BGP-AOS-Policy-blue, `$IRB_IFL_1` irb.1400, `$IRB_IFL_10` irb.1409, `$IRB_IFL_11` irb.1800 |
| evpn-type5-vrf-dhcp-relay-overrides-20-irb-blue | dc1-dc2_ott/dc2_server-leaf1_qfx5120-48y | `$DHCP_RELAY_GROUP` blue, `$INSTANCE_NAME` blue, `$IP_PREFIX_EXPORT_POL` BGP-AOS-Policy-blue, `$IRB_IFL_1` irb.1400, `$IRB_IFL_10` irb.1409, `$IRB_IFL_11` irb.1800 |
| evpn-type5-vrf-dhcp-relay-overrides-20-irb-red | dc1-dc2_ott/dc2_esi-leaf1_qfx5120-48y | `$DHCP_RELAY_GROUP` red, `$INSTANCE_NAME` red, `$IP_PREFIX_EXPORT_POL` BGP-AOS-Policy-red, `$IRB_IFL_1` irb.400, `$IRB_IFL_10` irb.409, `$IRB_IFL_11` irb.800 |
| evpn-type5-vrf-dhcp-relay-overrides-20-irb-red | dc1-dc2_ott/dc2_esi-leaf2_qfx5120-48y | `$DHCP_RELAY_GROUP` red, `$INSTANCE_NAME` red, `$IP_PREFIX_EXPORT_POL` BGP-AOS-Policy-red, `$IRB_IFL_1` irb.400, `$IRB_IFL_10` irb.409, `$IRB_IFL_11` irb.800 |
| evpn-type5-vrf-dhcp-relay-overrides-20-irb-red | dc1-dc2_ott/dc2_server-leaf1_qfx5120-48y | `$DHCP_RELAY_GROUP` red, `$INSTANCE_NAME` red, `$IP_PREFIX_EXPORT_POL` BGP-AOS-Policy-red, `$IRB_IFL_1` irb.400, `$IRB_IFL_10` irb.409, `$IRB_IFL_11` irb.800 |
| evpn-type5-vrf-interconnect-10-irb | dc1-dc4_type2_type5_seamless/dc1_borderleaf1_qfx5130-32cd | `$INSTANCE_NAME` green, `$IP_PREFIX_EXPORT_POL` BGP-AOS-Policy-green, `$IRB_IFL_1` irb.2700, `$IRB_IFL_10` irb.2709, `$IRB_IFL_2` irb.2701, `$IRB_IFL_3` irb.2702 |
| evpn-type5-vrf-interconnect-10-irb | dc1-dc4_type2_type5_seamless/dc1_borderleaf2_qfx5130-32cd | `$INSTANCE_NAME` green, `$IP_PREFIX_EXPORT_POL` BGP-AOS-Policy-green, `$IRB_IFL_1` irb.2700, `$IRB_IFL_10` irb.2709, `$IRB_IFL_2` irb.2701, `$IRB_IFL_3` irb.2702 |
| evpn-type5-vrf-interconnect-10-irb | dc1-dc4_type2_type5_seamless/dc4_services-leaf1_qfx5130-48c | `$INSTANCE_NAME` green, `$IP_PREFIX_EXPORT_POL` BGP-AOS-Policy-green, `$IRB_IFL_1` irb.2500, `$IRB_IFL_10` irb.2509, `$IRB_IFL_2` irb.2501, `$IRB_IFL_3` irb.2502 |
| evpn-type5-vrf-interconnect-10-irb | dc1-dc4_type2_type5_seamless/dc4_services-leaf2_qfx5130-48c | `$INSTANCE_NAME` green, `$IP_PREFIX_EXPORT_POL` BGP-AOS-Policy-green, `$IRB_IFL_1` irb.2500, `$IRB_IFL_10` irb.2509, `$IRB_IFL_2` irb.2501, `$IRB_IFL_3` irb.2502 |
| evpn-type5-vrf-ebgp-dhcp-relay-blue | dc1-dc2_ott/dc1_borderleaf1_qfx5130-32cd | `$AC_IFL` et-0/0/8:0.299, `$ASN_CUSTOMER` 65000, `$BGP_EXPORT_POL` RoutesToExt-blue-external_router, `$BGP_GROUP` l3rtr, `$BGP_IMPORT_POL` RoutesFromExt-blue-external_router, `$CE_PEER_V4` 10.200.0.5 |
| evpn-type5-vrf-ebgp-dhcp-relay-blue | dc1-dc2_ott/dc1_borderleaf2_qfx5130-32cd | `$AC_IFL` et-0/0/8:0.299, `$ASN_CUSTOMER` 65000, `$BGP_EXPORT_POL` RoutesToExt-blue-external_router, `$BGP_GROUP` l3rtr, `$BGP_IMPORT_POL` RoutesFromExt-blue-external_router, `$CE_PEER_V4` 10.200.0.7 |
| evpn-type5-vrf-ebgp-dhcp-relay-blue | dc1-dc2_ott/dc2_borderleaf1_qfx5700 | `$AC_IFL` et-0/2/0:2.299, `$ASN_CUSTOMER` 65000, `$BGP_EXPORT_POL` RoutesToExt-blue-external_router, `$BGP_GROUP` l3rtr, `$BGP_IMPORT_POL` RoutesFromExt-blue-external_router, `$CE_PEER_V4` 10.200.1.5 |
| evpn-type5-vrf-ebgp-dhcp-relay-blue | dc1-dc2_ott/dc2_borderleaf2_qfx5700 | `$AC_IFL` et-0/2/0:2.299, `$ASN_CUSTOMER` 65000, `$BGP_EXPORT_POL` RoutesToExt-blue-external_router, `$BGP_GROUP` l3rtr, `$BGP_IMPORT_POL` RoutesFromExt-blue-external_router, `$CE_PEER_V4` 10.200.1.7 |
| evpn-type5-vrf-ebgp-dhcp-relay-overrides-10-irb-blue | dc1-dc3_type2_seamless/dc1_borderleaf1_qfx5130-32cd | `$AC_IFL` et-0/0/8:0.299, `$ASN_CUSTOMER` 65000, `$BGP_EXPORT_POL` RoutesToExt-blue-external_router, `$BGP_GROUP` l3rtr, `$BGP_IMPORT_POL` RoutesFromExt-blue-external_router, `$CE_PEER_V4` 10.200.0.5 |
| evpn-type5-vrf-ebgp-dhcp-relay-overrides-10-irb-blue | dc1-dc3_type2_seamless/dc1_borderleaf2_qfx5130-32cd | `$AC_IFL` et-0/0/8:0.299, `$ASN_CUSTOMER` 65000, `$BGP_EXPORT_POL` RoutesToExt-blue-external_router, `$BGP_GROUP` l3rtr, `$BGP_IMPORT_POL` RoutesFromExt-blue-external_router, `$CE_PEER_V4` 10.200.0.7 |
| evpn-type5-vrf-ebgp-dhcp-relay-overrides-10-irb-red | dc1-dc3_type2_seamless/dc1_borderleaf1_qfx5130-32cd | `$AC_IFL` et-0/0/8:0.199, `$ASN_CUSTOMER` 65000, `$BGP_EXPORT_POL` RoutesToExt-red-external_router, `$BGP_GROUP` l3rtr, `$BGP_IMPORT_POL` RoutesFromExt-red-external_router, `$CE_PEER_V4` 10.200.0.1 |
| evpn-type5-vrf-ebgp-dhcp-relay-overrides-10-irb-red | dc1-dc3_type2_seamless/dc1_borderleaf2_qfx5130-32cd | `$AC_IFL` et-0/0/8:0.199, `$ASN_CUSTOMER` 65000, `$BGP_EXPORT_POL` RoutesToExt-red-external_router, `$BGP_GROUP` l3rtr, `$BGP_IMPORT_POL` RoutesFromExt-red-external_router, `$CE_PEER_V4` 10.200.0.3 |
| evpn-type5-vrf-ebgp-dhcp-relay-red | dc1-dc2_ott/dc1_borderleaf1_qfx5130-32cd | `$AC_IFL` et-0/0/8:0.199, `$ASN_CUSTOMER` 65000, `$BGP_EXPORT_POL` RoutesToExt-red-external_router, `$BGP_GROUP` l3rtr, `$BGP_IMPORT_POL` RoutesFromExt-red-external_router, `$CE_PEER_V4` 10.200.0.1 |
| evpn-type5-vrf-ebgp-dhcp-relay-red | dc1-dc2_ott/dc1_borderleaf2_qfx5130-32cd | `$AC_IFL` et-0/0/8:0.199, `$ASN_CUSTOMER` 65000, `$BGP_EXPORT_POL` RoutesToExt-red-external_router, `$BGP_GROUP` l3rtr, `$BGP_IMPORT_POL` RoutesFromExt-red-external_router, `$CE_PEER_V4` 10.200.0.3 |
| evpn-type5-vrf-ebgp-dhcp-relay-red | dc1-dc2_ott/dc2_borderleaf1_qfx5700 | `$AC_IFL` et-0/2/0:2.199, `$ASN_CUSTOMER` 65000, `$BGP_EXPORT_POL` RoutesToExt-red-external_router, `$BGP_GROUP` l3rtr, `$BGP_IMPORT_POL` RoutesFromExt-red-external_router, `$CE_PEER_V4` 10.200.1.1 |
| evpn-type5-vrf-ebgp-dhcp-relay-red | dc1-dc2_ott/dc2_borderleaf2_qfx5700 | `$AC_IFL` et-0/2/0:2.199, `$ASN_CUSTOMER` 65000, `$BGP_EXPORT_POL` RoutesToExt-red-external_router, `$BGP_GROUP` l3rtr, `$BGP_IMPORT_POL` RoutesFromExt-red-external_router, `$CE_PEER_V4` 10.200.1.3 |
| evpn-type5-vrf-ebgp-inet-10-irb-blue | dc1-dc3_type2_seamless/dc3_leaf1_qfx5120-48y | `$AC_IFL` xe-0/0/10.299, `$ASN_CUSTOMER` 65000, `$BGP_EXPORT_POL` RoutesToExt-blue-external_router, `$BGP_GROUP` l3rtr, `$BGP_IMPORT_POL` RoutesFromExt-blue-external_router, `$CE_PEER_V4` 10.200.2.5 |
| evpn-type5-vrf-ebgp-inet-10-irb-blue | dc1-dc3_type2_seamless/dc3_leaf2_qfx5120-48y | `$AC_IFL` xe-0/0/10.299, `$ASN_CUSTOMER` 65000, `$BGP_EXPORT_POL` RoutesToExt-blue-external_router, `$BGP_GROUP` l3rtr, `$BGP_IMPORT_POL` RoutesFromExt-blue-external_router, `$CE_PEER_V4` 10.200.2.7 |
| evpn-type5-vrf-ebgp-inet-10-irb-red | dc1-dc3_type2_seamless/dc3_leaf1_qfx5120-48y | `$AC_IFL` xe-0/0/10.199, `$ASN_CUSTOMER` 65000, `$BGP_EXPORT_POL` RoutesToExt-red-external_router, `$BGP_GROUP` l3rtr, `$BGP_IMPORT_POL` RoutesFromExt-red-external_router, `$CE_PEER_V4` 10.200.2.1 |
| evpn-type5-vrf-ebgp-inet-10-irb-red | dc1-dc3_type2_seamless/dc3_leaf2_qfx5120-48y | `$AC_IFL` xe-0/0/10.199, `$ASN_CUSTOMER` 65000, `$BGP_EXPORT_POL` RoutesToExt-red-external_router, `$BGP_GROUP` l3rtr, `$BGP_IMPORT_POL` RoutesFromExt-red-external_router, `$CE_PEER_V4` 10.200.2.3 |
| evpn-type5-vrf-ebgp-interconnect-dhcp-relay-20-irb-blue | dc1-dc4_type2_type5_seamless/dc1_borderleaf1_qfx5130-32cd | `$AC_IFL` et-0/0/8:0.299, `$ASN_CUSTOMER` 65000, `$BGP_EXPORT_POL` RoutesToExt-blue-external_router, `$BGP_GROUP` l3rtr, `$BGP_IMPORT_POL` RoutesFromExt-blue-external_router, `$CE_PEER_V4` 10.200.0.5 |
| evpn-type5-vrf-ebgp-interconnect-dhcp-relay-20-irb-blue | dc1-dc4_type2_type5_seamless/dc1_borderleaf2_qfx5130-32cd | `$AC_IFL` et-0/0/8:0.299, `$ASN_CUSTOMER` 65000, `$BGP_EXPORT_POL` RoutesToExt-blue-external_router, `$BGP_GROUP` l3rtr, `$BGP_IMPORT_POL` RoutesFromExt-blue-external_router, `$CE_PEER_V4` 10.200.0.7 |
| evpn-type5-vrf-ebgp-interconnect-dhcp-relay-20-irb-blue | dc1-dc4_type2_type5_seamless/dc4_services-leaf1_qfx5130-48c | `$AC_IFL` et-0/0/7.299, `$ASN_CUSTOMER` 65000, `$BGP_EXPORT_POL` RoutesToExt-blue-external_router, `$BGP_GROUP` l3rtr, `$BGP_IMPORT_POL` RoutesFromExt-blue-external_router, `$CE_PEER_V4` 10.200.3.9 |
| evpn-type5-vrf-ebgp-interconnect-dhcp-relay-20-irb-blue | dc1-dc4_type2_type5_seamless/dc4_services-leaf2_qfx5130-48c | `$AC_IFL` et-0/0/7.299, `$ASN_CUSTOMER` 65000, `$BGP_EXPORT_POL` RoutesToExt-blue-external_router, `$BGP_GROUP` l3rtr, `$BGP_IMPORT_POL` RoutesFromExt-blue-external_router, `$CE_PEER_V4` 10.200.3.11 |
| evpn-type5-vrf-ebgp-interconnect-dhcp-relay-20-irb-red | dc1-dc4_type2_type5_seamless/dc1_borderleaf1_qfx5130-32cd | `$AC_IFL` et-0/0/8:0.199, `$ASN_CUSTOMER` 65000, `$BGP_EXPORT_POL` RoutesToExt-red-external_router, `$BGP_GROUP` l3rtr, `$BGP_IMPORT_POL` RoutesFromExt-red-external_router, `$CE_PEER_V4` 10.200.0.1 |
| evpn-type5-vrf-ebgp-interconnect-dhcp-relay-20-irb-red | dc1-dc4_type2_type5_seamless/dc1_borderleaf2_qfx5130-32cd | `$AC_IFL` et-0/0/8:0.199, `$ASN_CUSTOMER` 65000, `$BGP_EXPORT_POL` RoutesToExt-red-external_router, `$BGP_GROUP` l3rtr, `$BGP_IMPORT_POL` RoutesFromExt-red-external_router, `$CE_PEER_V4` 10.200.0.3 |
| evpn-type5-vrf-ebgp-interconnect-dhcp-relay-20-irb-red | dc1-dc4_type2_type5_seamless/dc4_services-leaf1_qfx5130-48c | `$AC_IFL` et-0/0/7.199, `$ASN_CUSTOMER` 65000, `$BGP_EXPORT_POL` RoutesToExt-red-external_router, `$BGP_GROUP` l3rtr, `$BGP_IMPORT_POL` RoutesFromExt-red-external_router, `$CE_PEER_V4` 10.200.3.13 |
| evpn-type5-vrf-ebgp-interconnect-dhcp-relay-20-irb-red | dc1-dc4_type2_type5_seamless/dc4_services-leaf2_qfx5130-48c | `$AC_IFL` et-0/0/7.199, `$ASN_CUSTOMER` 65000, `$BGP_EXPORT_POL` RoutesToExt-red-external_router, `$BGP_GROUP` l3rtr, `$BGP_IMPORT_POL` RoutesFromExt-red-external_router, `$CE_PEER_V4` 10.200.3.15 |

A MAC-VRF or Type 5 VRF uses the same instance name, VNIs and route targets on every device of the data center that carries it; an EVPN interconnect uses the same interconnect route target on the DCI gateways of both data centers; route distinguishers start with each device's own loopback.
