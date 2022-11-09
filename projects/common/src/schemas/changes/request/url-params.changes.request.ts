import {z} from "zod";

export const ChangesURLParams = z.object({
  userId: z.array(z.string())
}).strict();

export type GetChangesQueryParams = z.infer<typeof ChangesURLParams>;
