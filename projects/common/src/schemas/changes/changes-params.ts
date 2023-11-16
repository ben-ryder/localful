import {z} from "zod";
import {ResourceId} from "../resources/resources.js";
import {ChangeDto, ChangeId} from "./changes.js";

export const ChangesURLParams = z.object({
  resourceId: ResourceId,
}).strict();
export type ChangesURLParams = z.infer<typeof ChangesURLParams>;

export const ChangesQueryParams = z.object({
  ids: z.array(ChangeId).optional(),
  fields: z.array(ChangeDto.keyof()).optional()
}).strict();
export type ChangesQueryParams = z.infer<typeof ChangesQueryParams>;
