/**
 * Defines events to be used with socket.io Typescript support:
 * https://socket.io/docs/v4/typescript/
 */

import {EntityEvent} from "../common/events";

export interface VaultsEvents {
	'vaults:create': EntityEvent,
	'vaults:update': EntityEvent,
	'vaults:delete': EntityEvent
}
