import {z} from "zod";

export const ProfileURLParams = z.object({
  userId: z.string()
}).strict();

export type ProfileURLParams = z.infer<typeof ProfileURLParams>;
