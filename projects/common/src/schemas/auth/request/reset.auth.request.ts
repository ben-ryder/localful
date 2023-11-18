import {z} from "zod";
import isJWT from "validator/lib/isJWT";
import {CreateUserDto} from "../../users/users";

export const ResetPasswordRequest = CreateUserDto
  .pick({encryptionSecret: true, password: true})
  .extend({
      token: z.string()
        // @ts-ignore
        .refine(isJWT, {message: "Password reset token must be a JWT"}),
  })
  .strict();

export type ResetPasswordRequest = z.infer<typeof ResetPasswordRequest>;
