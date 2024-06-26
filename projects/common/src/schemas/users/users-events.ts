/**
 * Defines events to be used with socket.io Typescript support:
 * https://socket.io/docs/v4/typescript/
 */

import {EntityEvent, EntityIdPayload} from "../common/events";
import {UserDto} from "./users";

export interface UsersEvents {
	'users:update': EntityEvent<UserDto>,
	'user:delete': EntityEvent<EntityIdPayload>
}
