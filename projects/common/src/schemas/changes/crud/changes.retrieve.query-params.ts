import {z} from "zod";

export const ChangesRetrieveQueryParams = z.object({
  ids: z.array(z.string()).optional()
}).strict();

export type ChangesRetrieveQueryParams = z.infer<typeof ChangesRetrieveQueryParams>;
