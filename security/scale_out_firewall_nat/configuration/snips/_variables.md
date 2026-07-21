# Snippet variable glossary

All `.conf` files under `junos/` are **templates**: identifiers that vary between
deployments are written as `$VAR`. This JVD's validated lab configs contain **no
secret material** (no `## SECRET-DATA`, PSKs, or encrypted passwords), so there are
no secret placeholders to supply.

Render with:

    ~/git-scripts/snips_render.py <snip>.conf <vars.json>  > rendered.conf

Example values are drawn from the validated lab configs under configuration/conf/
(the SRX examples use `srx1a_srx4600`, the MX examples use `mx1_mx304`, the gateway
examples use `gateway_emulator_mx304`).

## Autonomous systems

| Variable | What it is | Example |
|---|---|---|
| `$SRX_AS` | SRX VR-1 local-as (shared across the scale-out farm) | `65000` |
| `$SRX_MNHA_AS` | SRX MNHA-VR local-as (ICL eBGP) | `65001` |
| `$SRX_MNHA_A_AS` / `$SRX_MNHA_B_AS` | MNHA A-node / B-node AS as seen from the MX | `65001` / `65002` |
| `$MX_TRUST_AS` / `$TRUST_AS` | MX TRUST_VR local-as | `65200` |
| `$MX_UNTRUST_AS` / `$UNTRUST_AS` | MX UNTRUST_VR local-as | `65400` |
| `$MX_MNHA_AS` / `$MNHA_AS` | MX MNHA-VR local-as (ICL eBGP) | `65050` |
| `$GW_TRUST_AS` / `$GW_UNTRUST_AS` | North-side gateway-emulator peer AS | `65100` / `65300` |

## NAT pools & prefixes (CGN / NAPT44 / NAT64)

| Variable | What it is | Example |
|---|---|---|
| `$NAPT_POOL` | SRX source-NAT (NAPT44) pool name | `srx_nat_pool1` |
| `$NAPT_PREFIX` | Per-pair RFC6598 NAPT44 pool /24 | `100.64.1.0/24` |
| `$NAPT_POOL_1` … `$NAPT_POOL_4` | The four per-pair NAPT pools (MX route-filter-list) | `100.64.1.0/24` … `100.64.4.0/24` |
| `$NAT64_SRC_POOL` | SRX NAT64 source-NAT pool name | `nat_64_source_ipv4_pool` |
| `$NAT64_SRC_PREFIX` | NAT64 source v4 pool /24 | `100.64.2.0/24` |
| `$NAT64_CLIENT_V6` | NAT64 IPv6 client prefix | `2001:db8:172:80::/96` |
| `$NAT64_DST_V4` / `$NAT64_DST_V6` | NAT64 real v4 server / mapped v6 destination | `172.16.10.3/32` / `2001:db8:1::1/128` |

## Stateful-firewall (SFW) prefixes

| Variable | What it is | Example |
|---|---|---|
| `$SFW_CLIENT_PFX` / `$SFW_SERVER_PFX` | SFW pre-NAT client / server v4 prefix | `172.80.0.0/12` / `172.160.0.0/12` |
| `$SFW_CLIENT_V6` / `$SFW_SERVER_V6` | SFW client / server v6 prefix | `2001:db8:172:80::/96` / `2001:db8:172:160::/96` |
| `$INSIDE_NH` | Gateway-emulator inside next-hop for the client/server routes | `172.16.8.1` |

## Load balancer (TLB) & forwarding instances

| Variable | What it is | Example |
|---|---|---|
| `$TRUST_VRF` / `$UNTRUST_VRF` | TLB client/server VRFs | `TRUST_VR` / `UNTRUST_VR` |
| `$TRUST_FI` / `$UNTRUST_FI` | Forwarding instances holding the TLB virtual-services | `srx_mnha_group_tlb-trust_fi` / `srx_mnha_group_tlb-untrust_fi` |
| `$REAL1` / `$REAL2` | Per-pair TLB real-service (health-check / anchor) IPs | `192.168.10.1` / `192.168.10.2` |
| `$TCP_PORT` / `$WEB_PORT` | TCP health-check probe port = SRX web-management port | `8088` |

## MNHA & route signalling

| Variable | What it is | Example |
|---|---|---|
| `$LOCAL_IP` / `$PEER_IP` | MNHA local / peer node IP | `192.168.0.1` / `192.168.0.2` |
| `$MNHA_NODE` | MNHA node loopback /32 (re-advertised over the ICL) | `192.168.0.1` |
| `$MON_DEST` / `$MON_SRC` | SRG0 BFD monitor destination / source IP | `10.1.1.1` / `10.1.1.2` |
| `$MON_INT` | SRG0 BFD monitor interface | `ae1.0` |
| `$SIG_ROUTE` | MNHA signal-route installed on failure / tested by the condition | `192.168.255.0` |
| `$HC_SRC` / `$HC_SRC6` | SRX TLB health-check / anchor address (lo0.1) v4 / v6 | `192.168.10.1` / `2001:db8:1:255::1` |

## Interfaces & addressing

| Variable | What it is | Example |
|---|---|---|
| `$AE` | Aggregated-ethernet bundle to the MX | `ae1` |
| `$ETA` / `$ETB` | SRX member et- ports of the bundle | `et-1/0/0` / `et-1/0/1` |
| `$TRUST_IP` / `$UNTRUST_IP` / `$MNHA_IP` | Per-plane /30 point-to-point address (v4) | `10.1.1.1/30` |
| `$TRUST_IP6` / `$UNTRUST_IP6` | Per-plane /126 point-to-point address (v6) | `2001:db8:1:1:1::1/126` |
| `$TRUST_UNI_IP` / `$UNTRUST_UNI_IP` | MX north-side AC per-VLAN address (v4) | `172.16.1.1/30` / `172.16.2.1/30` |
| `$TRUST_UNI_IP6` / `$UNTRUST_UNI_IP6` | MX north-side AC per-VLAN address (v6) | `2001:db8:172:1:1::1/126` |
| `$HC_TRUST_SRC` / `$HC_UNTRUST_SRC` | MX TLB health-check source (lo0.1 / lo0.2) v4 | `192.168.10.251/32` / `192.168.10.252/32` |
| `$HC_TRUST_SRC6` / `$HC_UNTRUST_SRC6` | MX TLB health-check source (lo0.1 / lo0.2) v6 | `2001:db8:1:255::251/128` / `2001:db8:1:255::252/128` |

## Zones

| Variable | What it is | Example |
|---|---|---|
| `$TRUST_ZONE` / `$UNTRUST_ZONE` | SRX NAT rule-set from/to zones | `VR-1_trust_zone` / `VR-1_untrust_zone` |
