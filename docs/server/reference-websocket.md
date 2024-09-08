# Websocket Reference
The Localful Websocket server allows devices to subscribe to real-time changes which are synced to the server from other devices.  
It is used as a read-only event emitter, meaning that devices use the HTTP API to sync data updates to the server and can then
subscribe via websockets to receive updates when other devices (or the server) makes data updates.  

## Authentication
You must be authenticated to use the websocket server. When a device establishes a connection it has
3 seconds to send the `authenticate` event which should contain an access token retrieved from `/v1/auth/login`, for example:

```json5
{
  event: "authenticate",
  token: "...",
}
```

If the server does not receive the `authenticate` event within 3 seconds the connection will be closed.

A device can sync data updates via the HTTP API and can receive real-time updates via the websocket connection.  
In order to prevent the client being notified of its own HTTP API changes, the "group id" (`gid` claim) of the access token is used
to relate HTTP requests and socket connections.  
**It is therefore strongly recommended that you always share the same authentication tokens between your websocket and HTTP API communications.**

TODO:
- should authenticate initial connection?
- should handle session renewal?
- should handle session expiry?

## Events

### User Events
User events are related to the current user, examples include changes to account data such as email, password etc.  
A device will always receive user events for the current user.

- `user-update`
- `user-password-change`
- `user-email-change`
- `user-delete`

### Vault Events
Vault events are for informing the device of changes to the current users vaults.

- `vault-create`
- `vault-update`
- `vault-delete`

### Data Events
Data events are for the synchronisation of vault content.  
A device can subscribe to the vaults it wishes to receive data events from.

- `item-create`
- `item-delete`
- `version-create`
- `version-delete`

### Data Event Subscription
In order to receive data events the device must subscribe to specific vaults, which is done by sending the `subscribe` event, an
example payload would look something like this:

```json
{
  "vaults": [
    "e4440c93-b2a5-4896-8742-82b55f765c9f",
    "90156e0f-f183-466d-97ae-1fff5f464293"
  ]
}
```

If the device wishes to change the vaults it's subscribed to, it can re-send the `subscribe` event.  
This event will overwrite any previous subscriptions, so if you were to subscribe to 3 vaults and then later subscribe to 1 extra vault,
unless you also include the first three vaults in your second `subscribe` event you will be unsubscribed from them.
