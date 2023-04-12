import {z} from "zod";

export const ProfileUpdateDto= z.object({
	encryptionSecret: z.string().optional()
}).strict();
export type ProfileUpdateDto = z.infer<typeof ProfileUpdateDto>;
