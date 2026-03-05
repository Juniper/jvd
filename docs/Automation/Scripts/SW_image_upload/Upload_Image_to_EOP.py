import base64
import hashlib
import json
import requests

URL = 'https://A.B.C.D/api/v1/devicesoftware/'
USER = 'admin_user@juniper.net'
PASSWORD = 'Passw0rd!'
ORG_ID = '0d3146bb-6157-4356-9bbc-08f9dfeef81c'

MIN_SIZE = 5 * 1024 * 1024
FILENAME = 'junos-evo-install-acx-f-x86-64-24.2R2.16-EVO.iso'
DIRECTORY = '/volume/systest-proj/rkarthick/'


def file_sha(contents):
    h = hashlib.sha256()
    data = contents.read(MIN_SIZE)
    while data:
        h.update(data)
        data = contents.read(MIN_SIZE)
    return h.hexdigest()


def print_sw_images():
    response = requests.get(URL + ORG_ID + '/images', auth=(USER, PASSWORD), verify=False)
    images = decode(response)
    print('There are %d images' % len(images))
    for img in images:
        print(img.get('name'))


def decode(response):
    if response.status_code != 200:
        print(response.status_code)
        print(response.text)
        exit(1)
    return json.loads(response.text)


def upload(file_name: str, data, file_sha256: str, vendor: str, series: str, release: str, version: str):
    headers = {'Content-Type': 'application/json'}
    url = URL + ORG_ID + '/upload'

    response = requests.post(url, auth=(USER, PASSWORD), headers=headers, verify=False, json={
        'name': file_name,
        'expected_sha256': file_sha256,
        'device_vendor': vendor,
        'device_series_list': [series],
        'release': release,
        'version': version,
    })
    r = decode(response)
    upload_id = r.get('id')
    print('Uploading %s' % upload_id)
    url = url + '/' + upload_id

    file_slice = read_min(data)
    while file_slice:
        encoded = base64.b64encode(file_slice).decode('utf-8')
        response = requests.put(url, auth=(USER, PASSWORD), headers=headers, verify=False, json={
            'file_data': 'data:application/octet-stream;base64,' + encoded
        })
        msg = decode(response)
        print(msg)
        file_slice = read_min(data)

    response = requests.put(url, auth=(USER, PASSWORD), headers=headers, verify=False, json={
        "complete": True
    })
    msg = decode(response)
    print(msg)


def read_min(file):
    ret = b''
    while len(ret) < MIN_SIZE:
        file_slice = file.read(MIN_SIZE)
        ret = ret + file_slice
        if not file_slice:
            break
    return ret


if __name__ == '__main__':
    print_sw_images()

    with open(DIRECTORY + FILENAME, 'rb') as iso:
        sha = file_sha(iso)
        print("sha is",sha)

    with open(DIRECTORY + FILENAME, 'rb') as iso:
        upload(FILENAME, iso, sha, 'Juniper', 'ACX7100', '24.2R2.16-EVO', '24.2R2.16')

    print_sw_images()
