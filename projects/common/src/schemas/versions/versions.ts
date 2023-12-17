import {z} from "zod";
import {Entity} from "../entity";
import {ProtectedDataField} from "../common/fields";

export const ContentVersionFields = z.object({
  protectedData: ProtectedDataField,
}).strict()
export type ContentVersionFields = z.infer<typeof ContentVersionFields>;

export const ContentVersionEntity = Entity
  .merge(ContentVersionFields).strict()
export type ContentVersionEntity = z.infer<typeof ContentVersionEntity>;

export const ContentVersionDto = ContentVersionEntity;
export type ContentVersionDto = z.infer<typeof ContentVersionDto>;

export const CreateContentVersionDto = ContentVersionFields
export type CreateContentVersionDto = z.infer<typeof CreateContentVersionDto>;

export const UpdateContentVersionDto = ContentVersionFields
  .omit({type: true})
  .strict()
export type UpdateContentVersionDto = z.infer<typeof UpdateContentVersionDto>;
