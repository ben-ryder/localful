import {z} from "zod";
import isJWT from "validator/lib/isJWT.js";

export const RefreshRequest = z.object({
    refreshToken: z.string()
      // @ts-ignore
      .refine(isJWT, {message: "Refresh token must be a JWT"})
}).strict();

export type RefreshRequest = z.infer<typeof RefreshRequest>;
