# Server Reference
An overview of the REST API provided by the Localful server.


## Errors
Any errors will be returned with the appropriate status code and the following JSON data:

```js
{
  "statusCode": 404, // a copy of the HTTP status code.
  "identifier": "RESOURCE_NOT_FOUND", // an itentiifer for the specific error.
  "message": "An error occured." // a message explaining the error.
}
```

## API Reference

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

### Vaults
- `/v1/vaults [GET, POST]`
- `/v1/vaults/:id [GET, PATCH, DELETE]`

#### Content
- `/v1/content [GET, POST]`
- `/v1/content/:id [GET, DELETE]`

#### Content Versions
- `/v1/versions [GET, POST]`
- `/v1/versions/:id [GET, DELETE]`
