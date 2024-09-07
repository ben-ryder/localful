# Socket.io Reference
The Localful Socket.io server is used to allow local devices to subscribe to changes.  
It is used as a read-only event emitter, meaning that clients use the HTTP API to make data updates and can then
subscribe to the socket server to receive updates when another client (or the server) makes data updates.

## Events

### User Events
User level events are related to the current user, examples include changes to account data such as email, password etc.  
When a client connects to a socket they will always receive user level events for the current user.

- `user-update`
- `user-password-change`
- `user-email-change`
- `user-delete`

### Vault Events
Vault events are for informing the client of changes to the current users vaults.

- `vault-create`
- `vault-update`
- `vault-delete`

### Data Events
Vault level events are the primary and most important event level and deal with the synchronisation of vault content.  
When a client connects to a socket it can subscribe to the vaults it wishes to receive events from.

- `item-create`
- `item-delete`
- `version-create`
- `version-delete`

## Subscription
When a client connects to the socket it will always receive user and vault events. 
In order to receive data events the client must subscribe to vaults, which is done by sending the `subscribe` event, an
example payload would look something like this:

```json
{
  "vaults": [
    "e4440c93-b2a5-4896-8742-82b55f765c9f",
    "90156e0f-f183-466d-97ae-1fff5f464293"
  ]
}
```

If the client wishes to change the vaults it is subscribed to, it can re-send the `subscribe` event.  
This event will overwrite any previous subscriptions, so if you were to subscribe to 3 vaults and then later subscribe to 1 extra vault,
unless you also include the first three vaults in your second `subscribe` event you will unsubscribe to the first three vaults.  

## Sessions
A client will make data updates via the HTTP API and can receive real-time updates via Websockets.  
In order to prevent the client being notified of its own HTTP API changes, the "group id" (`gid` claim) of the access token is used
to identify HTTP requests and socket connections coming from the same device.  
**It is therefore strongly recommended that you share the same authentication tokens between your websocket and HTTP API communications.**
