import {z} from "zod";
import {Roles} from "./permissions";

export const TokenPayload = z.object({
  iss: z.string(),
  aud: z.string(),
  sub: z.string(),
  gid: z.string(),
  cid: z.number(),
  exp: z.number(),
}).strict()
export type TokenPayload = z.infer<typeof TokenPayload>;

export const AccessTokenPayload = TokenPayload.extend({
  type: z.literal("accessToken"),
  isVerified: z.boolean(),
  role: Roles
})
export type AccessTokenPayload = z.infer<typeof AccessTokenPayload>;

export const RefreshTokenPayload = TokenPayload.extend({
  type: z.literal("refreshToken"),
})
export type RefreshTokenPayload = z.infer<typeof RefreshTokenPayload>;

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}
