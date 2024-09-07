# HTTP API Reference
An overview of the HTTP API provided by the Localful server.

## Errors
Any errors will be returned with the appropriate status code and the following JSON data:

```json5
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

### Server Info
- `/info [GET]`

### Users
- `/v1/users [POST, GET]`
- `/v1/users/:userId [GET, PATCH, DELETE]`

### Authentication
- `/v1/auth/login [POST]`
- `/v1/auth/refresh [POST]`
- `/v1/auth/logout [POST]`
- `/v1/auth/verify-email [GET, POST]`
- `/v1/auth/change-email [GET, POST]`
- `/v1/auth/reset-password [GET, POST]`

### Vaults
- `/v1/vaults [GET, POST]`
- `/v1/vaults/:vaultId [GET, PATCH, DELETE]`
- `/v1/vaults/:vaultId/summary [GET]`

### Items
- `/v1/items [GET, POST]`
- `/v1/items/:itemId [GET, DELETE]`

### Item Versions
- `/v1/versions [GET, POST]`
- `/v1/versions/:versionId [GET, DELETE]`
