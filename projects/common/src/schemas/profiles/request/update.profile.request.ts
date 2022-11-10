import {z} from "zod";
import {JSONData} from "../json-data";

export const UpdateProfileRequest = z.object({
  data: JSONData
}).strict()

export type UpdateProfileRequest = z.infer<typeof UpdateProfileRequest>;
