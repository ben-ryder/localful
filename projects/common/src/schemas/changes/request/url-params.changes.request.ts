import {z} from "zod";

export const ChangesURLParams = z.object({
  userId: z.string()
}).strict();

export type ChangesURLParams = z.infer<typeof ChangesURLParams>;
