import {z} from "zod";

export const ChangeCreateDto = z.array(
  z.object({
    id: z.string()
      .min(1, "The id length must be at least 1 chars"),
    data: z.string()
      .min(1, "The data length must be at least 1 chars"),
  }).strict()
)
export type ChangeCreateDto = z.infer<typeof ChangeCreateDto>;
