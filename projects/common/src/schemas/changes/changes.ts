import {z} from "zod";

export const Change = z.object({
  id: z.string().min(1, "The change id must be at least 1 character."),
  resourceId: z.string().min(1, "The resource id must be at least 1 character."),
  data: z.string().min(1, "The change data must be at least 1 character."),
}).strict()
export type Change = z.infer<typeof Change>;
