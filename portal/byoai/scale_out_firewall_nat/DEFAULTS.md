# DEFAULTS — Scale-Out Firewall and NAT

Lab auto-fill values for the Scale-Out Firewall and NAT JVD. Every value is measured from the published device configurations under [`configuration/conf/`](../../conf/). Use them when the user picks a device and service and asks for lab values; otherwise ask for the deployment values.

## Device inventory

| Role | Device | Platform | OS | Loopbacks | AS numbers (instance: local AS) |
|------|--------|----------|----|-----------|---------------------------------|
| Gateway / Emulator | gateway_emulator_mx304 | MX304 | Junos | — | TRUST_VR 65100; UNTRUST_VR 65300 |
| Forwarding / Load Balancer | mx1_mx304 | MX304 | Junos | lo0.1 192.168.10.251/32, 2001:db8:1:255::251/128; lo0.2 192.168.10.252/32, 2001:db8:1:255::252/128 | MNHA-VR 65050; TRUST_VR 65200 (instance AS 1000); UNTRUST_VR 65400 |
| Security Service (SFW/NAT) | srx1a_srx4600 | SRX4600 | Junos | lo0.0 192.168.0.1/32; lo0.1 192.168.10.1/32, 2001:db8:1:255::1/128 | MNHA-VR 65001; VR-1 65000 |
| Security Service (SFW/NAT) | srx1b_srx4600 | SRX4600 | Junos | lo0.0 192.168.0.2/32; lo0.1 192.168.10.1/32, 2001:db8:1:255::1/128 | MNHA-VR 65002; VR-1 65000 |
| Security Service (SFW/NAT) | srx2a_srx4600 | SRX4600 | Junos | lo0.0 192.168.0.3/32; lo0.1 192.168.10.2/32, 2001:db8:1:255::2/128 | MNHA-VR 65001; VR-1 65000 |
| Security Service (SFW/NAT) | srx2b_srx4600 | SRX4600 | Junos | lo0.0 192.168.0.4/32; lo0.1 192.168.10.2/32, 2001:db8:1:255::2/128 | MNHA-VR 65002; VR-1 65000 |

The two nodes of an MNHA pair share their lo0.1 address (the TLB real service of the pair) and swap their MNHA local and peer IDs; the A nodes (srx1a, srx2a) prepend the AS path less than the B nodes (srx1b, srx2b).

## NAT pools

| MNHA pair | Devices | NAPT44 pool (`$NAT_POOL_V4_PFX_1`) | NAT64 source pool (`$NAT_POOL_V4_PFX_2`) |
|-----------|---------|------------------------------------|------------------------------------------|
| 1 | srx1a_srx4600 and srx1b_srx4600 | 100.64.1.0/24 | 100.64.2.0/24 |
| 2 | srx2a_srx4600 and srx2b_srx4600 | 100.64.3.0/24 | 100.64.4.0/24 |

## First validated instance per service and device

| Service form | Device | Example values |
|--------------|--------|----------------|
| source-nat-napt44-nat64 | srx1a_srx4600 | `$NAT_POOL_V4_PFX_1` 100.64.1.0/24, `$NAT_POOL_V4_PFX_2` 100.64.2.0/24 |
| source-nat-napt44-nat64 | srx1b_srx4600 | `$NAT_POOL_V4_PFX_1` 100.64.1.0/24, `$NAT_POOL_V4_PFX_2` 100.64.2.0/24 |
| source-nat-napt44-nat64 | srx2a_srx4600 | `$NAT_POOL_V4_PFX_1` 100.64.3.0/24, `$NAT_POOL_V4_PFX_2` 100.64.4.0/24 |
| source-nat-napt44-nat64 | srx2b_srx4600 | `$NAT_POOL_V4_PFX_1` 100.64.3.0/24, `$NAT_POOL_V4_PFX_2` 100.64.4.0/24 |
| security-policies-sfw-nat | srx1a_srx4600 | (no variables: the snip is rendered as written) |
| security-policies-sfw-nat | srx1b_srx4600 | (no variables: the snip is rendered as written) |
| security-policies-sfw-nat | srx2a_srx4600 | (no variables: the snip is rendered as written) |
| security-policies-sfw-nat | srx2b_srx4600 | (no variables: the snip is rendered as written) |
| mnha-srg-0-signal-route | srx1a_srx4600 | `$IFL` ae1.0, `$LOOPBACK_V4` 192.168.0.1, `$MNHA_LOCAL_ID` 1, `$MNHA_MONITOR_DST_V4` 10.1.1.1, `$MNHA_MONITOR_SRC_V4` 10.1.1.2, `$MNHA_PEER_ID` 2 … |
| mnha-srg-0-signal-route | srx1b_srx4600 | `$IFL` ae1.0, `$LOOPBACK_V4` 192.168.0.2, `$MNHA_LOCAL_ID` 2, `$MNHA_MONITOR_DST_V4` 10.1.2.1, `$MNHA_MONITOR_SRC_V4` 10.1.2.2, `$MNHA_PEER_ID` 1 … |
| mnha-srg-0-signal-route | srx2a_srx4600 | `$IFL` ae2.0, `$LOOPBACK_V4` 192.168.0.3, `$MNHA_LOCAL_ID` 1, `$MNHA_MONITOR_DST_V4` 10.1.3.1, `$MNHA_MONITOR_SRC_V4` 10.1.3.2, `$MNHA_PEER_ID` 2 … |
| mnha-srg-0-signal-route | srx2b_srx4600 | `$IFL` ae2.0, `$LOOPBACK_V4` 192.168.0.4, `$MNHA_LOCAL_ID` 2, `$MNHA_MONITOR_DST_V4` 10.1.4.1, `$MNHA_MONITOR_SRC_V4` 10.1.4.2, `$MNHA_PEER_ID` 1 … |
| srx-mnha-vr-icl | srx1a_srx4600 | `$ASN` 65001, `$ASN_CUSTOMER` 65050, `$BGP_EXPORT_POL` mnha_ip, `$CE_PEER_V4` 10.3.1.1, `$IFL` ae1.100, `$PE_LOCAL_V4` 10.3.1.2 |
| srx-mnha-vr-icl | srx1b_srx4600 | `$ASN` 65002, `$ASN_CUSTOMER` 65050, `$BGP_EXPORT_POL` mnha_ip, `$CE_PEER_V4` 10.3.2.1, `$IFL` ae1.100, `$PE_LOCAL_V4` 10.3.2.2 |
| srx-mnha-vr-icl | srx2a_srx4600 | `$ASN` 65001, `$ASN_CUSTOMER` 65050, `$BGP_EXPORT_POL` mnha_ip, `$CE_PEER_V4` 10.3.3.1, `$IFL` ae2.100, `$PE_LOCAL_V4` 10.3.3.2 |
| srx-mnha-vr-icl | srx2b_srx4600 | `$ASN` 65002, `$ASN_CUSTOMER` 65050, `$BGP_EXPORT_POL` mnha_ip, `$CE_PEER_V4` 10.3.4.1, `$IFL` ae2.100, `$PE_LOCAL_V4` 10.3.4.2 |
| srx-vr-1-scale-out | srx1a_srx4600 | `$ASN` 65000, `$ASN_CUSTOMER_1` 65200, `$ASN_CUSTOMER_2` 65400, `$BGP_EXPORT_POL_1` trust_export_policy, `$BGP_EXPORT_POL_2` untrust_export_policy, `$BGP_EXPORT_POL_3` ipv6_trust_export_policy … |
| srx-vr-1-scale-out | srx1b_srx4600 | `$ASN` 65000, `$ASN_CUSTOMER_1` 65200, `$ASN_CUSTOMER_2` 65400, `$BGP_EXPORT_POL_1` trust_export_policy, `$BGP_EXPORT_POL_2` untrust_export_policy, `$BGP_EXPORT_POL_3` ipv6_trust_export_policy … |
| srx-vr-1-scale-out | srx2a_srx4600 | `$ASN` 65000, `$ASN_CUSTOMER_1` 65200, `$ASN_CUSTOMER_2` 65400, `$BGP_EXPORT_POL_1` trust_export_policy, `$BGP_EXPORT_POL_2` untrust_export_policy, `$BGP_EXPORT_POL_3` ipv6_trust_export_policy … |
| srx-vr-1-scale-out | srx2b_srx4600 | `$ASN` 65000, `$ASN_CUSTOMER_1` 65200, `$ASN_CUSTOMER_2` 65400, `$BGP_EXPORT_POL_1` trust_export_policy, `$BGP_EXPORT_POL_2` untrust_export_policy, `$BGP_EXPORT_POL_3` ipv6_trust_export_policy … |
| mx-trust-vr-scale-out | mx1_mx304 | `$ASN` 1000, `$ASN_CUSTOMER_1` 65100, `$ASN_CUSTOMER_2` 65000, `$ASN_LOCAL` 65200, `$BGP_EXPORT_POL_1` def_route_export, `$BGP_EXPORT_POL_2` ipv4_mx_trust-to-srx_trust_export … |
| mx-untrust-vr-scale-out | mx1_mx304 | `$ASN` 65400, `$ASN_CUSTOMER_1` 65300, `$ASN_CUSTOMER_2` 65000, `$BGP_EXPORT_POL_1` ipv4_mx_untrust_to_gw_export, `$BGP_EXPORT_POL_2` ipv4_mx_untrust-to-srx_untrust_export, `$BGP_EXPORT_POL_3` ipv6_mx_untrust-to-srx_untrust_export … |
| mx-mnha-vr-icl | mx1_mx304 | `$ASN` 65050, `$ASN_CUSTOMER_1` 65001, `$ASN_CUSTOMER_2` 65002, `$BGP_EXPORT_POL` mnha-mx-to-srx-export, `$CE_PEER_V4_1` 10.3.1.2, `$CE_PEER_V4_2` 10.3.2.2 … |
| tlb-sfw-trust | mx1_mx304 | `$REAL_SERVICE_V4_1` 192.168.10.1, `$REAL_SERVICE_V4_2` 192.168.10.2 |
| tlb-sfw-untrust | mx1_mx304 | `$REAL_SERVICE_V4_1` 192.168.10.1, `$REAL_SERVICE_V4_2` 192.168.10.2 |
| tlb-sfw-trust-ipv6 | mx1_mx304 | `$REAL_SERVICE_V6_1` 2001:db8:1:255::1, `$REAL_SERVICE_V6_2` 2001:db8:1:255::2 |
| tlb-sfw-untrust-ipv6 | mx1_mx304 | `$REAL_SERVICE_V6_1` 2001:db8:1:255::1, `$REAL_SERVICE_V6_2` 2001:db8:1:255::2 |
| tlb-fbf-trust | mx1_mx304 | `$AC_ADDR_V4` 172.16.1.1/30, `$AC_ADDR_V6` 2001:db8:172:1:1::1/126, `$IFD` ae10, `$UNIT` 41, `$VLAN` 41 |
| tlb-fbf-untrust | mx1_mx304 | `$AC_ADDR_V4` 172.16.2.1/30, `$AC_ADDR_V6` 2001:db8:172:2:1::1/126, `$IFD` ae10, `$UNIT` 81, `$VLAN` 81 |

The two nodes of an MNHA pair name each other: each node's `$MNHA_PEER_V4` is the other node's lo0.0 address and its `$MNHA_PEER_ID` the other node's `$MNHA_LOCAL_ID`. The MX TLB real services are the SRX pairs' lo0.1 addresses, and the MX eBGP neighbors are the SRX nodes' VLAN unit addresses.
