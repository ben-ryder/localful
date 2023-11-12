# Server Reference
A reference of all REST API endpoints and websockets provided by the app.

## Errors
Any errors will be returned with the appropriate status code and the following JSON data:

```js
{
  "statusCode": 404, // interger: representing the error status code.
  "message": "An error occured." // string: a message detailing the error.
}
```

## REST API Reference

### Base
- `/ [GET]`
- `/v1 [GET]`

### Info
- `/info [GET]`

### Users
- `/v1/users [POST]`
- `/v1/users/:id [GET, PATCH, DELETE]`

### Authentication
- `/v1/auth/login [POST]`
- `/v1/auth/refresh [POST]`
- `/v1/auth/logout [POST]`
- `/v1/auth/check [POST]`
- `/v1/auth/verify [GET, POST]`

### Resources
- `/v1/resources [POST]`
- `/v1/resources/:id [GET, PATCH, DELETE]`

### Changes
- `/v1/resources/:id/changes [GET, POST]`

## Websockets Reference
- `changes`
  - The client can send this event when the user makes changes.
  - The server will relay the event to other clients and persist them to the server.
  - Users can only subscribe to their own changes.
  - Users can also subscribe to specific resources rather than all their changes.
