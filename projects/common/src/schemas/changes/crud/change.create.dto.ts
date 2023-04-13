import {z} from "zod";

export const ChangeCreateDto = z.array(
  z.object({
    id: z.string(),
    data: z.string()
  }).strict()
)
export type ChangeCreateDto = z.infer<typeof ChangeCreateDto>;
