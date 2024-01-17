/**
 * Defines events to be used with socket.io Typescript support:
 * https://socket.io/docs/v4/typescript/
 */
import {EntityEvent, EntityIdPayload} from "../common/events";
import {ContentDto} from "./content";

export interface ContentEvents {
	'content:create': EntityEvent<ContentDto>,
	'content:delete': EntityEvent<EntityIdPayload>
}
