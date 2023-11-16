import {z} from "zod";

export const ChangesQueryParams = z.object({
  ids: z.array(
    z.string().uuid()
  )
    .max(100, "You can't request more than 100 changes at a time.")
    .optional(),
  resourceIds: z.array(
    z.string().uuid()
  )
    .max(10, "You can't request more than 10 resources at a time.")
    .optional(),
  idOnly: z.boolean().optional()
}).strict();

export type ChangesQueryParams = z.infer<typeof ChangesQueryParams>;
