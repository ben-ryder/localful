/**
 * Defines events to be used with socket.io Typescript support:
 * https://socket.io/docs/v4/typescript/
 */

import {UserDto} from "./users";

export type UpdateUserEvent = () => UserDto;

export type DeleteUserEvent = () => {
	id: string
};

export interface UsersEvents {
	'users:update': UpdateUserEvent,
	'user:delete': DeleteUserEvent
}
