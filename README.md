# Localful
Tools for building local-first web apps with a focus on simplicity, interoperability and longevity.  

**Features:**
- Local-first storage using IndexDB.
- Client-side encryption, including locally in IndexDB.
- Schema definitions using [Zod](https://zod.dev/).
- Migration support for schemas and data.
- Basic local queries with support with filtering, ordering, grouping etc.
- Built-in reactivity for local data fetching via [RxJS Observables](https://rxjs.dev/).
- Self-hostable server for data backup and syncronisation.
- Built-in user and authentication system for server and local sign up/login.

**Quick Links:**
- [Why I built Localful]()
- [Documentation](./docs/README.md)
- [Quick Start](./docs/quick-start.md)
- [Examples](./docs/examples.md)
- [Encryption Specification](./docs/local/encryption/specification.md)
- [Roadmap](./docs/roadmap.md)

## Overview
Localful works by storing data in immutable versions, where each edit a user makes creates a new version.  
This very simplistic storage method allows for version history and a basic form of concurrent editing, as multiple versions can be created simultaneously and synced without fear of conflicts as each version is distinct and immutable. All versions are synced between all devices and a last-write-wins method is used to select the most recent version as the current state of the data.

This system makes Localful most suited to use cases where:
- The focus is on a single user editing their own content.
- You want to back up data to a central server and sync it between devices, but instant real-time collaboration between users and devices isn't required.
- The data being created is generally not super large, as creating new versions for every edit does increase storage and network costs.
- Data edits don't need to be tracked at the most granular level possible.
- There is no requirement for automagically resolving or merging changes.

Multi-user collaboration features may come in the future, but the fundamental approach of Localful right now means it will never be very suitable for this use case.  

## ❤️ Contributions
Feel free to suggest features, give feedback, suggest improvements, raise bugs, open PRs and anything else.

## 📃 License
This project is released under the [GNU AGPLv3 license](LICENSE.txt).
