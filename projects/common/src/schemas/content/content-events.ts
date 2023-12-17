/**
 * Defines events to be used with socket.io Typescript support:
 * https://socket.io/docs/v4/typescript/
 */
import {EntityEvent, EntityEventPayload} from "../common/events";

export interface CreateContentEventPayload extends EntityEventPayload {
	type: string
}

export type CreateContentEvent = () => CreateContentEventPayload;

export interface ContentEvents {
	'content:create': CreateContentEvent,
	'content:delete': EntityEvent
}
