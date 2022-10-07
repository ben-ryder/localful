import { UserError } from "../base/user.error";

/**
 * A subset of UserError specifically for access related errors
 * such as access denied, forbidden etc.
 */
export class AccessError extends UserError {}
