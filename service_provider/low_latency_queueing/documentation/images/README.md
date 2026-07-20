# Figure catalog — Low Latency QoS Design for 5G

Figures extracted from the published JVD documentation for the **Low Latency QoS
Design for 5G** design (`jvd-5g-fh-cos-llq-02-04`). Referenced from
[`../solution-overview.md`](../solution-overview.md) and
[`../design-guide.md`](../design-guide.md). The published PDFs on juniper.net are
the source of truth.

| File | Figure | Shows | Used in |
|------|--------|-------|---------|
| [`5g-solution-architecture.png`](5g-solution-architecture.png) | Solution Overview Fig 1 | 5G validation topology — Fronthaul Access / Midhaul-Backhaul / Service Edge, AS 63535 / AS 63536. | solution-overview |
| [`cos-model-components.png`](cos-model-components.png) | Solution Overview Fig 2 / Design Guide Fig 25 | Eight-queue CoS model — Shaped Low Latency Queue (Q6), Shaped Priority Queues (Q7/Q3/Q5), Weighted Fair Queues (Q4/Q2/Q1/Q0). | solution-overview, design-guide |
| [`solution-architecture.png`](solution-architecture.png) | Design Guide Fig 14 | End-to-end service architecture — AN/AG/CR/SAG roles, IS-IS L1/L2 SR, BGP-LU, MP-BGP, EVPN-VPWS/FXC/ELAN, 4G/5G L3VPN, BGP-VPLS, L2Circuit, inter-AS Option B/C. | design-guide |
| [`multi-level-priority-llq-port-qos.png`](multi-level-priority-llq-port-qos.png) | Design Guide Fig 24 | Multi-level priority hierarchy with LLQ in Port QoS mode — VOQ → priority (P0–P4/WFQ) → EGQ1/EGQ2/EGQ3 mapping. | design-guide |

## Additional figures in the published PDFs (not extracted)

The published Design Guide and Test Report Brief contain further diagrams not
mirrored here — RAN deployment scenarios, TSN Profile A packet behavior, O-RAN
5QI grouping, single/multiple priority queue models, xHaul latency budget, lab
topology / test bed, per-platform DUT diagrams, VOQ structure, eCPRI common header
format, per-topology latency test diagrams, and packet-capture screenshots. See
the published PDFs on juniper.net for the complete figure set.
