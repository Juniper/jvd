# Automation JVD

## Executive Summary

In the dynamic landscape of network engineering, the importance of leveraging validated designs and embracing key principles of network automation cannot be overstated. Failure to do so may result in missing out on the potential benefits that these strategies bring to the table. Consider a practical use case within a referenced network design, where streamlined deployment, monitoring, and management of devices, network infrastructure, and services all converge to increase operational efficiency.

This solution integrates a general access and aggregation use case network for the tier 2-3 operators with the capabilities of network automation and Paragon Automation (aka EoP or Epic on Prem) to demonstrate its capabilities in this context and enhance the final solution.

## Configurations

Here you can find all the configurations of the files being part of this Automation JVD.

### Access Nodes

- [Access Nodes Onboarding](./Configurations/ANs/Onboarding/)
- [Access Nodes Services](./Configurations/ANs/Services/)

### Aggregation Nodes

- [Aggregation Nodes](./Configurations/AGs/)

### Core Nodes

- [Core Nodes](./Configurations/Core/)

### SAG

- [SAG](./Configurations/SAG/)

## Scripts

Here there are the scripts being used in this Automation JVD.

[Scripts](./Scripts/)

## Considerations

For the sake of privacy, the following variables have been set as follows:

    URL = 'https://A.B.C.D/api/v1/devicesoftware/'
    USER = 'admin_user@juniper.net'
    PASSWORD = 'Passw0rd!'

- Replace everywhere it says "A.B.C.D" for your EOP cluster GUI IP.
- Replace everywhere it says "admin_user@juniper.net" as the user you configured as your admin in EOP.
- Replace everywhere it says "PASSWORD" or "Passw0rd!" for the password you set on your EOP installation steps.
