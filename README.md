# Local-First Backend
A generic backend for local-first applications including content backup, cross-device sync and multi-user support.  

This project includes:
- An API server written with [NestJS](https://nestjs.com/) which applications can use for user management, content backup, cross-device content synchronisation etc
- An opinionated JS client for interacting with the API which bundles other helpful utilities such as:
  - Built-in client side encryption
  - Automatic access token renewal

**Disclaimer:** This project is early in development and has not yet been thoroughly tested in a production context.

## About
TODO

## Project Structure
This is a monorepo containing a few projects & packages:
- `server` - The main backend Node server responsible for user management, data storage, cross-device sync etc.
- `common` - A library of generic functionality and types that are shared across projects & packages.
- `client` - A JS library for interacting with the server API and websockets easily.
- `testing` - Contains hardcoded test data which can be used across projects & packages for testing.

## Contributions
Feel free to try this project out, suggest features, raise bugs & PRs etc!

## License
This project is released under the [GNU AGPLv3 license](LICENSE.txt).
