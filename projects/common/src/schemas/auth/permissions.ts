/*
This file defines the permissions/scopes used in Localful to control access to various API actions.

All permissions have the following format as a convention:
	<resource>:<action> OR <resource>:<action>:<access>
For example:
	changes:create
		- 'changes' is the resource
		- 'create' is the action (could be any CRUD actions)
		- there is no 'access' present, so this scope only grants permission to a users own changes.
	changes:delete:all
		- 'users' is the resource
		- 'delete' is the action
		- 'all' signifies that this scope grants permissions to any users changes.
 */

import {z} from "zod"

export enum PERMISSIONS {
	// Scopes limited to the current users content
	CHANGES_CREATE = "changes:create",
	CHANGES_RETRIEVE = "changes:retrieve",
	CHANGES_DELETE = "changes:delete",

	USERS_CREATE = "users:create",
	USERS_RETRIEVE = "users:retrieve",
	USERS_UPDATE = "users:update",
	USERS_DELETE = "users:delete",

	AUTH_VERIFY = "auth:verify",

	// Special 'admin' scopes giving access to all content,
	CHANGES_CREATE_ALL = "changes:create:all",
	CHANGES_RETRIEVE_ALL = "changes:retrieve:all",
	CHANGES_UPDATE_ALL = "changes:update:all",
	CHANGES_DELETE_ALL = "changes:delete:all",

	USERS_CREATE_ALL = "users:create:all",
	USERS_RETRIEVE_ALL = "users:retrieve:all",
	USERS_UPDATE_ALL = "users:update:all",
	USERS_DELETE_ALL=  "users:delete:all",
}

export const Permissions = z.nativeEnum(PERMISSIONS);
export type Permissions = z.infer<typeof Permissions>;
