import {z} from "zod";
import {CreateUserRequest} from "./create.users.request";

// todo: remove password
export const UpdateUserRequest = CreateUserRequest.partial().strict();

export type UpdateUserRequest = z.infer<typeof UpdateUserRequest>;
