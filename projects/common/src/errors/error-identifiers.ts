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
  AUTH_TOKEN_INVALID = "auth-token-invalid",

  // Profile Errors
  PROFILE_NOT_FOUND = "profile-not-found",
  PROFILE_ALREADY_EXISTS = "profile-already-exists",
}
