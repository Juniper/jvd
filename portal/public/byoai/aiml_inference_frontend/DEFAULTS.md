# DEFAULTS — AI Data Center Frontend Fabric for Inference

Lab auto-fill values for the AI Data Center Frontend Fabric for Inference JVD. Every value is measured from the published device configurations under [`configuration/conf/`](../../conf/). Use them when the user picks a device and service and asks for lab values; otherwise ask for the deployment values.

## Device inventory

| Role | Device | Platform | OS | Loopback / router-id | `$ASN` |
|------|--------|----------|----|----------------------|--------|
| Leaf | leaf1_qfx5130-32cd | QFX5130-32CD | EVO | 10.0.4.0 | 4201032400 |
| Leaf | leaf2_qfx5130-32cd | QFX5130-32CD | EVO | 10.0.4.1 | 4201032401 |
| Leaf | leaf3_qfx5130-32cd | QFX5130-32CD | EVO | 10.0.4.4 | 4201032406 |
| Leaf | leaf4_qfx5130-32cd | QFX5130-32CD | EVO | 10.0.4.5 | 4201032407 |
| Spine | spine1_qfx5220-32cd | QFX5220-32CD | EVO | 10.0.3.0 | 4201032300 |
| Spine | spine2_qfx5220-32cd | QFX5220-32CD | EVO | 10.0.3.1 | 4201032301 |

## Service examples (first measured instance per leaf)

| Service form | Device | Example values |
|--------------|--------|----------------|
| frontend-cluster-vlan-irb | leaf1_qfx5130-32cd | `$IRB_IFL` irb.3, `$VLAN_BD` 3, `$VLAN_NAME` vn3 |
| frontend-cluster-vlan-irb | leaf2_qfx5130-32cd | `$IRB_IFL` irb.4, `$VLAN_BD` 4, `$VLAN_NAME` vn4 |
| frontend-cluster-vlan-irb | leaf3_qfx5130-32cd | `$IRB_IFL` irb.5, `$VLAN_BD` 5, `$VLAN_NAME` vn5 |
| frontend-cluster-vlan-irb | leaf4_qfx5130-32cd | `$IRB_IFL` irb.6, `$VLAN_BD` 6, `$VLAN_NAME` vn6 |

Each leaf's cluster VLAN is local to that leaf: its own VLAN ID, IRB unit and gateway subnet.
