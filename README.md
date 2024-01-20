# Localful
There are lots of tools to help you develop local-first software, however these often require building around CRDTs, eventual consistency, conflict resolution and other concepts 
which fundementally change how you build apps, and how you store and manage data.  
These concepts are incredibly powerful and useful when needed, but introduce a world of compexity when they're not.  

Localful is built with a focus on simplicity, interoperability and longevity. It provides features such as local data storage, client-side encryption, cross-device sync and cloud storage without introducing lots of technical compelxity.

## ❓ How does it work?
Localful works by using "versioned content", which is content that is stored and managed using immutable versions.  
This means that every time a user edits content, a new version is created which contains all data required to represent that content.
This very simplistic storage method allows for version history and a basic form of concurrent editing, as multiple versions
can be created simultaneously and synced later without fear of conflicts as each version is distinct and immutable.

There are no built-in conflict resolution features that you might get with more advanced systems that utilise CRDTs or distributed databases, and you also pay a much higher storage and network cost as you are
required to send and store more data. This makes Localful most suited to use cases where:
- The focus is on a single user editing their own content
- Users still want to back up their content to the cloud and sync it between their own devices, but instant real-time collaboration between users and devices isn't a huge priority
- The content being created is generally not super large, and edits don't need to be tracked at the most granular level possible
- There is no requirement for automagically resolving or merging changes. If a user creates two or more content versions simultaneously, all versions are synced between all devices and a last-write-wins method is used to select the
most recent version as the current state of the content.

## 🛠️ What does this project include?
- A Javascript SDK library (currently web only) which...
  - Implements local persistence via IndexDB, currently built using [Dexie.js](https://dexie.org/). This means you can use Dexie libraries like [useLiveQuery](https://dexie.org/docs/Tutorial/React) to get reactive queries in your application.
  - Implements client-side encryption, which you can learn more about in the **[encryption specification](./docs/local/encryption/specification.md)**.
  - Provides the ability to define your data schema via [Zod](https://zod.dev/) and also write migrations to update your schema and content data.
  - Provides functionality to integrate with the server and manage local content.
- A self-hostable Node.js server which...
  - Provides cloud storage and cross-device synchronisation via a HTTP API and Websockets.
  - Implements a user and authentication system, allowing multiple users to sign up and use the same server (new user registration can be disabled if required)

To learn when this project may or may not be useful to you, check out the **[use cases docs](./docs/use-cases.md)**.  
You can also take a look at **[minimal and real-world example apps](./docs/examples.md)**.

## 🌱 A focus on simplicity, interoperability and longevity
What does it mean to say that Localful focuses on simplicity, interoperability and longevity?

- **Simplicity**: There is no need for complex algorithms to handle things like eventual consistency, conflict resolution etc. This makes your application predictable and easy to reason about for developers and more importantly, for **users**.
- **Interoperability**: The server implements a straightforward HTTP API and Websocket system and each version contains all content data. This means you don't have to rely on special specifications and protocols that may only be useful as long as maintained implementation exist, and you can consume and write data easily using any technology.
- **Longevity**: Storing content on the client and server as versions that contain all content data means you are not committing to using a specialised storage format that could prove hard to migrate away from in the future and/or requires implementations for everywhere you want to access that data. 

### 📉 Reducing Network and Storage Costs
The network cost of sending versions with all content data for every edit will always be higher than many alternative systems that only send changes/deltas, however storage use can be kept under control by automatically deleting old versions based on when they were created and/or if there are over a given number of newer versions. You could even automatically delete all old versions from clients, and only retrieve these from the server if the use desires it.  

The frequency of version creation (and therefore the number of versions and network requests) can also be reduced by not implementing features such as automatic saving into your application, or by implementing this by only creating a new version of content after a period of inactivity.  
This means content edits would not be captured at their most granular level, but that is a required trade-off to prevent the network and storage costs quickly become unsustainable. 

## 👷 Installation and Usage
TODO

## 🚀 Deployment
TODO

## ❤️ Contributions
Feel free to suggest features, give feedback, suggest improvements, raise bugs, open PRs and anything else.

For development information see the [`docs/development`](docs/development) folder.

## 📃 License
This project is released under the [GNU AGPLv3 license](LICENSE.txt).
