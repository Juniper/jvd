# Data Center Interconnect over IPoDWDM — Configuration Snippets

Reusable, templated config fragments extracted from the sanitized JVD
configurations under [conf/](../conf/). Each snippet contains:

- A structured header (Topic, Variant, Seen on, Highlights, Pair with, Variables).
- `$VARIABLE` placeholders for tunable values; see [_variables.md](_variables.md)
  for the master glossary.

This JVD validates **Converged Optical Routing Architecture (CORA)** — Data
Center Interconnect over IPoDWDM using Juniper 400G Coherent Optics directly in
the router, with no external transponder. It spans **both operating systems**:
`dci1_ptx10001-36mr` and `dci3_acx7100-48l` run **Junos OS Evolved** (`evo/`);
`dci2_mx304` runs **Junos OS** (`junos/`).

This library focuses on the **IPoDWDM transport layer** — the coherent optics,
DWDM aggregated-ethernet core links, and chassis enablement. The routing/underlay
(BGP, MPLS/RSVP, VRF) used in the test bed is deployment-specific scaffolding and
is out of scope; the full device configs live under [conf/](../conf/).

## Layout

```
snips/
├── _variables.md
├── evo/                # Junos OS Evolved (PTX10001-36MR, ACX7100-48L)
│   ├── chassis/        # aggregated-devices
│   └── interfaces/     # coherent-optics-port, dwdm-ae-bundle, loopback
└── junos/              # Junos OS (MX304)
    ├── chassis/        # aggregated-devices, port-channelization
    └── interfaces/     # coherent-optics-port, dwdm-ae-bundle, loopback
```

## Snippet headers — `Seen on:` and `Pair with:`

- **Seen on** lists the exact source devices (per OS) each snippet was extracted
  from, so you can trace a fragment back to a validated config.
- **Pair with** lists the other snippets required for an end-to-end working
  function (e.g. a coherent port pairs with the DWDM AE bundle and the
  `aggregated-devices` chassis enablement).

## OS differences to note

- **LAG membership**: EVO coherent ports use `ether-options { 802.3ad … }`;
  Junos (MX) uses `gigether-options { 802.3ad … }`.
- **Channelization**: on MX the port rate/breakout is set under `chassis`
  (`fpc/pic/port` — `speed`, `number-of-sub-ports`). EVO DWDM ports are used
  natively at 400G; channelize the first sub-port (`et-x/y/z:0`) for
  optics-options when a port is broken out.
