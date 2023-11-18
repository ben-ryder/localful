import {z} from "zod";
import {ResourceId} from "../resources/resources";

export const ChangeId = z.string()
  .min(1, "A change id must be at least 1 character.")
  .max(40, "A change id can't go over 40 characters.")

export const ChangeDto = z.object({
  id: ChangeId,
  protectedData: z.string()
    .min(1, "protectedData must be at least 1 character."),
  createdAt: z.string()
    .datetime({message: "createdAt must be UTC timestamp"}),
}).strict()
export type ChangeDto = z.infer<typeof ChangeDto>;

export const ChangeDtoList = z.array(ChangeDto)
export type ChangeDtoList = z.infer<typeof ChangeDtoList>

/**
 * A ChangeDtoList with explicit resourceId reference, required as some use cases like socket events
 * can't rely on REST API URL relationships to determine the resourceId.
 */
export const ResourceChangesDto = z.object({
  resourceId: ResourceId,
  changes: ChangeDtoList
})
export type ResourceChangesDto = z.infer<typeof ResourceChangesDto>
