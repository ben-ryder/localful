import {z} from "zod";

export const ProfileCreateDto = z.object({
  userId: z.string(),
  encryptionSecret: z.string()
}).strict();

export type ProfileCreateDto = z.infer<typeof ProfileCreateDto>;
