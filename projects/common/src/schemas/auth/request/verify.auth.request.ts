import {z} from "zod";
import isJWT from "validator/lib/isJWT";

export const VerifyUserRequest = z.object({
    token: z.string().refine(isJWT, {message: "Verification token must be a JWT"})
}).strict();

export type VerifyUserRequest = z.infer<typeof VerifyUserRequest>;
