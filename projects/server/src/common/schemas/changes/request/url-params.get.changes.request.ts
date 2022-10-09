import {z} from "zod";

export const GetChangesQueryParams = z.object({
  ids: z.array(z.string()).optional()
}).strict();

export type GetChangesQueryParams = z.infer<typeof GetChangesQueryParams>;
