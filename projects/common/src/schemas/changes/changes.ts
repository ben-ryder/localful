import {z} from "zod";
import {ResourceId} from "../resources/resources.js";

export const ChangeId = z.string()
  .min(1, "A change id must be at least 1 character.")
  .max(40, "A change id must be less than 40 characters.")

export const ChangeDto = z.object({
  id: ChangeId,
  protectedData: z.string()
    .min(1, "The protectedData must be at least 1 character."),
  createdAt: z.string()
    .datetime({message: "createdAt must be UTC timestamp"}),
}).strict()
export type ChangeDto = z.infer<typeof ChangeDto>;

export const ChangesDto = z.object({
  resourceId: ResourceId,
  changes: z.array(ChangeDto)
})
export type ChangesDto = z.infer<typeof ChangesDto>
