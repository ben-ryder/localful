import {z} from "zod";
import {Roles} from "./permissions.js";

export const TokenPayload = z.object({
  iss: z.string(),
  aud: z.string(),
  sub: z.string(),
  gid: z.string(),
  cid: z.number(),
  exp: z.string(),
}).strict()
export type TokenPayload = z.infer<typeof TokenPayload>;

export const AccessTokenPayload = TokenPayload.extend({
  type: z.literal("accessToken"),
  isVerified: z.boolean(),
  role: Roles
})

export const RefreshTokenPayload = TokenPayload.extend({
  type: z.literal("refreshToken"),
})

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}
