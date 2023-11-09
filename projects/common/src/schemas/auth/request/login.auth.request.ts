import {z} from "zod";

export const LoginRequest = z.object({
    email: z.string().min(1, "Your email should not be empty"),
    password: z.string().min(1, "Your password should not be empty")
}).strict();

export type LoginRequest = z.infer<typeof LoginRequest>;
