# Localful
A system for developing local-first apps with client-side encryption, cross-device sync and cloud storage.  

This project includes:
- A server which...
  - Enables cross-device synchronisation and cloud storage via a REST API and Websockets.
  - Implements a user and authentication system to restrict access to the server and user content.
- A local library (currently web only) which...
  - Integrates with the Localful server.
  - Provides an opinionated user account setup and authentication system (that still supports local-only app usage).
  - Implements a client-side encryption system, which you can learn more about in the **[encryption specification](./docs/local/encryption/specification-v2.md)**.
  - Implements local storage via IndexDB and localStorage
  - Implements local synchronisation (between browser windows & tabs) via BroadcastChannel.

**⚠️ Disclaimer:** This project is early in development and has not yet been thoroughly tested in a production context.

To learn when this project may or may not be useful to you, check out the **[use cases docs](./docs/use-cases.md)**.  
You can also take a look at **[minimal and real-world example apps](./docs/examples.md)** using Localful.


## Installation and Usage
TODO

## Deployment
TODO

## Contributions
Feel free to suggest features, give feedback, suggest improvements, raise bugs, open PRs and anything else.

For development information see the [`docs/development`](docs/development) folder.

## License
This project is released under the [GNU AGPLv3 license](LICENSE.txt).
