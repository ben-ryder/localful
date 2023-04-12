import {z} from "zod";

export const ChangeCreateDto = z.array(
  z.object({
    id: z.string(),
    data: z.string()
  }).strict()
)
export type CreateChangeDto = z.infer<typeof ChangeCreateDto>;
