import {z} from "zod";
import isJWT from "validator/es/lib/isJWT.js";

export const LogoutRequest = z.object({
    refreshToken: z.string()
      // @ts-ignore
      .refine(isJWT, {message: "Refresh token must be a JWT"})
}).strict();

export type LogoutRequest = z.infer<typeof LogoutRequest>;
