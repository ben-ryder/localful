import {z} from "zod";

export const ChangesQueryParams = z.object({
  ids: z.array(z.string().uuid()).optional(),
  resourceIds: z.array(z.string().uuid()).optional(),
  idOnly: z.boolean().optional()
}).strict();

export type ChangesQueryParams = z.infer<typeof ChangesQueryParams>;
