
## When is this project useful?

The goal of this project is to simplify the development of local-first apps that require client-side encryption and cloud storage,
by implementing the common app and server functionality required to support these features.    
App developers should be able to focus on their unique app features, without worrying about device storage, user management,
cross-device sync, client-side encryption etc as these features are already implemented by Localful.

This project aims to be generic enough that it can be used for many different apps, but it does make a
number of fundamental assumptions:
- Your app will have one or more "resources" which are made up of many "changes".
- Your app needs to support multiple users.
- Resources are owned by specific users and cross-user collaboration is not required.
- You want to support local-first offline usage of your app.
- You want to synchronise resources and changes between different user devices, potentially in real time.
- You don't want a purely device-to-device sync system, you also want the ability to save content to a central server for cloud storage/backup.
- You want client-side encryption so the server can't access user content, and a user is the only one able to decrypt their content.
- Your app will use a CRDT to store data, specifically [Automerge](https://github.com/automerge/automerge).

## When might this project not be useful?

**If you don't like all the implementation opinions**  
The device library of Localful is opinionated. It uses [Automerge](https://github.com/automerge/automerge) as a CRDT implementation
and has a specific client-side encryption, device storage and user/account handling system which is designed for use with the Localful server.  
In theory, the server does just expose a generic API which could be used by anything, but in practice Localful is built
with the expectation that the device library and server will be used together.

**If you don't need client-side encryption AND cloud storage...**  
Localful has been developed to support client-side encryption AND cloud storage. If you don't need both these features, you probably don't need Localful.  
Automerge already implements its own storage and networking solution with [automerge-repo](https://automerge.org/docs/repositories/) which can
be used if you only need one (or neither) of those features.  
This is because the [Automerge Sync Protocol](https://automerge.org/automerge/automerge/sync/index.html) syncs changes between two peers,
but requires both peers to have versions of the Automerge document to compare in order to achieve synchronisation.
- If you just wanted client-side encryption, you could send data between devices (via a central relay server for example), encrypting and decrypting data on each device so the server can't view the data.
- If you just wanted cloud storage, the server could simply act as another peer to sync with.

If you want client-side encryption AND cloud storage, the server can't know about the Automerge document, so it can't use the sync protocol.  
Localful therefore sends and stores all Automerge changes encrypted, and the server acts as a dumb data store as well as a central server to facilitate device-to-device syncing at the same time.  
This means changes in Localful are an inefficient append-only data store that will only grow and reduce performance over time. A way to combat this
is suggested (but not yet implemented) in the [migrations]() docs page.

**If you need user collaboration...**  
Localful is designed for single-user applications. The server functionality and client-side encryption system currently implemented has no support for user collaboration.  
Users are technical able to "collaborate" with themselves cross-device though, due to the properties of CRDTs and real-time sync features.

**If you're experienced with CRDTs and local-first technologies...**  
I'm developing this project to meet my own requirements but also to learn. I doubt I've made all the best implementation decisions as I don't know what I don't know.  
If you notice anything wrong in my design or implementation of Localful, I'm open to constructive criticism and helpful suggestions!
