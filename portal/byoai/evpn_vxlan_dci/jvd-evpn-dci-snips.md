# JVD EVPN-VXLAN Data Center Interconnect (DCI) snippet library

## evo/interfaces/loopback.conf

```
/*
 * Topic:   Loopback lo0 addressing (router-id, VTEP, and VRF loopbacks)
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO:   dc1-dc2_ott/dc1_borderleaf1_qfx5130-32cd dc1-dc2_ott/dc1_borderleaf2_qfx5130-32cd dc1-dc3_type2_seamless/dc1_borderleaf1_qfx5130-32cd dc1-dc3_type2_seamless/dc1_borderleaf2_qfx5130-32cd dc1-dc4_type2_type5_seamless/dc1_borderleaf1_qfx5130-32cd dc1-dc4_type2_type5_seamless/dc1_borderleaf2_qfx5130-32cd
 *
 * Highlights:
 *  - lo0.0 is the router-id / VTEP source and the local-address for the DCI
 *    overlay eBGP (evpn-gw) and the fabric EVPN overlay.
 *  - Additional units (lo0.2, lo0.3, ...) are per-VRF loopbacks used by the
 *    tenant routing-instances.
 *  - Each unit carries both an IPv4 (/32) and IPv6 (/128) address.
 *  - Repeat the unit block per loopback.
 *
 * Pair with:
 *  - evo/transport/dci-gateway-overlay-ebgp.conf   (lo0.0 as gateway local-address)
 *
 * Variables (example values from dc1-dc4_type2_type5_seamless/dc1_borderleaf1_qfx5130-32cd):
 *   $LO_UNIT   e.g. 0
 *   $LO_IPV4   e.g. 192.168.255.2/32
 *   $LO_IPV6   e.g. fdf6:ed70:1fac:f2d1::1000/128
 */
interfaces {
    lo0 {
        unit $LO_UNIT {
            family inet {
                address $LO_IPV4;
            }
            family inet6 {
                address $LO_IPV6;
            }
        }
    }
}
```

## evo/policy/community-definitions.conf

```
/*
 * Topic:   BGP community definitions for DCI gateway and interconnect targets
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO:   dc1-dc3_type2_seamless/dc1_borderleaf1_qfx5130-32cd dc1-dc3_type2_seamless/dc1_borderleaf2_qfx5130-32cd dc1-dc4_type2_type5_seamless/dc1_borderleaf1_qfx5130-32cd dc1-dc4_type2_type5_seamless/dc1_borderleaf2_qfx5130-32cd
 *
 * Highlights:
 *  - The community set that the DCI gateway and interconnect policies match on.
 *  - EVPN_DCI_L2_TARGET is the interconnect EVI route target — the collapsed
 *    leaves reject it between themselves (see leaf-to-leaf-dci-filter).
 *  - EVPN_GW_IN / EVPN_GW_OUT tag and scope routes on the evpn-gw overlay so DCI
 *    routes are not looped back into the local fabric (EVPN_GW_OUT uses a Junos
 *    community regex, `.+:20001`).
 *  - FABRIC_EVI_TARGET marks local fabric EVI routes (accepted before DCI).
 *
 * Pair with:
 *  - evo/transport/dci-gateway-overlay-ebgp.conf   (uses EVPN_GW_IN / EVPN_GW_OUT)
 *  - evo/services/evpn-interconnect.conf            (EVPN_DCI_L2_TARGET is the RT)
 *
 * Variables (none — literal community definitions)
 */
policy-options {
    community EVPN_DCI_L2_TARGET members target:65655L:1;
    community EVPN_GW_IN members [ 3:20001 21000:26000 ];
    community EVPN_GW_OUT members .+:20001;
    community FABRIC_EVI_TARGET members target:100:100;
}
```

## evo/security/macsec-dci.conf

```
/*
 * Topic:   MACSEC encryption on the DCI border-leaf uplink
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO:   dc1-dc2_ott/dc1_borderleaf1_qfx5130-32cd dc1-dc2_ott/dc1_borderleaf2_qfx5130-32cd dc1-dc2_ott/dc2_borderleaf1_qfx5700 dc1-dc2_ott/dc2_borderleaf2_qfx5700 dc1-dc3_type2_seamless/dc1_borderleaf1_qfx5130-32cd dc1-dc3_type2_seamless/dc1_borderleaf2_qfx5130-32cd dc1-dc4_type2_type5_seamless/dc1_borderleaf1_qfx5130-32cd dc1-dc4_type2_type5_seamless/dc1_borderleaf2_qfx5130-32cd
 *
 * Highlights:
 *  - Encrypts inter-data-center traffic between border-leaf gateways with a
 *    static-CAK connectivity association (gcm-aes-xpn-128). Applied via Apstra
 *    configlet because Apstra 5.0 does not natively provision MACSEC.
 *  - The CAK line is marked "## SECRET-DATA" — never publish the real key.
 *  - On platforms without logical-interface (IFL) MACSEC (e.g. QFX5700), the
 *    association is bound at the physical interface (IFD).
 *  - The same connectivity-association is used for OTT and Type 2 stitching.
 *
 * Pair with:
 *  - evo/transport/dci-gateway-overlay-ebgp.conf   (the encrypted overlay uplink)
 *
 * Variables (example values from dc1-dc2_ott/dc1_borderleaf1_qfx5130-32cd):
 *   $CA_NAME       e.g. dc1-dc2-dci
 *   $CKN           e.g. abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234
 *   $CAK           e.g. secret
 *   $MACSEC_INTF   e.g. et-0/0/12:2
 */
security {
    macsec {
        connectivity-association $CA_NAME {
            cipher-suite gcm-aes-xpn-128;
            security-mode static-cak;
            pre-shared-key {
                ckn $CKN;
                cak "$CAK"; ## SECRET-DATA
            }
        }
        interfaces {
            $MACSEC_INTF {
                connectivity-association $CA_NAME;
            }
        }
    }
}
```

## evo/services/evpn-interconnect.conf

```
/*
 * Topic:   EVPN interconnect (seamless stitching) — DCI ESI, RD, and VNI list
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO:   dc1-dc3_type2_seamless/dc1_borderleaf1_qfx5130-32cd dc1-dc3_type2_seamless/dc1_borderleaf2_qfx5130-32cd dc1-dc4_type2_type5_seamless/dc1_borderleaf1_qfx5130-32cd dc1-dc4_type2_type5_seamless/dc1_borderleaf2_qfx5130-32cd dc1-dc4_type2_type5_seamless/dc4_services-leaf1_qfx5130-48c dc1-dc4_type2_type5_seamless/dc4_services-leaf2_qfx5130-48c
 *
 * Highlights:
 *  - The core of Type 2 (and Type 2 + Type 5) seamless stitching: under the
 *    evpn-1 MAC-VRF, the "interconnect" stanza terminates local VXLAN tunnels
 *    at the border leaf and re-originates them onto the DCI overlay.
 *  - vrf-target / route-distinguisher scope the interconnect EVI; the all-active
 *    ESI makes both border-leaf gateways a logical full mesh (DF resilience).
 *  - interconnected-vni-list enumerates exactly which VNIs are stretched — the
 *    selective, scale-friendly alternative to Over-the-Top.
 *  - VNIs that differ between sites are carried as translation VNIs (41xxx) —
 *    see evo/services/vxlan-translation-vni.conf.
 *
 * Pair with:
 *  - evo/transport/dci-gateway-overlay-ebgp.conf   (carries the stitched routes)
 *  - evo/services/vxlan-translation-vni.conf        (per-VLAN translation VNI)
 *  - evo/services/vrf-type5-interconnect.conf       (Type 5 L3 VRF stretch)
 *  - evo/policy/community-definitions.conf          (EVPN_DCI_L2_TARGET is the RT)
 *
 * Variables (example values from dc1-dc3_type2_seamless/dc1_borderleaf1_qfx5130-32cd):
 *   $IC_VRF_TARGET   e.g. target:65655L:1
 *   $IC_RD           e.g. 192.168.255.2:65533
 *   $IC_ESI          e.g. 00:02:ff:00:00:00:01:00:00:01
 *   $IC_VNI_LIST     e.g. 10400 10401 41400 41401
 */
routing-instances {
    evpn-1 {
        protocols {
            evpn {
                interconnect {
                    vrf-target $IC_VRF_TARGET;
                    route-distinguisher $IC_RD;
                    esi {
                        $IC_ESI;
                        all-active;
                    }
                    interconnected-vni-list [ $IC_VNI_LIST ];
                }
            }
        }
    }
}
```

## evo/services/vrf-type5-interconnect.conf

```
/*
 * Topic:   Type 5 (L3 VRF) EVPN interconnect for seamless stitching
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO:   dc1-dc4_type2_type5_seamless/dc1_borderleaf1_qfx5130-32cd dc1-dc4_type2_type5_seamless/dc1_borderleaf2_qfx5130-32cd
 *
 * Highlights:
 *  - Stretches the Layer 3 context of a tenant VRF across data centers — the
 *    Type 5 half of "Type 2 + Type 5 seamless stitching".
 *  - Under the tenant VRF (e.g. blue / red), the "interconnect" stanza applies
 *    the L3 interconnect route target and route distinguisher; the same RT must
 *    be configured in the remote data center for the stitch to work.
 *  - ip-prefix-routes advertises the VRF's IP prefixes as EVPN Type 5 routes
 *    (advertise direct-nexthop, encapsulation vxlan, per-VRF VNI).
 *  - Enable EVPN Type 5 host-specific routes in Apstra Fabric Settings to
 *    advertise host /32 and /128 routes instead of only the subnet prefix.
 *
 * Pair with:
 *  - evo/services/evpn-interconnect.conf            (Type 2 MAC-VRF interconnect)
 *  - evo/transport/dci-gateway-overlay-ebgp.conf    (carries the Type 5 routes)
 *
 * Variables (example values from dc1-dc4_type2_type5_seamless/dc1_borderleaf1_qfx5130-32cd):
 *   $VRF_NAME           e.g. blue
 *   $L3_IC_VRF_TARGET   e.g. target:65655L:2222
 *   $L3_IC_RD           e.g. 192.168.255.2:65530
 *   $L3_VNI             e.g. 20002
 *   $L3_EXPORT_POLICY   e.g. BGP-AOS-Policy-blue
 */
routing-instances {
    $VRF_NAME {
        protocols {
            evpn {
                interconnect {
                    vrf-target $L3_IC_VRF_TARGET;
                    route-distinguisher $L3_IC_RD;
                }
                ip-prefix-routes {
                    advertise direct-nexthop;
                    encapsulation vxlan;
                    vni $L3_VNI;
                    export $L3_EXPORT_POLICY;
                }
            }
        }
    }
}
```

## evo/services/vxlan-translation-vni.conf

```
/*
 * Topic:   Per-VLAN VXLAN translation VNI for cross-site stitching
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO:   dc1-dc3_type2_seamless/dc1_borderleaf1_qfx5130-32cd dc1-dc3_type2_seamless/dc1_borderleaf2_qfx5130-32cd dc1-dc4_type2_type5_seamless/dc1_borderleaf1_qfx5130-32cd dc1-dc4_type2_type5_seamless/dc1_borderleaf2_qfx5130-32cd dc1-dc4_type2_type5_seamless/dc4_services-leaf1_qfx5130-48c dc1-dc4_type2_type5_seamless/dc4_services-leaf2_qfx5130-48c
 *
 * Highlights:
 *  - When the same VLAN uses a different local VNI in each data center, the
 *    border leaf translates the local VNI to a common DCI (translation) VNI
 *    while forwarding — so both sites converge on one interconnect VNI.
 *  - The translation VNI must also appear in the interconnected-vni-list of
 *    evo/services/evpn-interconnect.conf for the stitch to take effect.
 *  - Repeat the vlan block per stretched VLAN (vn1400..vn1409 in the lab).
 *
 * Pair with:
 *  - evo/services/evpn-interconnect.conf   (translation VNI must be in the list)
 *
 * Variables (example values from dc1-dc3_type2_seamless/dc1_borderleaf1_qfx5130-32cd):
 *   $VLAN_NAME         e.g. vn1400
 *   $VLAN_ID           e.g. 1400
 *   $IRB_IFL           e.g. irb.1400
 *   $VNI               e.g. 11400
 *   $TRANSLATION_VNI   e.g. 41400
 */
routing-instances {
    evpn-1 {
        vlans {
            $VLAN_NAME {
                vlan-id $VLAN_ID;
                l3-interface $IRB_IFL;
                vxlan {
                    vni $VNI;
                    translation-vni $TRANSLATION_VNI;
                }
            }
        }
    }
}
```

## evo/transport/dci-gateway-overlay-ebgp.conf

```
/*
 * Topic:   DCI overlay eBGP gateway group to remote data center border leaves
 * Variant: Evolved-OS (EVO)
 * Seen on:
 *   Junos: (none)
 *   EVO:   dc1-dc2_ott/dc1_borderleaf1_qfx5130-32cd dc1-dc2_ott/dc1_borderleaf2_qfx5130-32cd dc1-dc3_type2_seamless/dc1_borderleaf1_qfx5130-32cd dc1-dc3_type2_seamless/dc1_borderleaf2_qfx5130-32cd dc1-dc4_type2_type5_seamless/dc1_borderleaf1_qfx5130-32cd dc1-dc4_type2_type5_seamless/dc1_borderleaf2_qfx5130-32cd
 *
 * Highlights:
 *  - The DCI overlay eBGP session ("evpn-gw" group) that stitches EVPN routes
 *    between border-leaf gateways in different data centers.
 *  - Multihop overlay (outer ttl 30, no-nexthop-change) between loopbacks;
 *    each remote gateway neighbor carries its own multihop ttl.
 *  - import EVPN_GW_IN / export ( EVPN_GW_OUT && EVPN_EXPORT ) tag and scope
 *    DCI routes so they are not re-advertised back into the local fabric.
 *  - bfd-liveness-detection (3000ms x 3, applied via Apstra configlet) speeds
 *    convergence on the multihop overlay.
 *  - For seamless stitching a logical full mesh to BOTH remote border leaves is
 *    mandatory — repeat the neighbor block per remote gateway.
 *  - QFX5700 (DC2 OTT) and QFX5130-48C (DC4 services) carry an equivalent group.
 *
 * Pair with:
 *  - evo/services/evpn-interconnect.conf          (interconnect ESI / VNI stitch)
 *  - evo/services/vrf-type5-interconnect.conf     (Type 5 L3 VRF stretch)
 *  - evo/interfaces/loopback.conf                 (lo0 used as local-address)
 *  - evo/policy/community-definitions.conf        (EVPN_DCI_* communities)
 *  - evo/security/macsec-dci.conf                 (encrypts the overlay uplink)
 *
 * Variables (example values from dc1-dc2_ott/dc1_borderleaf1_qfx5130-32cd):
 *   $BFD_INTERVAL_MS   e.g. 3000
 *   $BFD_MULTIPLIER    e.g. 3
 *   $GW_PEER           e.g. 192.168.254.2
 *   $PEER_DESCRIPTION  e.g. facing_dc2-bl1-evpn-gateway
 *   $PEER_TTL          e.g. 2
 *   $GW_LOCAL          e.g. 192.168.255.2
 *   $PEER_AS           e.g. 65105
 */
protocols {
    bgp {
        group evpn-gw {
            type external;
            multihop {
                ttl 30;
                no-nexthop-change;
            }
            multipath {
                multiple-as;
            }
            bfd-liveness-detection {
                minimum-interval $BFD_INTERVAL_MS;
                multiplier $BFD_MULTIPLIER;
            }
            neighbor $GW_PEER {
                description $PEER_DESCRIPTION;
                multihop {
                    ttl $PEER_TTL;
                }
                local-address $GW_LOCAL;
                import ( EVPN_GW_IN );
                family evpn {
                    signaling;
                }
                export ( EVPN_GW_OUT && EVPN_EXPORT );
                peer-as $PEER_AS;
            }
            vpn-apply-export;
        }
    }
}
```

## junos/policy/community-definitions.conf

```
/*
 * Topic:   BGP community definitions for DCI gateway and interconnect targets
 * Variant: Junos OS
 * Seen on:
 *   Junos: dc1-dc3_type2_seamless/dc3_leaf1_qfx5120-48y dc1-dc3_type2_seamless/dc3_leaf2_qfx5120-48y
 *   EVO:   (none)
 *
 * Highlights:
 *  - The community set that the collapsed-fabric DCI gateway and leaf-to-leaf
 *    policies match on.
 *  - EVPN_DCI_L2_TARGET is the interconnect EVI route target — rejected between
 *    the collapsed leaves by junos/policy/leaf-to-leaf-dci-filter.conf.
 *  - EVPN_GW_IN / EVPN_GW_OUT tag and scope routes on the evpn-gw overlay
 *    (EVPN_GW_OUT uses a Junos community regex, `.+:20001`).
 *  - FABRIC_EVI_TARGET marks local fabric EVI routes (accepted before DCI).
 *
 * Pair with:
 *  - junos/transport/dci-gateway-overlay-ebgp.conf  (uses EVPN_GW_IN / EVPN_GW_OUT)
 *  - junos/policy/leaf-to-leaf-dci-filter.conf       (matches these communities)
 *
 * Variables (none — literal community definitions)
 */
policy-options {
    community EVPN_DCI_L2_TARGET members target:65655L:1;
    community EVPN_GW_IN members [ 1:20001 21000:26000 ];
    community EVPN_GW_OUT members .+:20001;
    community FABRIC_EVI_TARGET members target:100:100;
}
```

## junos/policy/leaf-to-leaf-dci-filter.conf

```
/*
 * Topic:   Collapsed-fabric leaf-to-leaf DCI export filter
 * Variant: Junos OS
 * Seen on:
 *   Junos: dc1-dc3_type2_seamless/dc3_leaf1_qfx5120-48y dc1-dc3_type2_seamless/dc3_leaf2_qfx5120-48y
 *   EVO:   (none)
 *
 * Highlights:
 *  - During Type 2 stitching validation Apstra omitted the DCI overlay export
 *    policy on the collapsed-fabric leaves (it was applied on 3-stage spines).
 *    This configlet-applied policy restores that behaviour.
 *  - Term -10 accepts local fabric EVI routes (FABRIC_EVI_TARGET); term -20
 *    rejects the DCI L2 target (EVPN_DCI_L2_TARGET) so DCI routes are not
 *    re-advertised between the two collapsed leaves; term -30 accepts the rest.
 *  - Applied on the l3clos-l-evpn export chain alongside EVPN_EXPORT.
 *
 * Pair with:
 *  - junos/services/evpn-interconnect.conf          (defines the DCI EVI)
 *  - junos/transport/dci-gateway-overlay-ebgp.conf  (applied on its export chain)
 *  - junos/policy/community-definitions.conf         (EVPN_DCI_L2_TARGET etc.)
 *
 * Variables (none — literal policy)
 */
policy-options {
    policy-statement LEAF_TO_LEAF_EVPN_OUT {
        term LEAF_TO_LEAF_EVPN_OUT-10 {
            from {
                protocol [ bgp evpn ];
                community FABRIC_EVI_TARGET;
            }
            then accept;
        }
        term LEAF_TO_LEAF_EVPN_OUT-20 {
            from {
                protocol [ bgp evpn ];
                community EVPN_DCI_L2_TARGET;
            }
            then reject;
        }
        term LEAF_TO_LEAF_EVPN_OUT-30 {
            then accept;
        }
    }
}
```

## junos/security/macsec-dci.conf

```
/*
 * Topic:   MACSEC encryption on the DCI collapsed-fabric uplink
 * Variant: Junos OS
 * Seen on:
 *   Junos: dc1-dc3_type2_seamless/dc3_leaf1_qfx5120-48y dc1-dc3_type2_seamless/dc3_leaf2_qfx5120-48y
 *   EVO:   (none)
 *
 * Highlights:
 *  - Encrypts the DC1 <-> DC3 interconnect between the collapsed-fabric leaves
 *    with a static-CAK connectivity association (gcm-aes-xpn-128), applied via
 *    Apstra configlet.
 *  - QFX5120-48YM supports MACSEC and terminates the association at the physical
 *    interface used for the interconnect.
 *  - The CAK line is marked "## SECRET-DATA" — never publish the real key.
 *
 * Pair with:
 *  - junos/transport/dci-gateway-overlay-ebgp.conf  (the encrypted overlay uplink)
 *
 * Variables (example values from dc1-dc3_type2_seamless/dc3_leaf1_qfx5120-48y):
 *   $CA_NAME       e.g. dc1-dc3-dci
 *   $CKN           e.g. 1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd1234abcd
 *   $CAK           e.g. secret
 *   $MACSEC_INTF   e.g. xe-0/0/12
 */
security {
    macsec {
        connectivity-association $CA_NAME {
            cipher-suite gcm-aes-xpn-128;
            security-mode static-cak;
            pre-shared-key {
                ckn $CKN;
                cak "$CAK"; ## SECRET-DATA
            }
        }
        interfaces {
            $MACSEC_INTF {
                connectivity-association $CA_NAME;
            }
        }
    }
}
```

## junos/services/evpn-interconnect.conf

```
/*
 * Topic:   EVPN interconnect (seamless stitching) — DCI ESI, RD, and VNI list
 * Variant: Junos OS
 * Seen on:
 *   Junos: dc1-dc3_type2_seamless/dc3_leaf1_qfx5120-48y dc1-dc3_type2_seamless/dc3_leaf2_qfx5120-48y
 *   EVO:   (none)
 *
 * Highlights:
 *  - The collapsed-fabric (DC3) leaves terminate and re-originate the stretched
 *    VNIs onto the DCI overlay via the evpn-1 MAC-VRF "interconnect" stanza.
 *  - all-active ESI across the collapsed leaves provides gateway redundancy;
 *    interconnected-vni-list selects exactly which VNIs are stretched.
 *  - Because Apstra omitted the DCI export policy on the collapsed leaves, pair
 *    this with junos/policy/leaf-to-leaf-dci-filter.conf to stop overlay routes
 *    being re-advertised between the collapsed leaves.
 *
 * Pair with:
 *  - junos/transport/dci-gateway-overlay-ebgp.conf  (carries the stitched routes)
 *  - junos/services/vxlan-translation-vni.conf       (per-VLAN translation VNI)
 *  - junos/policy/leaf-to-leaf-dci-filter.conf       (stops DCI route re-advertise)
 *
 * Variables (example values from dc1-dc3_type2_seamless/dc3_leaf1_qfx5120-48y):
 *   $IC_VRF_TARGET   e.g. target:65655L:1
 *   $IC_RD           e.g. 192.168.253.0:65533
 *   $IC_ESI          e.g. 00:06:ff:00:00:00:01:00:00:01
 *   $IC_VNI_LIST     e.g. 10400 10401 41400 41401
 */
routing-instances {
    evpn-1 {
        protocols {
            evpn {
                interconnect {
                    vrf-target $IC_VRF_TARGET;
                    route-distinguisher $IC_RD;
                    esi {
                        $IC_ESI;
                        all-active;
                    }
                    interconnected-vni-list [ $IC_VNI_LIST ];
                }
            }
        }
    }
}
```

## junos/services/vxlan-translation-vni.conf

```
/*
 * Topic:   Per-VLAN VXLAN translation VNI for cross-site stitching
 * Variant: Junos OS
 * Seen on:
 *   Junos: dc1-dc3_type2_seamless/dc3_leaf1_qfx5120-48y dc1-dc3_type2_seamless/dc3_leaf2_qfx5120-48y
 *   EVO:   (none)
 *
 * Highlights:
 *  - On the collapsed-fabric (DC3) leaves the same VLAN uses a local VNI (31xxx)
 *    that is translated to the common DCI translation VNI (41xxx) at the border.
 *  - The translation VNI must also appear in the interconnected-vni-list of
 *    junos/services/evpn-interconnect.conf for the stitch to take effect.
 *  - Repeat the vlan block per stretched VLAN.
 *
 * Pair with:
 *  - junos/services/evpn-interconnect.conf  (translation VNI must be in the list)
 *
 * Variables (example values from dc1-dc3_type2_seamless/dc3_leaf1_qfx5120-48y):
 *   $VLAN_NAME         e.g. vn1400
 *   $VLAN_ID           e.g. 1400
 *   $IRB_IFL           e.g. irb.1400
 *   $VNI               e.g. 31400
 *   $TRANSLATION_VNI   e.g. 41400
 */
routing-instances {
    evpn-1 {
        vlans {
            $VLAN_NAME {
                vlan-id $VLAN_ID;
                l3-interface $IRB_IFL;
                vxlan {
                    vni $VNI;
                    translation-vni $TRANSLATION_VNI;
                }
            }
        }
    }
}
```

## junos/transport/dci-gateway-overlay-ebgp.conf

```
/*
 * Topic:   DCI overlay eBGP gateway group to remote data center border leaves
 * Variant: Junos OS
 * Seen on:
 *   Junos: dc1-dc3_type2_seamless/dc3_leaf1_qfx5120-48y dc1-dc3_type2_seamless/dc3_leaf2_qfx5120-48y
 *   EVO:   (none)
 *
 * Highlights:
 *  - The collapsed-fabric (DC3) leaves act as DCI gateways to the 3-stage DC1
 *    border leaves — the "evpn-gw" overlay eBGP group.
 *  - Multihop overlay (outer ttl 30, no-nexthop-change) between loopbacks;
 *    each remote gateway neighbor carries its own multihop ttl (5 here).
 *  - Seamless stitching requires a logical full mesh — one neighbor block per
 *    remote border leaf (this template shows a single neighbor; repeat it).
 *  - import EVPN_GW_IN / export ( EVPN_GW_OUT && EVPN_EXPORT ) keep DCI routes
 *    scoped; on the collapsed leaves this pairs with LEAF_TO_LEAF_EVPN_OUT.
 *
 * Pair with:
 *  - junos/services/evpn-interconnect.conf         (interconnect ESI / VNI stitch)
 *  - junos/policy/leaf-to-leaf-dci-filter.conf     (stops DCI route re-advertise)
 *  - junos/policy/community-definitions.conf       (EVPN_GW_* / EVPN_DCI_* RTs)
 *  - junos/security/macsec-dci.conf                (encrypts the overlay uplink)
 *
 * Variables (example values from dc1-dc3_type2_seamless/dc3_leaf1_qfx5120-48y):
 *   $GW_PEER           e.g. 192.168.255.2
 *   $PEER_DESCRIPTION  e.g. facing_dc3-dc1-1-evpn-gateway
 *   $PEER_TTL          e.g. 5
 *   $GW_LOCAL          e.g. 192.168.253.0
 *   $PEER_AS           e.g. 64514
 */
protocols {
    bgp {
        group evpn-gw {
            type external;
            multihop {
                ttl 30;
                no-nexthop-change;
            }
            multipath {
                multiple-as;
            }
            neighbor $GW_PEER {
                description $PEER_DESCRIPTION;
                multihop {
                    ttl $PEER_TTL;
                }
                local-address $GW_LOCAL;
                import ( EVPN_GW_IN );
                family evpn {
                    signaling;
                }
                export ( EVPN_GW_OUT && EVPN_EXPORT );
                peer-as $PEER_AS;
            }
            vpn-apply-export;
        }
    }
}
```

## _variables.md

# Snip Variable Reference — EVPN-VXLAN Data Center Interconnect (DCI)

Variables used across the `evpn_vxlan_dci` snip library. Replace `$VARIABLE`
placeholders with site-specific values when adapting snips to a new deployment.
JVD-wide constants (policy names such as `EVPN_GW_IN` / `EVPN_GW_OUT`, community
names, the `evpn-gw` group name, the `evpn-1` MAC-VRF instance) are left literal
because they *are* the abstraction the JVD documents.

## DCI overlay gateway (evpn-gw)

| Variable | Example | Used in |
|----------|---------|---------|
| `$GW_PEER` | `192.168.254.2` | dci-gateway-overlay-ebgp |
| `$GW_LOCAL` | `192.168.255.2` | dci-gateway-overlay-ebgp |
| `$PEER_DESCRIPTION` | `facing_dc2-bl1-evpn-gateway` | dci-gateway-overlay-ebgp |
| `$PEER_TTL` | `2` (EVO) / `5` (junos) | dci-gateway-overlay-ebgp |
| `$PEER_AS` | `65105` | dci-gateway-overlay-ebgp |
| `$BFD_INTERVAL_MS` | `3000` | dci-gateway-overlay-ebgp (EVO) |
| `$BFD_MULTIPLIER` | `3` | dci-gateway-overlay-ebgp (EVO) |

## EVPN interconnect (seamless stitching)

| Variable | Example | Used in |
|----------|---------|---------|
| `$IC_VRF_TARGET` | `target:65655L:1` | evpn-interconnect |
| `$IC_RD` | `192.168.255.2:65533` | evpn-interconnect |
| `$IC_ESI` | `00:02:ff:00:00:00:01:00:00:01` | evpn-interconnect |
| `$IC_VNI_LIST` | `10400 10401 41400 41401` | evpn-interconnect |

## Translation VNI

| Variable | Example | Used in |
|----------|---------|---------|
| `$VLAN_NAME` | `vn1400` | vxlan-translation-vni |
| `$VLAN_ID` | `1400` | vxlan-translation-vni |
| `$IRB_IFL` | `irb.1400` | vxlan-translation-vni |
| `$VNI` | `11400` (EVO) / `31400` (junos) | vxlan-translation-vni |
| `$TRANSLATION_VNI` | `41400` | vxlan-translation-vni |

## Type 5 (L3 VRF) interconnect

| Variable | Example | Used in |
|----------|---------|---------|
| `$VRF_NAME` | `blue` | vrf-type5-interconnect |
| `$L3_IC_VRF_TARGET` | `target:65655L:2222` | vrf-type5-interconnect |
| `$L3_IC_RD` | `192.168.255.2:65530` | vrf-type5-interconnect |
| `$L3_VNI` | `20002` | vrf-type5-interconnect |
| `$L3_EXPORT_POLICY` | `BGP-AOS-Policy-blue` | vrf-type5-interconnect |

## Interfaces

| Variable | Example | Used in |
|----------|---------|---------|
| `$LO_UNIT` | `0` | loopback |
| `$LO_IPV4` | `192.168.255.2/32` | loopback |
| `$LO_IPV6` | `fdf6:ed70:1fac:f2d1::1000/128` | loopback |

## MACSEC

| Variable | Example | Used in |
|----------|---------|---------|
| `$CA_NAME` | `dc1-dc2-dci` | macsec-dci |
| `$CKN` | `abcd1234…` (64 hex) | macsec-dci |
| `$CAK` | *(secret — `## SECRET-DATA`)* | macsec-dci |
| `$MACSEC_INTF` | `et-0/0/12:2` (EVO) / `xe-0/0/12` (junos) | macsec-dci |

## byoai/TIERS.md

# Configuration Form Tiers

This file is part of the [BYOAI](README.md) corpus. It tells the AI which snippet files to include for each DCI service kind at each verbosity tier. It is bundled into [`jvd-evpn-dci-snips.md`](jvd-evpn-dci-snips.md) by `regenerate-bundle.sh`.

For each service kind, the AI includes ONLY the snips listed for the chosen tier — and ONLY those — unless the user explicitly asks for more. OS-select each file under `junos/` (collapsed-fabric DC3 leaves) or `evo/` (border-leaf gateways) to match the target device.

This is a **DCI-additions** library: it layers onto an already-deployed EVPN/VXLAN fabric. There is no full-fabric `as-deployed` baseline here — the tiers control how much of the DCI supporting config (communities, loopback, encryption) comes along with the core interconnect stanza.

The two tiers:

- **minimum** — just the DCI stanza(s) that implement the chosen technique.
- **as-deployed** — the DCI stanza(s) + supporting config the JVD renders alongside them (community definitions, loopback, MACSEC where the JVD applies it).

---

## dci-gateway (DCI overlay eBGP gateway)  ·  EVO + Junos

The `evpn-gw` overlay eBGP session between border-leaf gateways in different data centers — the transport that carries all stitched EVPN routes. Present in every DCI technique.

**minimum**
- `transport/dci-gateway-overlay-ebgp.conf` (OS-select)

**as-deployed** (= minimum +)
- `policy/community-definitions.conf` (EVPN_GW_IN / EVPN_GW_OUT / EVPN_DCI_L2_TARGET / FABRIC_EVI_TARGET)
- `interfaces/loopback.conf` (EVO; lo0.0 gateway local-address)
- `security/macsec-dci.conf` (OS-select; encrypt the interconnect uplink — OTT and Type 2)

---

## evpn-interconnect (Type 2 seamless stitching)  ·  EVO + Junos

Terminates local VXLAN tunnels at the border/collapsed leaf and re-originates the selected VNIs onto the DCI overlay, with per-VLAN VNI translation. Runs on the DC1 border leaves and DC3 collapsed leaves.

**minimum**
- `services/evpn-interconnect.conf` (interconnect ESI / RD / interconnected-vni-list)
- `services/vxlan-translation-vni.conf` (per-VLAN translation VNI)

**as-deployed** (= minimum +)
- `transport/dci-gateway-overlay-ebgp.conf` (carries the stitched routes)
- `policy/community-definitions.conf` (EVPN_DCI_L2_TARGET is the interconnect RT)
- `security/macsec-dci.conf` (encrypt the interconnect uplink)

> **Collapsed-fabric add (Junos DC3 leaves only):** also include `junos/policy/leaf-to-leaf-dci-filter.conf` — it stops DCI overlay routes being re-advertised between the two collapsed leaves (Apstra omits this policy on collapsed fabric).

---

## type5-stretch (Type 2 + Type 5 seamless stitching)  ·  EVO

Extends Type 2 stitching by also stretching the Layer 3 context of a tenant VRF across data centers (3-stage DC1 ↔ 5-stage DC4). Runs on the DC1 and DC4 EVO border leaves.

**minimum**
- `evo/services/vrf-type5-interconnect.conf` (VRF interconnect RT/RD + ip-prefix-routes)

**as-deployed** (= minimum + the full `evpn-interconnect` as-deployed set)
- `evo/services/evpn-interconnect.conf` + `evo/services/vxlan-translation-vni.conf` (Type 2 half)
- `evo/transport/dci-gateway-overlay-ebgp.conf`
- `evo/policy/community-definitions.conf`

---

## macsec (encrypt the DCI uplink)  ·  EVO + Junos

Add MACSEC to the interconnect uplink between gateways (OTT and Type 2).

**minimum**
- `security/macsec-dci.conf` (OS-select)

---

## Add-a-feature requests (no full service)

When the user asks to add a supporting feature to an existing DCI gateway, emit ONLY that snip (OS-select):
- **DCI overlay gateway** → `transport/dci-gateway-overlay-ebgp.conf`
- **Translation VNI** → `services/vxlan-translation-vni.conf`
- **MACSEC on the uplink** → `security/macsec-dci.conf`
- **DCI communities** → `policy/community-definitions.conf`
- **Collapsed leaf-to-leaf filter** → `junos/policy/leaf-to-leaf-dci-filter.conf`
- **Type 5 L3 stretch** → `evo/services/vrf-type5-interconnect.conf`

## byoai/DEFAULTS.md

# Auto-Fill Defaults

This file is part of the [BYOAI](README.md) corpus. It gives the deterministic JVD lab-default values the AI uses in `auto` mode (or when the user short-circuits with `all defaults` / `use defaults` / `skip`). It is bundled into [`jvd-evpn-dci-snips.md`](jvd-evpn-dci-snips.md) by `regenerate-bundle.sh`.

Use these values EXACTLY. Do not invent alternative defaults. Every value the AI auto-fills MUST be listed in the output's `Inputs used:` block so the user can rerun with edits. Addresses below are the JVD lab's actual values (from each device `.conf`, generated by Juniper Apstra). Substitute site values when deploying.

This JVD is a **DCI extension** — the snip library captures only the *additional* configuration that stitches EVPN/VXLAN fabrics across data centers. The base 3-stage / 5-stage / collapsed fabric config is assumed already deployed (see the base JVDs).

---

## Scenarios (which devices carry DCI config)

The source configs live under three scenario folders; `Seen on:` device names are scenario-prefixed (e.g. `dc1-dc2_ott/dc1_borderleaf1_qfx5130-32cd`).

| Scenario | Folder | Interconnect | DCI gateways |
|----------|--------|--------------|--------------|
| **OTT** | `dc1-dc2_ott` | 3-stage DC1 ↔ 3-stage DC2 | DC1 QFX5130-32CD (EVO), DC2 QFX5700 (EVO) |
| **Type 2 seamless** | `dc1-dc3_type2_seamless` | 3-stage DC1 ↔ collapsed DC3 | DC1 QFX5130-32CD (EVO), DC3 QFX5120-48Y (Junos) |
| **Type 2 + Type 5** | `dc1-dc4_type2_type5_seamless` | 3-stage DC1 ↔ 5-stage DC4 | DC1 QFX5130-32CD (EVO), DC4 QFX5130-48C (EVO) |

## DCI gateway device inventory

| Device (scenario-prefixed) | Platform | OS | Role | Loopback |
|----------------------------|----------|----|----|----------|
| `dc1-dc2_ott/dc1_borderleaf1_qfx5130-32cd` | QFX5130-32CD | **EVO** | DC1 OTT border-leaf gateway | `192.168.255.2` |
| `dc1-dc2_ott/dc1_borderleaf2_qfx5130-32cd` | QFX5130-32CD | **EVO** | DC1 OTT border-leaf gateway | `192.168.255.3` |
| `dc1-dc2_ott/dc2_borderleaf1_qfx5700` | QFX5700 | **EVO** | DC2 OTT border-leaf gateway (MACSEC) | — |
| `dc1-dc3_type2_seamless/dc1_borderleaf1_qfx5130-32cd` | QFX5130-32CD | **EVO** | DC1 Type 2 border-leaf gateway | `192.168.255.2` |
| `dc1-dc3_type2_seamless/dc3_leaf1_qfx5120-48y` | QFX5120-48Y | Junos | DC3 collapsed-fabric leaf gateway | `192.168.253.0` |
| `dc1-dc4_type2_type5_seamless/dc1_borderleaf1_qfx5130-32cd` | QFX5130-32CD | **EVO** | DC1 Type 2+5 border-leaf gateway | `192.168.255.2` |
| `dc1-dc4_type2_type5_seamless/dc4_services-leaf1_qfx5130-48c` | QFX5130-48C | **EVO** | DC4 5-stage services border-leaf gateway | — |

**Device-choice shortcuts** (offered in the clarifying question):
- `DC1-BORDERLEAF` → the DC1 QFX5130-32CD border-leaf pair for the chosen scenario (EVO).
- `DC2-BORDERLEAF` → `dc2_borderleaf1_qfx5700` + `dc2_borderleaf2_qfx5700` (EVO; OTT).
- `DC3-LEAF` → `dc3_leaf1_qfx5120-48y` + `dc3_leaf2_qfx5120-48y` (Junos; collapsed fabric, Type 2).
- `DC4-SERVICES-LEAF` → `dc4_services-leaf1_qfx5130-48c` + `dc4_services-leaf2_qfx5130-48c` (EVO; Type 2+5).

> OS-select every snip: EVO border leaves (QFX5130-32CD / QFX5700 / QFX5130-48C) use `evo/`; the Junos collapsed-fabric leaves (QFX5120-48Y) use `junos/`.

---

## DCI overlay gateway (evpn-gw) defaults

| Variable | Default | Notes |
|----------|---------|-------|
| `$GW_LOCAL` | = device loopback (e.g. `192.168.255.2`) | overlay eBGP local-address |
| `$GW_PEER` | remote gateway loopback (e.g. `192.168.254.2`) | remote border-leaf loopback |
| `$PEER_DESCRIPTION` | `facing_<remote>-evpn-gateway` | descriptive |
| `$PEER_TTL` | `2` (EVO border leaf) / `5` (Junos collapsed leaf) | per-neighbor multihop TTL |
| `$PEER_AS` | remote gateway AS (e.g. `65105`) | remote border-leaf eBGP AS |
| `$BFD_INTERVAL_MS` | `3000` | overlay BFD (EVO; applied via configlet) |
| `$BFD_MULTIPLIER` | `3` | overlay BFD multiplier |

## Interconnect / translation defaults

| Variable | Default | Notes |
|----------|---------|-------|
| `$IC_VRF_TARGET` | `target:65655L:1` | interconnect EVI route target |
| `$IC_RD` | `<loopback>:65533` | interconnect route distinguisher |
| `$IC_ESI` | `00:02:ff:00:00:00:01:00:00:01` (DC1) / `00:06:…` (DC3) | all-active interconnect ESI |
| `$IC_VNI_LIST` | stretched + translation VNIs (e.g. `10400 … 41400 …`) | interconnected-vni-list |
| `$VLAN_NAME` / `$VLAN_ID` | `vn1400` / `1400` | stretched VLAN |
| `$IRB_IFL` | `irb.1400` | L3 interface for the VLAN |
| `$VNI` | `11400` (EVO) / `31400` (Junos) | local VNI |
| `$TRANSLATION_VNI` | `41400` | common DCI translation VNI |

## Type 5 (L3 VRF) stretch defaults

| Variable | Default | Notes |
|----------|---------|-------|
| `$VRF_NAME` | `blue` (or `red`) | tenant VRF |
| `$L3_IC_VRF_TARGET` | `target:65655L:2222` | L3 interconnect route target |
| `$L3_IC_RD` | `<loopback>:65530` | L3 interconnect route distinguisher |
| `$L3_VNI` | `20002` | per-VRF Type 5 VNI |
| `$L3_EXPORT_POLICY` | `BGP-AOS-Policy-<vrf>` | Type 5 export policy |

## Loopback / MACSEC defaults

| Variable | Default | Notes |
|----------|---------|-------|
| `$LO_UNIT` | `0` | lo0.0 (router-id / VTEP / gateway local-address) |
| `$LO_IPV4` | `192.168.255.2/32` | lo0.0 v4 |
| `$LO_IPV6` | `fdf6:ed70:1fac:f2d1::1000/128` | lo0.0 v6 |
| `$CA_NAME` | `dc1-dc2-dci` (per interconnect) | MACSEC connectivity-association |
| `$CKN` | 64-hex key name | MACSEC CKN |
| `$CAK` | *(secret — never emit; `## SECRET-DATA`)* | MACSEC CAK |
| `$MACSEC_INTF` | `et-0/0/12:2` (EVO) / `xe-0/0/12` (Junos) | interconnect uplink |

> **Constants (leave literal):** `evpn-gw` group name, the `evpn-1` MAC-VRF instance, community names (`EVPN_GW_IN`, `EVPN_GW_OUT`, `EVPN_DCI_L2_TARGET`, `FABRIC_EVI_TARGET`), `gcm-aes-xpn-128`, `static-cak`. These ARE the abstraction the JVD documents.

## byoai/OUTPUT_FORMAT.md

# Output Format

This file is part of the [BYOAI](README.md) corpus. It defines the exact shape every generation must take. Bundled into [`jvd-evpn-dci-snips.md`](jvd-evpn-dci-snips.md) by `regenerate-bundle.sh`.

## 1. `Inputs used:` block (always first)

Every generation begins with a YAML comment block listing **every** value picked or accepted:

```yaml
# Inputs used:
# mode: auto                   # or "interview"
# form: as-deployed            # or "minimum"
# scenario: type2_seamless     # ott | type2_seamless | type2_type5_seamless
# devices:
#   gw1: { name: <hostname>, os: <junos|evo>, role: <border-leaf-gateway|collapsed-leaf>, loopback4: <addr>, as: <asn> }
#   gw2: { ... }
# services:
#   - { kind: <dci-gateway|evpn-interconnect|type5-stretch|macsec>,
#       ic_rt: <target:...>,        # interconnect route target (must match remote DC)
#       ic_rd: <loopback:id>,       # interconnect route distinguisher
#       ic_esi: <hex>,              # all-active interconnect ESI (per DC)
#       vni_list: [<int>, ...],     # interconnected-vni-list
#       translation_vni: <int>,     # common DCI VNI when sites differ
#       vrf_name: <name>,           # for type5-stretch
#       remote_gw: { loopback: <addr>, as: <asn> },
#       macsec_ca: <name> }         # for macsec
# snips_used:
#   - evo/services/evpn-interconnect.conf
#   - evo/services/vxlan-translation-vni.conf
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

- Snips intentionally omitted (and why).
- Inputs defaulted because the user did not provide them.
- Cross-device consistency the user must verify:
  - The interconnect **route target** (`vrf-target`) and the **translation VNIs** MUST match on the local and remote data center gateways.
  - For a **Type 5 stretch**, the L3 interconnect route target MUST be configured identically in the remote data center.
  - The all-active interconnect **ESI** is shared across the two gateways in the SAME data center (Designated Forwarder resilience).
  - Seamless stitching requires a **logical full mesh** of `evpn-gw` overlay eBGP sessions to ALL remote gateways — repeat the neighbor block per remote gateway.
  - Per-gateway identifiers (loopbacks, RDs, own eBGP AS, MACSEC CKN) differ.
- Anything by-pattern rather than validated on that exact device (e.g., a user-supplied hostname not in any snip's `Seen on:` list).
- DCI reminders: on the collapsed fabric (DC3) apply `junos/policy/leaf-to-leaf-dci-filter.conf` so DCI routes are not re-advertised between the collapsed leaves; NEVER emit a real MACSEC CAK (the source marks it `## SECRET-DATA`) — emit a placeholder and set the key out-of-band.

## Refusal

If the request cannot be fulfilled from the snip library, do not apologise. Say exactly:

```
I cannot generate this from the snip library because <one reason>.
```

…and stop.
