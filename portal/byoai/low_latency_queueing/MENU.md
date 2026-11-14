# Low Latency QoS Design for 5G BYOAI — Full Query Menu

The always-current catalog of generation asks for the Low Latency QoS Design for 5G JVD. Replace `N` with any count (e.g. `Generate 3 …`). Every service renders on the devices it is validated on, in the `minimum` form.

## Services — point-to-point (E-Line)

- `Generate N EVPN-VPWS point-to-point service on an1 and an3` — validated on an1, an3, an4, ag1_1 and ag1_2
- `Generate N EVPN-VPWS service with static flow labels (FAT pseudowire) on an4 and sag` — validated on an4 and sag
- `Generate N EVPN flexible cross-connect, VLAN-aware, two attachment circuits on an4 and ag1_1` — validated on an4, ag1_1, ag1_2 and sag
- `Generate N Layer 2 circuit (LDP pseudowire) with control word on an1 and an3` — validated on an1, an3, an4 and sag
- `Generate N Layer 2 circuit with control word and static flow labels (FAT pseudowire) on ag1_1 and ag1_2` — validated on ag1_1, ag1_2 and sag

## Services — multipoint (E-LAN)

- `Generate N EVPN-ELAN MAC-VRF, VLAN-based service on an4 and ag1_1` — validated on an4, ag1_1 and ag1_2
- `Generate N EVPN MAC-VRF, VLAN-based service, with an IRB interface on ag1_1 and ag1_2` — validated on ag1_1, ag1_2 and sag
- `Generate N BGP-signalled VPLS with flow labels (FAT pseudowire) on an1 and an3` — validated on an1, an3, an4, ag1_1, ag1_2 and sag

## Services — L3VPN

- `Generate N L3VPN VRF with an IRB interface on ag1_1 and ag1_2` — validated on ag1_1, ag1_2 and sag
- `Generate N L3VPN VRF with IPv4 and IPv6 eBGP to the CE on an1 and an3` — validated on an1, an3, an4, ag1_1, ag1_2 and sag

## Audit / explain

- `Which snippets are validated on an4?`
- `What does an EVPN-VPWS service need on sag?`
- `Explain the eight forwarding classes and the low-latency queue`
- `Explain how the access, aggregation and core IS-IS levels and BGP labeled unicast connect the two autonomous systems`
- `What does this library not cover?`

---

Don't see what you need? Describe it and the assistant will tell you whether the Low Latency QoS Design for 5G JVD covers it.
