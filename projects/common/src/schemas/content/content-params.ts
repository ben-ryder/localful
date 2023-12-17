import {z} from "zod";

export const ContentURLParams = z.object({
  contentId: z.string().uuid("contentId must be a uuid"),
}).strict();

export type ContentURLParams = z.infer<typeof ContentURLParams>;
