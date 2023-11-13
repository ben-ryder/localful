import {z} from "zod";
import {Entity} from "./entity.js";
import {Roles} from "./auth/permissions.js";

export const UserFields = z.object({
	displayName: z.string().min(1, "displayName must be a least 1 character."),
	email: z.string().email("email must be... an email."),
	password: z.string().min(12, "password must be at least 12 characters."),
	isVerified: z.boolean(),
	role: Roles,
	protectedEncryptionKey: z.string().min(1, "protectedEncryptionKey must be at least 1 character."),
	protectedAdditionalData: z.string().optional(),
}).strict()
export type UserFields = z.infer<typeof UserFields>;

export const UserEntity = Entity.merge(UserFields).strict()
export type UserEntity = z.infer<typeof UserEntity>;

export const UserDto = UserEntity
	.omit({password: true})
	.strict()
export type UserDto = z.infer<typeof UserDto>;

export const CreateUserDto = UserFields
	.omit({isVerified: true, isAdmin: true, role: true})
	.strict()
export type CreateUserDto = z.infer<typeof CreateUserDto>;

export const UpdateUserDto = UserFields
	.omit({isVerified: true, role: true})
	.strict()
export type UpdateUserDto = z.infer<typeof UpdateUserDto>;
