import {z} from "zod";


export const AddChangesRequest = z.array(
  z.object({
    id: z.string(),
    data: z.string()
  }).strict()
)
export type AddChangesRequest = z.infer<typeof AddChangesRequest>;
