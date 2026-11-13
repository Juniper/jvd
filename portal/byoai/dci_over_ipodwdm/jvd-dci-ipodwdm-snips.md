# JVD Data Center Interconnect over IPoDWDM snippet library

## evo/chassis/aggregated-devices-ethernet.conf

```
/*
 * Topic: Aggregated Ethernet device count
 * Seen on:
 *   Junos: (none)
 *   EVO: dci1_ptx10001-36mr dci3_acx7100-48l
 * Count:
 *   dci1_ptx10001-36mr 1
 *   dci3_acx7100-48l 1
 *   total 2
 * Highlights:
 *   - Pre-allocates the aggregated Ethernet interfaces the chassis may create.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from dci1_ptx10001-36mr):
 *   $AE_DEVICE_COUNT  e.g. 10
 */
chassis {
    aggregated-devices {
        ethernet {
            device-count $AE_DEVICE_COUNT;
        }
    }
}
```

## evo/interfaces/ifd-core-aggregate-min-links-lacp-fast.conf

```
/*
 * Topic: Aggregated Ethernet core bundle with minimum links and fast active LACP
 * Seen on:
 *   Junos: (none)
 *   EVO: dci1_ptx10001-36mr dci3_acx7100-48l
 * Count:
 *   dci1_ptx10001-36mr 2
 *   dci3_acx7100-48l 2
 *   total 4
 * Highlights:
 *   - Bundles the coherent DWDM ports; LACP active with fast periodic hellos, and the bundle stays up with one member.
 * Pair with: none
 * Variables (example values from dci1_ptx10001-36mr):
 *   $IFD  e.g. ae12
 */
interfaces {
    $IFD {
        aggregated-ether-options {
            minimum-links 1;
            lacp {
                active;
                periodic fast;
            }
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `lag-member`: when the router's configuration has it, all related; `interfaces/ifd-lag-member-ether-wavelength`

## evo/interfaces/ifd-flexible-ethernet-services-100g.conf

```
/*
 * Topic: Port at 100G with flexible VLAN tagging and flexible Ethernet services
 * Seen on:
 *   Junos: (none)
 *   EVO: dci3_acx7100-48l
 * Count:
 *   dci3_acx7100-48l 1
 *   total 1
 * Highlights:
 *   - Same as `ifd-flexible-ethernet-services` with the port speed set to 100G.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from dci3_acx7100-48l):
 *   $IFD  e.g. et-0/0/48
 */
interfaces {
    $IFD {
        flexible-vlan-tagging;
        speed 100g;
        encapsulation flexible-ethernet-services;
    }
}
```

## evo/interfaces/ifd-flexible-ethernet-services.conf

```
/*
 * Topic: Port with flexible VLAN tagging and flexible Ethernet services
 * Seen on:
 *   Junos: (none)
 *   EVO: dci1_ptx10001-36mr
 * Count:
 *   dci1_ptx10001-36mr 1
 *   total 1
 * Highlights:
 *   - Flexible tagging and `flexible-ethernet-services` let one port carry many VLAN units; here the 100 routed customer-side units.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from dci1_ptx10001-36mr):
 *   $IFD  e.g. et-0/0/4
 */
interfaces {
    $IFD {
        flexible-vlan-tagging;
        encapsulation flexible-ethernet-services;
    }
}
```

## evo/interfaces/ifd-lag-member-ether-wavelength.conf

```
/*
 * Topic: Coherent optics port as an aggregated Ethernet member, with its DWDM wavelength
 * Seen on:
 *   Junos: (none)
 *   EVO: dci1_ptx10001-36mr dci3_acx7100-48l
 * Count:
 *   dci1_ptx10001-36mr 5
 *   dci3_acx7100-48l 4
 *   total 9
 * Highlights:
 *   - The 400G coherent optic plugs straight into the router: `optics-options wavelength` tunes it onto the DWDM line system, so no external transponder is used.
 *   - Junos OS Evolved sets LAG membership under `ether-options`.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from dci1_ptx10001-36mr):
 *   $IFD         e.g. et-0/0/10
 *   $AE_BUNDLE   e.g. ae12
 *   $WAVELENGTH  e.g. 1547.72
 */
interfaces {
    $IFD {
        ether-options {
            802.3ad $AE_BUNDLE;
        }
        optics-options {
            wavelength $WAVELENGTH;
        }
    }
}
```

## evo/interfaces/ifl-core-inet-mpls-max-labels-5.conf

```
/*
 * Topic: Core logical interface with IPv4 and MPLS
 * Seen on:
 *   Junos: (none)
 *   EVO: dci1_ptx10001-36mr dci3_acx7100-48l
 * Count:
 *   dci1_ptx10001-36mr 2
 *   dci3_acx7100-48l 2
 *   total 4
 * Highlights:
 *   - IPv4 and MPLS on the DWDM bundle; MPLS allows a stack of up to five labels.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from dci1_ptx10001-36mr):
 *   $IFD           e.g. ae12
 *   $UNIT          e.g. 0
 *   $CORE_V4_ADDR  e.g. 10.12.1.1/30
 */
interfaces {
    $IFD {
        unit $UNIT {
            family inet {
                address $CORE_V4_ADDR;
            }
            family mpls {
                maximum-labels 5;
            }
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `interface-parent`: when the router's configuration has it, all related; `interfaces/ifd-core-aggregate-min-links-lacp-fast`
- `lag-member`: when the router's configuration has it, all related; `interfaces/ifd-lag-member-ether-wavelength`

## evo/interfaces/ifl-loopback-inet.conf

```
/*
 * Topic: Loopback unit with one IPv4 address
 * Seen on:
 *   Junos: (none)
 *   EVO: dci1_ptx10001-36mr dci3_acx7100-48l
 * Count:
 *   dci1_ptx10001-36mr 1
 *   dci3_acx7100-48l 1
 *   total 2
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from dci1_ptx10001-36mr):
 *   $UNIT             e.g. 0
 *   $LOOPBACK_V4_PFX  e.g. 10.1.1.1/32
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

## evo/interfaces/ifl-vlan-inet.conf

```
/*
 * Topic: VLAN-tagged IPv4 unit
 * Seen on:
 *   Junos: (none)
 *   EVO: dci1_ptx10001-36mr dci3_acx7100-48l
 * Count:
 *   dci1_ptx10001-36mr 100
 *   dci3_acx7100-48l 100
 *   total 200
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from dci1_ptx10001-36mr):
 *   $IFD         e.g. et-0/0/4
 *   $UNIT        e.g. 1
 *   $VLAN        e.g. 1
 *   $AC_ADDR_V4  e.g. 10.10.1.1/30
 */
interfaces {
    $IFD {
        unit $UNIT {
            vlan-id $VLAN;
            family inet {
                address $AC_ADDR_V4;
            }
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `interface-parent`: when the router's configuration has it, all related; one of `interfaces/ifd-flexible-ethernet-services-100g`, `interfaces/ifd-flexible-ethernet-services`

## evo/policy-options/policy-statement/per-flow-load-balance.conf

```
/*
 * Topic: Per-flow load-balance policy
 * Seen on:
 *   Junos: (none)
 *   EVO: dci1_ptx10001-36mr dci3_acx7100-48l
 * Count:
 *   dci1_ptx10001-36mr 1
 *   dci3_acx7100-48l 1
 *   total 2
 * Highlights:
 *   - Exported to the forwarding table so traffic spreads across equal-cost paths per flow.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from dci1_ptx10001-36mr):
 *   $PPLB_NAME  e.g. PPLB
 */
policy-options {
    policy-statement $PPLB_NAME {
        then {
            load-balance per-flow;
        }
    }
}
```

## evo/protocols/bgp-ibgp-inet-vpn-2-peers.conf

```
/*
 * Topic: iBGP group for L3VPN with two loopback neighbors
 * Seen on:
 *   Junos: (none)
 *   EVO: dci1_ptx10001-36mr dci3_acx7100-48l
 * Count:
 *   dci1_ptx10001-36mr 1
 *   dci3_acx7100-48l 1
 *   total 2
 * Highlights:
 *   - Full mesh between the three DCI routers: each peers with the other two over loopbacks and carries `inet-vpn unicast` for the 100 VRFs.
 * Pair with: none
 * Variables (example values from dci1_ptx10001-36mr):
 *   $BGP_GROUP       e.g. grp-iBGP
 *   $LOOPBACK_V4     e.g. 10.1.1.1
 *   $IBGP_PEER_V4_1  e.g. 10.1.1.2
 *   $IBGP_PEER_V4_2  e.g. 10.1.1.3
 */
protocols {
    bgp {
        group $BGP_GROUP {
            type internal;
            local-address $LOOPBACK_V4;
            family inet-vpn {
                unicast;
            }
            neighbor $IBGP_PEER_V4_1;
            neighbor $IBGP_PEER_V4_2;
        }
    }
}
```

## evo/protocols/mpls-te-200-lsp-2-core.conf

```
/*
 * Topic: MPLS traffic engineering with 200 RSVP LSPs and two core interfaces
 * Seen on:
 *   Junos: (none)
 *   EVO: dci1_ptx10001-36mr dci3_acx7100-48l
 * Count:
 *   dci1_ptx10001-36mr 1
 *   dci3_acx7100-48l 1
 *   total 2
 * Highlights:
 *   - The validated scale: 100 RSVP-signalled LSPs to each of the two other DCI routers, all from the local loopback, listed peer by peer.
 *   - MPLS runs on the two DWDM core bundles.
 * Pair with: none
 * Variables (example values from dci1_ptx10001-36mr):
 *   $LSP_NAME_1    e.g. lsp-r1-to-r21
 *   $LOOPBACK_V4   e.g. 10.1.1.1
 *   $LSP_TO_A      e.g. 10.1.1.2
 *   $LSP_NAME_2    e.g. lsp-r1-to-r22
 *   $LSP_NAME_3    e.g. lsp-r1-to-r23
 *   $LSP_NAME_4    e.g. lsp-r1-to-r24
 *   $LSP_NAME_5    e.g. lsp-r1-to-r25
 *   $LSP_NAME_6    e.g. lsp-r1-to-r26
 *   $LSP_NAME_7    e.g. lsp-r1-to-r27
 *   $LSP_NAME_8    e.g. lsp-r1-to-r28
 *   $LSP_NAME_9    e.g. lsp-r1-to-r29
 *   $LSP_NAME_10   e.g. lsp-r1-to-r210
 *   $LSP_NAME_11   e.g. lsp-r1-to-r211
 *   $LSP_NAME_12   e.g. lsp-r1-to-r212
 *   $LSP_NAME_13   e.g. lsp-r1-to-r213
 *   $LSP_NAME_14   e.g. lsp-r1-to-r214
 *   $LSP_NAME_15   e.g. lsp-r1-to-r215
 *   $LSP_NAME_16   e.g. lsp-r1-to-r216
 *   $LSP_NAME_17   e.g. lsp-r1-to-r217
 *   $LSP_NAME_18   e.g. lsp-r1-to-r218
 *   $LSP_NAME_19   e.g. lsp-r1-to-r219
 *   $LSP_NAME_20   e.g. lsp-r1-to-r220
 *   $LSP_NAME_21   e.g. lsp-r1-to-r221
 *   $LSP_NAME_22   e.g. lsp-r1-to-r222
 *   $LSP_NAME_23   e.g. lsp-r1-to-r223
 *   $LSP_NAME_24   e.g. lsp-r1-to-r224
 *   $LSP_NAME_25   e.g. lsp-r1-to-r225
 *   $LSP_NAME_26   e.g. lsp-r1-to-r226
 *   $LSP_NAME_27   e.g. lsp-r1-to-r227
 *   $LSP_NAME_28   e.g. lsp-r1-to-r228
 *   $LSP_NAME_29   e.g. lsp-r1-to-r229
 *   $LSP_NAME_30   e.g. lsp-r1-to-r230
 *   $LSP_NAME_31   e.g. lsp-r1-to-r231
 *   $LSP_NAME_32   e.g. lsp-r1-to-r232
 *   $LSP_NAME_33   e.g. lsp-r1-to-r233
 *   $LSP_NAME_34   e.g. lsp-r1-to-r234
 *   $LSP_NAME_35   e.g. lsp-r1-to-r235
 *   $LSP_NAME_36   e.g. lsp-r1-to-r236
 *   $LSP_NAME_37   e.g. lsp-r1-to-r237
 *   $LSP_NAME_38   e.g. lsp-r1-to-r238
 *   $LSP_NAME_39   e.g. lsp-r1-to-r239
 *   $LSP_NAME_40   e.g. lsp-r1-to-r240
 *   $LSP_NAME_41   e.g. lsp-r1-to-r241
 *   $LSP_NAME_42   e.g. lsp-r1-to-r242
 *   $LSP_NAME_43   e.g. lsp-r1-to-r243
 *   $LSP_NAME_44   e.g. lsp-r1-to-r244
 *   $LSP_NAME_45   e.g. lsp-r1-to-r245
 *   $LSP_NAME_46   e.g. lsp-r1-to-r246
 *   $LSP_NAME_47   e.g. lsp-r1-to-r247
 *   $LSP_NAME_48   e.g. lsp-r1-to-r248
 *   $LSP_NAME_49   e.g. lsp-r1-to-r249
 *   $LSP_NAME_50   e.g. lsp-r1-to-r250
 *   $LSP_NAME_51   e.g. lsp-r1-to-r251
 *   $LSP_NAME_52   e.g. lsp-r1-to-r252
 *   $LSP_NAME_53   e.g. lsp-r1-to-r253
 *   $LSP_NAME_54   e.g. lsp-r1-to-r254
 *   $LSP_NAME_55   e.g. lsp-r1-to-r255
 *   $LSP_NAME_56   e.g. lsp-r1-to-r256
 *   $LSP_NAME_57   e.g. lsp-r1-to-r257
 *   $LSP_NAME_58   e.g. lsp-r1-to-r258
 *   $LSP_NAME_59   e.g. lsp-r1-to-r259
 *   $LSP_NAME_60   e.g. lsp-r1-to-r260
 *   $LSP_NAME_61   e.g. lsp-r1-to-r261
 *   $LSP_NAME_62   e.g. lsp-r1-to-r262
 *   $LSP_NAME_63   e.g. lsp-r1-to-r263
 *   $LSP_NAME_64   e.g. lsp-r1-to-r264
 *   $LSP_NAME_65   e.g. lsp-r1-to-r265
 *   $LSP_NAME_66   e.g. lsp-r1-to-r266
 *   $LSP_NAME_67   e.g. lsp-r1-to-r267
 *   $LSP_NAME_68   e.g. lsp-r1-to-r268
 *   $LSP_NAME_69   e.g. lsp-r1-to-r269
 *   $LSP_NAME_70   e.g. lsp-r1-to-r270
 *   $LSP_NAME_71   e.g. lsp-r1-to-r271
 *   $LSP_NAME_72   e.g. lsp-r1-to-r272
 *   $LSP_NAME_73   e.g. lsp-r1-to-r273
 *   $LSP_NAME_74   e.g. lsp-r1-to-r274
 *   $LSP_NAME_75   e.g. lsp-r1-to-r275
 *   $LSP_NAME_76   e.g. lsp-r1-to-r276
 *   $LSP_NAME_77   e.g. lsp-r1-to-r277
 *   $LSP_NAME_78   e.g. lsp-r1-to-r278
 *   $LSP_NAME_79   e.g. lsp-r1-to-r279
 *   $LSP_NAME_80   e.g. lsp-r1-to-r280
 *   $LSP_NAME_81   e.g. lsp-r1-to-r281
 *   $LSP_NAME_82   e.g. lsp-r1-to-r282
 *   $LSP_NAME_83   e.g. lsp-r1-to-r283
 *   $LSP_NAME_84   e.g. lsp-r1-to-r284
 *   $LSP_NAME_85   e.g. lsp-r1-to-r285
 *   $LSP_NAME_86   e.g. lsp-r1-to-r286
 *   $LSP_NAME_87   e.g. lsp-r1-to-r287
 *   $LSP_NAME_88   e.g. lsp-r1-to-r288
 *   $LSP_NAME_89   e.g. lsp-r1-to-r289
 *   $LSP_NAME_90   e.g. lsp-r1-to-r290
 *   $LSP_NAME_91   e.g. lsp-r1-to-r291
 *   $LSP_NAME_92   e.g. lsp-r1-to-r292
 *   $LSP_NAME_93   e.g. lsp-r1-to-r293
 *   $LSP_NAME_94   e.g. lsp-r1-to-r294
 *   $LSP_NAME_95   e.g. lsp-r1-to-r295
 *   $LSP_NAME_96   e.g. lsp-r1-to-r296
 *   $LSP_NAME_97   e.g. lsp-r1-to-r297
 *   $LSP_NAME_98   e.g. lsp-r1-to-r298
 *   $LSP_NAME_99   e.g. lsp-r1-to-r299
 *   $LSP_NAME_100  e.g. lsp-r1-to-r2100
 *   $LSP_NAME_101  e.g. lsp-r1-to-r31
 *   $LSP_TO_B      e.g. 10.1.1.3
 *   $LSP_NAME_102  e.g. lsp-r1-to-r32
 *   $LSP_NAME_103  e.g. lsp-r1-to-r33
 *   $LSP_NAME_104  e.g. lsp-r1-to-r34
 *   $LSP_NAME_105  e.g. lsp-r1-to-r35
 *   $LSP_NAME_106  e.g. lsp-r1-to-r36
 *   $LSP_NAME_107  e.g. lsp-r1-to-r37
 *   $LSP_NAME_108  e.g. lsp-r1-to-r38
 *   $LSP_NAME_109  e.g. lsp-r1-to-r39
 *   $LSP_NAME_110  e.g. lsp-r1-to-r310
 *   $LSP_NAME_111  e.g. lsp-r1-to-r311
 *   $LSP_NAME_112  e.g. lsp-r1-to-r312
 *   $LSP_NAME_113  e.g. lsp-r1-to-r313
 *   $LSP_NAME_114  e.g. lsp-r1-to-r314
 *   $LSP_NAME_115  e.g. lsp-r1-to-r315
 *   $LSP_NAME_116  e.g. lsp-r1-to-r316
 *   $LSP_NAME_117  e.g. lsp-r1-to-r317
 *   $LSP_NAME_118  e.g. lsp-r1-to-r318
 *   $LSP_NAME_119  e.g. lsp-r1-to-r319
 *   $LSP_NAME_120  e.g. lsp-r1-to-r320
 *   $LSP_NAME_121  e.g. lsp-r1-to-r321
 *   $LSP_NAME_122  e.g. lsp-r1-to-r322
 *   $LSP_NAME_123  e.g. lsp-r1-to-r323
 *   $LSP_NAME_124  e.g. lsp-r1-to-r324
 *   $LSP_NAME_125  e.g. lsp-r1-to-r325
 *   $LSP_NAME_126  e.g. lsp-r1-to-r326
 *   $LSP_NAME_127  e.g. lsp-r1-to-r327
 *   $LSP_NAME_128  e.g. lsp-r1-to-r328
 *   $LSP_NAME_129  e.g. lsp-r1-to-r329
 *   $LSP_NAME_130  e.g. lsp-r1-to-r330
 *   $LSP_NAME_131  e.g. lsp-r1-to-r331
 *   $LSP_NAME_132  e.g. lsp-r1-to-r332
 *   $LSP_NAME_133  e.g. lsp-r1-to-r333
 *   $LSP_NAME_134  e.g. lsp-r1-to-r334
 *   $LSP_NAME_135  e.g. lsp-r1-to-r335
 *   $LSP_NAME_136  e.g. lsp-r1-to-r336
 *   $LSP_NAME_137  e.g. lsp-r1-to-r337
 *   $LSP_NAME_138  e.g. lsp-r1-to-r338
 *   $LSP_NAME_139  e.g. lsp-r1-to-r339
 *   $LSP_NAME_140  e.g. lsp-r1-to-r340
 *   $LSP_NAME_141  e.g. lsp-r1-to-r341
 *   $LSP_NAME_142  e.g. lsp-r1-to-r342
 *   $LSP_NAME_143  e.g. lsp-r1-to-r343
 *   $LSP_NAME_144  e.g. lsp-r1-to-r344
 *   $LSP_NAME_145  e.g. lsp-r1-to-r345
 *   $LSP_NAME_146  e.g. lsp-r1-to-r346
 *   $LSP_NAME_147  e.g. lsp-r1-to-r347
 *   $LSP_NAME_148  e.g. lsp-r1-to-r348
 *   $LSP_NAME_149  e.g. lsp-r1-to-r349
 *   $LSP_NAME_150  e.g. lsp-r1-to-r350
 *   $LSP_NAME_151  e.g. lsp-r1-to-r351
 *   $LSP_NAME_152  e.g. lsp-r1-to-r352
 *   $LSP_NAME_153  e.g. lsp-r1-to-r353
 *   $LSP_NAME_154  e.g. lsp-r1-to-r354
 *   $LSP_NAME_155  e.g. lsp-r1-to-r355
 *   $LSP_NAME_156  e.g. lsp-r1-to-r356
 *   $LSP_NAME_157  e.g. lsp-r1-to-r357
 *   $LSP_NAME_158  e.g. lsp-r1-to-r358
 *   $LSP_NAME_159  e.g. lsp-r1-to-r359
 *   $LSP_NAME_160  e.g. lsp-r1-to-r360
 *   $LSP_NAME_161  e.g. lsp-r1-to-r361
 *   $LSP_NAME_162  e.g. lsp-r1-to-r362
 *   $LSP_NAME_163  e.g. lsp-r1-to-r363
 *   $LSP_NAME_164  e.g. lsp-r1-to-r364
 *   $LSP_NAME_165  e.g. lsp-r1-to-r365
 *   $LSP_NAME_166  e.g. lsp-r1-to-r366
 *   $LSP_NAME_167  e.g. lsp-r1-to-r367
 *   $LSP_NAME_168  e.g. lsp-r1-to-r368
 *   $LSP_NAME_169  e.g. lsp-r1-to-r369
 *   $LSP_NAME_170  e.g. lsp-r1-to-r370
 *   $LSP_NAME_171  e.g. lsp-r1-to-r371
 *   $LSP_NAME_172  e.g. lsp-r1-to-r372
 *   $LSP_NAME_173  e.g. lsp-r1-to-r373
 *   $LSP_NAME_174  e.g. lsp-r1-to-r374
 *   $LSP_NAME_175  e.g. lsp-r1-to-r375
 *   $LSP_NAME_176  e.g. lsp-r1-to-r376
 *   $LSP_NAME_177  e.g. lsp-r1-to-r377
 *   $LSP_NAME_178  e.g. lsp-r1-to-r378
 *   $LSP_NAME_179  e.g. lsp-r1-to-r379
 *   $LSP_NAME_180  e.g. lsp-r1-to-r380
 *   $LSP_NAME_181  e.g. lsp-r1-to-r381
 *   $LSP_NAME_182  e.g. lsp-r1-to-r382
 *   $LSP_NAME_183  e.g. lsp-r1-to-r383
 *   $LSP_NAME_184  e.g. lsp-r1-to-r384
 *   $LSP_NAME_185  e.g. lsp-r1-to-r385
 *   $LSP_NAME_186  e.g. lsp-r1-to-r386
 *   $LSP_NAME_187  e.g. lsp-r1-to-r387
 *   $LSP_NAME_188  e.g. lsp-r1-to-r388
 *   $LSP_NAME_189  e.g. lsp-r1-to-r389
 *   $LSP_NAME_190  e.g. lsp-r1-to-r390
 *   $LSP_NAME_191  e.g. lsp-r1-to-r391
 *   $LSP_NAME_192  e.g. lsp-r1-to-r392
 *   $LSP_NAME_193  e.g. lsp-r1-to-r393
 *   $LSP_NAME_194  e.g. lsp-r1-to-r394
 *   $LSP_NAME_195  e.g. lsp-r1-to-r395
 *   $LSP_NAME_196  e.g. lsp-r1-to-r396
 *   $LSP_NAME_197  e.g. lsp-r1-to-r397
 *   $LSP_NAME_198  e.g. lsp-r1-to-r398
 *   $LSP_NAME_199  e.g. lsp-r1-to-r399
 *   $LSP_NAME_200  e.g. lsp-r1-to-r3100
 *   $CORE_INTF_1   e.g. ae12.0
 *   $CORE_INTF_2   e.g. ae13.0
 */
protocols {
    mpls {
        traffic-engineering;
        label-switched-path $LSP_NAME_1 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_2 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_3 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_4 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_5 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_6 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_7 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_8 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_9 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_10 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_11 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_12 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_13 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_14 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_15 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_16 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_17 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_18 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_19 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_20 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_21 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_22 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_23 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_24 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_25 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_26 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_27 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_28 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_29 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_30 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_31 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_32 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_33 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_34 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_35 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_36 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_37 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_38 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_39 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_40 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_41 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_42 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_43 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_44 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_45 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_46 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_47 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_48 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_49 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_50 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_51 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_52 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_53 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_54 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_55 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_56 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_57 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_58 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_59 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_60 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_61 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_62 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_63 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_64 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_65 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_66 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_67 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_68 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_69 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_70 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_71 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_72 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_73 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_74 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_75 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_76 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_77 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_78 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_79 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_80 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_81 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_82 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_83 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_84 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_85 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_86 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_87 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_88 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_89 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_90 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_91 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_92 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_93 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_94 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_95 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_96 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_97 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_98 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_99 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_100 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_101 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_102 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_103 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_104 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_105 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_106 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_107 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_108 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_109 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_110 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_111 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_112 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_113 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_114 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_115 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_116 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_117 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_118 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_119 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_120 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_121 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_122 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_123 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_124 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_125 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_126 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_127 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_128 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_129 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_130 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_131 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_132 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_133 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_134 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_135 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_136 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_137 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_138 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_139 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_140 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_141 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_142 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_143 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_144 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_145 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_146 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_147 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_148 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_149 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_150 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_151 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_152 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_153 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_154 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_155 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_156 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_157 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_158 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_159 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_160 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_161 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_162 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_163 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_164 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_165 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_166 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_167 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_168 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_169 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_170 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_171 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_172 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_173 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_174 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_175 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_176 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_177 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_178 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_179 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_180 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_181 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_182 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_183 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_184 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_185 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_186 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_187 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_188 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_189 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_190 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_191 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_192 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_193 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_194 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_195 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_196 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_197 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_198 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_199 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_200 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        interface $CORE_INTF_1;
        interface $CORE_INTF_2;
    }
}
```

## evo/protocols/ospf-area0-loopback-2-p2p-core.conf

```
/*
 * Topic: OSPF backbone area with a passive loopback and two point-to-point core interfaces
 * Seen on:
 *   Junos: (none)
 *   EVO: dci1_ptx10001-36mr dci3_acx7100-48l
 * Count:
 *   dci1_ptx10001-36mr 1
 *   dci3_acx7100-48l 1
 *   total 2
 * Pair with: none
 * Variables (example values from dci1_ptx10001-36mr):
 *   $CORE_INTF_1  e.g. ae12.0
 *   $CORE_INTF_2  e.g. ae13.0
 */
protocols {
    ospf {
        area 0.0.0.0 {
            interface lo0.0 {
                passive;
            }
            interface $CORE_INTF_1 {
                interface-type p2p;
            }
            interface $CORE_INTF_2 {
                interface-type p2p;
            }
        }
    }
}
```

## evo/protocols/ospf-traffic-engineering.conf

```
/*
 * Topic: OSPF traffic-engineering extensions
 * Seen on:
 *   Junos: (none)
 *   EVO: dci1_ptx10001-36mr dci3_acx7100-48l
 * Count:
 *   dci1_ptx10001-36mr 1
 *   dci3_acx7100-48l 1
 *   total 2
 * Highlights:
 *   - Floods TE information so RSVP-TE can compute constrained paths for the LSPs.
 * Pair with: none
 * Variables: none
 */
protocols {
    ospf {
        traffic-engineering;
    }
}
```

## evo/protocols/rsvp-interface-2-core.conf

```
/*
 * Topic: RSVP on two core interfaces
 * Seen on:
 *   Junos: (none)
 *   EVO: dci1_ptx10001-36mr dci3_acx7100-48l
 * Count:
 *   dci1_ptx10001-36mr 1
 *   dci3_acx7100-48l 1
 *   total 2
 * Pair with: none
 * Variables (example values from dci1_ptx10001-36mr):
 *   $CORE_INTF_1  e.g. ae12.0
 *   $CORE_INTF_2  e.g. ae13.0
 */
protocols {
    rsvp {
        interface $CORE_INTF_1;
        interface $CORE_INTF_2;
    }
}
```

## evo/routing-instances/l3vpn/ri-l3vpn-ebgp-local-as-vrf-target.conf

```
/*
 * Topic: L3VPN VRF with an eBGP CE session that sets a local AS, and a route target
 * Seen on:
 *   Junos: (none)
 *   EVO: dci1_ptx10001-36mr dci3_acx7100-48l
 * Count:
 *   dci1_ptx10001-36mr 100
 *   dci3_acx7100-48l 100
 *   total 200
 * Highlights:
 *   - One of the 100 VPNv4 instances: an eBGP IPv4 unicast session to the traffic generator, with the router's own AS set as local AS.
 *   - `vrf-table-label` gives the VRF one label for IP lookup on egress; route targets come from `vrf-target`.
 * Pair with: none
 * Variables (example values from dci1_ptx10001-36mr):
 *   $INSTANCE_NAME    e.g. L3VPN_DCI_RI_1
 *   $BGP_GROUP        e.g. ebgp-w-tgen
 *   $CE_PEER_V4       e.g. 10.10.1.2
 *   $PE_LOCAL_V4      e.g. 10.10.1.1
 *   $ASN_CUSTOMER     e.g. 65501
 *   $ASN              e.g. 65000
 *   $AC_IFL           e.g. et-0/0/4.1
 *   $LOOPBACK_V4      e.g. 10.1.1.1
 *   $RD_SUB_ASSIGNED  e.g. 1
 *   $RT_AS            e.g. 65000
 *   $RT_ID            e.g. 1
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type vrf;
        protocols {
            bgp {
                group $BGP_GROUP {
                    type external;
                    family inet {
                        unicast;
                    }
                    neighbor $CE_PEER_V4 {
                        local-address $PE_LOCAL_V4;
                        peer-as $ASN_CUSTOMER;
                        local-as $ASN;
                    }
                }
            }
        }
        interface $AC_IFL;
        route-distinguisher $LOOPBACK_V4:$RD_SUB_ASSIGNED;
        vrf-target target:$RT_AS:$RT_ID;
        vrf-table-label;
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `logical-interface` (`$AC_IFL`): required, for each reference; `interfaces/ifl-vlan-inet`

## evo/routing-options/autonomous-system.conf

```
/*
 * Topic: Autonomous system number
 * Seen on:
 *   Junos: (none)
 *   EVO: dci1_ptx10001-36mr dci3_acx7100-48l
 * Count:
 *   dci1_ptx10001-36mr 1
 *   dci3_acx7100-48l 1
 *   total 2
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from dci1_ptx10001-36mr):
 *   $ASN  e.g. 65000
 */
routing-options {
    autonomous-system $ASN;
}
```

## evo/routing-options/forwarding-table-pplb-chained-nh-evpn.conf

```
/*
 * Topic: Forwarding-table load-balance export with chained composite next hops for EVPN
 * Seen on:
 *   Junos: (none)
 *   EVO: dci1_ptx10001-36mr dci3_acx7100-48l
 * Count:
 *   dci1_ptx10001-36mr 1
 *   dci3_acx7100-48l 1
 *   total 2
 * Highlights:
 *   - Exports the load-balance policy to the forwarding table and enables `chained-composite-next-hop ingress evpn`; no `ecmp-fast-reroute`.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from dci1_ptx10001-36mr):
 *   $PPLB_NAME  e.g. PPLB
 */
routing-options {
    forwarding-table {
        export $PPLB_NAME;
        chained-composite-next-hop {
            ingress {
                evpn;
            }
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `policy-statement` (`$PPLB_NAME`): required, for each reference; `policy-options/policy-statement/per-flow-load-balance`

## evo/routing-options/maximum-ecmp.conf

```
/*
 * Topic: Maximum ECMP paths
 * Seen on:
 *   Junos: (none)
 *   EVO: dci1_ptx10001-36mr dci3_acx7100-48l
 * Count:
 *   dci1_ptx10001-36mr 1
 *   dci3_acx7100-48l 1
 *   total 2
 * Highlights:
 *   - Raises the ECMP ceiling to 16 next hops.
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
routing-options {
    maximum-ecmp 16;
}
```

## evo/routing-options/router-id.conf

```
/*
 * Topic: Router ID
 * Seen on:
 *   Junos: (none)
 *   EVO: dci1_ptx10001-36mr dci3_acx7100-48l
 * Count:
 *   dci1_ptx10001-36mr 1
 *   dci3_acx7100-48l 1
 *   total 2
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from dci1_ptx10001-36mr):
 *   $ROUTER_ID  e.g. 10.1.1.1
 */
routing-options {
    router-id $ROUTER_ID;
}
```

## evo/system/login-2-users-super-user.conf

```
/*
 * Topic: Two local super-user accounts with encrypted passwords
 * Seen on:
 *   Junos: (none)
 *   EVO: dci1_ptx10001-36mr dci3_acx7100-48l
 * Count:
 *   dci1_ptx10001-36mr 1
 *   dci3_acx7100-48l 1
 *   total 2
 * Highlights:
 *   - Two automation accounts (in the validated configuration, `gnmi_user` and `netconf_user`) with fixed UIDs; both carry the same encrypted password in the published files.
 * Pair with: none
 * Variables (example values from dci1_ptx10001-36mr):
 *   $LOGIN_USER_1        e.g. gnmi_user
 *   $LOGIN_UID_1         e.g. 2002
 *   $ENCRYPTED_PASSWORD  e.g. "$1$kPU..$w.4FGRAGanJ8U4Yq6sbj7."
 *   $LOGIN_USER_2        e.g. netconf_user
 *   $LOGIN_UID_2         e.g. 2003
 */
system {
    login {
        user $LOGIN_USER_1 {
            uid $LOGIN_UID_1;
            class super-user;
            authentication {
                encrypted-password $ENCRYPTED_PASSWORD;
            }
        }
        user $LOGIN_USER_2 {
            uid $LOGIN_UID_2;
            class super-user;
            authentication {
                encrypted-password $ENCRYPTED_PASSWORD;
            }
        }
    }
}
```

## evo/system/ntp-server.conf

```
/*
 * Topic: NTP server
 * Seen on:
 *   Junos: (none)
 *   EVO: dci1_ptx10001-36mr
 * Count:
 *   dci1_ptx10001-36mr 1
 *   total 1
 * Pair with: none
 * Variables (example values from dci1_ptx10001-36mr):
 *   $NTP_SERVER  e.g. 66.129.233.81
 */
system {
    ntp {
        server $NTP_SERVER;
    }
}
```

## evo/system/ports-console-log-out.conf

```
/*
 * Topic: Console log-out on disconnect
 * Seen on:
 *   Junos: (none)
 *   EVO: dci1_ptx10001-36mr
 * Count:
 *   dci1_ptx10001-36mr 1
 *   total 1
 * Highlights:
 *   - Logs the console session out when the cable is disconnected.
 * Pair with: none
 * Variables: none
 */
system {
    ports {
        console log-out-on-disconnect;
    }
}
```

## evo/system/processes-ntp-enable.conf

```
/*
 * Topic: NTP process enabled
 * Seen on:
 *   Junos: (none)
 *   EVO: dci1_ptx10001-36mr
 * Count:
 *   dci1_ptx10001-36mr 1
 *   total 1
 * Pair with: none
 * Variables: none
 */
system {
    processes {
        ntp enable;
    }
}
```

## evo/system/services-grpc-clear-text-netconf-ssh.conf

```
/*
 * Topic: Clear-text gRPC for telemetry and NETCONF over SSH
 * Seen on:
 *   Junos: (none)
 *   EVO: dci1_ptx10001-36mr
 * Count:
 *   dci1_ptx10001-36mr 1
 *   total 1
 * Highlights:
 *   - Same services as `services-netconf-ssh-grpc-clear-text`, configured in the other order (gRPC first).
 * Pair with: none
 * Variables: none
 */
system {
    services {
        extension-service {
            request-response {
                grpc {
                    clear-text {
                        port 9339;
                    }
                    max-connections 8;
                    skip-authentication;
                }
            }
        }
        netconf {
            ssh;
            rfc-compliant;
        }
    }
}
```

## evo/system/services-netconf-ssh-grpc-clear-text.conf

```
/*
 * Topic: NETCONF over SSH and clear-text gRPC for telemetry
 * Seen on:
 *   Junos: (none)
 *   EVO: dci3_acx7100-48l
 * Count:
 *   dci3_acx7100-48l 1
 *   total 1
 * Highlights:
 *   - NETCONF over SSH with RFC-compliant replies, then gRPC on clear-text port 9339 (eight connections, no authentication) for streaming telemetry.
 * Pair with: none
 * Variables: none
 */
system {
    services {
        netconf {
            ssh;
            rfc-compliant;
        }
        extension-service {
            request-response {
                grpc {
                    clear-text {
                        port 9339;
                    }
                    max-connections 8;
                    skip-authentication;
                }
            }
        }
    }
}
```

## evo/system/time-zone.conf

```
/*
 * Topic: System time zone
 * Seen on:
 *   Junos: (none)
 *   EVO: dci1_ptx10001-36mr
 * Count:
 *   dci1_ptx10001-36mr 1
 *   total 1
 * Pair with: none
 * Variables (example values from dci1_ptx10001-36mr):
 *   $TIME_ZONE  e.g. America/Los_Angeles
 */
system {
    time-zone $TIME_ZONE;
}
```

## junos/chassis/aggregated-devices-ethernet.conf

```
/*
 * Topic: Aggregated Ethernet device count
 * Seen on:
 *   Junos: dci2_mx304
 *   EVO: (none)
 * Count:
 *   dci2_mx304 1
 *   total 1
 * Highlights:
 *   - Pre-allocates the aggregated Ethernet interfaces the chassis may create.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from dci2_mx304):
 *   $AE_DEVICE_COUNT  e.g. 10
 */
chassis {
    aggregated-devices {
        ethernet {
            device-count $AE_DEVICE_COUNT;
        }
    }
}
```

## junos/chassis/fpc-mx304-5x400g-1x100g-1x4x10g.conf

```
/*
 * Topic: MX304 port speeds for 400G coherent optics
 * Seen on:
 *   Junos: dci2_mx304
 *   EVO: (none)
 * Count:
 *   dci2_mx304 1
 *   total 1
 * Highlights:
 *   - Five ports at 400G for the coherent optics, one at 100G for the test-traffic port and one channelized to four 10G sub-ports.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from dci2_mx304):
 *   $FPC_SLOT  e.g. 0
 */
chassis {
    fpc $FPC_SLOT {
        pic 0 {
            port 1 {
                number-of-sub-ports 4;
                speed 10g;
            }
            port 2 {
                speed 100g;
            }
            port 6 {
                speed 400g;
            }
            port 8 {
                speed 400g;
            }
            port 14 {
                speed 400g;
            }
        }
        pic 1 {
            port 0 {
                speed 400g;
            }
            port 6 {
                speed 400g;
            }
        }
    }
}
```

## junos/interfaces/ifd-core-aggregate-min-links-lacp-fast.conf

```
/*
 * Topic: Aggregated Ethernet core bundle with minimum links and fast active LACP
 * Seen on:
 *   Junos: dci2_mx304
 *   EVO: (none)
 * Count:
 *   dci2_mx304 2
 *   total 2
 * Highlights:
 *   - Bundles the coherent DWDM ports; LACP active with fast periodic hellos, and the bundle stays up with one member.
 * Pair with: none
 * Variables (example values from dci2_mx304):
 *   $IFD  e.g. ae12
 */
interfaces {
    $IFD {
        aggregated-ether-options {
            minimum-links 1;
            lacp {
                active;
                periodic fast;
            }
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `lag-member`: when the router's configuration has it, all related; `interfaces/ifd-lag-member-gigether-wavelength`

## junos/interfaces/ifd-flexible-ethernet-services.conf

```
/*
 * Topic: Port with flexible VLAN tagging and flexible Ethernet services
 * Seen on:
 *   Junos: dci2_mx304
 *   EVO: (none)
 * Count:
 *   dci2_mx304 1
 *   total 1
 * Highlights:
 *   - Flexible tagging and `flexible-ethernet-services` let one port carry many VLAN units; here the 100 routed customer-side units.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from dci2_mx304):
 *   $IFD  e.g. et-0/0/2
 */
interfaces {
    $IFD {
        flexible-vlan-tagging;
        encapsulation flexible-ethernet-services;
    }
}
```

## junos/interfaces/ifd-lag-member-gigether-wavelength.conf

```
/*
 * Topic: Coherent optics port as an aggregated Ethernet member, with its DWDM wavelength
 * Seen on:
 *   Junos: dci2_mx304
 *   EVO: (none)
 * Count:
 *   dci2_mx304 5
 *   total 5
 * Highlights:
 *   - The 400G coherent optic plugs straight into the router: `optics-options wavelength` tunes it onto the DWDM line system, so no external transponder is used.
 *   - Junos OS sets LAG membership under `gigether-options`.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from dci2_mx304):
 *   $IFD         e.g. et-0/0/14
 *   $AE_BUNDLE   e.g. ae12
 *   $WAVELENGTH  e.g. 1548.31
 */
interfaces {
    $IFD {
        gigether-options {
            802.3ad $AE_BUNDLE;
        }
        optics-options {
            wavelength $WAVELENGTH;
        }
    }
}
```

## junos/interfaces/ifl-core-inet-mpls-max-labels-5.conf

```
/*
 * Topic: Core logical interface with IPv4 and MPLS
 * Seen on:
 *   Junos: dci2_mx304
 *   EVO: (none)
 * Count:
 *   dci2_mx304 2
 *   total 2
 * Highlights:
 *   - IPv4 and MPLS on the DWDM bundle; MPLS allows a stack of up to five labels.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from dci2_mx304):
 *   $IFD           e.g. ae12
 *   $UNIT          e.g. 0
 *   $CORE_V4_ADDR  e.g. 10.12..1.2/30
 */
interfaces {
    $IFD {
        unit $UNIT {
            family inet {
                address $CORE_V4_ADDR;
            }
            family mpls {
                maximum-labels 5;
            }
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `interface-parent`: when the router's configuration has it, all related; `interfaces/ifd-core-aggregate-min-links-lacp-fast`
- `lag-member`: when the router's configuration has it, all related; `interfaces/ifd-lag-member-gigether-wavelength`

## junos/interfaces/ifl-loopback-inet.conf

```
/*
 * Topic: Loopback unit with one IPv4 address
 * Seen on:
 *   Junos: dci2_mx304
 *   EVO: (none)
 * Count:
 *   dci2_mx304 1
 *   total 1
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from dci2_mx304):
 *   $UNIT             e.g. 0
 *   $LOOPBACK_V4_PFX  e.g. 10.1.1.2/32
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

## junos/interfaces/ifl-vlan-inet.conf

```
/*
 * Topic: VLAN-tagged IPv4 unit
 * Seen on:
 *   Junos: dci2_mx304
 *   EVO: (none)
 * Count:
 *   dci2_mx304 100
 *   total 100
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from dci2_mx304):
 *   $IFD         e.g. et-0/0/2
 *   $UNIT        e.g. 1
 *   $VLAN        e.g. 1
 *   $AC_ADDR_V4  e.g. 10.20.1.1/30
 */
interfaces {
    $IFD {
        unit $UNIT {
            vlan-id $VLAN;
            family inet {
                address $AC_ADDR_V4;
            }
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `interface-parent`: when the router's configuration has it, all related; `interfaces/ifd-flexible-ethernet-services`

## junos/policy-options/policy-statement/per-flow-load-balance.conf

```
/*
 * Topic: Per-flow load-balance policy
 * Seen on:
 *   Junos: dci2_mx304
 *   EVO: (none)
 * Count:
 *   dci2_mx304 1
 *   total 1
 * Highlights:
 *   - Exported to the forwarding table so traffic spreads across equal-cost paths per flow.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from dci2_mx304):
 *   $PPLB_NAME  e.g. PPLB
 */
policy-options {
    policy-statement $PPLB_NAME {
        then {
            load-balance per-flow;
        }
    }
}
```

## junos/protocols/bgp-ibgp-inet-vpn-2-peers.conf

```
/*
 * Topic: iBGP group for L3VPN with two loopback neighbors
 * Seen on:
 *   Junos: dci2_mx304
 *   EVO: (none)
 * Count:
 *   dci2_mx304 1
 *   total 1
 * Highlights:
 *   - Full mesh between the three DCI routers: each peers with the other two over loopbacks and carries `inet-vpn unicast` for the 100 VRFs.
 * Pair with: none
 * Variables (example values from dci2_mx304):
 *   $BGP_GROUP       e.g. grp-iBGP
 *   $LOOPBACK_V4     e.g. 10.1.1.2
 *   $IBGP_PEER_V4_1  e.g. 10.1.1.1
 *   $IBGP_PEER_V4_2  e.g. 10.1.1.3
 */
protocols {
    bgp {
        group $BGP_GROUP {
            type internal;
            local-address $LOOPBACK_V4;
            family inet-vpn {
                unicast;
            }
            neighbor $IBGP_PEER_V4_1;
            neighbor $IBGP_PEER_V4_2;
        }
    }
}
```

## junos/protocols/mpls-te-200-lsp-2-core.conf

```
/*
 * Topic: MPLS traffic engineering with 200 RSVP LSPs and two core interfaces
 * Seen on:
 *   Junos: dci2_mx304
 *   EVO: (none)
 * Count:
 *   dci2_mx304 1
 *   total 1
 * Highlights:
 *   - The validated scale: 100 RSVP-signalled LSPs to each of the two other DCI routers, all from the local loopback, listed peer by peer.
 *   - MPLS runs on the two DWDM core bundles.
 * Pair with: none
 * Variables (example values from dci2_mx304):
 *   $LSP_NAME_1    e.g. lsp-r2-to-r11
 *   $LOOPBACK_V4   e.g. 10.1.1.2
 *   $LSP_TO_A      e.g. 10.1.1.1
 *   $LSP_NAME_2    e.g. lsp-r2-to-r12
 *   $LSP_NAME_3    e.g. lsp-r2-to-r13
 *   $LSP_NAME_4    e.g. lsp-r2-to-r14
 *   $LSP_NAME_5    e.g. lsp-r2-to-r15
 *   $LSP_NAME_6    e.g. lsp-r2-to-r16
 *   $LSP_NAME_7    e.g. lsp-r2-to-r17
 *   $LSP_NAME_8    e.g. lsp-r2-to-r18
 *   $LSP_NAME_9    e.g. lsp-r2-to-r19
 *   $LSP_NAME_10   e.g. lsp-r2-to-r110
 *   $LSP_NAME_11   e.g. lsp-r2-to-r111
 *   $LSP_NAME_12   e.g. lsp-r2-to-r112
 *   $LSP_NAME_13   e.g. lsp-r2-to-r113
 *   $LSP_NAME_14   e.g. lsp-r2-to-r114
 *   $LSP_NAME_15   e.g. lsp-r2-to-r115
 *   $LSP_NAME_16   e.g. lsp-r2-to-r116
 *   $LSP_NAME_17   e.g. lsp-r2-to-r117
 *   $LSP_NAME_18   e.g. lsp-r2-to-r118
 *   $LSP_NAME_19   e.g. lsp-r2-to-r119
 *   $LSP_NAME_20   e.g. lsp-r2-to-r120
 *   $LSP_NAME_21   e.g. lsp-r2-to-r121
 *   $LSP_NAME_22   e.g. lsp-r2-to-r122
 *   $LSP_NAME_23   e.g. lsp-r2-to-r123
 *   $LSP_NAME_24   e.g. lsp-r2-to-r124
 *   $LSP_NAME_25   e.g. lsp-r2-to-r125
 *   $LSP_NAME_26   e.g. lsp-r2-to-r126
 *   $LSP_NAME_27   e.g. lsp-r2-to-r127
 *   $LSP_NAME_28   e.g. lsp-r2-to-r128
 *   $LSP_NAME_29   e.g. lsp-r2-to-r129
 *   $LSP_NAME_30   e.g. lsp-r2-to-r130
 *   $LSP_NAME_31   e.g. lsp-r2-to-r131
 *   $LSP_NAME_32   e.g. lsp-r2-to-r132
 *   $LSP_NAME_33   e.g. lsp-r2-to-r133
 *   $LSP_NAME_34   e.g. lsp-r2-to-r134
 *   $LSP_NAME_35   e.g. lsp-r2-to-r135
 *   $LSP_NAME_36   e.g. lsp-r2-to-r136
 *   $LSP_NAME_37   e.g. lsp-r2-to-r137
 *   $LSP_NAME_38   e.g. lsp-r2-to-r138
 *   $LSP_NAME_39   e.g. lsp-r2-to-r139
 *   $LSP_NAME_40   e.g. lsp-r2-to-r140
 *   $LSP_NAME_41   e.g. lsp-r2-to-r141
 *   $LSP_NAME_42   e.g. lsp-r2-to-r142
 *   $LSP_NAME_43   e.g. lsp-r2-to-r143
 *   $LSP_NAME_44   e.g. lsp-r2-to-r144
 *   $LSP_NAME_45   e.g. lsp-r2-to-r145
 *   $LSP_NAME_46   e.g. lsp-r2-to-r146
 *   $LSP_NAME_47   e.g. lsp-r2-to-r147
 *   $LSP_NAME_48   e.g. lsp-r2-to-r148
 *   $LSP_NAME_49   e.g. lsp-r2-to-r149
 *   $LSP_NAME_50   e.g. lsp-r2-to-r150
 *   $LSP_NAME_51   e.g. lsp-r2-to-r151
 *   $LSP_NAME_52   e.g. lsp-r2-to-r152
 *   $LSP_NAME_53   e.g. lsp-r2-to-r153
 *   $LSP_NAME_54   e.g. lsp-r2-to-r154
 *   $LSP_NAME_55   e.g. lsp-r2-to-r155
 *   $LSP_NAME_56   e.g. lsp-r2-to-r156
 *   $LSP_NAME_57   e.g. lsp-r2-to-r157
 *   $LSP_NAME_58   e.g. lsp-r2-to-r158
 *   $LSP_NAME_59   e.g. lsp-r2-to-r159
 *   $LSP_NAME_60   e.g. lsp-r2-to-r160
 *   $LSP_NAME_61   e.g. lsp-r2-to-r161
 *   $LSP_NAME_62   e.g. lsp-r2-to-r162
 *   $LSP_NAME_63   e.g. lsp-r2-to-r163
 *   $LSP_NAME_64   e.g. lsp-r2-to-r164
 *   $LSP_NAME_65   e.g. lsp-r2-to-r165
 *   $LSP_NAME_66   e.g. lsp-r2-to-r166
 *   $LSP_NAME_67   e.g. lsp-r2-to-r167
 *   $LSP_NAME_68   e.g. lsp-r2-to-r168
 *   $LSP_NAME_69   e.g. lsp-r2-to-r169
 *   $LSP_NAME_70   e.g. lsp-r2-to-r170
 *   $LSP_NAME_71   e.g. lsp-r2-to-r171
 *   $LSP_NAME_72   e.g. lsp-r2-to-r172
 *   $LSP_NAME_73   e.g. lsp-r2-to-r173
 *   $LSP_NAME_74   e.g. lsp-r2-to-r174
 *   $LSP_NAME_75   e.g. lsp-r2-to-r175
 *   $LSP_NAME_76   e.g. lsp-r2-to-r176
 *   $LSP_NAME_77   e.g. lsp-r2-to-r177
 *   $LSP_NAME_78   e.g. lsp-r2-to-r178
 *   $LSP_NAME_79   e.g. lsp-r2-to-r179
 *   $LSP_NAME_80   e.g. lsp-r2-to-r180
 *   $LSP_NAME_81   e.g. lsp-r2-to-r181
 *   $LSP_NAME_82   e.g. lsp-r2-to-r182
 *   $LSP_NAME_83   e.g. lsp-r2-to-r183
 *   $LSP_NAME_84   e.g. lsp-r2-to-r184
 *   $LSP_NAME_85   e.g. lsp-r2-to-r185
 *   $LSP_NAME_86   e.g. lsp-r2-to-r186
 *   $LSP_NAME_87   e.g. lsp-r2-to-r187
 *   $LSP_NAME_88   e.g. lsp-r2-to-r188
 *   $LSP_NAME_89   e.g. lsp-r2-to-r189
 *   $LSP_NAME_90   e.g. lsp-r2-to-r190
 *   $LSP_NAME_91   e.g. lsp-r2-to-r191
 *   $LSP_NAME_92   e.g. lsp-r2-to-r192
 *   $LSP_NAME_93   e.g. lsp-r2-to-r193
 *   $LSP_NAME_94   e.g. lsp-r2-to-r194
 *   $LSP_NAME_95   e.g. lsp-r2-to-r195
 *   $LSP_NAME_96   e.g. lsp-r2-to-r196
 *   $LSP_NAME_97   e.g. lsp-r2-to-r197
 *   $LSP_NAME_98   e.g. lsp-r2-to-r198
 *   $LSP_NAME_99   e.g. lsp-r2-to-r199
 *   $LSP_NAME_100  e.g. lsp-r2-to-r1100
 *   $LSP_NAME_101  e.g. lsp-r2-to-r31
 *   $LSP_TO_B      e.g. 10.1.1.3
 *   $LSP_NAME_102  e.g. lsp-r2-to-r32
 *   $LSP_NAME_103  e.g. lsp-r2-to-r33
 *   $LSP_NAME_104  e.g. lsp-r2-to-r34
 *   $LSP_NAME_105  e.g. lsp-r2-to-r35
 *   $LSP_NAME_106  e.g. lsp-r2-to-r36
 *   $LSP_NAME_107  e.g. lsp-r2-to-r37
 *   $LSP_NAME_108  e.g. lsp-r2-to-r38
 *   $LSP_NAME_109  e.g. lsp-r2-to-r39
 *   $LSP_NAME_110  e.g. lsp-r2-to-r310
 *   $LSP_NAME_111  e.g. lsp-r2-to-r311
 *   $LSP_NAME_112  e.g. lsp-r2-to-r312
 *   $LSP_NAME_113  e.g. lsp-r2-to-r313
 *   $LSP_NAME_114  e.g. lsp-r2-to-r314
 *   $LSP_NAME_115  e.g. lsp-r2-to-r315
 *   $LSP_NAME_116  e.g. lsp-r2-to-r316
 *   $LSP_NAME_117  e.g. lsp-r2-to-r317
 *   $LSP_NAME_118  e.g. lsp-r2-to-r318
 *   $LSP_NAME_119  e.g. lsp-r2-to-r319
 *   $LSP_NAME_120  e.g. lsp-r2-to-r320
 *   $LSP_NAME_121  e.g. lsp-r2-to-r321
 *   $LSP_NAME_122  e.g. lsp-r2-to-r322
 *   $LSP_NAME_123  e.g. lsp-r2-to-r323
 *   $LSP_NAME_124  e.g. lsp-r2-to-r324
 *   $LSP_NAME_125  e.g. lsp-r2-to-r325
 *   $LSP_NAME_126  e.g. lsp-r2-to-r326
 *   $LSP_NAME_127  e.g. lsp-r2-to-r327
 *   $LSP_NAME_128  e.g. lsp-r2-to-r328
 *   $LSP_NAME_129  e.g. lsp-r2-to-r329
 *   $LSP_NAME_130  e.g. lsp-r2-to-r330
 *   $LSP_NAME_131  e.g. lsp-r2-to-r331
 *   $LSP_NAME_132  e.g. lsp-r2-to-r332
 *   $LSP_NAME_133  e.g. lsp-r2-to-r333
 *   $LSP_NAME_134  e.g. lsp-r2-to-r334
 *   $LSP_NAME_135  e.g. lsp-r2-to-r335
 *   $LSP_NAME_136  e.g. lsp-r2-to-r336
 *   $LSP_NAME_137  e.g. lsp-r2-to-r337
 *   $LSP_NAME_138  e.g. lsp-r2-to-r338
 *   $LSP_NAME_139  e.g. lsp-r2-to-r339
 *   $LSP_NAME_140  e.g. lsp-r2-to-r340
 *   $LSP_NAME_141  e.g. lsp-r2-to-r341
 *   $LSP_NAME_142  e.g. lsp-r2-to-r342
 *   $LSP_NAME_143  e.g. lsp-r2-to-r343
 *   $LSP_NAME_144  e.g. lsp-r2-to-r344
 *   $LSP_NAME_145  e.g. lsp-r2-to-r345
 *   $LSP_NAME_146  e.g. lsp-r2-to-r346
 *   $LSP_NAME_147  e.g. lsp-r2-to-r347
 *   $LSP_NAME_148  e.g. lsp-r2-to-r348
 *   $LSP_NAME_149  e.g. lsp-r2-to-r349
 *   $LSP_NAME_150  e.g. lsp-r2-to-r350
 *   $LSP_NAME_151  e.g. lsp-r2-to-r351
 *   $LSP_NAME_152  e.g. lsp-r2-to-r352
 *   $LSP_NAME_153  e.g. lsp-r2-to-r353
 *   $LSP_NAME_154  e.g. lsp-r2-to-r354
 *   $LSP_NAME_155  e.g. lsp-r2-to-r355
 *   $LSP_NAME_156  e.g. lsp-r2-to-r356
 *   $LSP_NAME_157  e.g. lsp-r2-to-r357
 *   $LSP_NAME_158  e.g. lsp-r2-to-r358
 *   $LSP_NAME_159  e.g. lsp-r2-to-r359
 *   $LSP_NAME_160  e.g. lsp-r2-to-r360
 *   $LSP_NAME_161  e.g. lsp-r2-to-r361
 *   $LSP_NAME_162  e.g. lsp-r2-to-r362
 *   $LSP_NAME_163  e.g. lsp-r2-to-r363
 *   $LSP_NAME_164  e.g. lsp-r2-to-r364
 *   $LSP_NAME_165  e.g. lsp-r2-to-r365
 *   $LSP_NAME_166  e.g. lsp-r2-to-r366
 *   $LSP_NAME_167  e.g. lsp-r2-to-r367
 *   $LSP_NAME_168  e.g. lsp-r2-to-r368
 *   $LSP_NAME_169  e.g. lsp-r2-to-r369
 *   $LSP_NAME_170  e.g. lsp-r2-to-r370
 *   $LSP_NAME_171  e.g. lsp-r2-to-r371
 *   $LSP_NAME_172  e.g. lsp-r2-to-r372
 *   $LSP_NAME_173  e.g. lsp-r2-to-r373
 *   $LSP_NAME_174  e.g. lsp-r2-to-r374
 *   $LSP_NAME_175  e.g. lsp-r2-to-r375
 *   $LSP_NAME_176  e.g. lsp-r2-to-r376
 *   $LSP_NAME_177  e.g. lsp-r2-to-r377
 *   $LSP_NAME_178  e.g. lsp-r2-to-r378
 *   $LSP_NAME_179  e.g. lsp-r2-to-r379
 *   $LSP_NAME_180  e.g. lsp-r2-to-r380
 *   $LSP_NAME_181  e.g. lsp-r2-to-r381
 *   $LSP_NAME_182  e.g. lsp-r2-to-r382
 *   $LSP_NAME_183  e.g. lsp-r2-to-r383
 *   $LSP_NAME_184  e.g. lsp-r2-to-r384
 *   $LSP_NAME_185  e.g. lsp-r2-to-r385
 *   $LSP_NAME_186  e.g. lsp-r2-to-r386
 *   $LSP_NAME_187  e.g. lsp-r2-to-r387
 *   $LSP_NAME_188  e.g. lsp-r2-to-r388
 *   $LSP_NAME_189  e.g. lsp-r2-to-r389
 *   $LSP_NAME_190  e.g. lsp-r2-to-r390
 *   $LSP_NAME_191  e.g. lsp-r2-to-r391
 *   $LSP_NAME_192  e.g. lsp-r2-to-r392
 *   $LSP_NAME_193  e.g. lsp-r2-to-r393
 *   $LSP_NAME_194  e.g. lsp-r2-to-r394
 *   $LSP_NAME_195  e.g. lsp-r2-to-r395
 *   $LSP_NAME_196  e.g. lsp-r2-to-r396
 *   $LSP_NAME_197  e.g. lsp-r2-to-r397
 *   $LSP_NAME_198  e.g. lsp-r2-to-r398
 *   $LSP_NAME_199  e.g. lsp-r2-to-r399
 *   $LSP_NAME_200  e.g. lsp-r2-to-r3100
 *   $CORE_INTF_1   e.g. ae12.0
 *   $CORE_INTF_2   e.g. ae23.0
 */
protocols {
    mpls {
        traffic-engineering;
        label-switched-path $LSP_NAME_1 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_2 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_3 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_4 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_5 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_6 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_7 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_8 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_9 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_10 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_11 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_12 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_13 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_14 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_15 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_16 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_17 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_18 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_19 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_20 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_21 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_22 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_23 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_24 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_25 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_26 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_27 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_28 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_29 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_30 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_31 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_32 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_33 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_34 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_35 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_36 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_37 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_38 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_39 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_40 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_41 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_42 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_43 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_44 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_45 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_46 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_47 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_48 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_49 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_50 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_51 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_52 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_53 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_54 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_55 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_56 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_57 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_58 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_59 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_60 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_61 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_62 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_63 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_64 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_65 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_66 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_67 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_68 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_69 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_70 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_71 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_72 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_73 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_74 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_75 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_76 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_77 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_78 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_79 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_80 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_81 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_82 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_83 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_84 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_85 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_86 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_87 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_88 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_89 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_90 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_91 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_92 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_93 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_94 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_95 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_96 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_97 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_98 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_99 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_100 {
            from $LOOPBACK_V4;
            to $LSP_TO_A;
        }
        label-switched-path $LSP_NAME_101 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_102 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_103 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_104 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_105 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_106 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_107 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_108 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_109 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_110 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_111 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_112 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_113 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_114 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_115 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_116 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_117 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_118 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_119 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_120 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_121 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_122 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_123 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_124 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_125 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_126 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_127 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_128 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_129 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_130 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_131 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_132 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_133 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_134 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_135 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_136 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_137 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_138 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_139 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_140 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_141 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_142 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_143 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_144 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_145 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_146 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_147 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_148 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_149 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_150 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_151 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_152 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_153 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_154 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_155 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_156 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_157 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_158 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_159 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_160 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_161 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_162 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_163 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_164 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_165 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_166 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_167 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_168 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_169 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_170 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_171 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_172 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_173 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_174 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_175 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_176 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_177 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_178 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_179 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_180 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_181 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_182 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_183 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_184 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_185 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_186 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_187 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_188 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_189 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_190 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_191 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_192 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_193 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_194 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_195 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_196 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_197 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_198 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_199 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        label-switched-path $LSP_NAME_200 {
            from $LOOPBACK_V4;
            to $LSP_TO_B;
        }
        interface $CORE_INTF_1;
        interface $CORE_INTF_2;
    }
}
```

## junos/protocols/ospf-area0-loopback-2-p2p-core.conf

```
/*
 * Topic: OSPF backbone area with a passive loopback and two point-to-point core interfaces
 * Seen on:
 *   Junos: dci2_mx304
 *   EVO: (none)
 * Count:
 *   dci2_mx304 1
 *   total 1
 * Pair with: none
 * Variables (example values from dci2_mx304):
 *   $CORE_INTF_1  e.g. ae12.0
 *   $CORE_INTF_2  e.g. ae23.0
 */
protocols {
    ospf {
        area 0.0.0.0 {
            interface lo0.0 {
                passive;
            }
            interface $CORE_INTF_1 {
                interface-type p2p;
            }
            interface $CORE_INTF_2 {
                interface-type p2p;
            }
        }
    }
}
```

## junos/protocols/ospf-traffic-engineering.conf

```
/*
 * Topic: OSPF traffic-engineering extensions
 * Seen on:
 *   Junos: dci2_mx304
 *   EVO: (none)
 * Count:
 *   dci2_mx304 1
 *   total 1
 * Highlights:
 *   - Floods TE information so RSVP-TE can compute constrained paths for the LSPs.
 * Pair with: none
 * Variables: none
 */
protocols {
    ospf {
        traffic-engineering;
    }
}
```

## junos/protocols/rsvp-interface-2-core.conf

```
/*
 * Topic: RSVP on two core interfaces
 * Seen on:
 *   Junos: dci2_mx304
 *   EVO: (none)
 * Count:
 *   dci2_mx304 1
 *   total 1
 * Pair with: none
 * Variables (example values from dci2_mx304):
 *   $CORE_INTF_1  e.g. ae12.0
 *   $CORE_INTF_2  e.g. ae23.0
 */
protocols {
    rsvp {
        interface $CORE_INTF_1;
        interface $CORE_INTF_2;
    }
}
```

## junos/routing-instances/l3vpn/ri-l3vpn-ebgp-local-as-vrf-target.conf

```
/*
 * Topic: L3VPN VRF with an eBGP CE session that sets a local AS, and a route target
 * Seen on:
 *   Junos: dci2_mx304
 *   EVO: (none)
 * Count:
 *   dci2_mx304 100
 *   total 100
 * Highlights:
 *   - One of the 100 VPNv4 instances: an eBGP IPv4 unicast session to the traffic generator, with the router's own AS set as local AS.
 *   - `vrf-table-label` gives the VRF one label for IP lookup on egress; route targets come from `vrf-target`.
 * Pair with: none
 * Variables (example values from dci2_mx304):
 *   $INSTANCE_NAME    e.g. L3VPN_DCI_RI_1
 *   $BGP_GROUP        e.g. ebgp-w-tgen
 *   $CE_PEER_V4       e.g. 10.20.1.2
 *   $PE_LOCAL_V4      e.g. 10.20.1.1
 *   $ASN_CUSTOMER     e.g. 65502
 *   $ASN              e.g. 65000
 *   $AC_IFL           e.g. et-0/0/2.1
 *   $LOOPBACK_V4      e.g. 10.1.1.2
 *   $RD_SUB_ASSIGNED  e.g. 1
 *   $RT_AS            e.g. 65000
 *   $RT_ID            e.g. 1
 */
routing-instances {
    $INSTANCE_NAME {
        instance-type vrf;
        protocols {
            bgp {
                group $BGP_GROUP {
                    type external;
                    family inet {
                        unicast;
                    }
                    neighbor $CE_PEER_V4 {
                        local-address $PE_LOCAL_V4;
                        peer-as $ASN_CUSTOMER;
                        local-as $ASN;
                    }
                }
            }
        }
        interface $AC_IFL;
        route-distinguisher $LOOPBACK_V4:$RD_SUB_ASSIGNED;
        vrf-target target:$RT_AS:$RT_ID;
        vrf-table-label;
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `logical-interface` (`$AC_IFL`): required, for each reference; `interfaces/ifl-vlan-inet`

## junos/routing-options/autonomous-system.conf

```
/*
 * Topic: Autonomous system number
 * Seen on:
 *   Junos: dci2_mx304
 *   EVO: (none)
 * Count:
 *   dci2_mx304 1
 *   total 1
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from dci2_mx304):
 *   $ASN  e.g. 65000
 */
routing-options {
    autonomous-system $ASN;
}
```

## junos/routing-options/forwarding-table-pplb-chained-nh-evpn.conf

```
/*
 * Topic: Forwarding-table load-balance export with chained composite next hops for EVPN
 * Seen on:
 *   Junos: dci2_mx304
 *   EVO: (none)
 * Count:
 *   dci2_mx304 1
 *   total 1
 * Highlights:
 *   - Exports the load-balance policy to the forwarding table and enables `chained-composite-next-hop ingress evpn`; no `ecmp-fast-reroute`.
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from dci2_mx304):
 *   $PPLB_NAME  e.g. PPLB
 */
routing-options {
    forwarding-table {
        export $PPLB_NAME;
        chained-composite-next-hop {
            ingress {
                evpn;
            }
        }
    }
}
```

Needs (MANIFEST.json occurrence_requires; same OS):
- `policy-statement` (`$PPLB_NAME`): required, for each reference; `policy-options/policy-statement/per-flow-load-balance`

## junos/routing-options/maximum-ecmp.conf

```
/*
 * Topic: Maximum ECMP paths
 * Seen on:
 *   Junos: dci2_mx304
 *   EVO: (none)
 * Count:
 *   dci2_mx304 1
 *   total 1
 * Highlights:
 *   - Raises the ECMP ceiling to 16 next hops.
 * Pair with: none
 * Peers with: n/a
 * Variables: none
 */
routing-options {
    maximum-ecmp 16;
}
```

## junos/routing-options/router-id.conf

```
/*
 * Topic: Router ID
 * Seen on:
 *   Junos: dci2_mx304
 *   EVO: (none)
 * Count:
 *   dci2_mx304 1
 *   total 1
 * Pair with: none
 * Peers with: n/a
 * Variables (example values from dci2_mx304):
 *   $ROUTER_ID  e.g. 10.1.1.2
 */
routing-options {
    router-id $ROUTER_ID;
}
```

## junos/system/login-2-users-super-user.conf

```
/*
 * Topic: Two local super-user accounts with encrypted passwords
 * Seen on:
 *   Junos: dci2_mx304
 *   EVO: (none)
 * Count:
 *   dci2_mx304 1
 *   total 1
 * Highlights:
 *   - Two automation accounts (in the validated configuration, `gnmi_user` and `netconf_user`) with fixed UIDs; both carry the same encrypted password in the published files.
 * Pair with: none
 * Variables (example values from dci2_mx304):
 *   $LOGIN_USER_1        e.g. gnmi_user
 *   $LOGIN_UID_1         e.g. 2002
 *   $ENCRYPTED_PASSWORD  e.g. "$1$kPU..$w.4FGRAGanJ8U4Yq6sbj7."
 *   $LOGIN_USER_2        e.g. netconf_user
 *   $LOGIN_UID_2         e.g. 2003
 */
system {
    login {
        user $LOGIN_USER_1 {
            uid $LOGIN_UID_1;
            class super-user;
            authentication {
                encrypted-password $ENCRYPTED_PASSWORD;
            }
        }
        user $LOGIN_USER_2 {
            uid $LOGIN_UID_2;
            class super-user;
            authentication {
                encrypted-password $ENCRYPTED_PASSWORD;
            }
        }
    }
}
```

## junos/system/ports-console-log-out.conf

```
/*
 * Topic: Console log-out on disconnect
 * Seen on:
 *   Junos: dci2_mx304
 *   EVO: (none)
 * Count:
 *   dci2_mx304 1
 *   total 1
 * Highlights:
 *   - Logs the console session out when the cable is disconnected.
 * Pair with: none
 * Variables: none
 */
system {
    ports {
        console log-out-on-disconnect;
    }
}
```

## junos/system/services-netconf-ssh-grpc-clear-text.conf

```
/*
 * Topic: NETCONF over SSH and clear-text gRPC for telemetry
 * Seen on:
 *   Junos: dci2_mx304
 *   EVO: (none)
 * Count:
 *   dci2_mx304 1
 *   total 1
 * Highlights:
 *   - NETCONF over SSH with RFC-compliant replies, then gRPC on clear-text port 9339 (eight connections, no authentication) for streaming telemetry.
 * Pair with: none
 * Variables: none
 */
system {
    services {
        netconf {
            ssh;
            rfc-compliant;
        }
        extension-service {
            request-response {
                grpc {
                    clear-text {
                        port 9339;
                    }
                    max-connections 8;
                    skip-authentication;
                }
            }
        }
    }
}
```

## junos/system/syslog-file-messages-pfe-any.conf

```
/*
 * Topic: Syslog messages file with all PFE events
 * Seen on:
 *   Junos: dci2_mx304
 *   EVO: (none)
 * Count:
 *   dci2_mx304 1
 *   total 1
 * Pair with: none
 * Variables: none
 */
system {
    syslog {
        file messages {
            pfe any;
        }
    }
}
```

## _variables.md

# Snippet variable glossary

All `.conf` files under `junos/` and `evo/` are templates: identifiers that vary between deployments are written
as `$VAR`. Render a snippet by substituting each placeholder with your deployment's value. The placeholders each
snippet uses are listed in its `Variables:` header and in the glossary below. Variable names and meanings follow
the shared JVD snippet vocabulary. Lettered and numbered
variables (`_A`…`_E`, `_1`, `_2`, …) form an ordered set; the letters and numbers carry no other meaning.

Values left literal on purpose: design constants such as `class super-user`, the gRPC port `9339` and its
connection limit, the MX304 port speeds, `speed 100g`, `minimum-links 1` and the LACP settings, `maximum-labels 5`,
`maximum-ecmp 16`, the OSPF area `0.0.0.0` and the loopback `lo0.0`.

## System

| Variable | What it is | Example value |
|---|---|---|
| `$ENCRYPTED_PASSWORD` | Encrypted (hashed) login password; secret, supplied by the operator (the published value is sanitized). | `"$1$kPU..$w.4FGRAGanJ8U4Yq6sbj7."` |
| `$LOGIN_UID_1` | Numeric user ID (`uid`) of the login account with the same number. | `2002` |
| `$LOGIN_UID_2` | Numeric user ID (`uid`) of the login account with the same number. | `2003` |
| `$LOGIN_USER_1` | Name of a local login account; `_1`, `_2` order the accounts. | `gnmi_user` |
| `$LOGIN_USER_2` | Name of a local login account; `_1`, `_2` order the accounts. | `netconf_user` |
| `$NTP_SERVER` | IPv4 address of an NTP server. | `66.129.233.81` |
| `$TIME_ZONE` | System time zone (IANA time-zone name). | `America/Los_Angeles` |

## Identity / topology

| Variable | What it is | Example value |
|---|---|---|
| `$ASN` | Local device autonomous-system number. | `65000` |
| `$ASN_CUSTOMER` | Customer-facing BGP peer autonomous-system number. | `65501` |
| `$IBGP_PEER_V4_1` | IPv4 loopback of an internal BGP neighbor; `_1`, `_2` order the neighbors. | `10.1.1.2` |
| `$IBGP_PEER_V4_2` | IPv4 loopback of an internal BGP neighbor; `_1`, `_2` order the neighbors. | `10.1.1.3` |
| `$LOOPBACK_V4` | Primary per-node IPv4 loopback address. | `10.1.1.1` |
| `$LOOPBACK_V4_PFX` | IPv4 address with prefix length on a loopback unit (`lo0.0` or a per-VRF `lo0.<n>`). | `10.1.1.1/32` |
| `$ROUTER_ID` | Complete router identifier in IPv4 dotted-decimal form. | `10.1.1.1` |

## Interfaces and optics

| Variable | What it is | Example value |
|---|---|---|
| `$AC_ADDR_V4` | IPv4 address on a routed attachment-circuit unit. | `10.10.1.1/30` |
| `$AC_IFL` | Full logical attachment-circuit interface identifier, including its unit. | `et-0/0/4.1` |
| `$AE_BUNDLE` | Aggregated-Ethernet bundle a member link joins (`802.3ad`). | `ae12` |
| `$AE_DEVICE_COUNT` | Number of aggregated-Ethernet devices the chassis allocates. | `10` |
| `$CORE_INTF_1` | Core-facing logical interface (with unit); `_1`, `_2`, … order the core links of a per-device form. | `ae12.0` |
| `$CORE_INTF_2` | Core-facing logical interface (with unit); `_1`, `_2`, … order the core links of a per-device form. | `ae13.0` |
| `$CORE_V4_ADDR` | Core interface IPv4 address. | `10.12.1.1/30` |
| `$FPC_SLOT` | FPC slot for a complete source-measured hardware profile. | `0` |
| `$IFD` | Interface-device identifier, excluding a logical unit. | `ae12` |
| `$UNIT` | Logical-interface unit number, without the parent interface name. | `0` |
| `$VLAN` | A single VLAN identifier. | `1` |
| `$WAVELENGTH` | DWDM wavelength in nanometres of a coherent optic (`optics-options wavelength`); both ends of a link use the same value. | `1547.72` |

## Transport

| Variable | What it is | Example value |
|---|---|---|
| `$LSP_NAME_1` … `$LSP_NAME_200` | Name of an MPLS label-switched path; `_1`…`_200` order the paths of the form (the first 100 go to one peer, the next 100 to the other). | `lsp-r1-to-r21` … `lsp-r1-to-r3100` |
| `$LSP_TO_A` | Egress address (`to`) of the first group of label-switched paths: the loopback of one remote DCI router. | `10.1.1.2` |
| `$LSP_TO_B` | Egress address (`to`) of the second group of label-switched paths: the loopback of the other remote DCI router. | `10.1.1.3` |

## Services

| Variable | What it is | Example value |
|---|---|---|
| `$BGP_GROUP` | Name of a BGP group (CE-facing group in a VRF, or a CE's group toward a WAN edge). | `grp-iBGP` |
| `$CE_PEER_V4` | IPv4 address of the external BGP peer (CE). | `10.10.1.2` |
| `$INSTANCE_NAME` | Identity stem of a service instance: the routing-instance name, or the shared name of a hub-and-spoke policy and its community. | `L3VPN_DCI_RI_1` |
| `$PE_LOCAL_V4` | Local IPv4 address of the PE side of a CE eBGP session (`local-address`). | `10.10.1.1` |
| `$PPLB_NAME` | Per-packet load-balance policy name — a label proven to vary across otherwise-identical deployed forms. | `PPLB` |
| `$RD_SUB_ASSIGNED` | Route Distinguisher Assigned Number subfield. | `1` |
| `$RT_AS` | Route Target Administrator subfield. | `65000` |
| `$RT_ID` | Route Target Assigned Number subfield. | `1` |

## byoai/TIERS.md

> **Tier qualification for this JVD.** Only `minimum` is qualified and selectable.
> The `self-contained` and `as-deployed` entries below are blocked: each VRF's
> customer-facing unit is a required selection the library cannot make. They are not
> selectable: never offer or render them.

# Configuration form tiers

<!-- GENERATED FROM configuration/snips/_composition.json by the build tooling (generate-tiers). Do not edit by hand: run `JVD_REPO=<checkout> npm run tiers -- --jvd optical/dci_over_ipodwdm`. -->

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

## L3VPN VRF with an eBGP session to the CE

Family l3vpn, form l3vpn-ebgp-vrf. OS mode MIXED. Attachment: VLAN-tagged IPv4 unit on the customer-facing port; one of the 100 VPNv4 instances carried over the DWDM core.

### dci1_ptx10001-36mr (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-l3vpn-ebgp-local-as-vrf-target.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL

### dci3_acx7100-48l (evo)

- `minimum`: `evo/routing-instances/l3vpn/ri-l3vpn-ebgp-local-as-vrf-target.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL

### dci2_mx304 (junos)

- `minimum`: `junos/routing-instances/l3vpn/ri-l3vpn-ebgp-local-as-vrf-target.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$AC_IFL

---

## byoai/DEFAULTS.md

# DEFAULTS — Data Center Interconnect over IPoDWDM

Lab auto-fill values for the Data Center Interconnect over IPoDWDM JVD. Every value is measured from the published device configurations under [`configuration/conf/`](../../conf/). Use them when the user picks auto-fill; otherwise ask. Variable meanings are in [`_variables.md`](../_variables.md).

## Device inventory

| Role | Device | Platform | OS | `$LOOPBACK_V4` / router-id | `$ASN` |
|------|--------|----------|----|----------------------------|--------|
| DCI Edge | dci1_ptx10001-36mr | PTX10001-36MR | EVO | 10.1.1.1 | 65000 |
| DCI Edge | dci2_mx304 | MX304 | Junos | 10.1.1.2 | 65000 |
| DCI Edge | dci3_acx7100-48l | ACX7100-48L | EVO | 11.1.1.3 | 65000 |

dci1 and dci2 address dci3 as 10.1.1.3 (iBGP neighbor, LSP target); dci3 uses 11.1.1.x for itself and its peers. Render each router as configured.

## DWDM core links

| Link | Bundle (`$IFD`), `$CORE_V4_ADDR` | Coherent members (`$IFD` → `$WAVELENGTH`) |
|------|----------------------------------|-------------------------------------------|
| dci1 ↔ dci2 | dci1 ae12 10.12.1.1/30; dci2 ae12 `10.12..1.2/30` (as published) | dci1 et-0/0/8 1547.12, et-0/0/10 1547.72, et-0/1/0 1548.31; dci2 et-0/0/6 1547.12, et-0/0/8 1547.72, et-0/0/14 1548.31 |
| dci1 ↔ dci3 | dci1 ae13 10.13.1.1/30; dci3 ae13 10.13.1.2/30 | dci1 et-0/1/2 1552.52, et-0/1/8 1550.12; dci3 et-0/0/50 1552.52, et-0/0/51 1550.12 |
| dci2 ↔ dci3 | dci2 ae23 10.23.1.1/30; dci3 ae23 10.23.1.2/30 | dci2 et-0/1/0 1552.52, et-0/1/6 1550.12; dci3 et-0/0/52 1552.52, et-0/0/53 1550.12 |

`$AE_DEVICE_COUNT` 10 on every router. Both ends of a link use the same wavelengths.

## iBGP and RSVP-TE

| Device | `$BGP_GROUP` | iBGP neighbors | LSPs (`$LSP_NAME_1…200`, `$LSP_TO_A` / `$LSP_TO_B`) |
|--------|--------------|----------------|------------------------------------------------------|
| dci1 | grp-iBGP | 10.1.1.2, 10.1.1.3 | lsp-r1-to-r2<n> to 10.1.1.2, lsp-r1-to-r3<n> to 10.1.1.3, n = 1–100 |
| dci2 | grp-iBGP | 10.1.1.1, 10.1.1.3 | lsp-r2-to-r1<n> to 10.1.1.1, lsp-r2-to-r3<n> to 10.1.1.3 |
| dci3 | grp-iBGP | 11.1.1.1, 11.1.1.2 | lsp-r3-to-r1<n> to 11.1.1.1, lsp-r3-to-r2<n> to 11.1.1.2 |

## VRF examples (first measured instance)

| Device | Customer port | Example values |
|--------|---------------|----------------|
| dci1 | et-0/0/4 | `L3VPN_DCI_RI_1`, `$AC_IFL` et-0/0/4.1, `$PE_LOCAL_V4` 10.10.1.1, `$CE_PEER_V4` 10.10.1.2, `$ASN_CUSTOMER` 65501, `$BGP_GROUP` ebgp-w-tgen, RD 10.1.1.1:1, `vrf-target` target:65000:1 |
| dci2 | et-0/0/2 | `L3VPN_DCI_RI_1`, `$AC_IFL` et-0/0/2.1, `$PE_LOCAL_V4` 10.20.1.1, `$CE_PEER_V4` 10.20.1.2, `$ASN_CUSTOMER` 65502, RD 10.1.1.2:1, `vrf-target` target:65000:1 |
| dci3 | et-0/0/48 (100G) | `L3VPN_DCI_RI_1`, `$AC_IFL` et-0/0/48.1, `$PE_LOCAL_V4` 10.30.1.1, `$CE_PEER_V4` 10.30.1.2, `$ASN_CUSTOMER` 65503, RD 11.1.1.3:1, `vrf-target` target:65000:1 |

## Numbering conventions (hold on all 300 measured VRFs)

| Value | Convention for VRF n |
|-------|----------------------|
| Instance name | `L3VPN_DCI_RI_<n>` |
| Unit and VLAN | `$UNIT` = `$VLAN` = n on the customer port |
| Addresses | `$PE_LOCAL_V4` = .1 and `$CE_PEER_V4` = .2 of the unit's /30 (10.10.n.0/30 on dci1, 10.20.n.0/30 on dci2, 10.30.n.0/30 on dci3) |
| RD and RT | `$RD_SUB_ASSIGNED` = `$RT_ID` = n; RD administrator = the router's loopback; `$RT_AS` = `$ASN` = 65000 |
| Local AS | `local-as` = `$ASN` |

For `N` VRFs, auto-fill increments n from the example's starting value and keeps the conventions above. Keep the DCI routers of a VRF consistent: same instance name and route target.

## byoai/OUTPUT_FORMAT.md

# Output Format

This file is part of the [BYOAI](README.md) corpus. It defines the exact shape every generation must take. Bundled into `jvd-dci-ipodwdm-snips.md` by `regenerate-bundle.sh`.

## 1. `Inputs used:` block (always first)

Every generation begins with a YAML comment block listing **every** value picked or accepted:

```yaml
# Inputs used:
# mode: auto                   # or "interview"
# form: minimum
# devices:
#   dci1: { name: <hostname>, os: evo, loopback4: <addr> }
#   dci2: { name: <hostname>, os: junos, loopback4: <addr> }
# services:
#   - { kind: l3vpn-ebgp-vrf,
#       count: <int>,
#       start_id: <int>,
#       ac_ifl: <ifd.unit>,
#       rt: <rt_as:rt_id>,
#       rd: <admin:assigned> }
# snips_used:
#   - junos/routing-instances/l3vpn/ri-l3vpn-ebgp-local-as-vrf-target.conf
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
- Cross-device consistency the user must verify: the DCI routers of one VRF use the same instance name and route target; each router's route distinguisher uses its own loopback.
- Anything that is by-pattern rather than validated on that exact device.

## Refusal

If the request cannot be fulfilled from the snip library, do not apologise. Say exactly:

```
I cannot generate this from the snip library because <one reason>.
```

…and stop.
