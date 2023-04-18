# API Reference

## REST API
- `/ [GET]`
- `/v1 [GET]`
  - `/v1/info [GET]`
  - `/v1/profiles [POST]`
    - `/v1/profiles/:userId [GET, PATCH, DELETE]`
    - `/v1/changes/:userId [GET, POST]`
      - `/v1/changes/:userId/ids [GET]`

## Websocket Events
- `changes` - Event sent by client and server. The receiver should update their storage with the supplied changes.
