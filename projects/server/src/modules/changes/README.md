# Changes

- Changes are related to a resource, NOT a user
- Resources are related to a user

- Changes are added and fetched via the user
- Changes are cascade deleted via a resrouce deletion

todo: should api route be independent, user scopes?
- `/v1/changes` - with query param
- `/v1/changes/:usedId`
- `/v1/users/:userId/changes`