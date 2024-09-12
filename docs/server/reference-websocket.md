# Websocket Reference
The Localful sync Websocket server allows devices to subscribe to real-time changes made by other devices (and the server).  
It is used as a read-only event emitter, meaning that devices can only use the websocket to receive updates when changes occurs but
the HTTP API is used to actually make those updates.

## Authentication

### Establishing a connection
You must request a connection ticket from `/v1/sync/ticket [GET]` in order to access the websocket.  
This endpoint is only available to authenticated users and will return the following JSON data:
```json5
{
  ticket: "<your ticket here>"
}
```

This ticket is valid for 10 seconds and **can be used once** to establish a websocket connection to `/v1/sync`.  
It should be passed within the `Sec-WebSocket-Protocol` header in the format `localful.ticket.<your-ticket-here` when making the Websocket connection,
for example `Sec-WebSocket-Protocol: localful.ticket.<your-ticket-here>`.  
Here is an example of this in Javascript:

```js
const ws = new WebSocket("ws://localhost:42102/v1/sync", ["localful.ticket.<your-ticket-here>"])
```

During the upgrade to websockets the server will ensure you have a valid ticket and that the `Origin` header
of your request matches an allowed origin.

### Connection renewal and expiry
The connection ticket allows the websocket connection to be opened, but you are still required to re-authenticate at regular
intervals just like you are with the HTTP API.  
The server may send a `reauthenticate` event at any time and then the device has 10 seconds to send an `authenticate` event
back with its access token (previously obtained from `/v1/auth/login [POST]` or `/v1/auth/refresh [POST]`), for example:

**Server reauthenticate event:**
```json5
{
  type: "reauthenticate",
}
```

**Device authenticate event:**
```json5
{
  type: "authenticate",
  data: {
    accessToken: "<token here>"
  }
}
```

If the server does not receive the `authenticate` event within 10 seconds the connection will be closed.

### Joint HTTP and Websocket "session"

A device can make data updates via the HTTP API and can receive real-time updates via the websocket connection.  
In order to prevent the client being notified of its own HTTP API changes, the "session id" (`sid` claim) of the access token is used
to relate HTTP requests and socket connections.  
**It is therefore strongly recommended that you always share the same authentication tokens between your websocket and HTTP API communications.**

There can only be one active websocket connection per session, meaning that if you open a connection then request another 
connection ticket with the same access token your request will be denied.

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
A device will always receive these vault events.

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

#### Event Subscription
In order to receive data events the device must subscribe to specific vaults, which is done by sending the `subscribe` event, for example:

```json
{
  "type": "subscribe",
  "data": {
    "vaults": [
      "e4440c93-b2a5-4896-8742-82b55f765c9f",
      "90156e0f-f183-466d-97ae-1fff5f464293"
    ]
  }
}
```

If the device wishes to change the vaults it's subscribed to, it can re-send the `subscribe` event.  
This event will overwrite any previous subscriptions, so if you were to subscribe to 3 vaults and then later subscribe to 1 extra vault,
unless you also include the first three vaults in your second `subscribe` event you will be unsubscribed from them.

## Sending other events
If the device sends an event to the server which is not `subscribe` or `authenticate`, the server will close the connection.
