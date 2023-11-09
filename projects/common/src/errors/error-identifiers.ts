/**
 * Error identifiers
 */
export enum ErrorIdentifiers {
  // Generalised Errors
  NOT_FOUND = "not-found",

  // System Errors
  SYSTEM_UNEXPECTED = "system-unexpected-error",

  // Request Errors
  REQUEST_INVALID = "request-invalid",

  // Access Errors
  ACCESS_UNAUTHORIZED = "access-unauthorized",
  ACCESS_FORBIDDEN = "access-forbidden",

  // Resource Errors
  RESOURCE_NOT_FOUND = "resource-not-found",
  RESOURCE_NOT_UNIQUE = "resource-not-unique",
  RESOURCE_RELATIONSHIP_INVALID = "resource-relationship-invalid",

  // Auth Errors
  AUTH_CREDENTIALS_INVALID = "auth-credentials-invalid",
  AUTH_TOKEN_INVALID = "auth-token-invalid",
  AUTH_NOT_VERIFIED = "auth-not-verified",
  AUTH_ALREADY_VERIFIED = "auth-already-verified",

  // User Errors
  USER_REGISTRATION_DISABLED = "user-registration-disabled",
  USER_USERNAME_EXISTS = "user-username-exists",
  USER_EMAIL_EXISTS = "user-email-exists",
  USER_NOT_FOUND = "user-not-found",
}
