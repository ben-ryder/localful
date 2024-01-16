# Localful Versioned
A server and client toolkit for developing local-first apps with versionsed content, client-side encryption, cross-device sync and multiple users. 

## What is "versioned content"?
Versionsed content is content that is stored and managed using immutable versions, meaning that everytime you edit content a new version is created.
This very simplicitic storage method provides support for content history and allows for a basic form of concurrent and "offline" editing, where multiple versions
can be created simultaneously and synced later without fear of conflicts.  
Versioned content doesn't give you any advanced conflict-resolution or replication features that you might get with a CRDT like [Automerge](), or tools like [pouchdb]() etc, but ....

**Doesn't creating a new version every time duplicate a lot of data?**  
Yes absolutley, however this issues can be reduced by automatically deleting old versions that are either older than a period of time, or if a given number of versions already exist.  
This downside of potentially sotring 

## What does this project include?
This project includes:
- A self-hostable Node.js server which...
  - Provides cloud storage and cross-device synchronisation via a REST API and Websockets.
  - Implements a user and authentication system.
- A local library (currently web only) which...
  - Provides an SDK for integrating with the server and managing local content.
  - Implements client-side encryption, which you can learn more about in the **[encryption specification](./docs/local/encryption/specification.md)**.
  - Implements local persistence via IndexDB.

**⚠️ Disclaimer:** This project is early in development and has not yet been thoroughly tested in a production context.

To learn when this project may or may not be useful to you, check out the **[use cases docs](./docs/use-cases.md)**.  
You can also take a look at **[minimal and real-world example apps](./docs/examples.md)** using Localful Versioned.


## Installation and Usage
TODO

## Deployment
TODO

## Contributions
Feel free to suggest features, give feedback, suggest improvements, raise bugs, open PRs and anything else.

For development information see the [`docs/development`](docs/development) folder.

## License
This project is released under the [GNU AGPLv3 license](LICENSE.txt).
