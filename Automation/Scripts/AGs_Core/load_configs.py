import jnpr.junos as jnpr
from jnpr.junos.utils.config import Config
#from jnpr.junos.utils.ftp import FTP
import yaml

def load_configs_to_juniper(host, username, password, config_file):
    try:
        device = jnpr.Device(host=host, user=username, password=password)
        device.open()
        config = Config(device) 
        config.load(path=config_file,format='set',overwrite=False,merge=True)
        config.commit(comment="Loaded Configs from server", timeout=300)
        print(f"Configuration loaded successfully to {host}")
    except Exception as e:
        print(f"Error loading configuration to {host}: {e}")
    finally:
        device.close()

if __name__ == "__main__":

    data_file = open('routers_info.yaml', 'r')
    data = yaml.safe_load(data_file)

    for config in data['juniper_configs']:
        host = config['host']
        username = config['username']
        password = config['password']
        config_file = config['config_file']

        load_configs_to_juniper(host, username, password, config_file)

