# Localful Versioned
A server and client toolkit for developing local-first apps with versionsed content, client-side encryption, cross-device sync and multiple users. 

## What is "versioned content"?

### Basics
Versionsed content is content that is stored and managed using immutable versions, meaning that every time you edit content a new version is created which contains all content data.
This very simplicitic storage method allows for content history and a basic form of offline and concurrent editing, as multiple versions
can be created simultaneously and synced later without fear of conflicts.  

### A focus on simplicity
This system sacrifices advanced conflict resolution and replication features you might get with a storage system like CRDTs or distributed databases for something that is simple and easy to reason about.  

These missing features make versioned content most suited to use cases where the focus is on a single user editing content and potentially wanting to sync these changes between devices, and not on situations that require real-time collaboration between many users, where the complexity that CRDTs and distributed database systems often expose starts to be required.

### Network and Storage Costs
The main disadvantage with creating a new version for each content edit is higher storage and network costs.  
The network cost will always be higher than many alternatives, however storage use can be kept under control by automatically deleting old versions based on when they were created and/or if there are over a given number of versions already.  

The frequency of version creation (and therfore the number of versions) can also be reduced by not implementing features such as automatic saving into your application, or by implementing this by only creating a 
new version of content after a period of inactivity. This would prevent creating a new content version every time the user types a character for example, which would quickly become unmanagable.  


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
