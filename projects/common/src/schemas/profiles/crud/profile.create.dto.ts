import {z} from "zod";

export const ProfileCreateDto = z.object({
  userId: z.string()
    .min(1, "The userId length must be at least 1 chars")
    .max(100, "The userId length can't exceed 255 chars"),
  encryptionSecret: z.string()
    .min(1, "The encryptionSecret length must be at least 1 chars")
    .max(255, "The encryptionSecret length can't exceed 255 chars"),
}).strict();

export type ProfileCreateDto = z.infer<typeof ProfileCreateDto>;
