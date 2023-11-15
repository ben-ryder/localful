import {z} from "zod";

import {UserDto} from "@localful/common";

// todo: Should this exported from @localful/common as generic UserDtoWithPassword?
// if not, is there a better way than reusing the CreateUserDto just to get that field?
export const DatabaseUserDto = UserDto.extend({
	passwordHash: z.string()
}).strict()
export type DatabaseUserDto = z.infer<typeof DatabaseUserDto>
