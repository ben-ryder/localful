import {z} from "zod";
import isJWT from "validator/lib/isJWT";

export const LogoutRequest = z.object({
    refreshToken: z.string().refine(isJWT, {message: "Refresh token must be a JWT"})
}).strict();

export type LogoutRequest = z.infer<typeof LogoutRequest>;

