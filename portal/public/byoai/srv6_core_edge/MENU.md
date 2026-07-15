# SRv6 Core Edge BYOAI — Full Query Menu

The always-current catalog of generation asks for the SRv6 Core Edge JVD. Replace `N` with any count (e.g. `Generate 3 …`). All services render on the chosen device(s) with the chosen form tier (`minimum` / `with-overlay` / `as-deployed`).

## Services — L3VPN over SRv6

- `Generate N L3VPN-SRv6 VRFs with PE-CE eBGP` — µDT46 dual-stack, direct L3 attachment (Junos + EVO)
- `Generate N L3VPN-SRv6 VRFs with IRB attachment` — PE-CE via bridge-domain + IRB gateway
- `Generate N L3VPN-SRv6 VRFs on a delay-optimized locator` — service steered onto SL-FA-128 (delay Flex-Algo)

## Services — EVPN over SRv6 (Junos only)

- `Generate N EVPN-VPWS-SRv6 pseudowires` — all-active or single-active multihoming, RFC 9747
- `Generate N L3VPN EVPN Type-5 (silent-host) services` — PE originates Type-5; CE uses static default
- `Generate N CPE virtual-router instances` — lightweight CE-side counterpart (no RD/RT)

## Transport / underlay

- `Generate the SRv6 IS-IS + Flex-Algo underlay for <device>` — locators SL-FA-000/128/129, TI-LFA
- `Generate the iBGP SRv6 overlay to the route reflectors`
- `Generate the RR-side iBGP overlay for cr1/cr2`
- `Generate transport classes for color-based steering` — TC ↔ Flex-Algo binding
- `Generate inter-AS Option C between border routers` — multi-domain SRv6 (eBGP + locator summarization)

## Add a feature to a device

- `Add TWAMP-Light delay measurement to <device>`
- `Add BFD defaults to <device>`
- `Add SRv6 redistribution / per-packet load-balance policy to <device>`

## Greenfield / turn-up

- `Build a new MX480 SRv6 PE turn-up end-to-end`
- `Bootstrap an SRv6 edge with one L3VPN service`

## Audit / explain

- `Which services are EVO-capable vs Junos-only?`
- `Explain the SRv6 locator + Flex-Algo model (SL-FA-000/128/129)`
- `Explain color-based service steering with transport classes`
- `Explain the EVPN Type-5 silent-host model`
- `Explain inter-AS Option C for multi-domain SRv6`

---

Don't see what you need? Describe it and the assistant will tell you whether the SRv6 Core Edge JVD covers it.
