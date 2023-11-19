import {z} from "zod";
import {Entity} from "../entity";

export const ResourceId = z.string()
	.min(1, "A resource id must be at least 1 character.")
	.max(40, "A resource id can't go over 40 characters.")

export const ResourceFields = z.object({
	// id is generated locally so must be set within the fields and not be inherited from Entity.
	id: ResourceId,
	protectedEncryptionKey: z.string()
		.min(1, "protectedEncryptionKey must be at least 1 character.")
		.max(255, "protectedEncryptionKey can't be over 255 characters."),
	protectedAdditionalData: z.string().nullish(),
}).strict()
export type ResourceFields = z.infer<typeof ResourceFields>;

export const ResourceEntity = Entity
	.omit({id: true})
	.merge(ResourceFields).strict()
export type ResourceEntity = z.infer<typeof ResourceEntity>;

export const ResourceDto = ResourceEntity;
export type ResourceDto = z.infer<typeof ResourceDto>;

export const CreateResourceDto = ResourceFields
export type CreateResourceDto = z.infer<typeof CreateResourceDto>;

export const UpdateResourceDto = ResourceFields
	.omit({id: true})
	.strict()
export type UpdateResourceDto = z.infer<typeof UpdateResourceDto>;
