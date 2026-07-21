# Snip variable glossary

This file documents every `$VARIABLE` used in the templated snips under
`evo/`. Variables are alphabetical; the **Used in** column lists which
snip categories reference each one.

| Variable | Meaning | Typical example | Used in |
|---|---|---|---|
| `$EDGE_PORT` | Access port marked as an RSTP edge port on a leaf | `et-0/0/0:0` | oam/ |
| `$GRPC_CERT_PEM` | PEM-encoded TLS cert/key for the gRPC listener (masked SECRET-DATA) | *(redacted)* | bootstrap/ |
| `$GRPC_PORT` | TCP port for the gRPC extension-service SSL listener | `32769` (leaf), `32767` (spine) | bootstrap/ |
| `$GW_V4` | Frontend cluster VLAN IRB gateway IPv4 (full prefix) | `10.10.5.254/24` | interfaces/ |
| `$HOSTNAME` | Device hostname | `leaf3` | bootstrap/ |
| `$IRB_UNIT` | IRB logical unit number for the frontend cluster VLAN | `5` | interfaces/, services/ |
| `$LO0_V4` | Loopback IPv4 (router-id / underlay anchor, full prefix) | `10.0.4.4/32` (leaf), `10.0.3.0/32` (spine) | interfaces/ |
| `$LOCAL_AS` | Per-device BGP autonomous system number | `4201032406` (leaf), `4201032300` (spine) | transport/ |
| `$LOCAL_TIER_TAG` | Community high-order tag identifying the device's tier | `5` (leaf), `1` (spine) | policy/ |
| `$LOCAL_V4` | Local /31 v4 on a spine fabric interface (full prefix) | `10.0.5.0/31` | interfaces/, transport/ |
| `$LOCAL_V4_A` | First /31 v4 on a leaf fabric breakout sub-port | `10.0.5.33/31` | interfaces/ |
| `$LOCAL_V4_B` | Second /31 v4 on a leaf fabric breakout sub-port | `10.0.5.35/31` | interfaces/ |
| `$NATIVE_VLAN` | Native VLAN ID on a server/client access trunk | `5` | interfaces/ |
| `$PEER_AS` | Remote eBGP peer autonomous system number | `4201032300` (leaf->spine), `4201032400` (spine->leaf) | transport/ |
| `$PEER_DESC` | Attached-endpoint description on an access port | `to.mi300-01` | interfaces/ |
| `$PEER_HOST` | Remote device shortname (used in interface description) | `frontend-spine-1` | interfaces/ |
| `$PEER_NAME` | Remote device shortname (used in BGP neighbor description) | `frontend-spine-1`, `frontend-leaf1` | transport/ |
| `$PEER_PORT` | Remote interface name on a spine direct link (description) | `et-0/0/0` | interfaces/ |
| `$PEER_PORT_A` | Remote interface name for first leaf sub-port (description) | `et-0/0/4` | interfaces/ |
| `$PEER_PORT_B` | Remote interface name for second leaf sub-port (description) | `et-0/0/5` | interfaces/ |
| `$PEER_V4` | Remote /31 v4 (eBGP fabric underlay neighbor) | `10.0.5.32` | transport/ |
| `$PHY_PORT` | Parent physical port (breakout parent, access port, or spine link) | `et-0/0/24`, `et-0/0/0` | interfaces/ |
| `$ROUTER_ID` | Device router-id (matches lo0.0 v4 address) | `10.0.4.4` | transport/ |
| `$VLAN_DESC` | Frontend cluster VLAN description | `FrontEnd-Cluster-VN5` | services/ |
| `$VLAN_ID` | Frontend cluster VLAN ID | `5` | services/ |
| `$VLAN_NAME` | Frontend cluster VLAN name | `vn5` | interfaces/, services/ |
