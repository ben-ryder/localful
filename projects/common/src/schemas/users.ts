import {z} from "zod";
import {Entity} from "./entity.js";

export const UserFields = z.object({
	email: z.string().email("Your email must be... an email."),
	password: z.string().min(8, "Your password must be at least 8 characters."),
	encryptedVaultKey: z.string().min(1, "Your encrypted vault key must be at least 1 character."),
	isVerified: z.boolean()
}).strict()
export type UserFields = z.infer<typeof UserFields>;

export const UserEntity = Entity.merge(UserFields).strict()
export type UserEntity = z.infer<typeof UserEntity>;

export const UserDto = UserEntity
	.omit({password: true})
	.strict()
export type UserDto = z.infer<typeof UserDto>;

export const CreateUserDto = UserFields
	.omit({isVerified: true})
	.strict()
export type CreateUserDto = z.infer<typeof CreateUserDto>;

export const UpdateUserDto = UserFields
	.omit({isVerified: true})
	.strict()
export type UpdateUserDto = z.infer<typeof UpdateUserDto>;
