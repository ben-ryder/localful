import {z} from "zod";

export const ProfilesURLParams = z.object({
    userId: z.string()
}).strict();

export type ProfilesURLParams = z.infer<typeof ProfilesURLParams>;
