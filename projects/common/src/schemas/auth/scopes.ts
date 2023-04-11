/*
This file defines the permission scopes used in LFB to control access to various API actions.
These must be configured within to your third party user/authentication service and can then
be attached to the access token a user supplies to the LFB server.

All scopes have the following format:
	<resource>:<action> OR <resource>:<action>:<behaviour>
For example:
	profiles:create:self
		- 'profiles' is the resource
		- 'create' is the action (could be any CRUD actions)
		- 'self' defines the behaviour as only for entities owned by the given user
	profiles:delete
		- 'profiles' is the resource
		- 'delete' is the action
		- there is no special behaviour, so this scope grants permission to delete any profile
 */

export const Scopes = [
	// Scopes limited to the current users content
	"changes:create:self",
	"changes:retrieve:self",
	"changes:delete:self",

	"profiles:create:self",
	"profiles:retrieve:self",
	"profiles:update:self",
	"profiles:delete:self",

	// Special scopes giving access to all content,
	"changes:create",
	"changes:retrieve",
	"changes:update",
	"changes:delete",

	"profiles:create",
	"profiles:retrieve",
	"profiles:update",
	"profiles:delete",
];
