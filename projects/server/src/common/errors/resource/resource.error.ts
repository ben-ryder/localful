import { UserError } from '../base/user.error';

/**
 * A subset of UserError specifically for resource related errors
 * such as database interactions etc.
 */
export class ResourceError extends UserError {}
