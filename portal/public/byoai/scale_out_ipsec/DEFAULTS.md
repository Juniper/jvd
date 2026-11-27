# DEFAULTS — Scale-Out IPsec

Lab auto-fill values for the Scale-Out IPsec JVD. Every value is measured from the published device configurations under [`configuration/conf/`](../../conf/). Use them when the user picks a device and service and asks for lab values; otherwise ask for the deployment values. Credentials (pre-shared keys, passwords, RADIUS secrets, the SNMP community) are never auto-filled: ask the user, or emit the placeholder shown.

## Device inventory

| Role | Device | Platform | OS | Loopbacks | AS numbers (instance or group: local AS) |
|------|--------|----------|----|-----------|------------------------------------------|
| IPsec Initiator Gateway | ipsec_initiator_gateway_mx304 | MX304 | Junos | lo0.0 10.200.0.1/32, 10.200.0.2/32, 10.200.0.3/32, 10.200.0.4/32, 10.200.0.5/32 | TRUST_VR 65300 (instance AS 2500); UNTRUST_VR 65100 |
| Forwarding / Load Balancer | mx1_mx304 | MX304 | Junos | lo0.1 192.168.10.251/32 | MNHA-VR 65050; TRUST_VR 65200; UNTRUST_VR 65400; routing-options 10000 |
| Security Service (SECGW) | srx1a_srx4600 | SRX4600 | Junos | lo0.0 192.168.0.1/32; lo0.1 10.100.0.1/32, 192.168.10.1/32 | MNHA-VR 65001; default instance 65000 |
| Security Service (SECGW) | srx1b_srx4600 | SRX4600 | Junos | lo0.0 192.168.0.2/32; lo0.1 10.100.0.1/32, 192.168.10.1/32 | MNHA-VR 65002; default instance 65000; routing-options 69 |
| Security Service (SECGW) | srx2a_srx4600 | SRX4600 | Junos | lo0.0 192.168.0.3/32; lo0.1 10.100.0.1/32, 192.168.10.2/32 | MNHA-VR 65001; default instance 65000 |
| Security Service (SECGW) | srx2b_srx4600 | SRX4600 | Junos | lo0.0 192.168.0.4/32; lo0.1 10.100.0.1/32, 192.168.10.2/32 | MNHA-VR 65002; default instance 65000; routing-options 69 |

Every SRX node carries the IKE anycast address 10.100.0.1 on lo0.1. The two nodes of an MNHA pair share their second lo0.1 address (the pair's activeness-probe source and the MX TLB real service) and swap their MNHA local and peer IDs.

## MNHA pairs

| MNHA pair | Nodes | Probe and TLB real-service address (lo0.1) | Activeness-probe destination (preferred / backup) |
|-----------|-------|---------------------------------------------|---------------------------------------------------|
| 1 | srx1a_srx4600 (preferred, local ID 1) and srx1b_srx4600 (backup, local ID 2) | 192.168.10.1/32 | 10.1.1.1 / 10.1.2.1 |
| 2 | srx2a_srx4600 (preferred, local ID 1) and srx2b_srx4600 (backup, local ID 2) | 192.168.10.2/32 | 10.1.3.1 / 10.1.4.1 |

## First validated instance per service and device

| Service form | Device | Example values |
|--------------|--------|----------------|
| ike-autovpn-responder | srx1a_srx4600 | `$IKE_PSK_1` <IKE_PSK>, `$IKE_PSK_2` <IKE_PSK> |
| ike-autovpn-responder | srx1b_srx4600 | `$IKE_PSK_1` <IKE_PSK>, `$IKE_PSK_2` <IKE_PSK> |
| ike-autovpn-responder | srx2a_srx4600 | `$IKE_PSK_1` <IKE_PSK>, `$IKE_PSK_2` <IKE_PSK> |
| ike-autovpn-responder | srx2b_srx4600 | `$IKE_PSK_1` <IKE_PSK>, `$IKE_PSK_2` <IKE_PSK> |
| ipsec-autovpn-st0 | srx1a_srx4600 | (no variables: the snip is rendered as written) |
| ipsec-autovpn-st0 | srx1b_srx4600 | (no variables: the snip is rendered as written) |
| ipsec-autovpn-st0 | srx2a_srx4600 | (no variables: the snip is rendered as written) |
| ipsec-autovpn-st0 | srx2b_srx4600 | (no variables: the snip is rendered as written) |
| security-policies-ipsec-data | srx1a_srx4600 | (no variables: the snip is rendered as written) |
| security-policies-ipsec-data | srx1b_srx4600 | (no variables: the snip is rendered as written) |
| security-policies-ipsec-data | srx2a_srx4600 | (no variables: the snip is rendered as written) |
| security-policies-ipsec-data | srx2b_srx4600 | (no variables: the snip is rendered as written) |
| mnha-srg-1-ipsec-preferred | srx1a_srx4600 | `$IFL` ae1.0, `$LOOPBACK_V4` 192.168.0.1, `$MNHA_LOCAL_ID` 1, `$MNHA_MONITOR_DST_V4` 10.1.1.1, `$MNHA_MONITOR_SRC_V4` 10.1.1.2, `$MNHA_PEER_ID` 2 … |
| mnha-srg-1-ipsec-preferred | srx2a_srx4600 | `$IFL` ae1.0, `$LOOPBACK_V4` 192.168.0.3, `$MNHA_LOCAL_ID` 1, `$MNHA_MONITOR_DST_V4` 10.1.3.1, `$MNHA_MONITOR_SRC_V4` 10.1.3.2, `$MNHA_PEER_ID` 2 … |
| mnha-srg-1-ipsec-backup | srx1b_srx4600 | `$IFL` ae1.0, `$LOOPBACK_V4` 192.168.0.2, `$MNHA_LOCAL_ID` 2, `$MNHA_MONITOR_DST_V4` 10.1.2.1, `$MNHA_MONITOR_SRC_V4` 10.1.2.2, `$MNHA_PEER_ID` 1 … |
| mnha-srg-1-ipsec-backup | srx2b_srx4600 | `$IFL` ae1.0, `$LOOPBACK_V4` 192.168.0.4, `$MNHA_LOCAL_ID` 2, `$MNHA_MONITOR_DST_V4` 10.1.4.1, `$MNHA_MONITOR_SRC_V4` 10.1.4.2, `$MNHA_PEER_ID` 1 … |
| srx-mnha-vr-icl | srx1a_srx4600 | `$ASN` 65001, `$ASN_CUSTOMER` 65050, `$BGP_EXPORT_POL` mnha_ip, `$CE_PEER_V4` 10.3.1.1, `$IFL` ae1.100, `$PE_LOCAL_V4` 10.3.1.2 |
| srx-mnha-vr-icl | srx1b_srx4600 | `$ASN` 65002, `$ASN_CUSTOMER` 65050, `$BGP_EXPORT_POL` mnha_ip, `$CE_PEER_V4` 10.3.2.1, `$IFL` ae1.100, `$PE_LOCAL_V4` 10.3.2.2 |
| srx-mnha-vr-icl | srx2a_srx4600 | `$ASN` 65001, `$ASN_CUSTOMER` 65050, `$BGP_EXPORT_POL` mnha_ip, `$CE_PEER_V4` 10.3.3.1, `$IFL` ae1.100, `$PE_LOCAL_V4` 10.3.3.2 |
| srx-mnha-vr-icl | srx2b_srx4600 | `$ASN` 65002, `$ASN_CUSTOMER` 65050, `$BGP_EXPORT_POL` mnha_ip, `$CE_PEER_V4` 10.3.4.1, `$IFL` ae1.100, `$PE_LOCAL_V4` 10.3.4.2 |
| srx-bgp-to-mx-trust | srx1a_srx4600 | `$ASN` 65000, `$ASN_CUSTOMER` 65200, `$BGP_EXPORT_POL` loopback_export_trust, `$CE_PEER_V4` 10.1.1.1, `$PE_LOCAL_V4` 10.1.1.2 |
| srx-bgp-to-mx-trust | srx1b_srx4600 | `$ASN` 65000, `$ASN_CUSTOMER` 65200, `$BGP_EXPORT_POL` loopback_export_trust, `$CE_PEER_V4` 10.1.2.1, `$PE_LOCAL_V4` 10.1.2.2 |
| srx-bgp-to-mx-trust | srx2a_srx4600 | `$ASN` 65000, `$ASN_CUSTOMER` 65200, `$BGP_EXPORT_POL` loopback_export_trust, `$CE_PEER_V4` 10.1.3.1, `$PE_LOCAL_V4` 10.1.3.2 |
| srx-bgp-to-mx-trust | srx2b_srx4600 | `$ASN` 65000, `$ASN_CUSTOMER` 65200, `$BGP_EXPORT_POL` loopback_export_trust, `$CE_PEER_V4` 10.1.4.1, `$PE_LOCAL_V4` 10.1.4.2 |
| srx-bgp-to-mx-untrust | srx1a_srx4600 | `$ASN` 65000, `$ASN_CUSTOMER` 65400, `$BGP_EXPORT_POL` ari_export_untrust, `$CE_PEER_V4` 10.2.1.1, `$PE_LOCAL_V4` 10.2.1.2 |
| srx-bgp-to-mx-untrust | srx1b_srx4600 | `$ASN` 65000, `$ASN_CUSTOMER` 65400, `$BGP_EXPORT_POL` ari_export_untrust, `$CE_PEER_V4` 10.2.2.1, `$PE_LOCAL_V4` 10.2.2.2 |
| srx-bgp-to-mx-untrust | srx2a_srx4600 | `$ASN` 65000, `$ASN_CUSTOMER` 65400, `$BGP_EXPORT_POL` ari_export_untrust, `$CE_PEER_V4` 10.2.3.1, `$PE_LOCAL_V4` 10.2.3.2 |
| srx-bgp-to-mx-untrust | srx2b_srx4600 | `$ASN` 65000, `$ASN_CUSTOMER` 65400, `$BGP_EXPORT_POL` ari_export_untrust, `$CE_PEER_V4` 10.2.4.1, `$PE_LOCAL_V4` 10.2.4.2 |
| mx-trust-vr-scale-out | mx1_mx304 | `$ASN` 65200, `$ASN_CUSTOMER_1` 65000, `$ASN_CUSTOMER_2` 65100, `$BGP_EXPORT_POL_1` MX1-to-SRX_trust_export, `$BGP_EXPORT_POL_2` default_export, `$CE_PEER_V4_1` 10.1.1.2 … |
| mx-untrust-vr-scale-out | mx1_mx304 | `$ASN` 65400, `$ASN_CUSTOMER_1` 65000, `$ASN_CUSTOMER_2` 65300, `$BGP_EXPORT_POL_1` untrust-to-trust-export, `$BGP_EXPORT_POL_2` ipsec_ari_route_export, `$CE_PEER_V4_1` 10.2.1.2 … |
| mx-mnha-vr-icl | mx1_mx304 | `$ASN` 65050, `$ASN_CUSTOMER_1` 65001, `$ASN_CUSTOMER_2` 65002, `$BGP_EXPORT_POL` mnha-mx-to-srx-export, `$CE_PEER_V4_1` 10.3.1.2, `$CE_PEER_V4_2` 10.3.2.2 … |
| tlb-ipsec-lb | mx1_mx304 | `$REAL_SERVICE_V4_1` 192.168.10.1, `$REAL_SERVICE_V4_2` 192.168.10.2 |
| tlb-fbf-ipsec-lb | mx1_mx304 | `$AC_ADDR_V4` 172.16.1.1/30, `$IFD` ae10, `$UNIT` 40, `$VLAN` 40 |
| ike-initiator-gateway | ipsec_initiator_gateway_mx304 | `$IKE_PSK` <IKE_PSK> |
| ipsec-initiator-vpns | ipsec_initiator_gateway_mx304 | (no variables: the snip is rendered as written) |

The two nodes of an MNHA pair name each other: each node's `$MNHA_PEER_V4` is the other node's lo0.0 address and its `$MNHA_PEER_ID` the other node's `$MNHA_LOCAL_ID`. The MX TLB real services are the SRX pairs' shared lo0.1 probe addresses, and the MX eBGP neighbors are the SRX nodes' VLAN unit addresses.
