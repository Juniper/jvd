**Data Center Interconnect JVD (DCI)**

The DCI JVD is  published at https://www.juniper.net/documentation/validated-designs/us/en/data-center/.
The DCI design is an EVPN-VXLAN based design that focuses on Interconnecting 3-stage, 5-stage and Collapsed data centers which is based
on Edge-Routed Bridging (ERB). The DCI design covers three interconnect designs:

**• Over-the-top (OTT):** 
In over-the-top interconnect design, VXLAN tunnels are formed across all leaf devices spanning the
two data centers. Because the number of tunnels can increase based on the VXLAN/VNIs and the tenants, this solution is
better suited for smaller data centers that are not prone to change.

**• Type 2 Seamless Stitching:** 
In contrast to the OTT design, only a subset of VLAN/VNIs are selectively stretched between
data centers in Type 2 Seamless stitching design. Due to this, VXLAN tunnels are not formed automatically each time a
new leaf switch is added (as is the case with OTT). This increases the scale performance and simplifies the configurations
needed to achieve the Layer 2 extensions.

**• Type 2 and Type 5 seamless stitching:** 
Lastly the Type 2 and Type 5 seamless stitching is merely an extension of the Type
2 seamless stitching where the layer 3 context is stretched across data centers.

The OTT design and the Type 2 seamless stitching design also included MACSEC encryption between Border leaf switch (gateways) so
as to encrypt the traffic between data centers.

The configs uploaded for all these three designs include the additional configuration and does not include root password, DNS, FTP etc. Hence this will need to be created depending on DC requirement.
