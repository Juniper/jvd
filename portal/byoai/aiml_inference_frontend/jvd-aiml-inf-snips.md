# JVD AI Data Center Frontend Fabric for Inference snippet library

## evo/interfaces/ifd-breakout-description-10g.conf

```
/*
 * Topic: Port broken out into 10-Gbps sub-ports, with a description
 * Seen on:
 *   Junos: (none)
 *   EVO: leaf1_qfx5130-32cd
 * Count:
 *   leaf1_qfx5130-32cd 1
 *   total 1
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from leaf1_qfx5130-32cd):
 *   $IFD                 e.g. et-0/0/8
 *   $DESCRIPTION         e.g. "Breakout et-0/0/8"
 *   $BREAKOUT_SUB_PORTS  e.g. 4
 */
interfaces {
    $IFD {
        description $DESCRIPTION;
        number-of-sub-ports $BREAKOUT_SUB_PORTS;
        speed 10g;
    }
}
```

## evo/interfaces/ifd-breakout-description-400g.conf

```
/*
 * Topic: Port broken out into 400-Gbps sub-ports, with a description
 * Seen on:
 *   Junos: (none)
 *   EVO: leaf3_qfx5130-32cd leaf4_qfx5130-32cd
 * Count:
 *   leaf3_qfx5130-32cd 2
 *   leaf4_qfx5130-32cd 2
 *   total 4
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from leaf3_qfx5130-32cd):
 *   $IFD                 e.g. et-0/0/24
 *   $DESCRIPTION         e.g. "Breakout et-0/0/24"
 *   $BREAKOUT_SUB_PORTS  e.g. 2
 */
interfaces {
    $IFD {
        description $DESCRIPTION;
        number-of-sub-ports $BREAKOUT_SUB_PORTS;
        speed 400g;
    }
}
```

## evo/interfaces/ifd-description-100g-unit-0-inet.conf

```
/*
 * Topic: 100-Gbps access port with a description and an IPv4 address on unit 0
 * Seen on:
 *   Junos: (none)
 *   EVO: leaf1_qfx5130-32cd leaf2_qfx5130-32cd
 * Count:
 *   leaf1_qfx5130-32cd 1
 *   leaf2_qfx5130-32cd 1
 *   total 2
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from leaf1_qfx5130-32cd):
 *   $AC_INTF      e.g. et-0/0/28
 *   $DESCRIPTION  e.g. "VRF default to Lambda-X13-01"
 *   $AC_ADDR_V4   e.g. 10.10.1.29/31
 */
interfaces {
    $AC_INTF {
        description $DESCRIPTION;
        speed 100g;
        unit 0 {
            family inet {
                address $AC_ADDR_V4;
            }
        }
    }
}
```

## evo/interfaces/ifd-description-mtu-9216.conf

```
/*
 * Topic: Physical interface with a description and a 9216-byte MTU
 * Seen on:
 *   Junos: (none)
 *   EVO: leaf1_qfx5130-32cd leaf2_qfx5130-32cd leaf3_qfx5130-32cd leaf4_qfx5130-32cd spine1_qfx5220-32cd spine2_qfx5220-32cd
 * Count:
 *   leaf1_qfx5130-32cd 4
 *   leaf2_qfx5130-32cd 4
 *   leaf3_qfx5130-32cd 4
 *   leaf4_qfx5130-32cd 4
 *   spine1_qfx5220-32cd 8
 *   spine2_qfx5220-32cd 8
 *   total 32
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from leaf1_qfx5130-32cd):
 *   $IFD          e.g. et-0/0/0
 *   $DESCRIPTION  e.g. facing_frontend-spine-1:et-0/0/0
 */
interfaces {
    $IFD {
        description $DESCRIPTION;
        mtu 9216;
    }
}
```

## evo/interfaces/ifd-description-native-vlan-mtu-9216.conf

```
/*
 * Topic: Access port with a description, a native VLAN and a 9216-byte MTU
 * Seen on:
 *   Junos: (none)
 *   EVO: leaf1_qfx5130-32cd leaf3_qfx5130-32cd leaf4_qfx5130-32cd
 * Count:
 *   leaf1_qfx5130-32cd 1
 *   leaf3_qfx5130-32cd 1
 *   leaf4_qfx5130-32cd 1
 *   total 3
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from leaf1_qfx5130-32cd):
 *   $AC_INTF      e.g. et-0/0/8:0
 *   $DESCRIPTION  e.g. to.headend-svr-01:eth0
 *   $VLAN         e.g. 3
 */
interfaces {
    $AC_INTF {
        description $DESCRIPTION;
        native-vlan-id $VLAN;
        mtu 9216;
    }
}
```

## evo/interfaces/ifl-core-inet-mtu-9170.conf

```
/*
 * Topic: Unit 0 with an IPv4 address and a 9170-byte family MTU on a fabric link
 * Seen on:
 *   Junos: (none)
 *   EVO: leaf1_qfx5130-32cd leaf2_qfx5130-32cd leaf3_qfx5130-32cd leaf4_qfx5130-32cd spine1_qfx5220-32cd spine2_qfx5220-32cd
 * Count:
 *   leaf1_qfx5130-32cd 4
 *   leaf2_qfx5130-32cd 4
 *   leaf3_qfx5130-32cd 4
 *   leaf4_qfx5130-32cd 4
 *   spine1_qfx5220-32cd 8
 *   spine2_qfx5220-32cd 8
 *   total 32
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from leaf1_qfx5130-32cd):
 *   $CORE_PHYS     e.g. et-0/0/0
 *   $CORE_V4_ADDR  e.g. 10.0.5.1/31
 */
interfaces {
    $CORE_PHYS {
        unit 0 {
            family inet {
                mtu 9170;
                address $CORE_V4_ADDR;
            }
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `interface-parent`: when the router's configuration has it, all related; `interfaces/ifd-description-mtu-9216`

## evo/interfaces/ifl-ethernet-switching-trunk-1-vlan.conf

```
/*
 * Topic: Unit 0 as an Ethernet-switching trunk carrying one VLAN
 * Seen on:
 *   Junos: (none)
 *   EVO: leaf1_qfx5130-32cd leaf3_qfx5130-32cd leaf4_qfx5130-32cd
 * Count:
 *   leaf1_qfx5130-32cd 1
 *   leaf3_qfx5130-32cd 1
 *   leaf4_qfx5130-32cd 1
 *   total 3
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from leaf1_qfx5130-32cd):
 *   $AC_INTF    e.g. et-0/0/8:0
 *   $VLAN_NAME  e.g. vn3
 */
interfaces {
    $AC_INTF {
        unit 0 {
            family ethernet-switching {
                interface-mode trunk;
                vlan members $VLAN_NAME;
            }
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `interface-parent`: when the router's configuration has it, all related; `interfaces/ifd-description-native-vlan-mtu-9216`

## evo/interfaces/ifl-loopback-inet.conf

```
/*
 * Topic: Loopback unit with one IPv4 address
 * Seen on:
 *   Junos: (none)
 *   EVO: leaf1_qfx5130-32cd leaf2_qfx5130-32cd leaf3_qfx5130-32cd leaf4_qfx5130-32cd spine1_qfx5220-32cd spine2_qfx5220-32cd
 * Count:
 *   leaf1_qfx5130-32cd 1
 *   leaf2_qfx5130-32cd 1
 *   leaf3_qfx5130-32cd 1
 *   leaf4_qfx5130-32cd 1
 *   spine1_qfx5220-32cd 1
 *   spine2_qfx5220-32cd 1
 *   total 6
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from leaf1_qfx5130-32cd):
 *   $UNIT             e.g. 0
 *   $LOOPBACK_V4_PFX  e.g. 10.0.4.0/32
 */
interfaces {
    lo0 {
        unit $UNIT {
            family inet {
                address $LOOPBACK_V4_PFX;
            }
        }
    }
}
```

## evo/interfaces/irb-inet-mtu-9000.conf

```
/*
 * Topic: IRB unit with an IPv4 gateway address and a 9000-byte family MTU
 * Seen on:
 *   Junos: (none)
 *   EVO: leaf1_qfx5130-32cd leaf3_qfx5130-32cd leaf4_qfx5130-32cd
 * Count:
 *   leaf1_qfx5130-32cd 1
 *   leaf3_qfx5130-32cd 1
 *   leaf4_qfx5130-32cd 1
 *   total 3
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from leaf1_qfx5130-32cd):
 *   $IRB_UNIT  e.g. 3
 *   $IRB_ADDR  e.g. 10.10.3.1/24
 */
interfaces {
    irb {
        unit $IRB_UNIT {
            family inet {
                mtu 9000;
                address $IRB_ADDR;
            }
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `interface-parent`: when the router's configuration has it, all related; `interfaces/irb-mtu-9216`

## evo/interfaces/irb-mtu-9216.conf

```
/*
 * Topic: IRB interface with a 9216-byte MTU
 * Seen on:
 *   Junos: (none)
 *   EVO: leaf1_qfx5130-32cd leaf3_qfx5130-32cd leaf4_qfx5130-32cd
 * Count:
 *   leaf1_qfx5130-32cd 1
 *   leaf3_qfx5130-32cd 1
 *   leaf4_qfx5130-32cd 1
 *   total 3
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
interfaces {
    irb {
        mtu 9216;
    }
}
```

## evo/policy-options/community/community-2-members.conf

```
/*
 * Topic: Community with two standard members
 * Seen on:
 *   Junos: (none)
 *   EVO: leaf1_qfx5130-32cd leaf2_qfx5130-32cd leaf3_qfx5130-32cd leaf4_qfx5130-32cd spine1_qfx5220-32cd spine2_qfx5220-32cd
 * Count:
 *   leaf1_qfx5130-32cd 1
 *   leaf2_qfx5130-32cd 1
 *   leaf3_qfx5130-32cd 1
 *   leaf4_qfx5130-32cd 1
 *   spine1_qfx5220-32cd 1
 *   spine2_qfx5220-32cd 1
 *   total 6
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from leaf1_qfx5130-32cd):
 *   $COMMUNITY_NAME   e.g. DEFAULT_DIRECT_V4
 *   $COMMUNITY_ADMIN  e.g. 3
 */
policy-options {
    community $COMMUNITY_NAME members [ $COMMUNITY_ADMIN:20007 21001:26000 ];
}
```

## evo/policy-options/community/from-spine-fabric-tier.conf

```
/*
 * Topic: FROM_SPINE_FABRIC_TIER: the community that marks routes advertised by the spine tier
 * Seen on:
 *   Junos: (none)
 *   EVO: leaf1_qfx5130-32cd leaf2_qfx5130-32cd leaf3_qfx5130-32cd leaf4_qfx5130-32cd spine1_qfx5220-32cd spine2_qfx5220-32cd
 * Count:
 *   leaf1_qfx5130-32cd 1
 *   leaf2_qfx5130-32cd 1
 *   leaf3_qfx5130-32cd 1
 *   leaf4_qfx5130-32cd 1
 *   spine1_qfx5220-32cd 1
 *   spine2_qfx5220-32cd 1
 *   total 6
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
policy-options {
    community FROM_SPINE_FABRIC_TIER members 0:15;
}
```

## evo/policy-options/policy-statement/per-packet-load-balance-no-term.conf

```
/*
 * Topic: Per-packet load-balancing policy without terms
 * Seen on:
 *   Junos: (none)
 *   EVO: leaf1_qfx5130-32cd leaf2_qfx5130-32cd leaf3_qfx5130-32cd leaf4_qfx5130-32cd spine1_qfx5220-32cd spine2_qfx5220-32cd
 * Count:
 *   leaf1_qfx5130-32cd 1
 *   leaf2_qfx5130-32cd 1
 *   leaf3_qfx5130-32cd 1
 *   leaf4_qfx5130-32cd 1
 *   spine1_qfx5220-32cd 1
 *   spine2_qfx5220-32cd 1
 *   total 6
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from leaf1_qfx5130-32cd):
 *   $PPLB_NAME  e.g. PFE-LB
 */
policy-options {
    policy-statement $PPLB_NAME {
        then {
            load-balance per-packet;
        }
    }
}
```

## evo/policy-options/policy-statement/ps-add-from-spine-tier-accept.conf

```
/*
 * Topic: Spine export policy that tags every route FROM_SPINE_FABRIC_TIER and accepts it
 * Seen on:
 *   Junos: (none)
 *   EVO: spine1_qfx5220-32cd spine2_qfx5220-32cd
 * Count:
 *   spine1_qfx5220-32cd 1
 *   spine2_qfx5220-32cd 1
 *   total 2
 * Pair with:
 *  - evo/policy-options/community/from-spine-fabric-tier.conf
 *
 * Peers with: n/a
 * Variables (example values from spine1_qfx5220-32cd):
 *   $BGP_EXPORT_POL  e.g. SPINE_TO_LEAF_FABRIC_OUT
 *   $TERM_NAME       e.g. SPINE_TO_LEAF_FABRIC_OUT-10
 */
policy-options {
    policy-statement $BGP_EXPORT_POL {
        term $TERM_NAME {
            then {
                community add FROM_SPINE_FABRIC_TIER;
                accept;
            }
        }
    }
}
```

## evo/policy-options/policy-statement/ps-direct-inet-community-add-reject.conf

```
/*
 * Topic: Policy that accepts direct IPv4 routes with a community added and rejects everything else
 * Seen on:
 *   Junos: (none)
 *   EVO: leaf1_qfx5130-32cd leaf2_qfx5130-32cd leaf3_qfx5130-32cd leaf4_qfx5130-32cd spine1_qfx5220-32cd spine2_qfx5220-32cd
 * Count:
 *   leaf1_qfx5130-32cd 1
 *   leaf2_qfx5130-32cd 1
 *   leaf3_qfx5130-32cd 1
 *   leaf4_qfx5130-32cd 1
 *   spine1_qfx5220-32cd 1
 *   spine2_qfx5220-32cd 1
 *   total 6
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from leaf1_qfx5130-32cd):
 *   $POLICY_NAME     e.g. AllPodNetworks
 *   $TERM_NAME_1     e.g. AllPodNetworks-10
 *   $COMMUNITY_NAME  e.g. DEFAULT_DIRECT_V4
 *   $TERM_NAME_2     e.g. AllPodNetworks-100
 */
policy-options {
    policy-statement $POLICY_NAME {
        term $TERM_NAME_1 {
            from {
                family inet;
                protocol direct;
            }
            then {
                community add $COMMUNITY_NAME;
                accept;
            }
        }
        term $TERM_NAME_2 {
            then {
                reject;
            }
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `community` (`$COMMUNITY_NAME`): required, for each reference; `policy-options/community/community-2-members`

## evo/policy-options/policy-statement/ps-from-policy-accept-reject.conf

```
/*
 * Topic: Export policy that accepts the routes another policy accepts and rejects everything else
 * Seen on:
 *   Junos: (none)
 *   EVO: leaf1_qfx5130-32cd leaf2_qfx5130-32cd leaf3_qfx5130-32cd leaf4_qfx5130-32cd
 * Count:
 *   leaf1_qfx5130-32cd 1
 *   leaf2_qfx5130-32cd 1
 *   leaf3_qfx5130-32cd 1
 *   leaf4_qfx5130-32cd 1
 *   total 4
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from leaf1_qfx5130-32cd):
 *   $BGP_EXPORT_POL  e.g. BGP-AOS-Policy
 *   $TERM_NAME_1     e.g. BGP-AOS-Policy-10
 *   $POLICY_NAME     e.g. AllPodNetworks
 *   $TERM_NAME_2     e.g. BGP-AOS-Policy-100
 */
policy-options {
    policy-statement $BGP_EXPORT_POL {
        term $TERM_NAME_1 {
            from {
                policy $POLICY_NAME;
            }
            then {
                accept;
            }
        }
        term $TERM_NAME_2 {
            then {
                reject;
            }
        }
    }
}
```

## evo/policy-options/policy-statement/ps-from-policy-bgp-accept-reject.conf

```
/*
 * Topic: Export policy that accepts the routes another policy accepts and BGP routes, and rejects everything else
 * Seen on:
 *   Junos: (none)
 *   EVO: spine1_qfx5220-32cd spine2_qfx5220-32cd
 * Count:
 *   spine1_qfx5220-32cd 1
 *   spine2_qfx5220-32cd 1
 *   total 2
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from spine1_qfx5220-32cd):
 *   $BGP_EXPORT_POL  e.g. BGP-AOS-Policy
 *   $TERM_NAME_1     e.g. BGP-AOS-Policy-10
 *   $POLICY_NAME     e.g. AllPodNetworks
 *   $TERM_NAME_2     e.g. BGP-AOS-Policy-20
 *   $TERM_NAME_3     e.g. BGP-AOS-Policy-100
 */
policy-options {
    policy-statement $BGP_EXPORT_POL {
        term $TERM_NAME_1 {
            from {
                policy $POLICY_NAME;
            }
            then {
                accept;
            }
        }
        term $TERM_NAME_2 {
            from {
                protocol bgp;
            }
            then {
                accept;
            }
        }
        term $TERM_NAME_3 {
            then {
                reject;
            }
        }
    }
}
```

## evo/policy-options/policy-statement/ps-reject-bgp-from-spine-tier-accept.conf

```
/*
 * Topic: Leaf export policy that rejects BGP routes tagged FROM_SPINE_FABRIC_TIER and accepts everything else
 * Seen on:
 *   Junos: (none)
 *   EVO: leaf1_qfx5130-32cd leaf2_qfx5130-32cd leaf3_qfx5130-32cd leaf4_qfx5130-32cd
 * Count:
 *   leaf1_qfx5130-32cd 1
 *   leaf2_qfx5130-32cd 1
 *   leaf3_qfx5130-32cd 1
 *   leaf4_qfx5130-32cd 1
 *   total 4
 * Pair with:
 *  - evo/policy-options/community/from-spine-fabric-tier.conf
 *
 * Peers with: n/a
 * Variables (example values from leaf1_qfx5130-32cd):
 *   $BGP_EXPORT_POL  e.g. LEAF_TO_SPINE_FABRIC_OUT
 *   $TERM_NAME_1     e.g. LEAF_TO_SPINE_FABRIC_OUT-10
 *   $TERM_NAME_2     e.g. LEAF_TO_SPINE_FABRIC_OUT-20
 */
policy-options {
    policy-statement $BGP_EXPORT_POL {
        term $TERM_NAME_1 {
            from {
                protocol bgp;
                community FROM_SPINE_FABRIC_TIER;
            }
            then {
                reject;
            }
        }
        term $TERM_NAME_2 {
            then {
                accept;
            }
        }
    }
}
```

## evo/protocols/bgp-group-ebgp-underlay-4-peers-bfd-export-2-policies.conf

```
/*
 * Topic: Leaf eBGP underlay group with four directly connected spine peers, a two-policy export chain, BFD at 1000 ms and multiple-AS multipath
 * Seen on:
 *   Junos: (none)
 *   EVO: leaf1_qfx5130-32cd leaf2_qfx5130-32cd leaf3_qfx5130-32cd leaf4_qfx5130-32cd
 * Count:
 *   leaf1_qfx5130-32cd 1
 *   leaf2_qfx5130-32cd 1
 *   leaf3_qfx5130-32cd 1
 *   leaf4_qfx5130-32cd 1
 *   total 4
 * Pair with: none
 * Peers with:
 *   [leaf1_qfx5130-32cd] <-> [spine1_qfx5220-32cd]
 *   [leaf1_qfx5130-32cd] <-> [spine2_qfx5220-32cd]
 *   [leaf2_qfx5130-32cd] <-> [spine1_qfx5220-32cd]
 *   [leaf2_qfx5130-32cd] <-> [spine2_qfx5220-32cd]
 *   [leaf3_qfx5130-32cd] <-> [spine1_qfx5220-32cd]
 *   [leaf3_qfx5130-32cd] <-> [spine2_qfx5220-32cd]
 *   [leaf4_qfx5130-32cd] <-> [spine1_qfx5220-32cd]
 *   [leaf4_qfx5130-32cd] <-> [spine2_qfx5220-32cd]
 * Variables (example values from leaf1_qfx5130-32cd):
 *   $BGP_GROUP            e.g. l3clos-l
 *   $UNDERLAY_PEER_V4_1   e.g. 10.0.5.0
 *   $DESCRIPTION_1        e.g. facing_frontend-spine-1
 *   $UNDERLAY_LOCAL_V4_1  e.g. 10.0.5.1
 *   $BGP_EXPORT_POL_1     e.g. LEAF_TO_SPINE_FABRIC_OUT
 *   $BGP_EXPORT_POL_2     e.g. BGP-AOS-Policy
 *   $ASN_FABRIC_PEER_1    e.g. 4201032300
 *   $UNDERLAY_PEER_V4_2   e.g. 10.0.5.2
 *   $UNDERLAY_LOCAL_V4_2  e.g. 10.0.5.3
 *   $UNDERLAY_PEER_V4_3   e.g. 10.0.5.10
 *   $DESCRIPTION_2        e.g. facing_frontend-spine-2
 *   $UNDERLAY_LOCAL_V4_3  e.g. 10.0.5.11
 *   $ASN_FABRIC_PEER_2    e.g. 4201032301
 *   $UNDERLAY_PEER_V4_4   e.g. 10.0.5.8
 *   $UNDERLAY_LOCAL_V4_4  e.g. 10.0.5.9
 */
protocols {
    bgp {
        group $BGP_GROUP {
            type external;
            multipath multiple-as;
            vpn-apply-export;
            bfd-liveness-detection {
                minimum-interval 1000;
                multiplier 3;
            }
            neighbor $UNDERLAY_PEER_V4_1 {
                description $DESCRIPTION_1;
                local-address $UNDERLAY_LOCAL_V4_1;
                export ( $BGP_EXPORT_POL_1 && $BGP_EXPORT_POL_2 );
                peer-as $ASN_FABRIC_PEER_1;
                family inet {
                    unicast;
                }
            }
            neighbor $UNDERLAY_PEER_V4_2 {
                description $DESCRIPTION_1;
                local-address $UNDERLAY_LOCAL_V4_2;
                export ( $BGP_EXPORT_POL_1 && $BGP_EXPORT_POL_2 );
                peer-as $ASN_FABRIC_PEER_1;
                family inet {
                    unicast;
                }
            }
            neighbor $UNDERLAY_PEER_V4_3 {
                description $DESCRIPTION_2;
                local-address $UNDERLAY_LOCAL_V4_3;
                export ( $BGP_EXPORT_POL_1 && $BGP_EXPORT_POL_2 );
                peer-as $ASN_FABRIC_PEER_2;
                family inet {
                    unicast;
                }
            }
            neighbor $UNDERLAY_PEER_V4_4 {
                description $DESCRIPTION_2;
                local-address $UNDERLAY_LOCAL_V4_4;
                export ( $BGP_EXPORT_POL_1 && $BGP_EXPORT_POL_2 );
                peer-as $ASN_FABRIC_PEER_2;
                family inet {
                    unicast;
                }
            }
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `policy-statement` (`$BGP_EXPORT_POL_1`, `$BGP_EXPORT_POL_2`): required, for each reference; one of `policy-options/policy-statement/ps-from-policy-accept-reject`, `policy-options/policy-statement/ps-reject-bgp-from-spine-tier-accept`

## evo/protocols/bgp-group-ebgp-underlay-8-peers-bfd-export-2-policies.conf

```
/*
 * Topic: Spine eBGP underlay group with eight directly connected leaf peers, a two-policy export chain, BFD at 1000 ms and multiple-AS multipath
 * Seen on:
 *   Junos: (none)
 *   EVO: spine1_qfx5220-32cd spine2_qfx5220-32cd
 * Count:
 *   spine1_qfx5220-32cd 1
 *   spine2_qfx5220-32cd 1
 *   total 2
 * Pair with: none
 * Peers with:
 *   [leaf1_qfx5130-32cd] <-> [spine1_qfx5220-32cd]
 *   [leaf1_qfx5130-32cd] <-> [spine2_qfx5220-32cd]
 *   [leaf2_qfx5130-32cd] <-> [spine1_qfx5220-32cd]
 *   [leaf2_qfx5130-32cd] <-> [spine2_qfx5220-32cd]
 *   [leaf3_qfx5130-32cd] <-> [spine1_qfx5220-32cd]
 *   [leaf3_qfx5130-32cd] <-> [spine2_qfx5220-32cd]
 *   [leaf4_qfx5130-32cd] <-> [spine1_qfx5220-32cd]
 *   [leaf4_qfx5130-32cd] <-> [spine2_qfx5220-32cd]
 * Variables (example values from spine1_qfx5220-32cd):
 *   $BGP_GROUP            e.g. l3clos-s
 *   $UNDERLAY_PEER_V4_1   e.g. 10.0.5.1
 *   $DESCRIPTION_1        e.g. facing_frontend-leaf1
 *   $UNDERLAY_LOCAL_V4_1  e.g. 10.0.5.0
 *   $BGP_EXPORT_POL_1     e.g. SPINE_TO_LEAF_FABRIC_OUT
 *   $BGP_EXPORT_POL_2     e.g. BGP-AOS-Policy
 *   $ASN_FABRIC_PEER_1    e.g. 4201032400
 *   $UNDERLAY_PEER_V4_2   e.g. 10.0.5.3
 *   $UNDERLAY_LOCAL_V4_2  e.g. 10.0.5.2
 *   $UNDERLAY_PEER_V4_3   e.g. 10.0.5.5
 *   $DESCRIPTION_2        e.g. facing_frontend-leaf2
 *   $UNDERLAY_LOCAL_V4_3  e.g. 10.0.5.4
 *   $ASN_FABRIC_PEER_2    e.g. 4201032401
 *   $UNDERLAY_PEER_V4_4   e.g. 10.0.5.7
 *   $UNDERLAY_LOCAL_V4_4  e.g. 10.0.5.6
 *   $UNDERLAY_PEER_V4_5   e.g. 10.0.5.33
 *   $DESCRIPTION_3        e.g. facing_frontend-leaf3
 *   $UNDERLAY_LOCAL_V4_5  e.g. 10.0.5.32
 *   $ASN_FABRIC_PEER_3    e.g. 4201032406
 *   $UNDERLAY_PEER_V4_6   e.g. 10.0.5.35
 *   $UNDERLAY_LOCAL_V4_6  e.g. 10.0.5.34
 *   $UNDERLAY_PEER_V4_7   e.g. 10.0.5.37
 *   $DESCRIPTION_4        e.g. facing_frontend-leaf4
 *   $UNDERLAY_LOCAL_V4_7  e.g. 10.0.5.36
 *   $ASN_FABRIC_PEER_4    e.g. 4201032407
 *   $UNDERLAY_PEER_V4_8   e.g. 10.0.5.39
 *   $UNDERLAY_LOCAL_V4_8  e.g. 10.0.5.38
 */
protocols {
    bgp {
        group $BGP_GROUP {
            type external;
            multipath multiple-as;
            vpn-apply-export;
            bfd-liveness-detection {
                minimum-interval 1000;
                multiplier 3;
            }
            neighbor $UNDERLAY_PEER_V4_1 {
                description $DESCRIPTION_1;
                local-address $UNDERLAY_LOCAL_V4_1;
                export ( $BGP_EXPORT_POL_1 && $BGP_EXPORT_POL_2 );
                peer-as $ASN_FABRIC_PEER_1;
                family inet {
                    unicast;
                }
            }
            neighbor $UNDERLAY_PEER_V4_2 {
                description $DESCRIPTION_1;
                local-address $UNDERLAY_LOCAL_V4_2;
                export ( $BGP_EXPORT_POL_1 && $BGP_EXPORT_POL_2 );
                peer-as $ASN_FABRIC_PEER_1;
                family inet {
                    unicast;
                }
            }
            neighbor $UNDERLAY_PEER_V4_3 {
                description $DESCRIPTION_2;
                local-address $UNDERLAY_LOCAL_V4_3;
                export ( $BGP_EXPORT_POL_1 && $BGP_EXPORT_POL_2 );
                peer-as $ASN_FABRIC_PEER_2;
                family inet {
                    unicast;
                }
            }
            neighbor $UNDERLAY_PEER_V4_4 {
                description $DESCRIPTION_2;
                local-address $UNDERLAY_LOCAL_V4_4;
                export ( $BGP_EXPORT_POL_1 && $BGP_EXPORT_POL_2 );
                peer-as $ASN_FABRIC_PEER_2;
                family inet {
                    unicast;
                }
            }
            neighbor $UNDERLAY_PEER_V4_5 {
                description $DESCRIPTION_3;
                local-address $UNDERLAY_LOCAL_V4_5;
                export ( $BGP_EXPORT_POL_1 && $BGP_EXPORT_POL_2 );
                peer-as $ASN_FABRIC_PEER_3;
                family inet {
                    unicast;
                }
            }
            neighbor $UNDERLAY_PEER_V4_6 {
                description $DESCRIPTION_3;
                local-address $UNDERLAY_LOCAL_V4_6;
                export ( $BGP_EXPORT_POL_1 && $BGP_EXPORT_POL_2 );
                peer-as $ASN_FABRIC_PEER_3;
                family inet {
                    unicast;
                }
            }
            neighbor $UNDERLAY_PEER_V4_7 {
                description $DESCRIPTION_4;
                local-address $UNDERLAY_LOCAL_V4_7;
                export ( $BGP_EXPORT_POL_1 && $BGP_EXPORT_POL_2 );
                peer-as $ASN_FABRIC_PEER_4;
                family inet {
                    unicast;
                }
            }
            neighbor $UNDERLAY_PEER_V4_8 {
                description $DESCRIPTION_4;
                local-address $UNDERLAY_LOCAL_V4_8;
                export ( $BGP_EXPORT_POL_1 && $BGP_EXPORT_POL_2 );
                peer-as $ASN_FABRIC_PEER_4;
                family inet {
                    unicast;
                }
            }
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `policy-statement` (`$BGP_EXPORT_POL_1`, `$BGP_EXPORT_POL_2`): required, for each reference; one of `policy-options/policy-statement/ps-add-from-spine-tier-accept`, `policy-options/policy-statement/ps-from-policy-bgp-accept-reject`

## evo/protocols/bgp-log-updown-multipath-graceful-restart.conf

```
/*
 * Topic: BGP global options: log-updown, multipath, and graceful restart without helping on shared-fate BFD down
 * Seen on:
 *   Junos: (none)
 *   EVO: leaf1_qfx5130-32cd leaf2_qfx5130-32cd leaf3_qfx5130-32cd leaf4_qfx5130-32cd spine1_qfx5220-32cd spine2_qfx5220-32cd
 * Count:
 *   leaf1_qfx5130-32cd 1
 *   leaf2_qfx5130-32cd 1
 *   leaf3_qfx5130-32cd 1
 *   leaf4_qfx5130-32cd 1
 *   spine1_qfx5220-32cd 1
 *   spine2_qfx5220-32cd 1
 *   total 6
 * Pair with: none
 * Variables: none
 */
protocols {
    bgp {
        log-updown;
        multipath;
        graceful-restart {
            dont-help-shared-fate-bfd-down;
        }
    }
}
```

## evo/protocols/l2-learning-telemetry-remote-entries.conf

```
/*
 * Topic: Layer 2 learning telemetry that includes remote entries
 * Seen on:
 *   Junos: (none)
 *   EVO: leaf1_qfx5130-32cd leaf2_qfx5130-32cd leaf3_qfx5130-32cd leaf4_qfx5130-32cd
 * Count:
 *   leaf1_qfx5130-32cd 1
 *   leaf2_qfx5130-32cd 1
 *   leaf3_qfx5130-32cd 1
 *   leaf4_qfx5130-32cd 1
 *   total 4
 * Pair with: none
 * Variables: none
 */
protocols {
    l2-learning {
        telemetry enable-remote-entries;
    }
}
```

## evo/protocols/lldp-interface-all-port-id-interface-name.conf

```
/*
 * Topic: LLDP on all interfaces with the interface name as port ID and the interface description as port description
 * Seen on:
 *   Junos: (none)
 *   EVO: leaf1_qfx5130-32cd leaf2_qfx5130-32cd leaf3_qfx5130-32cd leaf4_qfx5130-32cd spine1_qfx5220-32cd spine2_qfx5220-32cd
 * Count:
 *   leaf1_qfx5130-32cd 1
 *   leaf2_qfx5130-32cd 1
 *   leaf3_qfx5130-32cd 1
 *   leaf4_qfx5130-32cd 1
 *   spine1_qfx5220-32cd 1
 *   spine2_qfx5220-32cd 1
 *   total 6
 * Pair with: none
 * Variables: none
 */
protocols {
    lldp {
        port-id-subtype interface-name;
        port-description-type interface-description;
        neighbour-port-info-display port-id;
        interface all;
    }
}
```

## evo/protocols/rstp-bridge-priority-0-bpdu-block-on-edge.conf

```
/*
 * Topic: RSTP with bridge priority 0 and BPDU block on edge ports
 * Seen on:
 *   Junos: (none)
 *   EVO: leaf1_qfx5130-32cd leaf2_qfx5130-32cd leaf3_qfx5130-32cd leaf4_qfx5130-32cd
 * Count:
 *   leaf1_qfx5130-32cd 1
 *   leaf2_qfx5130-32cd 1
 *   leaf3_qfx5130-32cd 1
 *   leaf4_qfx5130-32cd 1
 *   total 4
 * Pair with: none
 * Variables: none
 */
protocols {
    rstp {
        bridge-priority 0;
        bpdu-block-on-edge;
    }
}
```

## evo/protocols/rstp-disable.conf

```
/*
 * Topic: RSTP disabled
 * Seen on:
 *   Junos: (none)
 *   EVO: spine1_qfx5220-32cd spine2_qfx5220-32cd
 * Count:
 *   spine1_qfx5220-32cd 1
 *   spine2_qfx5220-32cd 1
 *   total 2
 * Pair with: none
 * Variables: none
 */
protocols {
    rstp {
        disable;
    }
}
```

## evo/protocols/rstp-interface-edge.conf

```
/*
 * Topic: RSTP edge port
 * Seen on:
 *   Junos: (none)
 *   EVO: leaf1_qfx5130-32cd leaf3_qfx5130-32cd leaf4_qfx5130-32cd
 * Count:
 *   leaf1_qfx5130-32cd 1
 *   leaf3_qfx5130-32cd 1
 *   leaf4_qfx5130-32cd 1
 *   total 3
 * Pair with: none
 * Variables (example values from leaf1_qfx5130-32cd):
 *   $AC_INTF  e.g. et-0/0/8:0
 */
protocols {
    rstp {
        interface $AC_INTF {
            edge;
        }
    }
}
```

## evo/routing-options/autonomous-system.conf

```
/*
 * Topic: Device autonomous-system number
 * Seen on:
 *   Junos: (none)
 *   EVO: leaf1_qfx5130-32cd leaf2_qfx5130-32cd leaf3_qfx5130-32cd leaf4_qfx5130-32cd spine1_qfx5220-32cd spine2_qfx5220-32cd
 * Count:
 *   leaf1_qfx5130-32cd 1
 *   leaf2_qfx5130-32cd 1
 *   leaf3_qfx5130-32cd 1
 *   leaf4_qfx5130-32cd 1
 *   spine1_qfx5220-32cd 1
 *   spine2_qfx5220-32cd 1
 *   total 6
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from leaf1_qfx5130-32cd):
 *   $ASN  e.g. 4201032400
 */
routing-options {
  autonomous-system $ASN;
}
```

## evo/routing-options/forwarding-table-pplb-ecmp-fast-reroute.conf

```
/*
 * Topic: Forwarding-table export of the per-packet load-balancing policy, with ECMP fast reroute
 * Seen on:
 *   Junos: (none)
 *   EVO: leaf1_qfx5130-32cd leaf2_qfx5130-32cd leaf3_qfx5130-32cd leaf4_qfx5130-32cd spine1_qfx5220-32cd spine2_qfx5220-32cd
 * Count:
 *   leaf1_qfx5130-32cd 1
 *   leaf2_qfx5130-32cd 1
 *   leaf3_qfx5130-32cd 1
 *   leaf4_qfx5130-32cd 1
 *   spine1_qfx5220-32cd 1
 *   spine2_qfx5220-32cd 1
 *   total 6
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from leaf1_qfx5130-32cd):
 *   $PPLB_NAME  e.g. PFE-LB
 */
routing-options {
    forwarding-table {
        export $PPLB_NAME;
        ecmp-fast-reroute;
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `policy-statement` (`$PPLB_NAME`): required, for each reference; `policy-options/policy-statement/per-packet-load-balance-no-term`

## evo/routing-options/graceful-restart.conf

```
/*
 * Topic: Graceful restart
 * Seen on:
 *   Junos: (none)
 *   EVO: leaf1_qfx5130-32cd leaf2_qfx5130-32cd leaf3_qfx5130-32cd leaf4_qfx5130-32cd spine1_qfx5220-32cd spine2_qfx5220-32cd
 * Count:
 *   leaf1_qfx5130-32cd 1
 *   leaf2_qfx5130-32cd 1
 *   leaf3_qfx5130-32cd 1
 *   leaf4_qfx5130-32cd 1
 *   spine1_qfx5220-32cd 1
 *   spine2_qfx5220-32cd 1
 *   total 6
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
routing-options {
    graceful-restart;
}
```

## evo/routing-options/router-id.conf

```
/*
 * Topic: Transport router identity
 * Seen on:
 *   Junos: (none)
 *   EVO: leaf1_qfx5130-32cd leaf2_qfx5130-32cd leaf3_qfx5130-32cd leaf4_qfx5130-32cd spine1_qfx5220-32cd spine2_qfx5220-32cd
 * Count:
 *   leaf1_qfx5130-32cd 1
 *   leaf2_qfx5130-32cd 1
 *   leaf3_qfx5130-32cd 1
 *   leaf4_qfx5130-32cd 1
 *   spine1_qfx5220-32cd 1
 *   spine2_qfx5220-32cd 1
 *   total 6
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from leaf1_qfx5130-32cd):
 *   $ROUTER_ID  e.g. 10.0.4.0
 */
routing-options {
    router-id $ROUTER_ID;
}
```

## evo/security/certificates-local.conf

```
/*
 * Topic: Local certificate and private key used by the gRPC SSL service
 * Seen on:
 *   Junos: (none)
 *   EVO: leaf1_qfx5130-32cd leaf2_qfx5130-32cd leaf3_qfx5130-32cd leaf4_qfx5130-32cd spine1_qfx5220-32cd spine2_qfx5220-32cd
 * Count:
 *   leaf1_qfx5130-32cd 1
 *   leaf2_qfx5130-32cd 1
 *   leaf3_qfx5130-32cd 1
 *   leaf4_qfx5130-32cd 1
 *   spine1_qfx5220-32cd 1
 *   spine2_qfx5220-32cd 1
 *   total 6
 * Pair with: none
 * Variables (example values from leaf1_qfx5130-32cd):
 *   $LOCAL_CERT      e.g. aos_grpc
 *   $LOCAL_CERT_KEY  e.g. "******"
 */
security {
    certificates {
        local {
            $LOCAL_CERT {
                $LOCAL_CERT_KEY;
            }
        }
    }
}
```

## evo/system/host-name.conf

```
/*
 * Topic: System host name
 * Seen on:
 *   Junos: (none)
 *   EVO: leaf1_qfx5130-32cd leaf2_qfx5130-32cd leaf3_qfx5130-32cd leaf4_qfx5130-32cd spine1_qfx5220-32cd spine2_qfx5220-32cd
 * Count:
 *   leaf1_qfx5130-32cd 1
 *   leaf2_qfx5130-32cd 1
 *   leaf3_qfx5130-32cd 1
 *   leaf4_qfx5130-32cd 1
 *   spine1_qfx5220-32cd 1
 *   spine2_qfx5220-32cd 1
 *   total 6
 * Pair with: none
 * Variables (example values from leaf1_qfx5130-32cd):
 *   $HOST_NAME  e.g. leaf1
 */
system {
    host-name $HOST_NAME;
}
```

## evo/system/management-instance.conf

```
/*
 * Topic: Dedicated management routing instance (mgmt_junos) for the management interface and services
 * Seen on:
 *   Junos: (none)
 *   EVO: leaf1_qfx5130-32cd leaf2_qfx5130-32cd leaf4_qfx5130-32cd spine1_qfx5220-32cd spine2_qfx5220-32cd
 * Count:
 *   leaf1_qfx5130-32cd 1
 *   leaf2_qfx5130-32cd 1
 *   leaf4_qfx5130-32cd 1
 *   spine1_qfx5220-32cd 1
 *   spine2_qfx5220-32cd 1
 *   total 5
 * Pair with: none
 * Variables: none
 */
system {
    management-instance;
}
```

## evo/system/services-grpc-ssl-local-certificate-mgmt-junos.conf

```
/*
 * Topic: gRPC request-response extension service over SSL in the management instance, using a local certificate
 * Seen on:
 *   Junos: (none)
 *   EVO: leaf1_qfx5130-32cd leaf2_qfx5130-32cd leaf3_qfx5130-32cd leaf4_qfx5130-32cd spine1_qfx5220-32cd spine2_qfx5220-32cd
 * Count:
 *   leaf1_qfx5130-32cd 1
 *   leaf2_qfx5130-32cd 1
 *   leaf3_qfx5130-32cd 1
 *   leaf4_qfx5130-32cd 1
 *   spine1_qfx5220-32cd 1
 *   spine2_qfx5220-32cd 1
 *   total 6
 * Pair with: none
 * Variables (example values from leaf1_qfx5130-32cd):
 *   $GRPC_PORT   e.g. 32767
 *   $LOCAL_CERT  e.g. aos_grpc
 */
system {
    services {
        extension-service {
            request-response {
                grpc {
                    routing-instance mgmt_junos;
                    ssl {
                        port $GRPC_PORT;
                        local-certificate $LOCAL_CERT;
                    }
                }
            }
        }
    }
}
```

## evo/vlans/vlan-description-vlan-id-l3-interface.conf

```
/*
 * Topic: VLAN with a description, a VLAN ID and an IRB Layer 3 interface
 * Seen on:
 *   Junos: (none)
 *   EVO: leaf1_qfx5130-32cd leaf2_qfx5130-32cd leaf3_qfx5130-32cd leaf4_qfx5130-32cd
 * Count:
 *   leaf1_qfx5130-32cd 1
 *   leaf2_qfx5130-32cd 1
 *   leaf3_qfx5130-32cd 1
 *   leaf4_qfx5130-32cd 1
 *   total 4
 * Pair with: none
 * Variables (example values from leaf1_qfx5130-32cd):
 *   $VLAN_NAME    e.g. vn3
 *   $DESCRIPTION  e.g. FrontEnd-Cluster-VN3
 *   $VLAN_BD      e.g. 3
 *   $IRB_IFL      e.g. irb.3
 */
vlans {
    $VLAN_NAME {
        description $DESCRIPTION;
        vlan-id $VLAN_BD;
        l3-interface $IRB_IFL;
    }
}
```

## _variables.md

# Snippet variable glossary

All `.conf` files under `evo/` are templates: identifiers that vary between deployments are written
as `$VAR`. Render a snippet by substituting each placeholder with your deployment's value. The placeholders each
snippet uses are listed in its `Variables:` header and in the glossary below. Variable names and meanings follow
the shared JVD snippet vocabulary. Numbered variables (`_1`, `_2`, …) form an ordered set; the numbers carry no
other meaning.

Values left literal on purpose: the community `FROM_SPINE_FABRIC_TIER` and its value `0:15`, which both fabric
policies reference by name; the MTUs (`9216`, `9170`, `9000`), the BFD timers (1000 ms × 3), the breakout and port
speeds, the gRPC routing instance `mgmt_junos`, the route-tagging values `20007` and `21001:26000`, the RSTP bridge
priority `0`, `unit 0`, and the loopback `lo0`.

## System

| Variable | What it is | Example value |
|---|---|---|
| `$GRPC_PORT` | TCP port of the gRPC request-response extension service over SSL. | `32767` |
| `$HOST_NAME` | System host name. | `leaf1` |
| `$LOCAL_CERT` | Name of the local certificate (`security certificates local`) the gRPC SSL service presents (`local-certificate`). | `aos_grpc` |
| `$LOCAL_CERT_KEY` | PEM private key and certificate of the local certificate; secret, supplied by the operator (the published value is sanitized). | `"******"` |

## Identity / topology

| Variable | What it is | Example value |
|---|---|---|
| `$ASN` | Local device autonomous-system number (`routing-options autonomous-system`). | `4201032400` |
| `$LOOPBACK_V4_PFX` | IPv4 address with prefix length on loopback unit 0. | `10.0.4.0/32` |
| `$ROUTER_ID` | Router identifier in IPv4 dotted-decimal form. | `10.0.4.0` |

## Interfaces

| Variable | What it is | Example value |
|---|---|---|
| `$AC_ADDR_V4` | IPv4 address with prefix length on an access-facing Layer 3 unit. | `10.10.1.29/31` |
| `$AC_INTF` | Access-facing physical interface (server, host or external attachment). | `et-0/0/28` |
| `$BREAKOUT_SUB_PORTS` | Number of sub-ports a channelized (breakout) port is split into (`number-of-sub-ports`). | `4` |
| `$CORE_PHYS` | Fabric-facing physical interface of a point-to-point leaf-spine link. | `et-0/0/0` |
| `$CORE_V4_ADDR` | IPv4 address with prefix length (/31) on a leaf-spine fabric link. | `10.0.5.1/31` |
| `$DESCRIPTION` | Free-text interface or BGP neighbor `description`. | `"Breakout et-0/0/8"` |
| `$DESCRIPTION_1` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `facing_frontend-spine-1` |
| `$DESCRIPTION_2` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `facing_frontend-spine-2` |
| `$DESCRIPTION_3` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `facing_frontend-leaf3` |
| `$DESCRIPTION_4` | Free-text BGP neighbor `description`; `_1`, `_2`, … number the distinct descriptions of one group form, in neighbor order (two links to the same peer share one). | `facing_frontend-leaf4` |
| `$IFD` | Physical interface name. | `et-0/0/8` |
| `$IRB_ADDR` | IPv4 gateway address with prefix length on an IRB unit. | `10.10.3.1/24` |
| `$IRB_IFL` | IRB logical interface (`irb.<unit>`): the Layer 3 interface of a VLAN. | `irb.3` |
| `$IRB_UNIT` | IRB unit number. | `3` |
| `$UNIT` | Logical-interface unit number, without the parent interface name. | `0` |
| `$VLAN` | VLAN identifier: here the native VLAN of an access port (`native-vlan-id`). | `3` |
| `$VLAN_BD` | VLAN identifier (`vlan-id`) of a VLAN under `vlans`. | `3` |
| `$VLAN_NAME` | Name of a VLAN under `vlans`; also the member a trunk unit carries. | `vn3` |

## Fabric underlay

| Variable | What it is | Example value |
|---|---|---|
| `$ASN_FABRIC_PEER_1` | Autonomous-system number of a fabric eBGP neighbor (another leaf or spine); `_1`, `_2`, … number the distinct peer AS numbers of one group, in neighbor order. | `4201032300` |
| `$ASN_FABRIC_PEER_2` | Autonomous-system number of a fabric eBGP neighbor (another leaf or spine); `_1`, `_2`, … number the distinct peer AS numbers of one group, in neighbor order. | `4201032301` |
| `$ASN_FABRIC_PEER_3` | Autonomous-system number of a fabric eBGP neighbor (another leaf or spine); `_1`, `_2`, … number the distinct peer AS numbers of one group, in neighbor order. | `4201032406` |
| `$ASN_FABRIC_PEER_4` | Autonomous-system number of a fabric eBGP neighbor (another leaf or spine); `_1`, `_2`, … number the distinct peer AS numbers of one group, in neighbor order. | `4201032407` |
| `$BGP_GROUP` | Name of the eBGP underlay group. | `l3clos-l` |
| `$UNDERLAY_LOCAL_V4_1` | Local IPv4 address (`local-address`) of the eBGP underlay session with the neighbor of the same number. | `10.0.5.1` |
| `$UNDERLAY_LOCAL_V4_2` | Local IPv4 address (`local-address`) of the eBGP underlay session with the neighbor of the same number. | `10.0.5.3` |
| `$UNDERLAY_LOCAL_V4_3` | Local IPv4 address (`local-address`) of the eBGP underlay session with the neighbor of the same number. | `10.0.5.11` |
| `$UNDERLAY_LOCAL_V4_4` | Local IPv4 address (`local-address`) of the eBGP underlay session with the neighbor of the same number. | `10.0.5.9` |
| `$UNDERLAY_LOCAL_V4_5` | Local IPv4 address (`local-address`) of the eBGP underlay session with the neighbor of the same number. | `10.0.5.32` |
| `$UNDERLAY_LOCAL_V4_6` | Local IPv4 address (`local-address`) of the eBGP underlay session with the neighbor of the same number. | `10.0.5.34` |
| `$UNDERLAY_LOCAL_V4_7` | Local IPv4 address (`local-address`) of the eBGP underlay session with the neighbor of the same number. | `10.0.5.36` |
| `$UNDERLAY_LOCAL_V4_8` | Local IPv4 address (`local-address`) of the eBGP underlay session with the neighbor of the same number. | `10.0.5.38` |
| `$UNDERLAY_PEER_V4_1` | IPv4 address of a directly connected eBGP underlay neighbor (the far end of a leaf-spine /31); `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `10.0.5.0` |
| `$UNDERLAY_PEER_V4_2` | IPv4 address of a directly connected eBGP underlay neighbor (the far end of a leaf-spine /31); `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `10.0.5.2` |
| `$UNDERLAY_PEER_V4_3` | IPv4 address of a directly connected eBGP underlay neighbor (the far end of a leaf-spine /31); `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `10.0.5.10` |
| `$UNDERLAY_PEER_V4_4` | IPv4 address of a directly connected eBGP underlay neighbor (the far end of a leaf-spine /31); `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `10.0.5.8` |
| `$UNDERLAY_PEER_V4_5` | IPv4 address of a directly connected eBGP underlay neighbor (the far end of a leaf-spine /31); `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `10.0.5.33` |
| `$UNDERLAY_PEER_V4_6` | IPv4 address of a directly connected eBGP underlay neighbor (the far end of a leaf-spine /31); `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `10.0.5.35` |
| `$UNDERLAY_PEER_V4_7` | IPv4 address of a directly connected eBGP underlay neighbor (the far end of a leaf-spine /31); `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `10.0.5.37` |
| `$UNDERLAY_PEER_V4_8` | IPv4 address of a directly connected eBGP underlay neighbor (the far end of a leaf-spine /31); `_1`, `_2`, … number the neighbors of one group, in neighbor order. | `10.0.5.39` |

## Policy

| Variable | What it is | Example value |
|---|---|---|
| `$BGP_EXPORT_POL` | Policy-statement name applied as a BGP `export` (in a policy form, the policy's own name). | `SPINE_TO_LEAF_FABRIC_OUT` |
| `$BGP_EXPORT_POL_1` | Policy-statement name applied as a BGP `export`; `_1`, `_2` number the members of a policy chain (`export ( A && B )`), in evaluation order. | `LEAF_TO_SPINE_FABRIC_OUT` |
| `$BGP_EXPORT_POL_2` | Policy-statement name applied as a BGP `export`; `_1`, `_2` number the members of a policy chain (`export ( A && B )`), in evaluation order. | `BGP-AOS-Policy` |
| `$COMMUNITY_ADMIN` | Administrator field of the first member of the route-tagging community; distinct per device in this JVD. | `3` |
| `$COMMUNITY_NAME` | Name of a BGP community that a policy adds to routes (`community add`). | `DEFAULT_DIRECT_V4` |
| `$POLICY_NAME` | Name of a routing policy referenced by `from policy` in another policy (here the direct-route policy). | `AllPodNetworks` |
| `$PPLB_NAME` | Name of the per-packet load-balancing policy that the forwarding table exports. | `PFE-LB` |
| `$TERM_NAME` | Name of the single term of a policy-statement. | `SPINE_TO_LEAF_FABRIC_OUT-10` |
| `$TERM_NAME_1` | Name of a policy-statement term; `_1`, `_2`, … number the terms in evaluation order. | `AllPodNetworks-10` |
| `$TERM_NAME_2` | Name of a policy-statement term; `_1`, `_2`, … number the terms in evaluation order. | `AllPodNetworks-100` |
| `$TERM_NAME_3` | Name of a policy-statement term; `_1`, `_2`, … number the terms in evaluation order. | `BGP-AOS-Policy-100` |

## byoai/TIERS.md

> **Tier qualification for this JVD.** Only `minimum` is qualified and selectable.
> The `self-contained` and `as-deployed` lists below are not yet qualified for this
> JVD. They are not selectable: never offer or render them.

# Configuration form tiers

<!-- GENERATED FROM configuration/snips/_composition.json by the build tooling (generate-tiers). Do not edit by hand: run `JVD_REPO=<checkout> npm run tiers -- --jvd data_center/aidc/aiml_inference_frontend`. -->

This file tells the assistant which snippet files to include for each service
form at each tier. It is generated from the composition matrix, so every path
below resolves to a real snippet and every device listed is one the form is
validated on.

## What the tiers mean

| Tier | What it includes |
|---|---|
| `minimum` | Only the service construct. Assumes the device already runs the underlay and the overlay the service needs. |
| `self-contained` | Everything the emitted configuration names, resolved recursively for the target device. |
| `as-deployed` | The self-contained set plus the validated baselines this JVD runs on that device. |

A tier never implies that a larger closure is a minimal protocol requirement.
If a form's overlay, variant or dependency cannot be resolved for the target
device, the request fails closed: say so and generate nothing for it.

---

## Frontend cluster VLAN with an IRB gateway

Family irb, form frontend-cluster-vlan-irb. OS mode EVO. Attachment: Access trunk unit carrying the VLAN toward the inference servers or client hosts, and the IRB unit that is the VLAN's Layer 3 gateway..

### leaf1_qfx5130-32cd (evo)

- `minimum`: `evo/vlans/vlan-description-vlan-id-l3-interface.conf`
- `self-contained`: the above — it names nothing further
- `as-deployed`: the self-contained set plus the other snippets validated on this device.

### leaf2_qfx5130-32cd (evo)

- `minimum`: `evo/vlans/vlan-description-vlan-id-l3-interface.conf`
- `self-contained`: the above — it names nothing further
- `as-deployed`: the self-contained set plus the other snippets validated on this device.

### leaf3_qfx5130-32cd (evo)

- `minimum`: `evo/vlans/vlan-description-vlan-id-l3-interface.conf`
- `self-contained`: the above — it names nothing further
- `as-deployed`: the self-contained set plus the other snippets validated on this device.

### leaf4_qfx5130-32cd (evo)

- `minimum`: `evo/vlans/vlan-description-vlan-id-l3-interface.conf`
- `self-contained`: the above — it names nothing further
- `as-deployed`: the self-contained set plus the other snippets validated on this device.

---

## byoai/DEFAULTS.md

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

## byoai/OUTPUT_FORMAT.md

# Output Format

This file is part of the [BYOAI](README.md) corpus. It defines the exact shape every generation must take. Bundled into `jvd-aiml-inf-snips.md` by `regenerate-bundle.sh`.

## 1. `Inputs used:` block (always first)

Every generation begins with a YAML comment block listing **every** value picked or accepted:

```yaml
# Inputs used:
# mode: auto                   # or "interview"
# form: minimum
# devices:
#   leaf1: { name: <hostname>, os: evo, loopback4: <addr> }
#   leaf3: { name: <hostname>, os: evo, loopback4: <addr> }
# services:
#   - { kind: <frontend-cluster-vlan-irb>,
#       count: <int>,
#       start_id: <int>,
#       ac_ifl: <ifd.unit>,
#       rt: <rt_as:rt_id>,
#       rd: <admin:assigned> }
# snips_used:
#   - evo/vlans/vlan-description-vlan-id-l3-interface.conf
#   - ...
```

This block makes every generation reproducible — the user can paste it back to regenerate the same output.

## 2. One fenced `text` block per device

Each device block starts with a `# device:` label and groups its snips with `/* snips/<path> */` section comments:

```text
# device: <hostname>
/* snips/<path-to-snip>.conf */
<rendered config block>

/* snips/<path-to-next-snip>.conf */
<rendered config block>
```

Drop the leading C-style `/* … */` documentation header from each snip when emitting. Keep one `/* snips/<path> */` line as the section comment.

## 3. `Notes:` section (always last)

Bullets covering:

- The prerequisites the device must already run: the snip's `Pair with:` entries, the applicable entries of its Needs list and the requirements TIERS.md lists under the Blocked entry for that device. Name them; do not render them.
- Inputs defaulted because the user did not provide them.
- Cross-device consistency the user must verify: each leaf's VLAN is local to that leaf (its own VLAN ID, IRB unit and gateway subnet); the access trunk must carry the VLAN, and the IRB unit must exist on the leaf.
- Anything that is by-pattern rather than validated on that exact device.

## Refusal

If the request cannot be fulfilled from the snip library, do not apologise. Say exactly:

```
I cannot generate this from the snip library because <one reason>.
```

…and stop.
