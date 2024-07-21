import {z} from "zod";

import {CreateUserDto, Roles, UpdateUserDto, UserDto} from "@localful/common";
import {createDateField} from "@localful/common/build/src/schemas/common/fields";

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
	.extend({
		passwordHash: z.string(),
		verifiedAt: createDateField("verifiedAt").nullable(),
		firstVerifiedAt: createDateField("firstVerifiedAt").nullable(),
	})
	.strict()
	.partial()
export type DatabaseUpdateUserDto = z.infer<typeof DatabaseUpdateUserDto>

export interface RawDatabaseUser {
	id: string
	email: string
	display_name: string
	password_hash: string
	protected_encryption_key: string
	protected_additional_data: string
	verified_at: string | null
	first_verified_at: string | null
	role: Roles
	created_at: string
	updated_at: string
}
