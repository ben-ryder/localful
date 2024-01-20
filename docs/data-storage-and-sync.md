## Content Basics
Every time you edit content a new versions is created. A version contains all data associated with that content, and a version can only be created or deleted.  

## Version History and Deleted Data
- Vaults can either be "local" or "cloud". A local vault only exists on a single device, and cloud vaults are saved to the server and are synced between devices.
- To delete a vault, you must delete both the cloud vault and manually delete the vault from **all** devices.
- When content or a content version is deleted, the data is nullified and an `isDeleted` flag is set to true. If connected to a server, this deletion is
  sent to the server, and on a successful response the device can then fully remove the local data.
- An `isDeleted` flag is required as otherwise devices wouldn't be able to identity the difference between deleted data
  and data that just doesn't exist on the server yet.

## Concurrent Edits
If two devices edit different pieces of content, new versions can be created and synced fine, but there are
potential issues when clients are concurrently editing the same content. In Localful v1, this situation is
handled by simply using "last write wins", for example:

Given `Device A` and `Device B` concurrently edit `Content v1` and are both online:
- `Device A` creates a `Content v2a` version and uploads to server.
- `Device B` is notified of the new version and downloads this.
- `Device B` continues to edit `Content v1` to generate `Content v2b` and uploads this to the server. This version is
now newer than `Content v2a`, so `Device B` uses this as the latest version.
- `Device A` is notified of the new version and downloads it. `Content v2b` is newer than `Content v2a` so `Client B`
will now use the newer `Content v2b` version, even though it previously created `Content v2a` with different changes.

This system may appear to cause "data loss" as the content of `Content v2a` is lost, however it still exists in 
the version history that the user can access.

**Future Improvements**  
This "last write wins" system is very simplistic, which is both a big advantage and a weakness. Some potential future improvements are:
- Versions could be saved with a reference to the previous version, which could help to visualise the history or prioritise versions with more history.
- When `Device B` receives `Content v2a` in the example above, it could "merge" this with its local content to produce version `Content v3` which is then uploaded for `Client A`.
`Client B` could then continue making edits against `Content v3` before creating a final `Content v3b` version.

## Storage Limits
- Devices do not automatically delete old content versions, and have no maximum storage limits (except that of the device itself).
- Devices should still handle situations where the device itself is low on storage, and could still automatically delete old versions.
- The server does set storage limits, which any connecting device needs to be aware of and handle:
  - Maximum number of vaults per user
  - Maximum content size (measured for each content version, defined as the size of the `protectedData` field)
  - Maximum vault size (measured as the sum of all content)
- There is currently no server limit for the maximum number of versions per content item, as this logic could depend on the application and content type.
In the future, servers may be able to set a maximum number of versions per content item for each content type too.

