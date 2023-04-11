import {z} from "zod";

export const CreateProfileRequest = z.object({
  encryptionSecret: z.string()
}).strict();

export type CreateProfileRequest = z.infer<typeof CreateProfileRequest>;
