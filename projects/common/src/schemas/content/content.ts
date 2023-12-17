import {z} from "zod";
import {Entity} from "../entity";
import {ProtectedDataField} from "../common/fields";

export const ContentFields = z.object({
	type: z.string().min(1, "type field must not be empty"),
	protectedData: ProtectedDataField,
}).strict()
export type ContentFields = z.infer<typeof ContentFields>;

export const ContentEntity = Entity
	.merge(ContentFields).strict()
export type ContentEntity = z.infer<typeof ContentEntity>;

export const ContentDto = ContentEntity;
export type ContentDto = z.infer<typeof ContentDto>;

export const CreateContentDto = ContentFields
export type CreateContentDto = z.infer<typeof CreateContentDto>;

export const UpdateContentDto = ContentFields
	.omit({type: true})
	.strict()
export type UpdateContentDto = z.infer<typeof UpdateContentDto>;
