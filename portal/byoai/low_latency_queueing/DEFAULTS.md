# DEFAULTS — Low Latency QoS Design for 5G

Lab auto-fill values for the Low Latency QoS Design for 5G JVD. Every value is measured from the published device configurations under [`configuration/conf/`](../../conf/). Use them when the user picks a device and service and asks for lab values; otherwise ask for the deployment values.

## Device inventory

| Role | Device | Platform | OS | Loopback / router-id | `$ASN` |
|------|--------|----------|----|----------------------|--------|
| Access Node / Cell Site Router (CSR) | an1_acx7100-48l | ACX7100-48L | EVO | 192.168.1.1 | 63535 |
| Access Node / Cell Site Router (CSR) | an3_acx7100-48l | ACX7100-48L | EVO | 192.168.1.2 | 63535 |
| Access Node / Cell Site Router (CSR) | an4_acx7024 | ACX7024 | EVO | 192.168.1.0 | 63535 |
| Aggregation: HSR and helper (AG) | ag1_1_acx7509 | ACX7509 | EVO | 192.168.1.3 | 63535 |
| Aggregation: HSR and helper (AG) | ag1_2_acx7100-32c | ACX7100-32C | EVO | 192.168.1.4 | 63535 |
| Aggregation: HSR and helper (AG) | ag2_1_mx204 | MX204 | Junos | 192.168.1.5 | 63535 |
| Aggregation: HSR and helper (AG) | ag2_2_mx204 | MX204 | Junos | 192.168.1.6 | 63535 |
| Aggregation: HSR and helper (AG) | ag3_1_mx480 | MX480 | Junos | 192.168.1.7 | 63535 |
| Aggregation: HSR and helper (AG) | ag3_2_mx480 | MX480 | Junos | 192.168.1.8 | 63535 |
| Core Router (CR) | cr1_ptx10001-36mr | PTX10001-36MR | EVO | 192.168.1.9 | 63535 |
| Core Router (CR) | cr2_ptx10001-36mr | PTX10001-36MR | EVO | 192.168.1.10 | 63535 |
| Services Aggregation Gateway (SAG) | sag_mx304 | MX304 | Junos | 192.168.1.11 | 63536 |
| O-DU Switch (DU) | du_qfx5210 | QFX5210 | Junos | — | — |

## Service examples (first measured instance per router)

| Service form | Device | Example values |
|--------------|--------|----------------|
| evpn-vpws | an1_acx7100-48l | `$AC_INTF` et-0/0/2.1101, `$INSTANCE_NAME` FRONTHAUL-EVPN-VPWS-MH-1, `$LOOPBACK_V4` 192.168.1.0, `$RD_SUB_ASSIGNED` 3601, `$RT_AS` 63535, `$RT_ID` 3601 |
| evpn-vpws | an3_acx7100-48l | `$AC_INTF` et-0/0/0.1000, `$INSTANCE_NAME` FRONTHAUL-EVPN-VPWS-MH-100, `$LOOPBACK_V4` 192.168.1.2, `$RD_SUB_ASSIGNED` 3500, `$RT_AS` 63535, `$RT_ID` 3500 |
| evpn-vpws | an4_acx7024 | `$AC_INTF` et-0/0/4.1001, `$INSTANCE_NAME` FRONTHAUL-EVPN-VPWS-MH-1, `$LOOPBACK_V4` 192.168.1.0, `$RD_SUB_ASSIGNED` 3501, `$RT_AS` 63535, `$RT_ID` 3501 |
| evpn-vpws | ag1_1_acx7509 | `$AC_INTF` ae26.1000, `$INSTANCE_NAME` FRONTHAUL-EVPN-VPWS-MH-AN1-100, `$LOOPBACK_V4` 192.168.1.3, `$RD_SUB_ASSIGNED` 3500, `$RT_AS` 63535, `$RT_ID` 3500 |
| evpn-vpws | ag1_2_acx7100-32c | `$AC_INTF` ae26.1000, `$INSTANCE_NAME` FRONTHAUL-EVPN-VPWS-MH-AN1-100, `$LOOPBACK_V4` 192.168.1.4, `$RD_SUB_ASSIGNED` 3500, `$RT_AS` 63535, `$RT_ID` 3500 |
| evpn-vpws-flow-label-static | an4_acx7024 | `$AC_IFL` et-0/0/4.501, `$INSTANCE_NAME` MBH-EVPN-VPWS-SH-TO-SAG-1, `$LOOPBACK_V4` 192.168.1.0, `$RD_SUB_ASSIGNED` 3951, `$RT_ID` 3951, `$VPWS_SVC_ID_LOCAL` 1 |
| evpn-vpws-flow-label-static | sag_mx304 | `$AC_IFL` xe-0/1/3:3.501, `$INSTANCE_NAME` MBH-EVPN-VPWS-SH-TO-AN4-1, `$LOOPBACK_V4` 192.168.1.11, `$RD_SUB_ASSIGNED` 3951, `$RT_ID` 3951, `$VPWS_SVC_ID_LOCAL` 2 |
| evpn-fxc-vlan-aware-2-uni | an4_acx7024 | `$AC_INTF_A` et-0/0/4.2501, `$AC_INTF_B` et-0/0/4.2551, `$INSTANCE_NAME` 5G-FRONTHAUL-EVPN-FXC-SH-AG1-1-1, `$LOOPBACK_V4` 192.168.1.0, `$RD_SUB_ASSIGNED` 3701, `$RT_AS` 63535 |
| evpn-fxc-vlan-aware-2-uni | ag1_1_acx7509 | `$AC_INTF_A` ae26.2601, `$AC_INTF_B` ae26.2651, `$INSTANCE_NAME` 5G-FRONTHAUL-EVPN-FXC-MH-1, `$LOOPBACK_V4` 192.168.1.3, `$RD_SUB_ASSIGNED` 3751, `$RT_AS` 63535 |
| evpn-fxc-vlan-aware-2-uni | ag1_2_acx7100-32c | `$AC_INTF_A` ae26.2601, `$AC_INTF_B` ae26.2651, `$INSTANCE_NAME` 5G-FRONTHAUL-EVPN-FXC-MH-1, `$LOOPBACK_V4` 192.168.1.4, `$RD_SUB_ASSIGNED` 3751, `$RT_AS` 63535 |
| evpn-fxc-vlan-aware-2-uni | sag_mx304 | `$AC_INTF_A` xe-0/1/3:3.2701, `$AC_INTF_B` xe-0/1/3:3.2801, `$INSTANCE_NAME` MIDHUAL-EVPN-FXC-MH-1, `$LOOPBACK_V4` 192.168.1.11, `$RD_SUB_ASSIGNED` 3801, `$RT_AS` 63535 |
| l2circuit-control-word | an1_acx7100-48l | `$AC_IFL` et-0/0/2.1301, `$REMOTE_PE_V4` 192.168.1.11, `$VC_ID` 1301 |
| l2circuit-control-word | an3_acx7100-48l | `$AC_IFL` et-0/0/0.1001, `$REMOTE_PE_V4` 192.168.1.11, `$VC_ID` 1001 |
| l2circuit-control-word | an4_acx7024 | `$AC_IFL` et-0/0/4.1201, `$REMOTE_PE_V4` 192.168.1.11, `$VC_ID` 1201 |
| l2circuit-control-word | sag_mx304 | `$AC_IFL` xe-0/1/3:2.1001, `$REMOTE_PE_V4` 192.168.1.2, `$VC_ID` 1001 |
| l2circuit-control-word-flow-label-static | ag1_1_acx7509 | `$AC_IFL` et-1/0/1.1501, `$REMOTE_PE_V4` 192.168.1.11, `$VC_ID` 1501 |
| l2circuit-control-word-flow-label-static | ag1_2_acx7100-32c | `$AC_IFL` et-0/0/2:0.2501, `$REMOTE_PE_V4` 192.168.1.11, `$VC_ID` 2501 |
| l2circuit-control-word-flow-label-static | sag_mx304 | `$AC_IFL` xe-0/1/3:2.1501, `$REMOTE_PE_V4` 192.168.1.3, `$VC_ID` 1501 |
| evpn-elan-vlan-based | an4_acx7024 | `$AC_IFL` et-0/0/4.1501, `$BD_NAME` BD_EVPN_ELAN_1501, `$INSTANCE_NAME` 5G-FRONTHAUL-EVPN-ELAN-MH-1, `$LOOPBACK_V4` 192.168.1.0, `$RD_SUB_ASSIGNED` 3901, `$RT_ID` 3901 |
| evpn-elan-vlan-based | ag1_1_acx7509 | `$AC_IFL` ae26.1501, `$BD_NAME` BD_EVPN_ELAN_1501, `$INSTANCE_NAME` 5G-FRONTHAUL-EVPN-ELAN-MH-1, `$LOOPBACK_V4` 192.168.1.3, `$RD_SUB_ASSIGNED` 3901, `$RT_ID` 3901 |
| evpn-elan-vlan-based | ag1_2_acx7100-32c | `$AC_IFL` ae26.1501, `$BD_NAME` BD_EVPN_ELAN_1501, `$INSTANCE_NAME` 5G-FRONTHAUL-EVPN-ELAN-MH-1, `$LOOPBACK_V4` 192.168.1.4, `$RD_SUB_ASSIGNED` 3901, `$RT_ID` 3901 |
| evpn-elan-vlan-based-irb | ag1_1_acx7509 | `$AC_IFL` ae26.101, `$BD_NAME` BD_EVPN_101, `$INSTANCE_NAME` 5G-MIDHAUL-EVPN-L3VPN-IRB-1, `$IRB_IFL` irb.101, `$RD_SUB_ASSIGNED` 101, `$RT_ID` 101 |
| evpn-elan-vlan-based-irb | ag1_2_acx7100-32c | `$AC_IFL` ae26.101, `$BD_NAME` BD_EVPN_101, `$INSTANCE_NAME` 5G-MIDHAUL-EVPN-L3VPN-IRB-1, `$IRB_IFL` irb.101, `$RD_SUB_ASSIGNED` 101, `$RT_ID` 101 |
| evpn-elan-vlan-based-irb | sag_mx304 | `$AC_IFL` xe-0/1/3:2.101, `$BD_NAME` BD_EVPN_101, `$INSTANCE_NAME` 5G-MIDHAUL-EVPN-L3VPN-IRB-1, `$IRB_IFL` irb.101, `$RD_SUB_ASSIGNED` 101, `$RT_ID` 101 |
| bgp-vpls-flow-label | an1_acx7100-48l | `$AC_IFL` et-0/0/2.1651, `$BD_NAME` vlan1651, `$INSTANCE_NAME` L2-MBH-BGP-VPLS-1, `$LOOPBACK_V4` 192.168.1.1, `$RD_SUB_ASSIGNED` 651, `$RT_ID` 651 |
| bgp-vpls-flow-label | an3_acx7100-48l | `$AC_IFL` et-0/0/0.1201, `$BD_NAME` vlan1201, `$INSTANCE_NAME` MBH-VPLS-RT1-RT6-1, `$LOOPBACK_V4` 192.168.1.2, `$RD_SUB_ASSIGNED` 101, `$RT_ID` 101 |
| bgp-vpls-flow-label | an4_acx7024 | `$AC_IFL` et-0/0/4.101, `$BD_NAME` vlan101, `$INSTANCE_NAME` L2-MBH-BGP-VPLS-1, `$LOOPBACK_V4` 192.168.1.0, `$RD_SUB_ASSIGNED` 551, `$RT_ID` 551 |
| bgp-vpls-flow-label | ag1_1_acx7509 | `$AC_IFL` et-1/0/1.201, `$BD_NAME` vlan201, `$INSTANCE_NAME` L2-MIDHAUL-BGP-VPLS-TO-SAG-1, `$LOOPBACK_V4` 192.168.1.3, `$RD_SUB_ASSIGNED` 1101, `$RT_ID` 1101 |
| bgp-vpls-flow-label | ag1_2_acx7100-32c | `$AC_IFL` et-0/0/2:0.1000, `$BD_NAME` vlan1000, `$INSTANCE_NAME` L2-MIDHAUL-BGP-VPLS-TO-SAG-300, `$LOOPBACK_V4` 192.168.1.4, `$RD_SUB_ASSIGNED` 1900, `$RT_ID` 1900 |
| bgp-vpls-flow-label | sag_mx304 | `$AC_IFL` xe-0/1/3:0.1000, `$BD_NAME` vlan1000, `$INSTANCE_NAME` L2-MIDHAUL-BGP-VPLS-TO-AG1-2-300, `$LOOPBACK_V4` 192.168.1.11, `$RD_SUB_ASSIGNED` 1900, `$RT_ID` 1900 |
| l3vpn-irb | ag1_1_acx7509 | `$INSTANCE_NAME` 5G-MIDHAUL-L3VPN-EVPN-IRB-1, `$IRB_IFL` irb.101, `$LOOPBACK_V4` 192.168.1.3, `$RD_SUB_ASSIGNED` 5000, `$ROUTER_ID` 192.168.1.3, `$RT_ID` 5000 |
| l3vpn-irb | ag1_2_acx7100-32c | `$INSTANCE_NAME` 5G-MIDHAUL-L3VPN-EVPN-IRB-1, `$IRB_IFL` irb.101, `$LOOPBACK_V4` 192.168.1.4, `$RD_SUB_ASSIGNED` 5000, `$ROUTER_ID` 192.168.1.4, `$RT_ID` 5000 |
| l3vpn-irb | sag_mx304 | `$INSTANCE_NAME` 5G-MIDHAUL-L3VPN-EVPN-IRB-1, `$IRB_IFL` irb.101, `$LOOPBACK_V4` 192.168.1.11, `$RD_SUB_ASSIGNED` 5000, `$ROUTER_ID` 192.168.1.11, `$RT_ID` 5000 |
| l3vpn-ebgp-v4-v6 | an1_acx7100-48l | `$AC_IFL` et-0/0/2.1, `$ASN_CUSTOMER` 64513, `$BGP_GROUP_V4` v4ixia, `$BGP_GROUP_V6` v6ixia, `$CE_PEER_V4` 10.14.7.206, `$CE_PEER_V6` 2001:db8::14:1:7:7cf |
| l3vpn-ebgp-v4-v6 | an3_acx7100-48l | `$AC_IFL` et-0/0/0.1, `$ASN_CUSTOMER` 64514, `$BGP_GROUP_V4` v4ixia, `$BGP_GROUP_V6` v6ixia, `$CE_PEER_V4` 10.15.7.206, `$CE_PEER_V6` 2001:db8::15:1:7:7cf |
| l3vpn-ebgp-v4-v6 | an4_acx7024 | `$AC_IFL` et-0/0/4.1, `$ASN_CUSTOMER` 64511, `$BGP_GROUP_V4` v4ixia, `$BGP_GROUP_V6` v6ixia, `$CE_PEER_V4` 10.11.7.206, `$CE_PEER_V6` 2001:db8::11:1:7:7cf |
| l3vpn-ebgp-v4-v6 | ag1_1_acx7509 | `$AC_IFL` et-1/0/1.1, `$ASN_CUSTOMER` 64518, `$BGP_GROUP_V4` v4ixia, `$BGP_GROUP_V6` v6ixia, `$CE_PEER_V4` 10.16.7.206, `$CE_PEER_V6` 2001:db8::16:1:7:7cf |
| l3vpn-ebgp-v4-v6 | ag1_2_acx7100-32c | `$AC_IFL` et-0/0/2:0.1, `$ASN_CUSTOMER` 64515, `$BGP_GROUP_V4` v4ixia, `$BGP_GROUP_V6` v6ixia, `$CE_PEER_V4` 10.17.7.206, `$CE_PEER_V6` 2001:db8::17:1:7:7cf |
| l3vpn-ebgp-v4-v6 | sag_mx304 | `$AC_IFL` xe-0/1/3:2.1, `$ASN_CUSTOMER` 64516, `$BGP_GROUP_V4` v4ixia, `$BGP_GROUP_V6` v6ixia, `$CE_PEER_V4` 10.18.7.206, `$CE_PEER_V6` 2001:db8::18:1:7:7cf |

Keep the routers of a service consistent: same instance name and route target; swap the local and remote VPWS service identifiers between the two ends of an EVPN-VPWS service.
