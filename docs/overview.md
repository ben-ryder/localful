## Overview
Localful works by storing data in immutable versions, where each edit a user makes creates a new version.  
This very simplistic storage method allows for version history and a basic form of concurrent editing, as multiple versions can be created simultaneously and synced without fear of conflicts as each version is distinct and immutable. All versions are synced between all devices and a last-write-wins method is used to select the most recent version as the current state of the data.

This system makes Localful most suited to use cases where:
- There is no requirement for automagically resolving or merging concurrent changes.
- You want to back up data to a central server and sync it between devices.
- The focus is on a single user editing their own content and instant real-time collaboration between users and devices isn't required.
- The data being created is generally not super large, as creating new versions for every edit does increase storage and network costs.
- Data edits don't need to be tracked at the most granular level possible.

Multi-user collaboration features may come in the future, but the fundamental approach of Localful right now means it will likely never be as suitable for this use case as other tooling.  
