import {z} from "zod";
import {CreatedAtField, createIdField, ProtectedDataField} from "../common/fields";

export const VersionFields = z.object({
  contentId: createIdField("contentId"),
  createdAt: CreatedAtField,
  deviceIdentifier: z.string()
    .min(1, "deviceIdentifier must be at least 1 character.")
    .max(20, "deviceIdentifier can't be over 20 characters."),
  // Data is nullable because it will be removed once the version is deleted.
  protectedData: ProtectedDataField.nullable(),
  isDeleted: z.boolean().optional()
}).strict()
export type VersionFields = z.infer<typeof VersionFields>;

export const VersionEntity = VersionFields.extend({
  id: createIdField()
}).strict()
export type VersionEntity = z.infer<typeof VersionEntity>;

export const VersionDto = VersionEntity;
export type VersionDto = z.infer<typeof VersionDto>;

export const CreateVersionDto = VersionFields
export type CreateVersionDto = z.infer<typeof CreateVersionDto>;
