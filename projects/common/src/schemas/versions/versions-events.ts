/**
 * Defines events to be used with socket.io Typescript support:
 * https://socket.io/docs/v4/typescript/
 */
import {EntityEvent, EntityIdPayload} from "../common/events";

export interface VersionsEvents {
	'version:create': EntityEvent<EntityIdPayload>,
	'version:delete': EntityEvent<EntityIdPayload>
}
