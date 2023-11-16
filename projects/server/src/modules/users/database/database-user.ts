import {z} from "zod";

import {Roles, UpdateUserDto, UserDto} from "@localful/common";

// todo: Should this exported from @localful/common as generic UserDtoWithPassword?
// if not, is there a better way than reusing the CreateUserDto just to get that field?
export const DatabaseUserDto = UserDto.extend({
	passwordHash: z.string()
}).strict()
export type DatabaseUserDto = z.infer<typeof DatabaseUserDto>

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
	display_name: string
	email: string
	password_hash: string
	is_verified: boolean
	protected_encryption_key: string
	protected_additional_data: string
	created_at: string
	updated_at: string
	role: Roles
}
