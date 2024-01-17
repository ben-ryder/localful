import {z} from "zod";
import {ContentEntity} from "./content";
import {ResourceListingParams} from "../common/params";

export const ContentURLParams = z.object({
  contentId: z.string().uuid("contentId must be a uuid"),
}).strict();
export type ContentURLParams = z.infer<typeof ContentURLParams>;

export const ContentParams = ResourceListingParams.extend({
  vaultId: ContentEntity.shape.vaultId.optional(),
}).strict();
export type ContentParams = z.infer<typeof ContentParams>;
