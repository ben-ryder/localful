# Localful Versioned
A server and client toolkit for developing local-first apps with versionsed content, client-side encryption, cross-device sync and cloud storage. 

## What is "versioned content"?
Versionsed content is content that is stored and managed using immutable versions, meaning that every time you edit content a new version is created which contains all content data.
This very simplicitic storage method allows for content history and a basic form of offline and concurrent editing, as multiple versions
can be created simultaneously and synced later without fear of conflicts.  

## A focus on simplicity, interoperability and longevity
Treating each content edit as a new version has advantages and disavantages.  
You don't get any automatic conflict resolution and replication features you might get with a storage system like CRDTs or distributed databases, and you also pay a much higher storage and network cost as you are
required to send and store much more data.  

These missing features make versioned content most suited to use cases where:
- The focus is on a single user editing their own content
- Users still want to backup their content to the cloud and sync it between their own devices, but instant real-time collaboration between users and devices isn't a huge priority
- The content being created is generally not super large, and edits don't need to be tracked at the most granular level possible

The advantages of using versioned content are simplicity, interoperability and longevity:
- **Simplicity**: There is no need for complex algorithms to handle things like eventual consistency, conflict resolution etc. This makes your application predictable and easy to reason about for developers and more importantly, **users**.
- **Interoperability**: The server implements straightforward REST API and Websocket interfaces familar to anyone who's ever used or built REST APIs. This means you don't have to rely on specilised specifications and protocols that are only useful as long as maintained implementation exist for you to use.
- **Longevity**: Storing content on the client and server in versions that contain all content data means you are not commiting to using a custom way of storing data that could prove hard to migrate aware from in the future. A specilised ditributed database may require implementations for everywhere you want to access that data. 

### Reducing Network and Storage Costs
The network cost of sending all content data again for every edit will always be higher than many alternatives that only send changes/deltas etc, however storage use can be kept under control by automatically deleting old versions based on when they were created and/or if there are over a given number of newer versions.  

The frequency of version creation (and therfore the number of versions and network requests) can also be reduced by not implementing features such as automatic saving into your application, or by implementing this by only creating a 
new version of content after a period of inactivity. This means edits would not be captured at their most granular level, but that is a required trade-off to prevent the network and storage costs quickly become unmanagable.  

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
