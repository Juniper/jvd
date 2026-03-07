**5-Stage EVPN-VXLAN Data Center**

The 5-stage fabric data center design is an EVPN-VXLAN based validated design based on ERB network architecture. It consists of a
superspine connecting to Pods, the superspine only perform IP forwarding and relaying of routes just as the spines in the Pods do.
Hence the superspines and spines in 5-stage Fabric are called Lean superspines and lean spines.
The 5-stage fabric is adopted for large scale data center design especially where there is a requirement for large datastores and compute
nodes that need to connect to this storage. Therefore, this JVD validates key features such as RoCEv2, Multicast along with base
features for deploying the 5-stage fabric.

The configuration uploaded are validated configuration and the JVD provides more information on the features and details of the deployment.

https://www.juniper.net/documentation/us/en/software/jvd/jvd-dcfabric-5-stage/

![image](https://github.com/user-attachments/assets/b0e3dc72-7c4f-40aa-99d5-954abcb88e7d)
