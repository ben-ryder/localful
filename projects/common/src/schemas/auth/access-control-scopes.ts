/*
This file defines the access control rules and scopes used in LFB to control access to various API actions.
The scopes must be configured within to your third party user/authentication service and can then
be attached to the access token a user supplies to the LFB server.

All scopes have the following format:
	<resource>:<action> OR <resource>:<action>:<behaviour>
For example:
	profiles:create:self
		- 'profiles' is the resource
		- 'create' is the action (could be any CRUD actions)
		- 'self' signifies the behaviour as only for entities owned by the given user
	profiles:delete
		- 'profiles' is the resource
		- 'delete' is the action
		- there is no special behaviour, so this scope grants permission to delete any profile
 */


export const AccessControlScopes = {
	// Scopes limited to the current users content
	CHANGES_CREATE_SELF: "changes:create:self",
	CHANGES_RETRIEVE_SELF: "changes:retrieve:self",
	CHANGES_DELETE_SELF: "changes:delete:self",

	PROFILES_CREATE_SELF: "profiles:create:self",
	PROFILES_RETRIEVE_SELF: "profiles:retrieve:self",
	PROFILES_UPDATE_SELF: "profiles:update:self",
	PROFILES_DELETE_SELF: "profiles:delete:self",

	// Special scopes giving access to all content,
	CHANGES_CREATE: "changes:create",
	CHANGES_RETRIEVE: "changes:retrieve",
	CHANGES_UPDATE: "changes:update",
	CHANGES_DELETE: "changes:delete",

	PROFILES_CREATE: "profiles:create",
	PROFILES_RETRIEVE: "profiles:retrieve",
	PROFILES_UPDATE: "profiles:update",
	PROFILES_DELETE: "profiles:delete",
};
