import {z} from "zod";
import {Entity} from "./entity.js";

export const ResourceFields = z.object({
	// id is generated locally so must be set within the fields and not be inherited from Entity.
	id: z.string().uuid('id must be uuid format'),
	protectedEncryptionKey: z.string().min(1, "protectedEncryptionKey must be at least 1 character."),
	protectedAdditionalData: z.string().optional(),
}).strict()
export type ResourceFields = z.infer<typeof ResourceFields>;

export const ResourceEntity = Entity.merge(ResourceFields).strict()
export type ResourceEntity = z.infer<typeof ResourceEntity>;

export const ResourceDto = ResourceEntity;
export type ResourceDto = z.infer<typeof ResourceDto>;

export const CreateResourceDto = ResourceFields
export type CreateResourceDto = z.infer<typeof CreateResourceDto>;

export const UpdateResourceDto = ResourceFields
	.omit({id: true})
	.strict()
export type UpdateResourceDto = z.infer<typeof UpdateResourceDto>;