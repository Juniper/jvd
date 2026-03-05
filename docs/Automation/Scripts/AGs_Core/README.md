# AGs and Core nodes script

Since only access nodes (AN) are onboarded automatically in this JVD. Any aggregation node or core node is onboarded manually (CLI) at EOP. However, the configuration is being provisioned in an automated way with a pyEZ script (`load_configs.py`).

This script is to load the final configurations of all Aggregation nodes, Core nodes and Services Aggregation Gateway in an automated way.

The paths of the configurations should be updated on the script. For example in below configuration file:

```
juniper_configs:
  - host: 10.216.160.205 #jvd-awan-acx7509-d (AG1.1) 
    username: regress
    password: MaRtInI
    config_file: /home/regress/junos-pyez/device_configs/AG1_1.configs
  - host: 10.216.161.76 # jvd-awan-acx7100-j (AG1.2)
    username: regress
    password: MaRtInI
    config_file: /home/regress/junos-pyez/device_configs/AG1_2.configs
  - host: 10.216.160.254 # jvd-awan-mx204-h (AG2.1)
    username: regress
    password: MaRtInI
    config_file: /home/regress/junos-pyez/device_configs/AG2_1.configs
  - host: 10.216.160.245 # jvd-awan-mx204-g (AG2.2)
    username: regress
    password: MaRtInI
    config_file: /home/regress/junos-pyez/device_configs/AG2_2.configs
  - host: 10.216.164.52 # Jvd-awan-mx480-h (AG3.1)
    username: regress
    password: MaRtInI
    config_file: /home/regress/junos-pyez/device_configs/AG3_1.configs
  - host: 10.216.164.68 # jvd-awan-mx204-i (AG3.2)
    username: regress
    password: MaRtInI
    config_file: /home/regress/junos-pyez/device_configs/AG3_2.configs
  - host: 10.216.161.62 # jvd-awan-ptx10k1-f (CR1)
    username: regress
    password: MaRtInI
    config_file: /home/regress/junos-pyez/device_configs/CR1.configs
  - host: 10.216.161.29 # jvd-awan-ptx10k1-e (CR2)
    username: regress
    password: MaRtInI
    config_file: /home/regress/junos-pyez/device_configs/CR2.configs
  - host: 10.216.164.231 # jvd-awan-mx304-d (SAG)
    username: regress
    password: MaRtInI
    config_file: /home/regress/junos-pyez/device_configs/SAG.configs
  - host: 10.216.165.34 # jvd-awan-qfx5210-c (CU_DU)
    username: regress
    password: MaRtInI
    config_file: /home/regress/junos-pyez/device_configs/CU_DU.configs
```

the configuration of `/home/regress/junos-pyez/device_configs/AG1_1.configs` corresponds to [AG1_1.configs](../../Configurations/AGs/AG1_1.configs) which is located at the `Automation/Configurations/AGs/AG1_1.configs`

The script requires pyEZ to be able to run it: 

    python3 load_configs.py
