# SRv6 Core Edge JVD — Snip Variables Glossary

This file lists every `$VARIABLE` placeholder used in the `snips/` library
along with a brief description and a representative example value drawn from
the sanitized JVD configurations. Values are alphabetized.

| Variable | Description | Example value |
|---|---|---|
| `$AC_IFL` | EVPN-VPWS attachment-circuit IFL on the customer-facing AE | `ae2.1001` |
| `$AE_NUMBER` | Aggregated-Ethernet bundle number for a core link | `0` |
| `$ASBR_NEIGHBOR_LIST` | List of `neighbor <addr> { description <peer>; }` blocks for ASBR/BR peers | (per-deployment) |
| `$ATTACH_IFL` | Per-VRF customer-facing sub-IFL (typically `xe-X/Y/Z.<unit>`) | `xe-2/0/2.501` |
| `$BD_UNIT` | IRB / bridge-domain unit number (matches VLAN convention) | `601` |
| `$BFD_MIN_INT` | BFD minimum-interval in ms (per-IFL & LACP-side) | `50` |
| `$BFD_MULT` | BFD detection multiplier | `3` |
| `$BRIDGE_UNIT` | Bridge-domain attachment unit on the CPE-facing AE | `601` |
| `$BRIDGE_VLAN` | Bridge-domain VLAN-id | `601` |
| `$CE_AS` | Customer-edge BGP autonomous-system number | `65003` |
| `$CLIENT_NEIGHBOR_LIST` | RR's list of `neighbor <addr> { description <pe>; }` blocks | (per-deployment) |
| `$COLOR_LIST` | List of BGP colors used for transport-class binding | `128 129 131 132 133` |
| `$DEFAULT_SVC_LOC` | PE's default per-VRF service locator name | `SL-FA-000` |
| `$DELAY_ADV_INTERVAL` | Periodic delay-advertisement interval (s) | `30` |
| `$DELAY_ADV_THRESH` | Delay change threshold for advertisement (units of µs) | `100` |
| `$DELAY_METRIC` | IS-IS Flex-Algo 128 per-IFL delay metric value | `1000` |
| `$DELAY_PROBE_COUNT` | Per-IFL TWAMP-Light probe count per measurement window | `10` |
| `$DELAY_PROBE_INT` | Per-IFL TWAMP-Light probe interval (s) | `1` |
| `$EBGP_EXPORT_POLICY_LIST` | Inter-AS eBGP export policy chain | `[ PS-EBGP-NHS PS-EBGP-SRV6-EXP ]` |
| `$EBGP_IMPORT_POLICY` | Inter-AS eBGP import policy | `PS-EBGP-IMP` |
| `$EBGP_MULTIHOP_TTL` | Inter-AS Option-C eBGP multihop TTL | `5` |
| `$ESI_BYTES` | 10-byte ESI value (PE-ID in byte 9, service-ID in byte 10) | `00:11:11:11:11:11:11:11:18:d1` |
| `$ESI_MODE` | Multi-homing mode | `single-active` or `all-active` |
| `$FA_LIST` | List of Flex-Algo IDs this node participates in | `[ 128 129 ]` (PE) / `[ 128 129 131 132 133 ]` (RR/BR) |
| `$IBGP_IMPORT_POLICY` | Optional iBGP RR-session import policy on a BR | `PS-IBGP-SRV6-IMP` |
| `$IPV6_ROUTER_ID` | IPv6 router-id (typically lo0 v6 address) | `2001:db8:bad:cafe::1000:56` |
| `$IRB_V4` | IRB IPv4 gateway address/mask | `10.104.8.1/30` |
| `$IRB_V6` | IRB IPv6 gateway address/mask | `2010:104:8::1/126` |
| `$ISIS_IFL_LIST` | Space-separated list of IS-IS-bearing IFLs (one `interface` line each) | `xe-0/0/0:0.0 xe-0/0/0:1.0 ...` |
| `$ISIS_NET` | IS-IS NET address (49.<region>.<sysid>.00) | `49.1000.0000.0000.0056.00` |
| `$JUMBO_HELLO_SIZE` | IS-IS max-hello-size (bytes) | `9106` |
| `$JUMBO_L2_MTU` | Core L2 MTU (bytes) | `9192` |
| `$JUMBO_L3_MTU` | Family-level L3 MTU (bytes; L2 minus 86 for SRv6 µSID overhead) | `9106` |
| `$L3_UNIT` | Plain L3VPN sub-IFL unit on a CPE-facing AE | `10` |
| `$L3_V6` | Per-sub-IFL IPv6 address | `2020:0:0:1::1/126` |
| `$L3_VLAN` | Plain L3VPN sub-IFL VLAN-id | `10` |
| `$LACP_BFD_INTERVAL` | BFD-on-LACP minimum-interval (ms) | `50` |
| `$LACP_BFD_MULT` | BFD-on-LACP multiplier | `3` |
| `$LOC` | Per-VRF / per-service SRv6 locator name | `SL-FA-000` |
| `$LOC_BLOCK_FA_0` | Block name for Flex-Algo 0 (default IGP) | `SB-FA-000` |
| `$LOC_BLOCK_FA_128` | Block name for Flex-Algo 128 (delay) | `SB-FA-128` |
| `$LOC_BLOCK_FA_129` | Block name for Flex-Algo 129 (TE) | `SB-FA-129` |
| `$LOC_BLOCK_PREFIX_0` | µSID block /32 for FA-0 | `5f00:1::/32` |
| `$LOC_BLOCK_PREFIX_128` | µSID block /32 for FA-128 | `5f00:a1::/32` |
| `$LOC_BLOCK_PREFIX_129` | µSID block /32 for FA-129 | `5f00:b1::/32` |
| `$LOC_FA_0` | Locator name for Flex-Algo 0 | `SL-FA-000` |
| `$LOC_FA_128` | Locator name for Flex-Algo 128 | `SL-FA-128` |
| `$LOC_FA_129` | Locator name for Flex-Algo 129 | `SL-FA-129` |
| `$LOC_PREFIX_0` | Per-node /48 locator for FA-0 | `5f00:1:56::/48` |
| `$LOC_PREFIX_128` | Per-node /48 locator for FA-128 | `5f00:a1:56::/48` |
| `$LOC_PREFIX_129` | Per-node /48 locator for FA-129 | `5f00:b1:56::/48` |
| `$LOCAL_AS` | Local BGP autonomous-system number | `65001` |
| `$LOCAL_BR_V6_LOOPBACK` | Local Border-Router IPv6 loopback for inter-AS eBGP | `2001:db8:bad:cafe::1000:18` |
| `$LOCAL_USID_LIMIT` | `local-micro-sid maximum-static-sids` per block | `2000` |
| `$LOCAL_VPWS_ID` | EVPN-VPWS local service-id | `1` |
| `$LOOPBACK_IFL` | Per-VRF lo0 unit | `lo0.501` |
| `$LOOPBACK_V4` | Per-VRF lo0 IPv4 address/mask | `195.168.8.1/32` |
| `$LOOPBACK_V6` | Per-VRF lo0 IPv6 address/mask | `2195:168:8::1/128` |
| `$MAX_BACKUP_PATHS` | TI-LFA backup paths to install | `2` |
| `$MEMBER_PORT_LIST` | Space-separated physical IFLs that join the AE bundle | `xe-2/0/0 xe-2/0/1` |
| `$MLA_DELAY` | Micro-loop avoidance post-convergence delay (ms) | `500` |
| `$OVERLOAD_TIMEOUT` | IS-IS startup overload timer (s) | `60` |
| `$PE_CE_LOCAL_V4` | PE-CE local v4 address/mask | `13.1.8.1/30` |
| `$PE_CE_NEIGHBOR_V4` | PE-CE remote v4 address | `13.1.8.2` |
| `$PE_CE_V4_LOCAL` | PE-CE local v4 (with mask) | `13.1.8.1/30` |
| `$PE_CE_V6_LOCAL` | PE-CE local v6 (with mask) | `2013:1:8::1/126` |
| `$PE_LOCAL_V6` | PE's iBGP local-address (v6 loopback) | `2001:db8:bad:cafe::1006:48` |
| `$PEER_HOSTNAME` | Description token for AE description | `CR1` |
| `$PHYS_IFL` | Physical interface name for service attachment | `xe-2/0/2` (MX) / `et-0/0/3` (PTX) |
| `$RD_ID` | `route-distinguisher-id` seed (typically v4 lo0) | `100.0.0.56` |
| `$RD_SEED` | RD numeric prefix (typically v4 lo0) | `100.0.6.48` / `200.0.0.60` |
| `$REF_BANDWIDTH` | IS-IS reference bandwidth | `1000g` |
| `$REMOTE_AS` | Inter-AS remote autonomous-system | `65000` |
| `$REMOTE_BR_V6_LOOPBACK` | Remote BR's IPv6 loopback for inter-AS eBGP | `2001:db8:bad:cafe::1000:36` |
| `$REMOTE_PEER_DESCRIPTION` | Description token for far-AS peer | `PEER-MSE1` |
| `$REMOTE_VPWS_ID` | EVPN-VPWS remote service-id | `2` |
| `$ROUTER_ID` | v4 router-id (typically lo0 v4) | `100.0.0.56` |
| `$RR1_V6` | First RR's v6 loopback (PE-side neighbor) | `2001:db8:bad:cafe::1000:31` |
| `$RR2_V6` | Second RR's v6 loopback (PE-side neighbor) | `2001:db8:bad:cafe::1000:56` |
| `$RR_CLUSTER_ID` | RR cluster-id (typically RR's v4 lo0) | `100.0.0.56` |
| `$RR_LOCAL_V6` | RR's iBGP local-address (v6 loopback) | `2001:db8:bad:cafe::1000:56` |
| `$RR_PEER_V6` | Peer RR's v6 loopback (RR-mesh side) | `2001:db8:bad:cafe::1000:31` |
| `$SUMMARY_PREFIX_FA_0` | Inter-AS summary prefix for FA-0 locators | `5f00:1::/24` |
| `$SUMMARY_PREFIX_FA_128` | Inter-AS summary prefix for FA-128 locators | `5f00:a1::/24` |
| `$SUMMARY_PREFIX_FA_129` | Inter-AS summary prefix for FA-129 locators | `5f00:b1::/24` |
| `$TC_NAME_LIST` | Transport-class names | `TC-128 TC-129 TC-131 TC-132 TC-133` |
| `$TE_METRIC` | IS-IS Flex-Algo 129 ASLA TE metric value | `1000` |
| `$UNIT` | Per-VLAN AE sub-IFL unit number | `10` |
| `$VLAN` | Sub-IFL VLAN-id | `10` |
| `$VPN_ID` | Per-VRF service-id (used in RD/RT and unit numbering) | `501` |
| `$VPWS_NAME` | EVPN-VPWS routing-instance name | `EVPN-VPWS-AA-DYN-FA000-1` |
| `$VPWS_UNIT` | EVPN-VPWS AC unit on the CPE-facing AE | `1001` |
| `$VPWS_VLAN` | EVPN-VPWS AC VLAN-id | `1001` |
| `$VRF_NAME` | L3VPN routing-instance name | `L3VPN-DYN-FA000-1` |
| `$VRF_ROUTER_ID` | Per-VRF router-id | `195.168.8.1` |
| `$VRF_UNIT` | Per-VRF sub-IFL unit on the customer-facing IFL | `501` |
