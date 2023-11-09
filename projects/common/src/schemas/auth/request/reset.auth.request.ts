import {z} from "zod";
import isJWT from "validator/lib/isJWT.js";
import {CreateUserDto} from "../../users.js";

export const ResetPasswordRequest = CreateUserDto
  .pick({encryptionSecret: true, password: true})
  .extend({
      token: z.string()
        // @ts-ignore
        .refine(isJWT, {message: "Password reset token must be a JWT"}),
  })
  .strict();

export type ResetPasswordRequest = z.infer<typeof ResetPasswordRequest>;
