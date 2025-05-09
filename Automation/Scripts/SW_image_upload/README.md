# Upload SW image

Use `Upload_Image_to_EOP` script to upload image which is more than 2.5 GB

Update below details before executing the script.

    URL = 'https://A.B.C.D/api/v1/devicesoftware/'
    USER = 'admin_user@juniper.net'
    PASSWORD = 'Passw0rd!'
    ORG_ID = '0d3146bb-6157-4356-9bbc-08f9dfeef81c'

    FILENAME = 'junos-evo-install-acx-f-x86-64-24.2R2.16-EVO.iso'
    DIRECTORY = '/volume/systest-proj/rkarthick/'


    upload(FILENAME, iso, sha, 'Juniper', 'ACX7100', '24.2R2.16-EVO', '24.2R2.16')
