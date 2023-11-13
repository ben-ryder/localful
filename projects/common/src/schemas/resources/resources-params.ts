import {z} from "zod";

export const ResourcesURLParams = z.object({
  resourceId: z.string().uuid("resourceId must be a uuid"),
}).strict();

export type ResourcesURLParams = z.infer<typeof ResourcesURLParams>;
