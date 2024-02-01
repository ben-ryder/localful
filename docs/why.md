# Why I built Localful

There are lots of tools and libraries to help you develop local-first web applications, however these often require building around CRDTs, eventual consistency, conflict resolution and other concepts 
which fundementally change how you build apps, and how you store and manage data.  
These concepts are incredibly powerful and useful when needed, but introduce a world of compexity when your use case doesn't require them.


## 🌱 A focus on simplicity, interoperability and longevity
What does it mean to say that Localful focuses on simplicity, interoperability and longevity?

- **Simplicity**: There is no need for complex algorithms to handle things like eventual consistency, conflict resolution etc. This makes your application predictable and easy to reason about for developers and more importantly, for **users**.
- **Interoperability**: The server implements a straightforward HTTP API and Websocket system and each version contains all content data. This means you don't have to rely on special specifications and protocols that may only be useful as long as maintained implementation exist, and you can consume and write data easily using any technology.
- **Longevity**: Storing content on the client and server as versions that contain all content data means you are not committing to using a specialised storage format that could prove hard to migrate away from in the future and/or requires implementations for everywhere you want to access that data. 
