# DEFAULTS — Data Center Interconnect over IPoDWDM

Lab auto-fill values for the Data Center Interconnect over IPoDWDM JVD. Every value is measured from the published device configurations under [`configuration/conf/`](../../conf/). Use them when the user picks auto-fill; otherwise ask. Variable meanings are in [`_variables.md`](../_variables.md).

## Device inventory

| Role | Device | Platform | OS | `$LOOPBACK_V4` / router-id | `$ASN` |
|------|--------|----------|----|----------------------------|--------|
| DCI Edge | dci1_ptx10001-36mr | PTX10001-36MR | EVO | 10.1.1.1 | 65000 |
| DCI Edge | dci2_mx304 | MX304 | Junos | 10.1.1.2 | 65000 |
| DCI Edge | dci3_acx7100-48l | ACX7100-48L | EVO | 11.1.1.3 | 65000 |

dci1 and dci2 address dci3 as 10.1.1.3 (iBGP neighbor, LSP target); dci3 uses 11.1.1.x for itself and its peers. Render each router as configured.

## DWDM core links

| Link | Bundle (`$IFD`), `$CORE_V4_ADDR` | Coherent members (`$IFD` → `$WAVELENGTH`) |
|------|----------------------------------|-------------------------------------------|
| dci1 ↔ dci2 | dci1 ae12 10.12.1.1/30; dci2 ae12 `10.12..1.2/30` (as published) | dci1 et-0/0/8 1547.12, et-0/0/10 1547.72, et-0/1/0 1548.31; dci2 et-0/0/6 1547.12, et-0/0/8 1547.72, et-0/0/14 1548.31 |
| dci1 ↔ dci3 | dci1 ae13 10.13.1.1/30; dci3 ae13 10.13.1.2/30 | dci1 et-0/1/2 1552.52, et-0/1/8 1550.12; dci3 et-0/0/50 1552.52, et-0/0/51 1550.12 |
| dci2 ↔ dci3 | dci2 ae23 10.23.1.1/30; dci3 ae23 10.23.1.2/30 | dci2 et-0/1/0 1552.52, et-0/1/6 1550.12; dci3 et-0/0/52 1552.52, et-0/0/53 1550.12 |

`$AE_DEVICE_COUNT` 10 on every router. Both ends of a link use the same wavelengths.

## iBGP and RSVP-TE

| Device | `$BGP_GROUP` | iBGP neighbors | LSPs (`$LSP_NAME_1…200`, `$LSP_TO_A` / `$LSP_TO_B`) |
|--------|--------------|----------------|------------------------------------------------------|
| dci1 | grp-iBGP | 10.1.1.2, 10.1.1.3 | lsp-r1-to-r2<n> to 10.1.1.2, lsp-r1-to-r3<n> to 10.1.1.3, n = 1–100 |
| dci2 | grp-iBGP | 10.1.1.1, 10.1.1.3 | lsp-r2-to-r1<n> to 10.1.1.1, lsp-r2-to-r3<n> to 10.1.1.3 |
| dci3 | grp-iBGP | 11.1.1.1, 11.1.1.2 | lsp-r3-to-r1<n> to 11.1.1.1, lsp-r3-to-r2<n> to 11.1.1.2 |

## VRF examples (first measured instance)

| Device | Customer port | Example values |
|--------|---------------|----------------|
| dci1 | et-0/0/4 | `L3VPN_DCI_RI_1`, `$AC_IFL` et-0/0/4.1, `$PE_LOCAL_V4` 10.10.1.1, `$CE_PEER_V4` 10.10.1.2, `$ASN_CUSTOMER` 65501, `$BGP_GROUP` ebgp-w-tgen, RD 10.1.1.1:1, `vrf-target` target:65000:1 |
| dci2 | et-0/0/2 | `L3VPN_DCI_RI_1`, `$AC_IFL` et-0/0/2.1, `$PE_LOCAL_V4` 10.20.1.1, `$CE_PEER_V4` 10.20.1.2, `$ASN_CUSTOMER` 65502, RD 10.1.1.2:1, `vrf-target` target:65000:1 |
| dci3 | et-0/0/48 (100G) | `L3VPN_DCI_RI_1`, `$AC_IFL` et-0/0/48.1, `$PE_LOCAL_V4` 10.30.1.1, `$CE_PEER_V4` 10.30.1.2, `$ASN_CUSTOMER` 65503, RD 11.1.1.3:1, `vrf-target` target:65000:1 |

## Numbering conventions (hold on all 300 measured VRFs)

| Value | Convention for VRF n |
|-------|----------------------|
| Instance name | `L3VPN_DCI_RI_<n>` |
| Unit and VLAN | `$UNIT` = `$VLAN` = n on the customer port |
| Addresses | `$PE_LOCAL_V4` = .1 and `$CE_PEER_V4` = .2 of the unit's /30 (10.10.n.0/30 on dci1, 10.20.n.0/30 on dci2, 10.30.n.0/30 on dci3) |
| RD and RT | `$RD_SUB_ASSIGNED` = `$RT_ID` = n; RD administrator = the router's loopback; `$RT_AS` = `$ASN` = 65000 |
| Local AS | `local-as` = `$ASN` |

For `N` VRFs, auto-fill increments n from the example's starting value and keeps the conventions above. Keep the DCI routers of a VRF consistent: same instance name and route target.
