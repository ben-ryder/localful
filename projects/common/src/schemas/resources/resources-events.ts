/**
 * Defines events to be used with socket.io Typescript support:
 * https://socket.io/docs/v4/typescript/
 */

import {ResourceDto} from "./resources.js";

export type CreateResourceEvent = () => ResourceDto;

export type UpdateResourceEvent = () => ResourceDto;

export type DeleteResourceEvent = () => {
	id: string
};

export interface ResourcesEvents {
	'resource:create': CreateResourceEvent,
	'resource:update': UpdateResourceEvent,
	'resource:delete': DeleteResourceEvent
}
