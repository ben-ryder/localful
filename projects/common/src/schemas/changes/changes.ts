import {z} from "zod";

export const ChangeDto = z.object({
  id: z.string().min(1, "The id must be at least 1 character."),
  resourceId: z.string().min(1, "The resourceId must be at least 1 character."),
  protectedData: z.string().min(1, "The protectedData must be at least 1 character."),
  createdAt: z.string().datetime({message: "createdAt must be UTC timestamp"}),
}).strict()
export type ChangeDto = z.infer<typeof ChangeDto>;

export const ChangesDto = z.array(ChangeDto)
export type ChangesDto = z.infer<typeof ChangesDto>
