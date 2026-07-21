# Snippet variable glossary

All `.conf` files under `junos/` are **templates**: identifiers that vary between
deployments are written as `$VAR`. Secrets (`## SECRET-DATA`) are replaced with
`$*_PSK` placeholders — supply your own encrypted values.

Render with:

    ~/git-scripts/snips_render.py <snip>.conf <vars.json>  > rendered.conf

Example values are drawn from the validated lab configs under `configuration/conf/`.

## Autonomous systems

| Variable | What it is | Example |
|---|---|---|
| `$MX_AS` | MX global autonomous-system | `10000` |
| `$TRUST_AS` | MX TRUST_VR local-as (to SRX / GW) | `65200` |
| `$UNTRUST_AS` | MX UNTRUST_VR local-as (to SRX / GW) | `65400` |
| `$MNHA_AS` | MX MNHA-VR local-as (ICL eBGP) | `65050` |
| `$SRX_AS` | SRX local-as (shared across the scale-out farm) | `65000` |
| `$GW_TRUST_AS` / `$GW_UNTRUST_AS` | North-side GW router peer AS | `65100` / `65300` |
| `$MX_TRUST_AS` / `$MX_UNTRUST_AS` / `$MX_MNHA_AS` | MX peer AS as seen from the SRX | `65200` / `65400` / `65050` |

## Anycast endpoint & load-balancer

| Variable | What it is | Example |
|---|---|---|
| `$TLB_VIP` / `$IKE_VIP` / `$SRX_VIP` | Shared anycast IKE gateway VIP (TLB virtual-service) | `10.100.0.1` |
| `$REAL1` / `$REAL2` | Per-MNHA-pair TLB real-service (health-check/anchor) IP | `192.168.10.1` / `192.168.10.2` |
| `$LB_VRF` | TLB client/server VRF | `TRUST_VR` |
| `$TPROXY_VRF` | Forwarding instance holding the TLB VIP | `srx-tproxy-fi` |
| `$HC_INT` / `$IKE_HC_INT` | Loopback unit hosting the anycast/health-check IP | `lo0.1` |
| `$HC_SRC` | TLB health-check source IP on the SRX | `192.168.10.1` |
| `$TCP_PORT` | TCP health-check probe port (SRX web-management) | `8088` |

## Endpoints & identities

| Variable | What it is | Example |
|---|---|---|
| `$LOCAL_ID` / `$REMOTE_ID` | IKE local/remote hostname identity | `vsrx.juniper.net` |
| `$LOCAL_EP` / `$SRX_VIP` | Initiator local-address / responder anycast | `10.200.0.1` / `10.100.0.1` |
| `$INIT_ID` | Per-tunnel initiator hostname identity | `peer1.juniper.net` |
| `$MNHA_NODE_IP` / `$LOCAL_IP` / `$PEER_IP` | MNHA node loopback / local / peer IPs | `192.168.0.1` / `192.168.0.2` |

## Prefixes & traffic selectors

| Variable | What it is | Example |
|---|---|---|
| `$ARI_CLIENT_PFX` / `$CLIENT_PFX` | IPsec client (ARI) prefix | `172.80.0.0/16` |
| `$SERVER_PFX` | IPsec server-side prefix | `172.160.0.0/16` |
| `$IKE_SRC_PFX` | IKE source-endpoint prefix | `10.200.0.0/16` |
| `$MNHA_PFX` / `$MNHA_LO0` | MNHA loopback prefix / node /32 | `192.168.0.0/24` / `192.168.0.1` |
| `$TS_LOCAL` / `$TS_REMOTE` | Per-tunnel traffic-selector local/remote | `172.80.0.1/32` / `172.160.0.1/32` |

## Interfaces

| Variable | What it is | Example |
|---|---|---|
| `$AE` / `$UNI_AE` | Aggregated-ethernet bundle to the SRX / north GW | `ae1` / `ae10` |
| `$TRUST_IP` / `$UNTRUST_IP` / `$MNHA_IP` | Per-plane /30 point-to-point address | `10.1.1.1/30` |
| `$TRUST_VLAN_IP` / `$UNTRUST_VLAN_IP` | North-side AC per-VLAN address | `172.16.1.1/30` |
| `$ST_UNIT` | Secure tunnel unit bound to the IPsec VPN | `st0.1` |
| `$AMS` | MX aggregated-multiservices bundle (initiator) | `ams1` |
| `$MON_INT` | MNHA activeness BFD monitor interface | `ae1.0` |

## MNHA signalling

| Variable | What it is | Example |
|---|---|---|
| `$ACT_SIG` / `$BKP_SIG` | MNHA active / backup signal-route | `192.168.255.0` / `192.168.255.1` |
| `$PROBE_DEST` / `$PROBE_SRC` | SRG activeness-probe dest / src | `10.1.1.1` / `192.168.10.1` |
| `$MONITOR_SRC` | SRG BFD monitor source IP | `10.1.1.2` |
| `$PRIO` | SRG activeness-priority | `200` |

## Secrets (supply your own)

| Variable | What it is |
|---|---|
| `$IKE_PSK` | SRX responder / MX initiator IKE pre-shared key |
| `$L3HA_PSK` | MNHA HA-link-encryption pre-shared key |
| `$INIT_PSK` | Initiator IKE pre-shared key |
