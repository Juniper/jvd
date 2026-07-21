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
