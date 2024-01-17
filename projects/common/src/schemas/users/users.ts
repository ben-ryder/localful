import {z} from "zod";
import {Roles} from "../auth/permissions";
import {CreatedAtField, createIdField, UpdatedAtField} from "../common/fields";

export const UserFields = z.object({
	displayName: z.string()
		.min(1, "displayName must be at least 1 character.")
		.max(50, "displayName can't be over 50 characters."),
	email: z.string().email("email must be... an email."),
	password: z.string()
		.min(12, "password must be at least 12 characters.")
		.max(100, "password can't be over 100 characters."),
	isVerified: z.boolean(),
	role: Roles,
}).strict()
export type UserFields = z.infer<typeof UserFields>;

export const UserEntity = UserFields.extend({
	id: createIdField(),
	createdAt: CreatedAtField,
	updatedAt: UpdatedAtField
}).strict()
export type UserEntity = z.infer<typeof UserEntity>;

export const UserDto = UserEntity
	.omit({password: true})
	.strict()
export type UserDto = z.infer<typeof UserDto>;

export const CreateUserDto = UserFields
	.omit({isVerified: true, role: true})
	.strict()
export type CreateUserDto = z.infer<typeof CreateUserDto>;

export const UpdateUserDto = UserFields
	.omit({isVerified: true, role: true})
	.strict()
export type UpdateUserDto = z.infer<typeof UpdateUserDto>;
