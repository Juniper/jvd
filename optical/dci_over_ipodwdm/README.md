# DCI over IP-over-DWDM

> Data Center Interconnect leveraging IP-over-DWDM with coherent optics for cost-effective, high-capacity inter-site connectivity.

Data Center Interconnect (DCI) using IP-over-DWDM eliminates the traditional optical transport layer by running coherent DWDM optics directly in routers, reducing cost and complexity while delivering high-capacity, low-latency inter-site connectivity.

## Highlights

- IP-over-DWDM eliminates standalone optical transport equipment
- Coherent pluggable optics (ZR/ZR+) in router line cards
- Validated across PTX, MX, and ACX platforms
- Simplified operations — single management domain for IP + optical
- Scalable DCI for metro and long-haul distances

---

## Validated Hardware

| Juniper Product | Role | Config |
|---|---|---|
| **PTX10001-36MR** | DCI Router | [`dci1_ptx10001-36mr.conf`](configuration/conf/dci1_ptx10001-36mr.conf) |
| **MX304** | DCI Router | [`dci2_mx304.conf`](configuration/conf/dci2_mx304.conf) |
| **ACX7100-48L** | DCI Router | [`dci3_acx7100-48l.conf`](configuration/conf/dci3_acx7100-48l.conf) |

---

## Documentation

Design corpus (markdown, in this repo):

- [Datasheet](documentation/datasheet.md) — quick reference (platforms, optics, scale)
- [Design Guide](documentation/design-guide.md) — CORA architecture, test beds, config templates
- [Solution Overview](documentation/solution-overview.md) — executive summary
- [Test Report Brief](documentation/test-report-brief.md) — DUTs, OSNR / Rx-sensitivity results, scale

Published (juniper.net):

- **JVD Document:**  
  [DCI over IP-over-DWDM JVD](https://www.juniper.net/documentation/us/en/software/jvd/jvd-optics-base-01-01/index.html)

- **Solution Overview:**  
  [PDF Overview](https://www.juniper.net/documentation/us/en/software/jvd/solution-overview-optics-base-01-01.pdf)

- **Test Report Brief:**  
  [PDF Test Brief](https://www.juniper.net/documentation/us/en/software/jvd/test-report-brief-optics-base-01-01.pdf)

## Configuration snippets

Templated, validated config fragments for the IPoDWDM transport layer — coherent
400G optics, DWDM aggregated-ethernet core links, and chassis enablement — are in
[configuration/snips/](configuration/snips/) (see its
[README](configuration/snips/README.md) and
[_variables.md](configuration/snips/_variables.md)). A
[BYOAI](configuration/snips/byoai/) bundle turns any capable LLM into an
assistant for this JVD (config generation + design Q&A).
