import {z} from "zod";

export const ProfileUpdateDto= z.object({
	encryptionSecret: z.string()
		.min(1, "The encryptionSecret length must be at least 1 chars")
		.max(255, "The encryptionSecret length can't exceed 255 chars")
		.optional()
}).strict();
export type ProfileUpdateDto = z.infer<typeof ProfileUpdateDto>;
