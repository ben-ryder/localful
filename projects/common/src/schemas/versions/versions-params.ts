import {z} from "zod";
import {createIdField} from "../common/fields";
import {VersionEntity} from "./versions";
import {ResourceListingParams} from "../common/params";

export const VersionsURLParams = z.object({
  versionId: createIdField("versionId"),
}).strict();
export type VersionsURLParams = z.infer<typeof VersionsURLParams>;

export const VersionsParams = ResourceListingParams.extend({
  devices: z.array(VersionEntity.shape.deviceName).optional(),
  contentIds: z.array(VersionEntity.shape.contentId).optional(),
  ids: z.array(VersionEntity.shape.id).optional()
}).strict();
export type VersionsParams = z.infer<typeof VersionsParams>;
