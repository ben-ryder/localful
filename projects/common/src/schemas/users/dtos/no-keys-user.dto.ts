/**
 * This interface can be used when creating users.
 *
 * This typing is required as most applications don't need to know about the user encryptionSecret,
 * that implementation is encapsulated by the API client library,
 */
export interface NoKeysUserDto {
  username: string;
  email: string;
  password: string;
}