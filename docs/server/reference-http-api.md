# HTTP API Reference
An overview of the HTTP API provided by the Localful server.

## Errors
Any errors will be returned with the appropriate status code and the following JSON data:

```json
{
  "statusCode": 404, // a copy of the HTTP status code.
  "identifier": "RESOURCE_NOT_FOUND", // an identifier for the specific error.
  "message": "An error occurred.", // a message explaining the error.
  "context": null // an optional property of any type which may contain extra information about why the error occured.
}
```

## API Reference

### Base
- `/ [GET]`
- `/v1 [GET]`

### Info
- `/info [GET]`

### Users
- `/v1/users [POST, GET]`
- `/v1/users/:id [GET, PATCH, DELETE]`

### Authentication
- `/v1/auth/login [POST]`
- `/v1/auth/refresh [POST]`
- `/v1/auth/logout [POST]`
- `/v1/auth/verify [GET, POST]`

### Databases
- `/v1/databases [GET, POST]`
- `/v1/databases/:id [GET, PATCH, DELETE]`

### Entities
- `/v1/entities [GET, POST]`
- `/v1/entities/:id [GET, DELETE]`

### Entity Versions
- `/v1/versions [GET, POST]`
- `/v1/versions/:id [GET, DELETE]`
