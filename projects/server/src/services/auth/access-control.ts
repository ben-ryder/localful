
export type AccessControlRules = AccessControlRule[];

/**
 * A single access control rule:
 * 	- scope: defines the scope the user must have
 * 	- unrestricted: set to true if this rule should give access to all data, not just data belonging to the current user context
 */
export interface AccessControlRule {
	scope: string,
	unrestricted?: boolean
}
