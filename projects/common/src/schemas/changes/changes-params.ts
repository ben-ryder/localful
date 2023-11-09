import {z} from "zod";

export const ChangesParams = z.object({
  ids: z.array(z.string().uuid()).optional(),
  resourceIds: z.array(z.string().uuid()).optional(),
  idOnly: z.boolean().optional()
}).strict();

export type ChangeParams = z.infer<typeof ChangesParams>;
