import {z} from "zod";

export const UsersURLParams = z.object({
  userId: z.string().uuid("userId must be a uuid"),
}).strict();

export type UsersURLParams = z.infer<typeof UsersURLParams>;
