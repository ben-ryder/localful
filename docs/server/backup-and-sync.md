# Backup and Sync

Vaults can be backed up to the cloud and synchronised between devices by using a Localful server.  

Vaults can exist in one of three states:
- Local device only
- Server only
- Synced between local device and server (and other devices)

There are three pieces of information which are used to determine what state a given vault is in:
- Presence on the server
- Presence on the local device
- If the "syncEnabled" flag is set on the local vault

The current state can then be derived like so:
- Present ONLY on the server = Server only
- Present ONLY on local device = Local only
- Present on local device AND "syncEnabled" = Sync with server, but initial sync hasn't happened yet
- Present on local device AND server AND "syncEnabled" = Sync to server
- Present on local device AND server, but NOT "syncEnabled" = Not a valid state

A vault can be transitioned between each state:
- Sync can be enabled for a local vault by setting "syncEnabled"
- A vault can be made local only by deleting the server vault AND unsetting "syncEnabled" (the vault will be deleted from all other devices)
- A server vault can be added to a device for syncing by crating the vault locally with "syncEnabled" set
- A vault can be removed from the local device (but keeping it on server) by just deleting the local vault
