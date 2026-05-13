# Juniper Validated Designs (JVD)

Tested and documented blueprints that take HPE Juniper Networks solution architectures from design to deployment with confidence—from branch and campus to data center, security, enterprise WAN, and service provider networks.

> **Browse the JVD Portal:** <https://juniper.github.io/jvd/portal/>
>
> A searchable catalog of every JVD in this repository — filter by
> area, platform, and Junos version, jump straight to the matching
> reference design, snip library, or BYOAI config generator.

## Why JVD

### Qualify Solutions Faster

Juniper Validated Designs offer tested architectures for building networks with well-documented capabilities and product/software release guidance.

### Reduce Risk

Products, features, and topologies outlined in Juniper Validated Designs are based on best practices and common use cases.

### Achieve Predictable, Repeatable Results

Juniper Validated Designs have been validated at scale to help ensure faster, more reliable deployments.

Official documentation: <https://www.juniper.net/documentation/validated-designs/>

---

## Validated Designs for:

| Domain | Summary |
| --- | --- |
| **[Branch](https://www.juniper.net/documentation/validated-designs/us/en/branch/)** | Achieve simplified operations, reduced mean time to repair, and improved user experience with software-delivered branch network architectures. |
| **[Campus](https://www.juniper.net/documentation/validated-designs/us/en/campus/)** | Deliver reliable, secure, and agile campus networking solutions with common building blocks, automation workflows, and custom automation. |
| **[Data Center and AI Cluster](https://www.juniper.net/documentation/validated-designs/us/en/data-center/)** | Deploy and operate resilient data center networks for modern workloads, including validated ADC and AI-focused designs. |
| **[Security](https://www.juniper.net/documentation/validated-designs/us/en/security/)** | Operationalize security across the entire network with validated designs that help the network take an active role in its own defense. |
| **[Enterprise WAN](https://www.juniper.net/documentation/validated-designs/us/en/enterprise-wan/)** | Simplify management and operations through high-performance, reliable, and secure enterprise WAN architectures across locations, data centers, and cloud services. |
| **[Service Provider Core, Edge, Cloud Metro, and 5G](https://www.juniper.net/documentation/validated-designs/us/en/service-provider-edge/)** | Create automated, secure, and service-assured networking across physical, virtualized, and containerized telco cloud domains. |

---

## Repository Sections

Each section groups the JVDs for that domain. Every JVD folder follows
a common layout — a `README.md` with the hardware table and config
index, a `configuration/` tree (`conf/`, `set/`, and where relevant
`apstra/`), and — for JVDs with a snip library — a `snips/` tree
paired across Junos and Junos EVO.

| Section | What's inside |
| --- | --- |
| [Automation](automation/) | Shared automation scripts and reference configurations (ACX upgrade, AGS core, ANS, software image upload). |
| [Data Center](data_center/) | Automated Data Center (ADC) and AI Data Center (AIDC) validated designs. |
| [Enterprise WAN](enterprise_wan/) | Core/edge WAN designs, advanced core/edge, and the EWAN finance reference. |
| [Optical](optical/) | DCI-over-IPoDWDM and other optical-transport designs. |
| [Security](security/) | Scale-out firewall + NAT and scale-out IPsec designs. |
| [Service Provider](service_provider/) | Broadband Edge, Metro Ethernet Business Services, Metro-as-a-Service, SRv6 Core/Edge, Port Fan-Out, and Low-Latency Queueing. |
| [Portal](portal/) | Source for the JVD Portal web catalog. |

---

## Snip Libraries and BYOAI

Several JVDs ship a paired Junos / Junos EVO **snip library** —
templated, variable-driven config fragments with structured headers
(`Topic`, `Seen on`, `Pair with`, `Variables`) that can be assembled
into a complete device config.

- Browse the snips in the portal:
  <https://juniper.github.io/jvd/portal/#snips>
- Launch the **BYOAI** config generator (drives any modern AI against
  the snip library to produce a full, customer-specific config) from
  the portal: <https://juniper.github.io/jvd/portal/#byoai>

---

## Get help or report a problem

- **Open an issue** — use one of the templates so it routes correctly:
  - [Report a portal bug](https://github.com/Juniper/jvd/issues/new?template=portal-bug.yml)
  - [Report a JVD content issue](https://github.com/Juniper/jvd/issues/new?template=jvd-content.yml)
  - [Ask a question](https://github.com/Juniper/jvd/issues/new?template=question.yml)
- **See what's new** — read the [CHANGELOG](CHANGELOG.md) for the
  rolling list of additions across JVDs, snips, the portal, and BYOAI.


