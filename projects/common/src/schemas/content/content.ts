import {z} from "zod";
import {CreatedAtField, createIdField} from "../common/fields";

export const ContentFields = z.object({
	vaultId: createIdField("vaultId"),
	type: z.string()
		.min(1, "type must be at least 1 character.")
		.max(20, "type can't be over 20 characters."),
	createdAt: CreatedAtField,
	isDeleted: z.boolean().optional()
}).strict()
export type ContentFields = z.infer<typeof ContentFields>;

export const ContentEntity = ContentFields.extend({
	id: createIdField()
}).strict()
export type ContentEntity = z.infer<typeof ContentEntity>;

export const ContentDto = ContentEntity;
export type ContentDto = z.infer<typeof ContentDto>;

export const CreateContentDto = ContentFields
export type CreateContentDto = z.infer<typeof CreateContentDto>;
