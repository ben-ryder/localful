# API Reference

## REST API
- `/ [GET]`
- `/v1 [GET]`
  - `/users [POST]`
    - `/users/:userId [GET, PATCH, DELETE]`
  - `/auth`
    - `/auth/login [POST]`
    - `/auth/refresh [POST]`
    - ~~`/auth/logout [POST]`~~
    - `/auth/check [POST]`
  - `/changes [GET, POST]`
    - `/changes/ids [GET]`

## Websocket Events
- `changes` - Event sent by client and server. The receiver should update their storage with the supplied changes.
