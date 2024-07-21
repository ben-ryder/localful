import {z} from "zod";
import {Roles} from "./permissions";
import {createDateField} from "../common/fields";

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
  verifiedAt: createDateField('verifiedAt').nullable(),
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
