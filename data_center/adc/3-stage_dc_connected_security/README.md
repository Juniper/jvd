**3-stage EVPN-VXLAN Data Center Design**

This JVD is an extension to the 3-Stage Data Center Design with Juniper Apstra (JVD)
The Juniper Secure Data Center Fabric solution provides a streamlined, highly available secured data center architecture by integrating SRX4600/SRX4700 devices into a Multinode High Availability (MNHA) cluster within the data center fabric. The firewall device’s ability to participate in EVPN signaling allows the SRX devices to learn all the Type 5 routes from the fabric simply by peering with spines. This helps network and firewall administrators to take care of their job independently and at their own pace. The typical use cases covered in this solution include: 

**Inter-VRF Traffic:** The SRX4600 is configured with all the Virtual Routing and Forwarding (VRF) instances. Inter-VRF traffic is forwarded to the SRX device by leaf (via spine), the SRX device applies appropriate security policies on the inner VXLAN packet header. Based on the security policies, SRX device then routes the traffic toward its intended destination while preserving VXLAN encapsulation across the fabric—without terminating the VXLAN tunnel on the firewall. This design eliminates the need for ACL configurations on the fabric switches. 

**North-South:** The SRX device inspects every north‑south flow using both basic and advanced security policies. Traffic exiting the fabric is steered to the SRX based on the default route injected by the SRX device into the EVPN‑VXLAN fabric, ensuring consistent and deterministic forwarding for perimeter‑bound traffic. 
The configurations uploaded here are validated configurations.




