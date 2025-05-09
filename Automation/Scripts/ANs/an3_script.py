#!/usr/bin/python3
import jnpr.junos as jnpr
from jnpr.junos.utils.config import Config
import ftplib
from lxml import etree
import re

def load_base_config(config_file):
    try:
        device = jnpr.Device()
        device.open()
        config = Config(device)
        output = device.rpc.get_config(options={'format':'set'},filter_xml='<configuration><interfaces/><protocols/></configuration>')
        new_output=etree.tostring(output, encoding='unicode')

        # SPLIT LINES
        lines = new_output.splitlines()
        # CROP 1ST AND LAST LINE FROM OUTPUT
        output= "\n".join(lines[1:-1])
        lines = output.splitlines()
        # GET INTERFACE NAME WHICH HAS DHCP IP ASSIGNED
        interface=''
        for line in lines:
            match = re.search(r"(et-\d/\d/\d).*(address)",line)
            if match:
                interface = match.group(1)

        # DELETE MATCH INTERFACE FROM ALL INTERFACE
        output = "\n".join(line for line in lines if f"{interface} unit" not in line)
        lines = output.splitlines()
        output = "\n".join(line for line in lines if "inet6" not in line)

        #DELETE unit 0 family inet
        output=output.replace("unit 0 family inet","")
        # REPLACE SET WITH DELETE
        output = output.replace("set", "delete")
        
        config.load(output,format='set',overwrite=False,merge=True)
        config.load(path=config_file,format='set',overwrite=False,merge=True,ignore_warning=True)
        config.commit(comment="Loaded Configs from server", timeout=300,ignore_warning=True)
        print(f"Configuration loaded successfully")
    except Exception as e:
        print(f"Error loading configuration :{e}")
    finally:
        device.close()
def copy_file_from_ftp(ftp_host, ftp_user, ftp_password, remote_file, local_file):
    try:
        # Connect to the FTP server
        with ftplib.FTP(ftp_host, ftp_user, ftp_password) as ftp:
            # Download the file
            with open(local_file, 'wb') as f:
                ftp.retrbinary('RETR ' + remote_file, f.write)
            print(f"File copied successfully: {remote_file} -> {local_file}")
    except Exception as e:
        print(f"Error copying file: {e}")

ftp_host = "7.1.1.2"
ftp_user = "ftp_user"
ftp_password = "Passw0rd!"
remote_file_base = "AN3_Onboarding.configs"
remote_file_jvd = "AN3.configs"
jvd_config_file = "/var/tmp/jvd.configs"
base_config_file = "/var/tmp/base.configs"


copy_file_from_ftp(ftp_host, ftp_user, ftp_password, remote_file_base, base_config_file)
copy_file_from_ftp(ftp_host, ftp_user, ftp_password, remote_file_jvd, jvd_config_file)
load_base_config(base_config_file)

