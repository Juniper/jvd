import requests
from requests.auth import HTTPBasicAuth
import ssl
import urllib3
import time  # Import the time module for sleep functionality

# Disable SSL warnings (not recommended for production)
ssl._create_default_https_context = ssl._create_unverified_context
urllib3.disable_warnings()

def fetch_org_id(eop_ip, username, password):
    get_org_id_url = f"https://{eop_ip}/api/v1/self"
    response = requests.get(get_org_id_url, auth=HTTPBasicAuth(username, password), verify=False)
    if response.status_code != 200:
        raise Exception(f"Failed to fetch org ID. Status code: {response.status_code}\nError: {response.text}")
    
    data = response.json()
    for privilege in data.get('privileges', []):
        if 'org_id' in privilege:
            return privilege['org_id']
    
    raise Exception("Failed to find org_id in privileges.")

def fetch_inventory(eop_ip, username, password, org_id):
    get_inventory_url = f"https://{eop_ip}/api/v1/orgs/{org_id}/inventory"
    response = requests.get(get_inventory_url, auth=HTTPBasicAuth(username, password), verify=False)
    if response.status_code != 200:
        raise Exception(f"Failed to fetch inventory. Status code: {response.status_code}\nError: {response.text}")
    
    return response.json()

def find_device_by_name(devices, host_name):
    device = next((device for device in devices if device.get('name') == host_name), None)
    if not device:
        raise Exception(f"Device with name '{host_name}' not found in inventory.")
    return device

def upgrade_device(eop_ip, username, password, org_id, device_id, image_id):
    url = f"https://{eop_ip}/api/v1/devicesoftware/{org_id}/upgrade"
    headers = {'Content-Type': 'application/json'}
    body = [
        {
            "device_id": device_id,
            "image_id": image_id,
            "org_managed": "true"
        }
    ]
    
    response = requests.post(url, json=body, headers=headers, auth=HTTPBasicAuth(username, password), verify=False)
    if response.status_code != 200:
        raise Exception(f"Failed to send upgrade request for device ID {device_id}. Status code: {response.status_code}\nError: {response.text}")
    
    return response.json()

def main():
    eop_ip = "A.B.C.D"
    username = "admin_user@juniper.net"
    password = "Passw0rd!"
    image_name = "junos-evo-install-acx-f-x86-64-24.2R2.16-EVO.iso"
    host_names = "jvd-awan-acx7100-l,jvd-awan-acx7100-k,jvd-awan-acx7024-a"  # Comma-separated host names
    try:
        org_id = fetch_org_id(eop_ip, username, password)
        print(f"Org ID: {org_id}")
        image_id = f"{org_id}-{image_name}"
        print(f"Image ID: {image_id}")

        inventory = fetch_inventory(eop_ip, username, password, org_id)

        for host_name in host_names.split(','):
            host_name = host_name.strip()  # Remove any leading/trailing whitespace
            try:
                device = find_device_by_name(inventory, host_name)
                device_model = device.get('model', '')
                print(f"Processing host {host_name}: Model matches. Proceeding with upgrade.")
                print(f"ID of device {host_name}: {device['id']}")
                print(f"Model of device {host_name}: {device_model}")
                upgrade_response = upgrade_device(eop_ip, username, password, org_id, device['id'], image_id)
                print(f"Upgrade response for {host_name}: {upgrade_response}")

            except Exception as e:
                print(f"Error processing host {host_name}: {e}")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()
