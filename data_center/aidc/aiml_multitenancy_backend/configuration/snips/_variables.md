# Snip variable glossary

This file documents every `$VARIABLE` used in the templated snips under
`junos/`. Variables are alphabetical; the **Used in** column lists which
snip categories reference each one.

| Variable | Meaning | Typical example | Used in |
|---|---|---|---|
| `$AC_INTF` | Attachment-circuit (GPU-server-facing) sub-port | `et-0/0/12:0` | interfaces/, transport/ |
| `$AC_INTF_A` | First AC sub-port bound to a tenant VRF | `et-0/0/12:0` | services/ |
| `$AC_INTF_B` | Second AC sub-port bound to the same tenant VRF | `et-0/0/16:0` | services/ |
| `$ANYCAST_MAC` | Shared virtual MAC for IRB anycast gateway (same across all leafs) | `00:1c:73:00:00:01` | interfaces/ |
| `$GPU_HOST` | GPU server hostname carried in the AC interface description | `H100-01` | interfaces/ |
| `$GRPC_CERT_PEM` | PEM-encoded TLS cert/key for the gRPC listener (masked SECRET-DATA) | *(redacted)* | bootstrap/ |
| `$GRPC_PORT` | TCP port for the gRPC extension-service SSL listener | `32767` | bootstrap/ |
| `$HOSTNAME` | Device hostname | `GPU-R1-L1` | bootstrap/ |
| `$IRB_UNIT` | IRB logical unit number for a tenant subnet | `2` | interfaces/ |
| `$LO0_V4` | Primary loopback IPv4 (router-id + EVPN overlay local-address) | `10.0.1.9/32` (leaf), `10.0.0.8/32` (spine) | interfaces/, services/ |
| `$LO0_V6` | Primary loopback IPv6 | `fdf6:ed70:1fac:f2d2::1007/128` | interfaces/ |
| `$LOCAL_AS` | Per-device BGP autonomous system number | `208` (leaf), `108` (spine) | transport/ |
| `$LOCAL_LO_V4` | Local loopback v4 used as eBGP-EVPN local-address | `10.0.1.9` | transport/ |
| `$LOCAL_TIER_TAG` | Community high-order tag identifying the device's tier | `5` (leaf), `1` (spine) | policy/ |
| `$LOCAL_V4` | Local /31 v4 on a fabric or AC interface (full prefix) | `10.0.2.131/31` | interfaces/, transport/ |
| `$LOCAL_V4_A` | First /31 v4 on a fabric breakout sub-port | `10.0.2.177/31` | interfaces/ |
| `$LOCAL_V4_B` | Second /31 v4 on a fabric breakout sub-port | `10.0.2.131/31` | interfaces/ |
| `$LO_UNIT` | Per-tenant lo0 unit number bound to a VRF | `2` | services/ |
| `$PEER_AS` | Remote eBGP peer autonomous system number | `108` (leaf->spine), `208` (spine->leaf) | transport/ |
| `$PEER_HOST` | Remote device shortname (used in interface description) | `spine1` | interfaces/ |
| `$PEER_LO_V4` | Remote loopback v4 (eBGP-EVPN overlay neighbor) | `10.0.0.8` | transport/ |
| `$PEER_NAME` | Remote device shortname (used in BGP neighbor description) | `spine1`, `gpu-r1-l1` | transport/ |
| `$PEER_PORT_A` | Remote interface name for first sub-port (description) | `et-0/0/0:0` | interfaces/ |
| `$PEER_PORT_B` | Remote interface name for second sub-port (description) | `et-0/0/0:1` | interfaces/ |
| `$PEER_V4` | Remote /31 v4 (eBGP fabric underlay neighbor) | `10.0.2.130` | transport/ |
| `$PHY_PORT` | Parent physical port for breakout config | `et-0/0/0` | interfaces/ |
| `$ROUTER_ID` | Device router-id (matches lo0.0 v4 address) | `10.0.1.9` | transport/ |
| `$TENANT_COMMUNITY_V4` | Per-tenant IPv4 BGP community name | `TENANT-1_COMMUNITY_V4` | policy/ |
| `$TENANT_COMMUNITY_V6` | Per-tenant IPv6 BGP community name | `TENANT-1_COMMUNITY_V6` | policy/ |
| `$TENANT_EXPORT_POLICY` | Per-tenant EVPN ip-prefix-routes export policy name | `BGP-AOS-Policy-tenant-1` | services/ |
| `$TENANT_GW_V4` | Tenant subnet's gateway IPv4 address (anycast on IRB) | `10.200.0.1/24` | interfaces/ |
| `$TENANT_LO_V4` | Per-tenant lo0 IPv4 (router-id anchor for the VRF) | `192.168.11.4/32` | interfaces/ |
| `$TENANT_LO_V6` | Per-tenant lo0 IPv6 | `fdf6:ed70:1fac:f2d2::1010/128` | interfaces/ |
| `$TENANT_NAME` | Tenant VRF / routing-instance name | `tenant-1` | interfaces/, services/ |
| `$TENANT_TAG` | Tenant tag suffix used in per-tenant policy names | `tenant-1`, `non-tenant` | policy/ |
| `$TENANT_UNIT` | lo0 unit number for a tenant VRF | `2` | interfaces/ |
| `$VNI` | VXLAN network identifier for the tenant's EVPN type-5 routes | `20001` | services/ |

## Notes on the variable design

- **Tenant-axis variables** (`$TENANT_*`) all share the same suffix
  convention (`tenant-1` … `tenant-N` plus `non-tenant`). When generating
  configs from these snips for a new tenant, increment the suffix and
  pick a fresh `$VNI` / `$LO_UNIT` / `$IRB_UNIT` triplet.
- **Role-axis variables** (`$LOCAL_AS`, `$LOCAL_TIER_TAG`,
  `$ROUTER_ID`) determine whether a device is a leaf or spine. The
  combined snips (`bgp-ebgp-fabric-underlay`, `bgp-ebgp-evpn-overlay`,
  `routing-options-ecmp-frr`, `clos-loop-prevention`,
  `allpodnetworks-direct-redistribution`, `community-definitions`)
  carry both LEAF and SPINE variants — pick one variant per role.
- **Link-axis variables** (`$LOCAL_V4*`, `$PEER_V4`, `$PEER_LO_V4`,
  `$PEER_AS`, `$PEER_NAME`) repeat once per fabric link; the snips show
  a single neighbor block that should be cloned per link.
