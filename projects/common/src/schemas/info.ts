import {z} from "zod";

export const Info = z.object({
  version: z.string(),
  registrationEnabled: z.boolean()
}).strict()

export type InfoDto = z.infer<typeof Info>;
