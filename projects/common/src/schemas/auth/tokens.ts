import {z} from "zod";

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
  scopes: z.array(z.string())
})

export const RefreshTokenPayload = TokenPayload.extend({
  type: z.literal("refreshToken"),
})

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}
