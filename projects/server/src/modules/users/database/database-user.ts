import {z} from "zod";

import {CreateUserDto, Roles, UpdateUserDto, UserDto} from "@localful/common";

// todo: Should this exported from @localful/common as generic UserDtoWithPassword?
// if not, is there a better way than reusing the CreateUserDto just to get that field?
export const DatabaseUserDto = UserDto.extend({
	passwordHash: z.string()
}).strict()
export type DatabaseUserDto = z.infer<typeof DatabaseUserDto>

export const DatabaseCreateUserDto = CreateUserDto
	.omit({password: true})
	.extend({
		passwordHash: z.string(),
		role: Roles
	})
	.strict()
export type DatabaseCreateUserDto = z.infer<typeof DatabaseCreateUserDto>

export const DatabaseUpdateUserDto = UpdateUserDto
	.omit({password: true})
	.extend({
		passwordHash: z.string(),
		isVerified: z.boolean()
	})
	.strict()
	.partial()
export type DatabaseUpdateUserDto = z.infer<typeof DatabaseUpdateUserDto>

export interface RawDatabaseUser {
	id: string
	created_at: string
	updated_at: string
	email: string
	password_hash: string
	display_name: string
	is_verified: boolean
	role: Roles
	protected_encryption_key: string
	protected_additional_data: string
}
