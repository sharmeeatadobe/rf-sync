# rf-sync
POC to read session data from Rainfocus and perform the following tasks:
- Read session template from DA
- Create sessions page using the template from RF
    check if any new session is created for an event -> use the master template with placeholders -> publish to AEM publish instance
    if session is modified -> delete existing page -> use the master template with placeholders -> publish to AEM publish instance
    if session is deleted -> delete existing page
- Preview and publish to HLX


# Setup

1. npm i
2. create a .env file
```
#RF
API_PROFILE_ID=
SESSION_ID=

#DA
DA_TOKEN=

#HLX
HLX_TOKEN=
```
3. node app.js