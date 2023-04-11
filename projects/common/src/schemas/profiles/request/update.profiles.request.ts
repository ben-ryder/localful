import {z} from "zod";
import {CreateProfileRequest} from "./create.profiles.request";

export const UpdateProfileRequest = CreateProfileRequest.partial().strict();
export type UpdateProfileRequest = z.infer<typeof UpdateProfileRequest>;
