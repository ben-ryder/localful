# Roadmap
- Refactor current version behaviour to use field on entity
- add basic query support
- add missing methods for version management
- write performance tests for queries on real world data

If performance tests are good...
- Add database management
  - switching
  - locking & unlocking (encryption)
- concept of version limits and background service for cleanups with events
- adapt exiting server for new requirements
- re-add server client and support for login/auth
- add api client integrations for syncing content via background process (process queue?)
  - add missing functionality for dealing with server pushed changes
    - add open handle system to prevent version overwriting and notifying user on changes?
    - ensure events are exposed and allow clients to hook into events for this purpose?
- any other missing features/requirements
- documentation improvements
- initial alpha
