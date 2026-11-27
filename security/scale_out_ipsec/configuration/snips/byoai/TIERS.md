# Configuration form tiers

<!-- GENERATED FROM configuration/snips/_composition.json by the build tooling (generate-tiers). Do not edit by hand: run `JVD_REPO=<checkout> npm run tiers -- --jvd security/scale_out_ipsec`. -->

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

## IKEv2 AutoVPN responder on the SRX IKE anycast address, with the MNHA inter-chassis link IKE gateway

Family ipsec, form ike-autovpn-responder. OS mode Junos. Attachment: lo0.1, which carries the IKE anycast address 10.100.0.1 on every SRX node..

### srx1a_srx4600 (junos)

- `minimum`: `junos/security/ike-autovpn-responder-group-ike-id-mnha-icl.conf`
- `self-contained`: the above plus `junos/interfaces/ifl-loopback-inet-two-addresses.conf`
- `as-deployed`: the self-contained set plus the other snippets validated on this device.

### srx1b_srx4600 (junos)

- `minimum`: `junos/security/ike-autovpn-responder-group-ike-id-mnha-icl.conf`
- `self-contained`: the above plus `junos/interfaces/ifl-loopback-inet-two-addresses.conf`
- `as-deployed`: the self-contained set plus the other snippets validated on this device.

### srx2a_srx4600 (junos)

- `minimum`: `junos/security/ike-autovpn-responder-group-ike-id-mnha-icl.conf`
- `self-contained`: the above plus `junos/interfaces/ifl-loopback-inet-two-addresses.conf`
- `as-deployed`: the self-contained set plus the other snippets validated on this device.

### srx2b_srx4600 (junos)

- `minimum`: `junos/security/ike-autovpn-responder-group-ike-id-mnha-icl.conf`
- `self-contained`: the above plus `junos/interfaces/ifl-loopback-inet-two-addresses.conf`
- `as-deployed`: the self-contained set plus the other snippets validated on this device.

---

## IPsec AutoVPN on st0.1 with ARI traffic selectors, and the MNHA inter-chassis link encryption VPN on an SRX

Family ipsec, form ipsec-autovpn-st0. OS mode Junos. Attachment: The st0.1 secure-tunnel unit and the IKE gateways of the AutoVPN responder form..

### srx1a_srx4600 (junos)

- `minimum`: `junos/security/ipsec-autovpn-st0-1-mnha-icl-link-encryption-aes-256-gcm.conf`
- `self-contained`: the above plus `junos/interfaces/ifl-loopback-inet-two-addresses.conf`, `junos/interfaces/ifl-unit-inet.conf`, `junos/security/ike-autovpn-responder-group-ike-id-mnha-icl.conf`
- `as-deployed`: the self-contained set plus the other snippets validated on this device.

### srx1b_srx4600 (junos)

- `minimum`: `junos/security/ipsec-autovpn-st0-1-mnha-icl-link-encryption-aes-256-gcm.conf`
- `self-contained`: the above plus `junos/interfaces/ifl-loopback-inet-two-addresses.conf`, `junos/interfaces/ifl-unit-inet.conf`, `junos/security/ike-autovpn-responder-group-ike-id-mnha-icl.conf`
- `as-deployed`: the self-contained set plus the other snippets validated on this device.

### srx2a_srx4600 (junos)

- `minimum`: `junos/security/ipsec-autovpn-st0-1-mnha-icl-link-encryption-aes-256-gcm.conf`
- `self-contained`: the above plus `junos/interfaces/ifl-loopback-inet-two-addresses.conf`, `junos/interfaces/ifl-unit-inet.conf`, `junos/security/ike-autovpn-responder-group-ike-id-mnha-icl.conf`
- `as-deployed`: the self-contained set plus the other snippets validated on this device.

### srx2b_srx4600 (junos)

- `minimum`: `junos/security/ipsec-autovpn-st0-1-mnha-icl-link-encryption-aes-256-gcm.conf`
- `self-contained`: the above plus `junos/interfaces/ifl-loopback-inet-two-addresses.conf`, `junos/interfaces/ifl-unit-inet.conf`, `junos/security/ike-autovpn-responder-group-ike-id-mnha-icl.conf`
- `as-deployed`: the self-contained set plus the other snippets validated on this device.

---

## Intra-zone security policies for IPsec data, the MNHA inter-chassis link and ESP to the trust zone on an SRX

Family security-policy, form security-policies-ipsec-data. OS mode Junos. Attachment: The VR-1 trust, VR-1 untrust and MNHA security zones, the global address-book entries and the ESP application the policies name..

### srx1a_srx4600 (junos)

- `minimum`: `junos/security/policies-intra-zone-esp-block-mnha-icl-ipsec-data.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: security-zone:vr-1_trust_zone
  - occurrence-selection-required: security-zone:vr-1_trust_zone
  - occurrence-selection-required: security-zone:trust_zone_mnha
  - occurrence-selection-required: security-zone:trust_zone_mnha
  - occurrence-selection-required: security-zone:vr-1_untrust_zone
  - occurrence-selection-required: security-zone:vr-1_untrust_zone

### srx1b_srx4600 (junos)

- `minimum`: `junos/security/policies-intra-zone-esp-block-mnha-icl-ipsec-data.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: security-zone:vr-1_trust_zone
  - occurrence-selection-required: security-zone:vr-1_trust_zone
  - occurrence-selection-required: security-zone:trust_zone_mnha
  - occurrence-selection-required: security-zone:trust_zone_mnha
  - occurrence-selection-required: security-zone:vr-1_untrust_zone
  - occurrence-selection-required: security-zone:vr-1_untrust_zone

### srx2a_srx4600 (junos)

- `minimum`: `junos/security/policies-intra-zone-esp-block-mnha-icl-ipsec-data.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: security-zone:vr-1_trust_zone
  - occurrence-selection-required: security-zone:vr-1_trust_zone
  - occurrence-selection-required: security-zone:trust_zone_mnha
  - occurrence-selection-required: security-zone:trust_zone_mnha
  - occurrence-selection-required: security-zone:vr-1_untrust_zone
  - occurrence-selection-required: security-zone:vr-1_untrust_zone

### srx2b_srx4600 (junos)

- `minimum`: `junos/security/policies-intra-zone-esp-block-mnha-icl-ipsec-data.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: security-zone:vr-1_trust_zone
  - occurrence-selection-required: security-zone:vr-1_trust_zone
  - occurrence-selection-required: security-zone:trust_zone_mnha
  - occurrence-selection-required: security-zone:trust_zone_mnha
  - occurrence-selection-required: security-zone:vr-1_untrust_zone
  - occurrence-selection-required: security-zone:vr-1_untrust_zone

---

## SRX MNHA with an encrypted inter-chassis link and IPsec SRG 1, preferred node (preemption, activeness priority 200)

Family mnha, form mnha-srg-1-ipsec-preferred. OS mode Junos. Attachment: lo0.0 in MNHA-VR, the ike_lo0 prefix list, the L3HA_IPSEC_VPN inter-chassis link VPN and the trust-side unit that the BFD monitor uses..

### srx1a_srx4600 (junos)

- `minimum`: `junos/chassis/high-availability-mnha-icl-encryption-srg-1-ipsec-activeness-probe-preemption-priority-200.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:lo0.0
  - occurrence-selection-required: logical-interface:$IFL
  - occurrence-selection-required: logical-interface:$IFL
  - occurrence-selection-required: logical-interface:lo0.0
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL

### srx2a_srx4600 (junos)

- `minimum`: `junos/chassis/high-availability-mnha-icl-encryption-srg-1-ipsec-activeness-probe-preemption-priority-200.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:lo0.0
  - occurrence-selection-required: logical-interface:$IFL
  - occurrence-selection-required: logical-interface:$IFL
  - occurrence-selection-required: logical-interface:lo0.0
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL

---

## SRX MNHA with an encrypted inter-chassis link and IPsec SRG 1, backup node (activeness priority 1)

Family mnha, form mnha-srg-1-ipsec-backup. OS mode Junos. Attachment: lo0.0 in MNHA-VR, the ike_lo0 prefix list, the L3HA_IPSEC_VPN inter-chassis link VPN and the trust-side unit that the BFD monitor uses..

### srx1b_srx4600 (junos)

- `minimum`: `junos/chassis/high-availability-mnha-icl-encryption-srg-1-ipsec-activeness-probe-priority-1.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:lo0.0
  - occurrence-selection-required: logical-interface:$IFL
  - occurrence-selection-required: logical-interface:$IFL
  - occurrence-selection-required: logical-interface:lo0.0
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL

### srx2b_srx4600 (junos)

- `minimum`: `junos/chassis/high-availability-mnha-icl-encryption-srg-1-ipsec-activeness-probe-priority-1.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:lo0.0
  - occurrence-selection-required: logical-interface:$IFL
  - occurrence-selection-required: logical-interface:$IFL
  - occurrence-selection-required: logical-interface:lo0.0
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL

---

## SRX MNHA-VR inter-chassis link routing with eBGP and BFD to the MX

Family mnha, form srx-mnha-vr-icl. OS mode Junos. Attachment: The inter-chassis link VLAN unit toward the MX and lo0.0..

### srx1a_srx4600 (junos)

- `minimum`: `junos/routing-instances/virtual-router/ri-mnha-vr-ebgp-icl-bfd.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$IFL
  - occurrence-selection-required: logical-interface:lo0.0
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL

### srx1b_srx4600 (junos)

- `minimum`: `junos/routing-instances/virtual-router/ri-mnha-vr-ebgp-icl-bfd.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$IFL
  - occurrence-selection-required: logical-interface:lo0.0
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL

### srx2a_srx4600 (junos)

- `minimum`: `junos/routing-instances/virtual-router/ri-mnha-vr-ebgp-icl-bfd.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$IFL
  - occurrence-selection-required: logical-interface:lo0.0
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL

### srx2b_srx4600 (junos)

- `minimum`: `junos/routing-instances/virtual-router/ri-mnha-vr-ebgp-icl-bfd.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$IFL
  - occurrence-selection-required: logical-interface:lo0.0
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL

---

## SRX eBGP group SRX-to-MX_TRUST with BFD toward the MX trust instance

Family scale-out-routing, form srx-bgp-to-mx-trust. OS mode Junos. Attachment: The MX-facing trust VLAN unit; the export policy advertises the activeness-probe address with the SRG-state AS-path preference..

### srx1a_srx4600 (junos)

- `minimum`: `junos/protocols/bgp-group-srx-to-mx-trust-ebgp-bfd.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL

### srx1b_srx4600 (junos)

- `minimum`: `junos/protocols/bgp-group-srx-to-mx-trust-ebgp-bfd.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL

### srx2a_srx4600 (junos)

- `minimum`: `junos/protocols/bgp-group-srx-to-mx-trust-ebgp-bfd.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL

### srx2b_srx4600 (junos)

- `minimum`: `junos/protocols/bgp-group-srx-to-mx-trust-ebgp-bfd.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL

---

## SRX eBGP group SRX-to-MX_UNTRUST with BFD toward the MX untrust instance

Family scale-out-routing, form srx-bgp-to-mx-untrust. OS mode Junos. Attachment: The MX-facing untrust VLAN unit; the export policy advertises the ARI routes with the SRG-state AS-path preference..

### srx1a_srx4600 (junos)

- `minimum`: `junos/protocols/bgp-group-srx-to-mx-untrust-ebgp-bfd.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL

### srx1b_srx4600 (junos)

- `minimum`: `junos/protocols/bgp-group-srx-to-mx-untrust-ebgp-bfd.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL

### srx2a_srx4600 (junos)

- `minimum`: `junos/protocols/bgp-group-srx-to-mx-untrust-ebgp-bfd.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL

### srx2b_srx4600 (junos)

- `minimum`: `junos/protocols/bgp-group-srx-to-mx-untrust-ebgp-bfd.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL

---

## MX TRUST_VR scale-out routing with eBGP to every SRX node and to the trust-side gateway

Family scale-out-routing, form mx-trust-vr-scale-out. OS mode Junos. Attachment: The SRX-facing trust VLAN units, the gateway-facing unit with the IPSEC_LB filter and lo0.1, the TLB instance interface..

### mx1_mx304 (junos)

- `minimum`: `junos/routing-instances/virtual-router/ri-trust-vr-static-discard-default-ebgp-srx-4-neighbors-gateway.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$IFL_1
  - occurrence-selection-required: logical-interface:$IFL_2
  - occurrence-selection-required: logical-interface:$IFL_3
  - occurrence-selection-required: logical-interface:$IFL_4
  - occurrence-selection-required: logical-interface:$IFL_5
  - occurrence-selection-required: logical-interface:$LOOPBACK_IFL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_1
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_2

---

## MX UNTRUST_VR scale-out routing with eBGP to every SRX node and to the untrust-side gateway

Family scale-out-routing, form mx-untrust-vr-scale-out. OS mode Junos. Attachment: The SRX-facing untrust VLAN units and the gateway-facing unit..

### mx1_mx304 (junos)

- `minimum`: `junos/routing-instances/virtual-router/ri-untrust-vr-ebgp-srx-4-neighbors-gateway.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$IFL_1
  - occurrence-selection-required: logical-interface:$IFL_2
  - occurrence-selection-required: logical-interface:$IFL_3
  - occurrence-selection-required: logical-interface:$IFL_4
  - occurrence-selection-required: logical-interface:$IFL_5
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_1
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_2

---

## MX MNHA-VR with eBGP to the inter-chassis link unit of every SRX node

Family mnha, form mx-mnha-vr-icl. OS mode Junos. Attachment: The inter-chassis link VLAN unit toward each SRX node..

### mx1_mx304 (junos)

- `minimum`: `junos/routing-instances/virtual-router/ri-mnha-vr-ebgp-4-icl-groups.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$IFL_1
  - occurrence-selection-required: logical-interface:$IFL_2
  - occurrence-selection-required: logical-interface:$IFL_3
  - occurrence-selection-required: logical-interface:$IFL_4
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL

---

## MX TLB instance ipsec_lb (direct server return to the SRX MNHA pairs, source-IP hash)

Family tlb, form tlb-ipsec-lb. OS mode Junos. Attachment: lo0.1 as the instance interface, TRUST_VR, the network-monitoring profiles and forwarding instance srx-tproxy-fi, which the IPSEC_LB filter feeds..

### mx1_mx304 (junos)

- `minimum`: `junos/services/traffic-load-balance-instance-ipsec-lb.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$IFL_1
  - occurrence-selection-required: logical-interface:$IFL_2
  - occurrence-selection-required: logical-interface:$IFL_3
  - occurrence-selection-required: logical-interface:$IFL_4
  - occurrence-selection-required: logical-interface:$IFL_5
  - occurrence-selection-required: logical-interface:$LOOPBACK_IFL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_1
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_2

---

## MX gateway-facing unit with filter-based forwarding of IKE and IPsec traffic into the TLB forwarding instance

Family tlb, form tlb-fbf-ipsec-lb. OS mode Junos. Attachment: The trust-gateway-facing VLAN unit of the aggregated Ethernet interface..

### mx1_mx304 (junos)

- `minimum`: `junos/interfaces/ifl-vlan-inet-input-filter-ipsec-lb.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: interface-parent:source-occurrence
  - occurrence-selection-required: lag-member:source-occurrence

---

## MX IKEv2 initiator with five gateways to the SRX IKE anycast address

Family ipsec, form ike-initiator-gateway. OS mode Junos. Attachment: lo0.0, which carries the five initiator addresses..

### ipsec_initiator_gateway_mx304 (junos)

- `minimum`: `junos/security/ike-initiator-5-gateways-ikev2-pre-shared-key.conf`
- `self-contained`: the above plus `junos/interfaces/ifl-loopback-inet-5-addresses.conf`
- `as-deployed`: the self-contained set plus the other snippets validated on this device.

---

## MX IPsec initiator with five route-based VPNs established immediately

Family ipsec, form ipsec-initiator-vpns. OS mode Junos. Attachment: The st0.1 to st0.5 secure-tunnel units, the five IKE gateways and the next-hop service-sets IPSEC_TUN_1 to IPSEC_TUN_5 on the AMS interface..

### ipsec_initiator_gateway_mx304 (junos)

- `minimum`: `junos/security/ipsec-initiator-5-vpns-aes-256-gcm-establish-immediately.conf`
- `self-contained`: the above plus `junos/interfaces/ifl-loopback-inet-5-addresses.conf`, `junos/interfaces/ifl-unit-inet.conf`, `junos/security/ike-initiator-5-gateways-ikev2-pre-shared-key.conf`
- `as-deployed`: the self-contained set plus the other snippets validated on this device.

---
