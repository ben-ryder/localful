import {z} from "zod";
import isJWT from "validator/lib/isJWT";

export const ResetPasswordRequest = z.object({
    token: z.string().refine(isJWT, {message: "Password reset token must be a JWT"}),
    password: z.string(),
    encryptionSecret: z.string()
}).strict();

export type ResetPasswordRequest = z.infer<typeof ResetPasswordRequest>;
