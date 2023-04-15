# API Authentication
Authentication and user management is not handled by the API itself,
instead the server validates tokens supplied by a third party authentication and user management system,
such as [Logto](https://logto.io/).

**IMPORTANT NOTE:** Although in theory the API should support any provider that supplies
a valid JWT and has a JWKS endpoint, it is only actively developed and tested using [Logto](https://logto.io/).

The API expects the JWT bearer token to have:
- The `sub` (subject) claim, which it used as the `userId` value in the API.
- The `scope` claim which controls what resources and actions the user is capable of in the API.
- The `iss` (issuer) and `aud` (audience) claims, which are validated alongside the token itself.
