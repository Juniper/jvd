# Configuration form tiers

<!-- GENERATED FROM configuration/snips/_composition.json by the build tooling (generate-tiers). Do not edit by hand: run `JVD_REPO=<checkout> npm run tiers -- --jvd security/scale_out_firewall_nat`. -->

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

## Source NAT (NAPT44 and NAT64 pools) and NAT64 destination NAT on an SRX

Family nat, form source-nat-napt44-nat64. OS mode Junos. Attachment: The VR-1 trust and untrust security zones; VR-1 originates the pool prefixes as discard routes and its untrust export policy advertises them..

### srx1a_srx4600 (junos)

- `minimum`: `junos/security/nat-source-napt44-nat64-pools-destination-nat64.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$IFL_1
  - occurrence-selection-required: logical-interface:lo0.1
  - occurrence-selection-required: logical-interface:$IFL_2
  - occurrence-selection-required: logical-interface:lo0.0
  - occurrence-selection-required: logical-interface:$IFL_3

### srx1b_srx4600 (junos)

- `minimum`: `junos/security/nat-source-napt44-nat64-pools-destination-nat64.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$IFL_1
  - occurrence-selection-required: logical-interface:lo0.1
  - occurrence-selection-required: logical-interface:$IFL_2
  - occurrence-selection-required: logical-interface:lo0.0
  - occurrence-selection-required: logical-interface:$IFL_3

### srx2a_srx4600 (junos)

- `minimum`: `junos/security/nat-source-napt44-nat64-pools-destination-nat64.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$IFL_1
  - occurrence-selection-required: logical-interface:lo0.1
  - occurrence-selection-required: logical-interface:$IFL_2
  - occurrence-selection-required: logical-interface:lo0.0
  - occurrence-selection-required: logical-interface:$IFL_3

### srx2b_srx4600 (junos)

- `minimum`: `junos/security/nat-source-napt44-nat64-pools-destination-nat64.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$IFL_1
  - occurrence-selection-required: logical-interface:lo0.1
  - occurrence-selection-required: logical-interface:$IFL_2
  - occurrence-selection-required: logical-interface:lo0.0
  - occurrence-selection-required: logical-interface:$IFL_3

---

## Trust-to-untrust security policies for the SFW and NAT source prefixes on an SRX

Family security-policy, form security-policies-sfw-nat. OS mode Junos. Attachment: The VR-1 trust and untrust security zones and the global address-book entries the policies name..

### srx1a_srx4600 (junos)

- `minimum`: `junos/security/policies-trust-to-untrust-permit-sfw-nat-default-permit-all.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: address-book-entry:sfw_source_prefix_172.80.0.0/12
  - occurrence-selection-required: address-book-entry:sfw_source_prefix_2001:db8:172:80::/96
  - occurrence-selection-required: address-book-entry:sfw_source_prefix_2001:db8:172:160::/96
  - occurrence-selection-required: address-book-entry:sfw_source_prefix_172.160.0.0/12
  - occurrence-selection-required: logical-interface:$IFL_1
  - occurrence-selection-required: logical-interface:lo0.1
  - occurrence-selection-required: logical-interface:$IFL_2
  - occurrence-selection-required: logical-interface:lo0.0
  - occurrence-selection-required: logical-interface:$IFL_3

### srx1b_srx4600 (junos)

- `minimum`: `junos/security/policies-trust-to-untrust-permit-sfw-nat-default-permit-all.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: address-book-entry:sfw_source_prefix_172.80.0.0/12
  - occurrence-selection-required: address-book-entry:sfw_source_prefix_2001:db8:172:80::/96
  - occurrence-selection-required: address-book-entry:sfw_source_prefix_2001:db8:172:160::/96
  - occurrence-selection-required: address-book-entry:sfw_source_prefix_172.160.0.0/12
  - occurrence-selection-required: logical-interface:$IFL_1
  - occurrence-selection-required: logical-interface:lo0.1
  - occurrence-selection-required: logical-interface:$IFL_2
  - occurrence-selection-required: logical-interface:lo0.0
  - occurrence-selection-required: logical-interface:$IFL_3

### srx2a_srx4600 (junos)

- `minimum`: `junos/security/policies-trust-to-untrust-permit-sfw-nat-default-permit-all.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: address-book-entry:sfw_source_prefix_172.80.0.0/12
  - occurrence-selection-required: address-book-entry:sfw_source_prefix_2001:db8:172:80::/96
  - occurrence-selection-required: address-book-entry:sfw_source_prefix_2001:db8:172:160::/96
  - occurrence-selection-required: address-book-entry:sfw_source_prefix_172.160.0.0/12
  - occurrence-selection-required: logical-interface:$IFL_1
  - occurrence-selection-required: logical-interface:lo0.1
  - occurrence-selection-required: logical-interface:$IFL_2
  - occurrence-selection-required: logical-interface:lo0.0
  - occurrence-selection-required: logical-interface:$IFL_3

### srx2b_srx4600 (junos)

- `minimum`: `junos/security/policies-trust-to-untrust-permit-sfw-nat-default-permit-all.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: address-book-entry:sfw_source_prefix_172.80.0.0/12
  - occurrence-selection-required: address-book-entry:sfw_source_prefix_2001:db8:172:80::/96
  - occurrence-selection-required: address-book-entry:sfw_source_prefix_2001:db8:172:160::/96
  - occurrence-selection-required: address-book-entry:sfw_source_prefix_172.160.0.0/12
  - occurrence-selection-required: logical-interface:$IFL_1
  - occurrence-selection-required: logical-interface:lo0.1
  - occurrence-selection-required: logical-interface:$IFL_2
  - occurrence-selection-required: logical-interface:lo0.0
  - occurrence-selection-required: logical-interface:$IFL_3

---

## SRX Multinode High Availability (routing mode) with SRG 0, a BFD monitor and an install-on-failure signal route

Family mnha, form mnha-srg-0-signal-route. OS mode Junos. Attachment: lo0.0 in MNHA-VR (the inter-chassis link endpoint) and the trust-side VR-1 unit that the BFD liveliness monitor uses..

### srx1a_srx4600 (junos)

- `minimum`: `junos/chassis/high-availability-mnha-srg-0-bfd-monitor-install-on-failure-route.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:lo0.0
  - occurrence-selection-required: logical-interface:$IFL
  - occurrence-selection-required: logical-interface:$IFL_1
  - occurrence-selection-required: logical-interface:$IFL_2
  - occurrence-selection-required: logical-interface:$LOOPBACK_IFL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_1
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_2
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_3
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_4
  - occurrence-selection-required: logical-interface:$IFL
  - occurrence-selection-required: logical-interface:lo0.0
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL

### srx1b_srx4600 (junos)

- `minimum`: `junos/chassis/high-availability-mnha-srg-0-bfd-monitor-install-on-failure-route.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:lo0.0
  - occurrence-selection-required: logical-interface:$IFL
  - occurrence-selection-required: logical-interface:$IFL_1
  - occurrence-selection-required: logical-interface:$IFL_2
  - occurrence-selection-required: logical-interface:$LOOPBACK_IFL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_1
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_2
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_3
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_4
  - occurrence-selection-required: logical-interface:$IFL
  - occurrence-selection-required: logical-interface:lo0.0
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL

### srx2a_srx4600 (junos)

- `minimum`: `junos/chassis/high-availability-mnha-srg-0-bfd-monitor-install-on-failure-route.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:lo0.0
  - occurrence-selection-required: logical-interface:$IFL
  - occurrence-selection-required: logical-interface:$IFL_1
  - occurrence-selection-required: logical-interface:$IFL_2
  - occurrence-selection-required: logical-interface:$LOOPBACK_IFL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_1
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_2
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_3
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_4
  - occurrence-selection-required: logical-interface:$IFL
  - occurrence-selection-required: logical-interface:lo0.0
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL

### srx2b_srx4600 (junos)

- `minimum`: `junos/chassis/high-availability-mnha-srg-0-bfd-monitor-install-on-failure-route.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:lo0.0
  - occurrence-selection-required: logical-interface:$IFL
  - occurrence-selection-required: logical-interface:$IFL_1
  - occurrence-selection-required: logical-interface:$IFL_2
  - occurrence-selection-required: logical-interface:$LOOPBACK_IFL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_1
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_2
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_3
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_4
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

## SRX VR-1 scale-out routing with NAT pool discard routes and IPv4 and IPv6 eBGP to the MX trust and untrust instances

Family scale-out-routing, form srx-vr-1-scale-out. OS mode Junos. Attachment: The MX-facing trust and untrust VLAN units and lo0.1, the TLB real-service address..

### srx1a_srx4600 (junos)

- `minimum`: `junos/routing-instances/virtual-router/ri-vr-1-nat-pool-discard-ebgp-trust-untrust-inet-inet6.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$IFL_1
  - occurrence-selection-required: logical-interface:$IFL_2
  - occurrence-selection-required: logical-interface:$LOOPBACK_IFL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_1
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_2
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_3
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_4

### srx1b_srx4600 (junos)

- `minimum`: `junos/routing-instances/virtual-router/ri-vr-1-nat-pool-discard-ebgp-trust-untrust-inet-inet6.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$IFL_1
  - occurrence-selection-required: logical-interface:$IFL_2
  - occurrence-selection-required: logical-interface:$LOOPBACK_IFL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_1
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_2
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_3
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_4

### srx2a_srx4600 (junos)

- `minimum`: `junos/routing-instances/virtual-router/ri-vr-1-nat-pool-discard-ebgp-trust-untrust-inet-inet6.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$IFL_1
  - occurrence-selection-required: logical-interface:$IFL_2
  - occurrence-selection-required: logical-interface:$LOOPBACK_IFL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_1
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_2
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_3
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_4

### srx2b_srx4600 (junos)

- `minimum`: `junos/routing-instances/virtual-router/ri-vr-1-nat-pool-discard-ebgp-trust-untrust-inet-inet6.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$IFL_1
  - occurrence-selection-required: logical-interface:$IFL_2
  - occurrence-selection-required: logical-interface:$LOOPBACK_IFL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_1
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_2
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_3
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_4

---

## MX TRUST_VR scale-out routing with eBGP multipath to every SRX node and eBGP to the trust gateway

Family scale-out-routing, form mx-trust-vr-scale-out. OS mode Junos. Attachment: The SRX-facing trust VLAN units, the gateway-facing unit with the TLB trust filters and lo0.1, the TLB health-check source..

### mx1_mx304 (junos)

- `minimum`: `junos/routing-instances/virtual-router/ri-trust-vr-static-discard-default-ebgp-10-groups.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$IFL_1
  - occurrence-selection-required: logical-interface:$IFL_2
  - occurrence-selection-required: logical-interface:$IFL_3
  - occurrence-selection-required: logical-interface:$IFL_4
  - occurrence-selection-required: logical-interface:$IFL_5
  - occurrence-selection-required: logical-interface:$LOOPBACK_IFL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_1
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_2
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_2
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_2
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_2
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_3
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_3
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_3
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_3
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_4

---

## MX UNTRUST_VR scale-out routing with eBGP multipath to every SRX node and eBGP to the untrust gateway

Family scale-out-routing, form mx-untrust-vr-scale-out. OS mode Junos. Attachment: The SRX-facing untrust VLAN units, the gateway-facing unit with the TLB untrust filters and lo0.2, the TLB health-check source..

### mx1_mx304 (junos)

- `minimum`: `junos/routing-instances/virtual-router/ri-untrust-vr-static-discard-sfw-ebgp-10-groups.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$IFL_1
  - occurrence-selection-required: logical-interface:$IFL_2
  - occurrence-selection-required: logical-interface:$IFL_3
  - occurrence-selection-required: logical-interface:$IFL_4
  - occurrence-selection-required: logical-interface:$IFL_5
  - occurrence-selection-required: logical-interface:$LOOPBACK_IFL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_1
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_2
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_2
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_2
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_2
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_3
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_3
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_3
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_3
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_4

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

## MX TLB instance tlb_sfw_trust (IPv4, direct server return, source-IP hash)

Family tlb, form tlb-sfw-trust. OS mode Junos. Attachment: lo0.0 as the instance interface, lo0.1 as the health-check source and forwarding instance srx_mnha_group_tlb-trust_fi, which the MX_TLB_LB_TRUST filter feeds..

### mx1_mx304 (junos)

- `minimum`: `junos/services/traffic-load-balance-instance-tlb-sfw-trust.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$IFL_1
  - occurrence-selection-required: logical-interface:$IFL_2
  - occurrence-selection-required: logical-interface:$IFL_3
  - occurrence-selection-required: logical-interface:$IFL_4
  - occurrence-selection-required: logical-interface:$IFL_5
  - occurrence-selection-required: logical-interface:$LOOPBACK_IFL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_1
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_2
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_2
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_2
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_2
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_3
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_3
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_3
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_3
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_4

---

## MX TLB instance tlb_sfw_untrust (IPv4, direct server return, destination-IP hash)

Family tlb, form tlb-sfw-untrust. OS mode Junos. Attachment: lo0.0 as the instance interface, lo0.2 as the health-check source and forwarding instance srx_mnha_group_tlb-untrust_fi, which the MX_TLB_LB_UNTRUST filter feeds..

### mx1_mx304 (junos)

- `minimum`: `junos/services/traffic-load-balance-instance-tlb-sfw-untrust.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$IFL_1
  - occurrence-selection-required: logical-interface:$IFL_2
  - occurrence-selection-required: logical-interface:$IFL_3
  - occurrence-selection-required: logical-interface:$IFL_4
  - occurrence-selection-required: logical-interface:$IFL_5
  - occurrence-selection-required: logical-interface:$LOOPBACK_IFL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_1
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_2
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_2
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_2
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_2
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_3
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_3
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_3
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_3
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_4

---

## MX TLB instance ipv6_tlb_sfw_trust (IPv6, direct server return, source-IP hash)

Family tlb, form tlb-sfw-trust-ipv6. OS mode Junos. Attachment: lo0.0 as the instance interface, lo0.1 as the health-check source and forwarding instance srx_mnha_group_tlb-trust_fi, which the IPv6_MX_TLB_LB_TRUST filter feeds..

### mx1_mx304 (junos)

- `minimum`: `junos/services/traffic-load-balance-instance-ipv6-tlb-sfw-trust.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$IFL_1
  - occurrence-selection-required: logical-interface:$IFL_2
  - occurrence-selection-required: logical-interface:$IFL_3
  - occurrence-selection-required: logical-interface:$IFL_4
  - occurrence-selection-required: logical-interface:$IFL_5
  - occurrence-selection-required: logical-interface:$LOOPBACK_IFL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_1
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_2
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_2
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_2
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_2
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_3
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_3
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_3
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_3
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_4

---

## MX TLB instance ipv6_tlb_sfw_untrust (IPv6, direct server return, destination-IP hash)

Family tlb, form tlb-sfw-untrust-ipv6. OS mode Junos. Attachment: lo0.0 as the instance interface, lo0.2 as the health-check source and forwarding instance srx_mnha_group_tlb-untrust_fi, which the IPv6_MX_TLB_LB_UNTRUST filter feeds..

### mx1_mx304 (junos)

- `minimum`: `junos/services/traffic-load-balance-instance-ipv6-tlb-sfw-untrust.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: logical-interface:$IFL_1
  - occurrence-selection-required: logical-interface:$IFL_2
  - occurrence-selection-required: logical-interface:$IFL_3
  - occurrence-selection-required: logical-interface:$IFL_4
  - occurrence-selection-required: logical-interface:$IFL_5
  - occurrence-selection-required: logical-interface:$LOOPBACK_IFL
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_1
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_2
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_2
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_2
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_2
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_3
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_3
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_3
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_3
  - occurrence-selection-required: policy-statement:$BGP_EXPORT_POL_4

---

## MX gateway-facing unit with filter-based forwarding into the TLB trust forwarding instance

Family tlb, form tlb-fbf-trust. OS mode Junos. Attachment: The trust-gateway-facing VLAN unit of the aggregated Ethernet interface..

### mx1_mx304 (junos)

- `minimum`: `junos/interfaces/ifl-vlan-inet-inet6-input-filter-mx-tlb-lb-trust.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: interface-parent:source-occurrence
  - occurrence-selection-required: lag-member:source-occurrence

---

## MX gateway-facing unit with filter-based forwarding into the TLB untrust forwarding instance

Family tlb, form tlb-fbf-untrust. OS mode Junos. Attachment: The untrust-gateway-facing VLAN unit of the aggregated Ethernet interface..

### mx1_mx304 (junos)

- `minimum`: `junos/interfaces/ifl-vlan-inet-inet6-input-filter-mx-tlb-lb-untrust.conf`
- `self-contained` / `as-deployed`: **Blocked until the complete bound dependency plan validates.**
  - occurrence-selection-required: interface-parent:source-occurrence
  - occurrence-selection-required: lag-member:source-occurrence

---
