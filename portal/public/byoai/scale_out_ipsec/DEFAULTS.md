# Auto-fill Defaults

This file is part of the [BYOAI](README.md) corpus. It gives the deterministic JVD lab-default value for every `$VAR`, so `auto` mode (and the `all defaults` / `use defaults` / `skip` short-circuits) can generate without an interview. Values are drawn from the validated configs in [`../../conf/`](../../conf/). Bundled into [`jvd-so-ipsec-snips.md`](jvd-so-ipsec-snips.md) by `regenerate-bundle.sh`.

## Device selection shortcuts

| Shortcut | Device(s) | Role |
|---|---|---|
| `MX-LB` | `mx1_mx304` | MX304 stateless load balancer (TLB) |
| `SRX` | `srx1a` (+ `srx1b` as the MNHA peer) | SRX4600 IPsec Security Gateway |
| `MX-INIT` | `ipsec_initiator_gateway_mx304` | MX304 AMS IPsec initiator (test source) |

The SRX farm is two MNHA pairs: `srx1a`+`srx1b`, `srx2a`+`srx2b`.

## Anycast endpoint & load balancer

| Variable | Default |
|---|---|
| `$TLB_VIP` / `$IKE_VIP` / `$SRX_VIP` | `10.100.0.1` (shared anycast IKE gateway) |
| `$REAL1` / `$REAL2` | `192.168.10.1` / `192.168.10.2` |
| `$LB_VRF` | `TRUST_VR` |
| `$TPROXY_VRF` | `srx-tproxy-fi` |
| `$HC_INT` / `$IKE_HC_INT` | `lo0.1` |
| `$HC_SRC` | `192.168.10.1` (SRX health-check IP); `192.168.10.251/32` (MX health-check source) |
| `$TCP_PORT` | `8088` |

## Autonomous systems

| Variable | Default |
|---|---|
| `$MX_AS` | `10000` |
| `$TRUST_AS` / `$UNTRUST_AS` / `$MNHA_AS` (MX side) | `65200` / `65400` / `65050` |
| `$SRX_AS` | `65000` (shared across the SRX farm) |
| `$MNHA_AS` (SRX MNHA-VR) | `65001` (pair 1) / `65002` (pair 2) |
| `$GW_TRUST_AS` / `$GW_UNTRUST_AS` | `65100` / `65300` |
| `$MX_TRUST_AS` / `$MX_UNTRUST_AS` / `$MX_MNHA_AS` (SRX view) | `65200` / `65400` / `65050` |

## Per-plane addressing (per SRX/MNHA node, /30 point-to-point)

| Plane | VLAN | MX side | SRX side |
|---|---|---|---|
| TRUST (unit .0) | 1 | `10.1.1.1/30` | `10.1.1.2/30` |
| UNTRUST (unit .1) | 2 | `10.2.1.1/30` | `10.2.1.2/30` |
| MNHA-ICL (unit .100) | 100 | `10.3.1.1/30` | `10.3.1.2/30` |

North-side AC (MX ae10): TRUST VLAN 40 = `172.16.1.1/30`, UNTRUST VLAN 80 = `172.16.2.1/30`.

## Prefixes

| Variable | Default |
|---|---|
| `$ARI_CLIENT_PFX` / `$CLIENT_PFX` | `172.80.0.0/16` |
| `$SERVER_PFX` | `172.160.0.0/16` |
| `$IKE_SRC_PFX` | `10.200.0.0/16` |
| `$MNHA_PFX` | `192.168.0.0/24` |

## SRX identity / MNHA

| Variable | Default |
|---|---|
| `$MNHA_NODE_IP` / `$LOCAL_IP` | `192.168.0.1` (srx*a); `192.168.0.2` (srx*b) |
| `$PEER_IP` | `192.168.0.2` (peer of srx*a) |
| `$ACT_SIG` / `$BKP_SIG` | `192.168.255.0` / `192.168.255.1` |
| `$PROBE_DEST` / `$PROBE_SRC` | `10.1.1.1` / `192.168.10.1` |
| `$MONITOR_SRC` / `$MON_INT` | `10.1.1.2` / `ae1.0` |
| `$PRIO` | `200` |
| `$LOCAL_ID` / `$REMOTE_ID` | `vsrx.juniper.net` |

## IKE / IPsec

| Variable | Default |
|---|---|
| Encryption | ESP **AES-256-GCM**, lifetime 3600 s, anti-replay-window 512 |
| IKE | v2-only, PSK, DPD probe-idle-tunnel (interval 10, threshold 3); auto-VPN group-ike-id (responder) |
| `$ST_UNIT` | `st0.1` |
| Interfaces | `$AE` = `ae1` (to SRX), `$UNI_AE` = `ae10` (north AC), `$AMS` = `ams1` (initiator) |

## Initiator (MX-INIT)

| Variable | Default |
|---|---|
| `$LOCAL_EP` | `10.200.0.1` (per-tunnel: `.1`, `.2`, … on lo0.0) |
| `$INIT_ID` | `peer1.juniper.net` (per-tunnel: peer1…peerN) |
| `$TS_LOCAL` / `$TS_REMOTE` | `172.80.0.1/32` / `172.160.0.1/32` (per-tunnel /32 pair) |

## Secrets (NEVER auto-filled with a real value)

`$IKE_PSK`, `$L3HA_PSK`, `$INIT_PSK` — emit a clearly-placeholder value (e.g. `"<set-your-psk>"`) and flag in Notes that the user must supply a real encrypted key.
