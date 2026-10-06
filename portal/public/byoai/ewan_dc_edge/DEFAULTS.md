# DEFAULTS — Enterprise Data Center Edge

Lab auto-fill values for the Enterprise Data Center Edge JVD. Every value is measured from the validated device configurations under [`configuration/conf/`](../../conf/). Use them when the user picks auto-fill; otherwise ask. Variable meanings are in [`_variables.md`](../_variables.md).

## Device inventory

| Role | Device | Platform | OS | `$LOOPBACK_V4` / router-id | `$LOCAL_AS` |
|------|--------|----------|----|----------------------------|-------------|
| DC edge (EVPN-VXLAN ↔ EVPN-MPLS interconnect) | dc-edge1_mx480 | MX480 | Junos | 1.1.1.5 | 65000 |
| DC edge (interconnect) | dc-edge2_mx10003 | MX10003 | Junos | 1.1.1.6 | 65000 |
| WAN edge (EVPN-MPLS) | wan-edge1_mx204 | MX204 | Junos | 1.1.1.10 | 65000 |
| WAN edge (EVPN-MPLS) | wan-edge2_acx5448-m | ACX5448-M | Junos | 1.1.1.9 | 65000 |
| WAN core P | p1_acx7100-48l | ACX7100-48L | EVO | 1.1.1.7 | — |
| WAN core P | p2_ptx10001-36mr | PTX10001-36MR | EVO | 1.1.1.8 | — |
| DC spine | spine1_qfx5200 | QFX5200 | Junos | 1.1.1.3 | 65000 |
| DC spine | spine2_qfx5200 | QFX5200 | Junos | 1.1.1.4 | — |
| DC leaf (EVPN-VXLAN) | leaf1_qfx5120-48t | QFX5120-48T | Junos | 1.1.1.1 | 65000 |
| DC leaf (EVPN-VXLAN) | leaf2_qfx5120-48t | QFX5120-48T | Junos | 1.1.1.2 | 65000 |
| Top-of-rack access | tor1_ex4200-48t | EX4200-48T | Junos | — | — |
| Top-of-rack access | tor2_ex4200-48t | EX4200-48T | Junos | — | — |

"—" means the device configuration does not set that value. Do not invent one; ask the user if a requested snippet needs it.

## Service examples (first validated instance per device)

| Service form | Device | Example values |
|--------------|--------|----------------|
| Interconnect VLAN-based IRB | dc-edge1 / dc-edge2 | `Interconnect_Instance3226`, `$IRB_UNIT` 3226, `$VNI` 3226, `$RT_AS:$RT_ID` 100:3226, `$RD_SUB_ASSIGNED` 8223, interconnect RD/RT 3226 / 3226:3226, `$ESI` `00:61:01:00:11:22:03:04:05:06` |
| Interconnect VLAN bundle | dc-edge1 / dc-edge2 | `Interconnect_VBundle_Instance1`, `$VNI` 701, `$RT_AS:$RT_ID` 100:701, `$RD_SUB_ASSIGNED` 6000, interconnect RD/RT 701 / 701:701, `$ESI` `00:45:55:65:75:85:95:15:25:35` |
| Leaf MAC-VRF VLAN-based | leaf1 / leaf2 | `MACVRF-Instance1402`, `$BD_NAME` `EP-TYPE-2-VLAN-1402`, `$AC_INTF` ae33.1402, `$VNI` 1402, `$RT_AS:$RT_ID` 100:1402, `$RD_SUB_ASSIGNED` 7000 |
| Leaf MAC-VRF VLAN bundle | leaf1 / leaf2 | `MACVRF-VBundle-Instance1`, `$BD_NAME` `VLANS-701-780`, `$AC_INTF` ae16.0, `$VNI` 701, `$RT_AS:$RT_ID` 100:701, `$RD_SUB_ASSIGNED` 6000 (leaf1) / 6001 (leaf2) |
| WAN edge VLAN-based IRB | wan-edge1 | `EVPN_SH_VBased_1402`, `$AC_INTF` xe-0/1/4.1402, `$IRB_UNIT` 1402, RD sub / RT 1402 / 1402:1402 |
| WAN edge VLAN-based l3-interface | wan-edge2 | `ACX_EVPN_SH_VBased_2704`, `$AC_INTF` xe-0/0/2.2704, `$IRB_UNIT` 2704, RD sub / RT 2704 / 2704:2704 |
| WAN edge VLAN bundle | wan-edge1 / wan-edge2 | `EVPN_SH_VBundle_VLAN1021-1100` (xe-0/1/4.1021, 1021) / `ACX_EVPN_SH_VBundle_VLAN2188-2272` (xe-0/0/2.2188, 2188) |
| WAN edge VLAN bundle, no-gateway-community | wan-edge2 | `ACX_EVPN_SH_VBundle_VLAN2103-2187`, `$AC_INTF` xe-0/0/2.2103, RD sub / RT 2103 / 2103:2103 |

IRB virtual gateway: `$VG_MAC` is `00:00:5e:00:00:04` on every measured IRB unit; `$VGA` is the `.254` host of the IRB subnet, and each device takes its own host address in the same subnet (for example `irb.2` 10.0.101.1/24 on dc-edge1 and 10.0.101.2/24 on dc-edge2, gateway 10.0.101.254).

## Numbering conventions (hold on every measured instance)

| Service form | Convention |
|--------------|------------|
| Interconnect (both forms) | `$RT_AS` = 100. `$RT_ID` = `$VNI` = `$RD_SUB_INTERCONNECT` = `$RT_AS_INTERCONNECT` = `$RT_ID_INTERCONNECT`; the VLAN-based form also uses the same number for `$IRB_UNIT`. Both DC edges use the same values and the same `$ESI`; only `$LOOPBACK_V4` differs. |
| Leaf MAC-VRF (both forms) | `$RT_AS` = 100 and `$RT_ID` = `$VNI`. |
| WAN edge VLAN-based (IRB and l3-interface) | `$RD_SUB_ASSIGNED` = `$RT_AS` = `$RT_ID` = `$IRB_UNIT` = the unit number of `$AC_INTF`. |
| WAN edge VLAN bundle (both forms) | `$RD_SUB_ASSIGNED` = `$RT_AS` = `$RT_ID` = the unit number of `$AC_INTF`. |

For `N` services, auto-fill increments the per-service number from the example's starting value and keeps the conventions above. `$RD_SUB_ASSIGNED` on the interconnect and MAC-VRF forms is not tied to another variable in the source; ask, or keep the example value and state it in `Notes:`.

Route distinguishers use the device's own `$LOOPBACK_V4`. The validated leaf MAC-VRF VLAN-bundle instances carry the peer leaf's loopback in the RD; reproduce that only when the user asks for the as-deployed lab values.
