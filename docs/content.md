# Content & Content Versions
Every time a user edits content a new versions is created. A version contains all content data and is immutable, it can only be created or deleted.  

## Concurrent Edits
If two clients are editing different pieces of content, the versions can be created and synced fine, but there are
potential issues when clients are concurrently editing the same content. In Localful v1 this situation is
handled using "last write wins", for example:

Given `Client A` and `Client B` concurrently edit `Content v1` and are both online:
- `Client A` creates a `Content v2a` version and uploads to server.
- `Client B` is notified of the new version and downloads this.
- `Client B` continues to edit `Content v1` to generate `Content v2b` and uploads this to the server. This version is
now newer than `Content v2a` so `Client B` uses this as the latest version.
- `Client A` is notified of the new version and downloads it. `Content v2b` is newer than `Content v2a` so `Client B`
will now use the newer `Content v2b`, even though it previously created `Content v2a`.

This system may cause "data loss" as the content of `Content v2a` is lost, however it still exists in 
the version history that the user can access.

**Future Improvements**  
This "last write wins" system is very simplistic, which is both a big advantage and a weakness. Some potential future improvements are:
- Versions could be saved with a reference to the previous version. This could be used to visualise the history.
- When `Client B` receives `Content 2a` it could "merge" this with its local content to produce version `Content 3` which is uploaded.
`Client B` would then make continue making edits against `Content 3` before creating version `Content 3b`.
