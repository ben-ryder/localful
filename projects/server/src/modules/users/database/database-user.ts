import {z} from "zod";

import {CreateUserDto, UserDto} from "@localful/common";

// todo: Should this exported from @localful/common as generic UserDtoWithPassword?
// if not, is there a better way than reusing the CreateUserDto just to get that field?
export const DatabaseUserDto = UserDto.merge(
	CreateUserDto.pick({password: true})
).strict()
export type DatabaseUserDto = z.infer<typeof DatabaseUserDto>
