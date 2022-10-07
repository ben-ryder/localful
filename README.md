# Local-first backend
A generic backend for local-first applications including content backup, cross-device sync and multi-user support.  

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
